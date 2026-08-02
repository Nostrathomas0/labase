const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

// Cache the JWT secret to avoid repeated Secrets Manager calls
let cachedJwtSecret = null;

async function getJwtSecret() {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }
  
  try {
    const secretName = 'languFunct/secret/jwt';
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secretJson = JSON.parse(secretData.SecretString);
    cachedJwtSecret = secretJson.JWT_SECRET || secretJson.secret || secretData.SecretString;
    return cachedJwtSecret;
  } catch (error) {
    console.error('Failed to retrieve JWT secret:', error);
    throw new Error('JWT secret retrieval failed');
  }
}

exports.handler = async (event) => {
  console.log('Lambda invoked with event:', JSON.stringify(event, null, 2));
  
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://labase.languapps.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Get JWT secret from Secrets Manager
    const jwtSecret = await getJwtSecret();
    console.log('DEBUG: Lambda secret length:', jwtSecret.length);
    console.log('DEBUG: Lambda secret first 10 chars:', jwtSecret.substring(0, 10));
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    console.log('Parsed request body:', requestBody);
    
    // Extract JWT from Authorization header
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing or invalid Authorization header' })
      };
    }
    
    const currentJWT = authHeader.replace('Bearer ', '');
    console.log('JWT token received, length:', currentJWT.length);

    // ADD THESE DEBUG LINES:
    console.log('DEBUG: JWT header:', currentJWT.substring(0, 50));
    const payload = JSON.parse(atob(currentJWT.split('.')[1]));
    console.log('DEBUG: JWT was signed at:', new Date(payload.iat * 1000));
    console.log('DEBUG: JWT expires at:', new Date(payload.exp * 1000));
    
    // Decode and verify current JWT
    let decoded;
    try {
      decoded = jwt.verify(currentJWT, jwtSecret);
      console.log('JWT decoded successfully for user:', decoded.uid || decoded.email || 'unknown');
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid or expired JWT', message: jwtError.message })
      };
    }
    
    // Extract progress data from request
    const { updateType, progressData, timestamp } = requestBody;
    
    console.log('Update type:', updateType);
    console.log('Progress data:', JSON.stringify(progressData, null, 2));
    
    // Update JWT payload based on update type
    let updatedPayload = { ...decoded };
    
    switch (updateType) {
      case 'session_save':
        // Save current session progress
        if (progressData && progressData.currentSession) {
          updatedPayload.currentSession = progressData.currentSession;
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
          console.log('Updated current session for:', progressData.currentSession.level, progressData.currentSession.topic);
        }
        break;
        
      case 'page_complete':
        // Complete a page and move to recent progress
        if (progressData && progressData.completedPage) {
          // Initialize recentProgress if it doesn't exist
          updatedPayload.recentProgress = updatedPayload.recentProgress || [];
          
          // Add completed page to recent progress (most recent first)
          updatedPayload.recentProgress.unshift(progressData.completedPage);
          
          // Keep only last 50 completed pages to prevent JWT from getting too large
          if (updatedPayload.recentProgress.length > 50) {
            updatedPayload.recentProgress = updatedPayload.recentProgress.slice(0, 50);
          }
          
          // Clear current session since page is completed
          updatedPayload.currentSession = null;
          
          // Update overall stats
          updatedPayload.overallStats = calculateOverallStats(updatedPayload);
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
          
          console.log('Page completed and added to recent progress:', progressData.completedPage.level, progressData.completedPage.topic, 'page', progressData.completedPage.page);
        }
        break;
        
      case 'update':
      default:
        // General update - handle both session and completed page data
        if (progressData) {
          if (progressData.currentSession) {
            updatedPayload.currentSession = progressData.currentSession;
          }
          if (progressData.completedPage) {
            updatedPayload.recentProgress = updatedPayload.recentProgress || [];
            updatedPayload.recentProgress.unshift(progressData.completedPage);
            
            // Keep only last 50 completed pages
            if (updatedPayload.recentProgress.length > 50) {
              updatedPayload.recentProgress = updatedPayload.recentProgress.slice(0, 50);
            }
          }
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
        }
        console.log('General progress update applied');
        break;
    }
    
    // Generate new JWT with updated progress
    const { exp, ...payloadWithoutExp } = updatedPayload; 
    
    const newJWT = jwt.sign(payloadWithoutExp, jwtSecret, {
      expiresIn: '28d',
    });
    
    console.log('New JWT generated successfully');
    
    // Return success response with new JWT
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Progress updated successfully',
        newJWT: newJWT,
        updateType: updateType,
        timestamp: new Date().toISOString(),
        progressSummary: {
          currentSession: updatedPayload.currentSession ? 
            `${updatedPayload.currentSession.level}-${updatedPayload.currentSession.topic}-p${updatedPayload.currentSession.page}` : 
            null,
          totalCompletedPages: (updatedPayload.recentProgress || []).length,
          overallStats: updatedPayload.overallStats
        }
      })
    };
    
  } catch (error) {
    console.error('Lambda execution error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Helper function to calculate overall statistics
function calculateOverallStats(payload) {
  const recentProgress = payload.recentProgress || [];
  const existingStats = payload.overallStats || {};
  
  if (recentProgress.length === 0) {
    return {
      totalTopicsCompleted: 0,
      averageScore: 0,
      totalTimeSpent: existingStats.totalTimeSpent || 0,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
  }
  
  // Calculate statistics from recent progress
  const totalCompleted = recentProgress.length;
  const totalScore = recentProgress.reduce((sum, page) => sum + (page.score || 0), 0);
  const averageScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;
  const totalTimeSpent = recentProgress.reduce((sum, page) => sum + (page.timeSpent || 0), 0) + (existingStats.totalTimeSpent || 0);
  
  // Calculate current streak (consecutive passing scores from most recent)
  let streak = 0;
  for (const page of recentProgress) {
    if (page.passed) {
      streak++;
    } else {
      break;
    }
  }
  
  return {
    totalTopicsCompleted: totalCompleted,
    averageScore: averageScore,
    totalTimeSpent: totalTimeSpent,
    streak: streak,
    lastActiveDate: new Date().toISOString().split('T')[0]
  };
}