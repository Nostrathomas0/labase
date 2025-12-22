// ProgressManager.js - Complete fixed version with proper state management

class ProgressManager {
  constructor() {
    this.currentSession = {
      level: null,
      topic: null,
      page: null,
      questions: [],
      startTime: null,
      lastActivity: null
    };
    
    // Track questions using Map for better state management
    this.questionStates = new Map(); // questionId -> state
    
    this.loadProgressFromJWT();
    console.log('[ProgressManager] Initialized with existing progress');
  }

  // Load existing progress from JWT cookie
  loadProgressFromJWT() {
    try {
      const jwt = this.getJWTFromCookie();
      if (jwt) {
        const decoded = this.decodeJWT(jwt);
        if (decoded && decoded.currentSession) {
          console.log('[ProgressManager] Found existing session in JWT:', decoded.currentSession);
          this.previousProgress = decoded.recentProgress || [];
          this.overallStats = decoded.overallStats || {};
        }
      }
    } catch (error) {
      console.log('[ProgressManager] No existing progress found or error loading:', error.message);
    }
  }

  // Initialize a new learning session
  startSession(level, topic, page = 1) {
    this.currentSession = {
      level,
      topic, 
      page,
      questions: [],
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      sessionId: `${level}-${topic}-${page}-${Date.now()}`
    };
    
    // Only clear question states if starting completely fresh
    if (!this.questionStates.size) {
      this.questionStates.clear();
      console.log('[ProgressManager] Question states cleared for new session');
    }
    
    console.log(`[ProgressManager] Started new session: ${level}-${topic}-p${page}`);
  }

  // Initialize question only if not already tracked
  initializeQuestion(questionId) {
    if (!this.questionStates.has(questionId)) {
      this.questionStates.set(questionId, {
        questionId,
        isAnswered: false,
        showFeedback: false,
        userAnswer: null,
        isCorrect: null
      });
      console.log(`[ProgressManager] Initialized new question: ${questionId}`);
    } else {
      console.log(`[ProgressManager] Question ${questionId} already initialized`);
    }
  }

  // Check if question is already answered
  isQuestionAnswered(questionId) {
    const state = this.questionStates.get(questionId);
    return state ? state.isAnswered : false;
  }

  // Get current question state
  getCurrentQuestionState(questionId) {
    return this.questionStates.get(questionId) || {
      questionId,
      isAnswered: false,
      showFeedback: false,
      userAnswer: null,
      isCorrect: null
    };
  }

  // Record an answer to any question type
  recordAnswer(questionData) {
    const answer = {
      questionId: questionData.questionId || `q-${this.currentSession.questions.length + 1}`,
      questionType: questionData.type,
      userAnswer: questionData.userAnswer,
      correctAnswer: questionData.correctAnswer,
      isCorrect: questionData.isCorrect,
      timestamp: new Date().toISOString(),
      timeSpent: questionData.timeSpent || null,
      attempts: questionData.attempts || 1
    };

    // Update question state in Map
    this.questionStates.set(answer.questionId, {
      questionId: answer.questionId,
      isAnswered: true,
      showFeedback: true,
      userAnswer: answer.userAnswer,
      isCorrect: answer.isCorrect
    });

    // Add or update question in current session
    const existingIndex = this.currentSession.questions.findIndex(
      q => q.questionId === answer.questionId
    );

    if (existingIndex >= 0) {
      this.currentSession.questions[existingIndex] = {
        ...this.currentSession.questions[existingIndex],
        ...answer,
        attempts: this.currentSession.questions[existingIndex].attempts + 1
      };
    } else {
      this.currentSession.questions.push(answer);
    }

    this.currentSession.lastActivity = new Date().toISOString();
    console.log(`[ProgressManager] Question answered: ${answer.questionId}`);
  }

