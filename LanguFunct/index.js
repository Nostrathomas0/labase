// Lambda: updates a student's progress inside their JWT.
// The caller must send a valid, unexpired JWT in the Authorization header.
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

// Renewed tokens last this long...
const TOKEN_LIFETIME = '28d';
// ...but a token can't be renewed forever: after this many days since it was
// first issued, the student has to sign in again.
const MAX_SESSION_DAYS = 90;
// Premium is checked against Firestore, not trusted from a renewed token.
// Set to true only if something still reads `premium` from the JWT.
const CARRY_PREMIUM = false;
const MAX_RECENT_PAGES = 50;

let cachedJwtSecret = null;

async function getJwtSecret() {
  if (cachedJwtSecret) return cachedJwtSecret;

  try {
    const secretData = await secretsManager
      .getSecretValue({ SecretId: 'languFunct/secret/jwt' })
      .promise();
    let secret = secretData.SecretString;
    try {
      const parsed = JSON.parse(secretData.SecretString);
      secret = parsed.JWT_SECRET || parsed.secret || secretData.SecretString;
    } catch (e) {
      // Plain-text secret: use as is.
    }
    cachedJwtSecret = secret;
    return cachedJwtSecret;
  } catch (error) {
    console.error('Failed to retrieve JWT secret:', error.name);
    throw new Error('JWT secret retrieval failed');
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://labase.languapps.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

function respond(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...extraHeaders },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, { message: 'CORS preflight successful' });
  }
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' });
  }

  try {
    const jwtSecret = await getJwtSecret();

    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return respond(400, { error: 'Invalid JSON in request body' });
    }

    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return respond(401, { error: 'Missing or invalid Authorization header' });
    }
    const currentJWT = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(currentJWT, jwtSecret);
    } catch (jwtError) {
      console.warn('JWT verification failed:', jwtError.name);
      return respond(401, { error: 'Invalid or expired JWT' });
    }

    // Stop a stolen token from being renewed forever.
    const issuedAt = decoded.iat ? decoded.iat * 1000 : 0;
    if (!issuedAt || Date.now() - issuedAt > MAX_SESSION_DAYS * 86400000) {
      return respond(401, { error: 'Session too old. Please sign in again.' });
    }

    const { updateType, progressData, timestamp } = requestBody;
    const updatedPayload = { ...decoded };

    switch (updateType) {
      case 'session_save':
        if (progressData && progressData.currentSession) {
          updatedPayload.currentSession = progressData.currentSession;
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
        }
        break;

      case 'page_complete':
        if (progressData && progressData.completedPage) {
          updatedPayload.recentProgress = updatedPayload.recentProgress || [];
          updatedPayload.recentProgress.unshift(progressData.completedPage);
          if (updatedPayload.recentProgress.length > MAX_RECENT_PAGES) {
            updatedPayload.recentProgress =
              updatedPayload.recentProgress.slice(0, MAX_RECENT_PAGES);
          }
          updatedPayload.currentSession = null;
          updatedPayload.overallStats = calculateOverallStats(updatedPayload);
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
        }
        break;

      case 'update':
      default:
        if (progressData) {
          if (progressData.currentSession) {
            updatedPayload.currentSession = progressData.currentSession;
          }
          if (progressData.completedPage) {
            updatedPayload.recentProgress = updatedPayload.recentProgress || [];
            updatedPayload.recentProgress.unshift(progressData.completedPage);
            if (updatedPayload.recentProgress.length > MAX_RECENT_PAGES) {
              updatedPayload.recentProgress =
                updatedPayload.recentProgress.slice(0, MAX_RECENT_PAGES);
            }
          }
          updatedPayload.lastActivity = timestamp || new Date().toISOString();
        }
        break;
    }

    if (!CARRY_PREMIUM) delete updatedPayload.premium;

    // jwt.sign sets a fresh exp; the original iat is kept so the
    // MAX_SESSION_DAYS cap above keeps counting from first issue.
    const { exp, ...payloadWithoutExp } = updatedPayload;
    const newJWT = jwt.sign(payloadWithoutExp, jwtSecret, {
      expiresIn: TOKEN_LIFETIME,
    });

    return respond(200, {
      success: true,
      message: 'Progress updated successfully',
      newJWT,
      updateType,
      timestamp: new Date().toISOString(),
      progressSummary: {
        currentSession: updatedPayload.currentSession
          ? `${updatedPayload.currentSession.level}-${updatedPayload.currentSession.topic}-p${updatedPayload.currentSession.page}`
          : null,
        totalCompletedPages: (updatedPayload.recentProgress || []).length,
        overallStats: updatedPayload.overallStats,
      },
    }, { 'Content-Type': 'application/json' });
  } catch (error) {
    console.error('Lambda execution error:', error.message);
    return respond(500, { error: 'Internal server error' });
  }
};

function calculateOverallStats(payload) {
  const recentProgress = payload.recentProgress || [];
  const existingStats = payload.overallStats || {};

  if (recentProgress.length === 0) {
    return {
      totalTopicsCompleted: 0,
      averageScore: 0,
      totalTimeSpent: existingStats.totalTimeSpent || 0,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  }

  const totalCompleted = recentProgress.length;
  const totalScore = recentProgress.reduce((sum, page) => sum + (page.score || 0), 0);
  const averageScore = Math.round(totalScore / totalCompleted);
  const totalTimeSpent =
    recentProgress.reduce((sum, page) => sum + (page.timeSpent || 0), 0) +
    (existingStats.totalTimeSpent || 0);

  let streak = 0;
  for (const page of recentProgress) {
    if (page.passed) streak++;
    else break;
  }

  return {
    totalTopicsCompleted: totalCompleted,
    averageScore,
    totalTimeSpent,
    streak,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
}