// ProgressManager.js - Unified Progress Tracking System

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
  }

  // Record an answer to any question type
  recordAnswer(questionData) {
    const answer = {
      questionId: questionData.questionId || `q-${this.currentSession.questions.length + 1}`,
      questionType: questionData.type, // 'multipleChoice', 'gapFill', 'click', 'wordBank'
      userAnswer: questionData.userAnswer,
      correctAnswer: questionData.correctAnswer,
      isCorrect: questionData.isCorrect,
      timestamp: new Date().toISOString(),
      timeSpent: questionData.timeSpent || null,
      attempts: questionData.attempts || 1
    };

    // Add or update question in current session
    const existingIndex = this.currentSession.questions.findIndex(
      q => q.questionId === answer.questionId
    );

    if (existingIndex >= 0) {
      // Update existing question (retry)
      this.currentSession.questions[existingIndex] = {
        ...this.currentSession.questions[existingIndex],
        ...answer,
        attempts: this.currentSession.questions[existingIndex].attempts + 1
      };
    } else {
      // Add new question
      this.currentSession.questions.push(answer);
    }

    this.currentSession.lastActivity = new Date().toISOString();
    this.updateJWTSession();
  }

  // Calculate page completion status
  getPageProgress() {
    const questions = this.currentSession.questions;
    if (questions.length === 0) return { score: 0, completed: false, passed: false };

    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Passing criteria: 70% correct
    const passed = score >= 70;
    const completed = totalQuestions > 0; // At least attempted some questions

    return {
      score,
      correctAnswers,
      totalQuestions,
      completed,
      passed,
      attempts: questions.reduce((sum, q) => sum + q.attempts, 0)
    };
  }

  // Complete current page and calculate final score
  completePage() {
    const progress = this.getPageProgress();
    const pageData = {
      ...this.currentSession,
      ...progress,
      completedAt: new Date().toISOString(),
      timeSpent: this.calculateTimeSpent()
    };

    // Update JWT with page completion
    this.updateJWTProgress(pageData);
    return pageData;
  }

  calculateTimeSpent() {
    if (!this.currentSession.startTime) return 0;
    const start = new Date(this.currentSession.startTime);
    const end = new Date();
    return Math.round((end - start) / 1000); // seconds
  }

  // Update JWT with current session data
  updateJWTSession() {
    const sessionData = {
      currentSession: {
        level: this.currentSession.level,
        topic: this.currentSession.topic,
        page: this.currentSession.page,
        progress: this.getPageProgress(),
        lastActivity: this.currentSession.lastActivity
      }
    };

    // Send to server to update JWT
    this.sendJWTUpdate(sessionData);
  }

  // Update JWT with completed page data
  updateJWTProgress(pageData) {
    const progressData = {
      completedPage: {
        level: pageData.level,
        topic: pageData.topic,
        page: pageData.page,
        score: pageData.score,
        passed: pageData.passed,
        completedAt: pageData.completedAt,
        timeSpent: pageData.timeSpent
      },
      currentSession: null // Clear current session after completion
    };

    this.sendJWTUpdate(progressData);
  }

  async sendJWTUpdate(data) {
    try {
      const response = await fetch('/api/update-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getJWT()}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.newJWT) {
          this.updateJWTCookie(result.newJWT);
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }

  getJWT() {
    // Get JWT from cookie or localStorage
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('JWT='))
      ?.split('=')[1];
  }

  updateJWTCookie(newJWT) {
    document.cookie = `JWT=${newJWT}; path=/; domain=.languapps.com; secure; samesite=strict`;
  }
}

// Standardized Question Component Interface
class QuestionHandler {
  constructor(progressManager) {
    this.progressManager = progressManager;
    this.questionStartTime = null;
  }

  // Start tracking a question
  startQuestion(questionId, questionType) {
    this.questionStartTime = Date.now();
    this.currentQuestionId = questionId;
    this.currentQuestionType = questionType;
  }

  // Handle answer for any question type
  handleAnswer(userAnswer, correctAnswer, isCorrect) {
    const timeSpent = this.questionStartTime ? 
      Math.round((Date.now() - this.questionStartTime) / 1000) : null;

    this.progressManager.recordAnswer({
      questionId: this.currentQuestionId,
      type: this.currentQuestionType,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent
    });

    return {
      isCorrect,
      feedback: this.getFeedback(isCorrect, correctAnswer),
      progress: this.progressManager.getPageProgress()
    };
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

// JWT Progress Structure
const JWT_PROGRESS_STRUCTURE = {
  userId: "string",
  email: "string",
  currentSession: {
    level: "A1",
    topic: "nouns", 
    page: 2,
    progress: {
      score: 75,
      correctAnswers: 3,
      totalQuestions: 4,
      completed: true,
      passed: true
    },
    lastActivity: "2024-01-15T10:30:00Z"
  },
  recentProgress: [
    {
      level: "A1",
      topic: "nouns",
      page: 1,
      score: 80,
      passed: true,
      completedAt: "2024-01-15T09:45:00Z",
      timeSpent: 300
    }
  ],
  overallStats: {
    totalTopicsCompleted: 5,
    averageScore: 82,
    totalTimeSpent: 1800,
    streak: 3,
    lastActiveDate: "2024-01-15"
  }
};

export { ProgressManager, QuestionHandler, JWT_PROGRESS_STRUCTURE };