  // Calculate page completion status
  getPageProgress() {
    const questions = this.currentSession.questions;
    if (questions.length === 0) return { score: 0, completed: false, passed: false };

    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const passed = score >= 70;
    const completed = totalQuestions > 0;

    return {
      score,
      correctAnswers,
      totalQuestions,
      completed,
      passed,
      attempts: questions.reduce((sum, q) => sum + q.attempts, 0)
    };
  }

  // Save current session progress to JWT (called on page navigation)
  async saveCurrentProgress() {
    const progress = this.getPageProgress();
    const sessionData = {
      currentSession: {
        level: this.currentSession.level,
        topic: this.currentSession.topic,
        page: this.currentSession.page,
        progress: progress,
        lastActivity: this.currentSession.lastActivity,
        questions: this.currentSession.questions
      }
    };

    console.log(`[ProgressManager] Saving current progress for: ${this.currentSession.level}-${this.currentSession.topic}-p${this.currentSession.page}`);
    console.log('[ProgressManager] Progress data:', progress);
    
    return await this.sendJWTUpdate(sessionData, 'session_save');
  }

  // Complete current page and save to JWT (called when page is finished)
  async completePage() {
    const progress = this.getPageProgress();
    const completedPageData = {
      level: this.currentSession.level,
      topic: this.currentSession.topic,
      page: this.currentSession.page,
      score: progress.score,
      passed: progress.passed,
      completedAt: new Date().toISOString(),
      timeSpent: this.calculateTimeSpent(),
      totalQuestions: progress.totalQuestions,
      correctAnswers: progress.correctAnswers
    };

    const updateData = {
      completedPage: completedPageData,
      currentSession: null
    };

    console.log(`[ProgressManager] Completing page with ${progress.score}% score`);
    
    const result = await this.sendJWTUpdate(updateData, 'page_complete');
    return { ...completedPageData, jwtUpdated: result };
  }

  // Manual save progress (called when user clicks "Save Progress" button)
  async saveProgress() {
    console.log('[ProgressManager] Manual save progress triggered');
    return await this.saveCurrentProgress();
  }

  calculateTimeSpent() {
    if (!this.currentSession.startTime) return 0;
    const start = new Date(this.currentSession.startTime);
    const end = new Date();
    return Math.round((end - start) / 1000);
  }

  // Send update to Lambda function
  async sendJWTUpdate(progressData, updateType = 'update') {
    try {
      const currentJWT = this.getJWTFromCookie();
      if (!currentJWT) {
        console.error('[ProgressManager] No JWT found in cookie');
        return false;
      }

      console.log(`[ProgressManager] Sending ${updateType} to Lambda...`);
      console.log('[ProgressManager] Update data:', progressData);

      const response = await fetch('https://ai98hipstc.execute-api.us-east-1.amazonaws.com/default/LanguFunct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentJWT}`
        },
        body: JSON.stringify({
          updateType: updateType,
          progressData: progressData,
          timestamp: new Date().toISOString()
        })
      });

      console.log(`[ProgressManager] Lambda response status: ${response.status}`);

      const responseText = await response.text();
      console.log('[ProgressManager] Raw Lambda response:', responseText);

      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          console.log('[ProgressManager] Lambda response parsed:', result);
          
          if (result.success && result.newJWT) {
            this.updateJWTCookie(result.newJWT);
            console.log('[ProgressManager] JWT updated successfully');
            console.log('[ProgressManager] Progress summary:', result.progressSummary);
            return true;
          } else {
            console.warn('[ProgressManager] Lambda response missing success/newJWT:', result);
            return false;
          }
        } catch (parseError) {
          console.error('[ProgressManager] Failed to parse Lambda response as JSON:', parseError);
          return false;
        }
      } else {
        console.error('[ProgressManager] Lambda request failed:', response.status, responseText);
        return false;
      }
    } catch (error) {
      console.error('[ProgressManager] Failed to update JWT:', error);
      return false;
    }
  }

  // Get JWT from cookie
  getJWTFromCookie() {
    const name = 'JWT=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  }

  // Update JWT cookie
  updateJWTCookie(newJWT) {
    const cookieString = `JWT=${newJWT}; path=/; domain=.languapps.com; secure; samesite=none; max-age=86400`;
    document.cookie = cookieString;
    console.log('[ProgressManager] JWT cookie updated');
  }

  // Decode JWT (basic decode - you might want to use a proper JWT library)
  decodeJWT(jwt) {
    try {
      const payload = jwt.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('[ProgressManager] Failed to decode JWT:', error);
      return null;
    }
  }

  // Get previous progress for a specific topic/page
  getPreviousProgress(level, topic, page) {
    if (!this.previousProgress) return null;
    
    return this.previousProgress.find(p => 
      p.level === level && p.topic === topic && p.page === page
    );
  }

  // Get overall statistics
  getOverallStats() {
    return this.overallStats || {
      totalTopicsCompleted: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      streak: 0,
      lastActiveDate: null
    };
  }
}

// Enhanced Question Handler with proper state management
class QuestionHandler {
  constructor(progressManager) {
    this.progressManager = progressManager;
    this.questionStartTime = null;
  }

  startQuestion(questionId, questionType) {
    // Only start if not already answered
    if (!this.progressManager.isQuestionAnswered(questionId)) {
      this.progressManager.initializeQuestion(questionId);
      this.questionStartTime = Date.now();
      this.currentQuestionId = questionId;
      this.currentQuestionType = questionType;
      console.log(`[QuestionHandler] Started tracking: ${questionId} (${questionType})`);
    } else {
      console.log(`[QuestionHandler] Question ${questionId} already answered, not starting new tracking`);
    }
  }

  // Check if question should show as answered
  shouldShowAsAnswered(questionId) {
    return this.progressManager.isQuestionAnswered(questionId);
  }

  // Get current question display state
  getQuestionDisplayState(questionId) {
    return this.progressManager.getCurrentQuestionState(questionId);
  }

  handleAnswer(userAnswer, correctAnswer, isCorrect) {
    // Prevent handling if already answered
    if (this.progressManager.isQuestionAnswered(this.currentQuestionId)) {
      console.log(`[QuestionHandler] Question ${this.currentQuestionId} already answered, ignoring`);
      return this.progressManager.getCurrentQuestionState(this.currentQuestionId);
    }

    const timeSpent = this.questionStartTime ? 
      Math.round((Date.now() - this.questionStartTime) / 1000) : null;

    console.log(`[QuestionHandler] Processing answer for: ${this.currentQuestionId}`);
    console.log(`[QuestionHandler] Answer: ${userAnswer} | Correct: ${correctAnswer} | Is Correct: ${isCorrect}`);

    this.progressManager.recordAnswer({
      questionId: this.currentQuestionId,
      type: this.currentQuestionType,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent
    });

    const progress = this.progressManager.getPageProgress();
    console.log(`[QuestionHandler] Current progress: ${progress.correctAnswers}/${progress.totalQuestions} (${progress.score}%)`);

    return {
      questionIndex: this.extractQuestionIndex(this.currentQuestionId),
      questionId: this.currentQuestionId,
      isCorrect,
      userAnswer,
      correctAnswer,
      feedback: this.getFeedback(isCorrect, correctAnswer),
      progress: progress
    };
  }

  extractQuestionIndex(questionId) {
  if (!questionId || typeof questionId !== 'string') {
    console.warn('[QuestionHandler] Invalid questionId:', questionId);
    return 0;
  }
  const match = questionId.match(/(\d+)$/);
  return match ? parseInt(match[1]) : 0;
}

  getFeedback(isCorrect, correctAnswer) {
    if (isCorrect) {
      return {
        type: 'success',
        message: 'Correct! Well done!',
        class: 'feedback-correct'
      };
    } else {
      return {
        type: 'error', 
        message: `Incorrect. The correct answer is: ${correctAnswer}`,
        class: 'feedback-incorrect'
      };
    }
  }
}

export { ProgressManager, QuestionHandler };