// ProgressManager.js - tracks answers on the current page and saves them to Firestore
//
// Records (all under the signed-in user's own document):
//   users/{uid}/attempts/{auto-id}  one document per answer, never changed afterwards
//   users/{uid}/pages/{pageKey}     the latest result for each lesson page
//
// Firestore keeps a local copy and queues writes while offline, so saving never
// waits for the network: writes go out when the device reconnects.

import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, addDoc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseInit';

const MAX_TEXT = 500;

// Answers can be strings, arrays or objects depending on the question type
const asText = (value) => {
  if (value === undefined || value === null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) : text;
};

// Firestore document ids cannot contain "/"
const pageKey = (level, topic, page) =>
  `${level}_${topic}_${page}`.replace(/[^A-Za-z0-9_-]/g, '-');

// A readable version of a question, saved with each answer for teacher reports
const describeQuestion = (q) => {
  if (!q || typeof q !== 'object') return '';
  const textOf = (runs) => (Array.isArray(runs)
    ? runs.map((r) => (r && typeof r.text === 'string' ? r.text : '')).join('')
    : '');
  let text = '';
  switch (q.type) {
    case 'multipleChoice': text = q.question || ''; break;
    case 'gapFill': text = q.template || ''; break;
    case 'wordBank': text = q.paragraph || ''; break;
    case 'sentenceBuilder': text = q.prompt || (Array.isArray(q.tokens) ? q.tokens.join(' ') : ''); break;
    case 'click': text = textOf(q.instructions); break;
    case 'popBox': text = q.instructions || (Array.isArray(q.columns) ? q.columns.join(' | ') : ''); break;
    case 'matchingPairs': text = q.instructions || (Array.isArray(q.pairs) ? q.pairs.map((p) => p.left).join(', ') : ''); break;
    default: text = q.question || q.prompt || textOf(q.instructions) || '';
  }
  return asText(String(text || '').replace(/\s+/g, ' ').trim());
};

const currentUid = () => (auth && auth.currentUser ? auth.currentUser.uid : null);

const dayString = (date) => date.toISOString().slice(0, 10);

class ProgressManager {
  constructor() {
    this.currentSession = {
      level: null,
      topic: null,
      page: null,
      questions: [],
      startTime: null,
      lastActivity: null,
    };
    this.questionStates = new Map(); // questionId -> state
    this.pages = new Map();          // pageKey -> saved page result
    this.questionTexts = new Map();  // questionId -> readable question
    this.loadedFor = null;

    // Load the signed-in user's saved page results (and reload when the user changes)
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        this.pages.clear();
        this.loadedFor = null;
        if (user) this.loadPages(user.uid);
      });
    }
  }

  async loadPages(uid) {
    if (!db) return;
    try {
      const snapshot = await getDocs(collection(db, 'users', uid, 'pages'));
      snapshot.forEach((d) => this.pages.set(d.id, d.data()));
      this.loadedFor = uid;
    } catch (error) {
      console.warn('[ProgressManager] Could not load saved progress:', error.message);
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
      sessionId: `${level}-${topic}-${page}-${Date.now()}`,
    };
  }

  // Called by the exercise panel with the question's data, before it is answered
  setQuestionData(questionId, questionData) {
    if (questionId) this.questionTexts.set(questionId, describeQuestion(questionData));
  }

  initializeQuestion(questionId) {
    if (!this.questionStates.has(questionId)) {
      this.questionStates.set(questionId, {
        questionId,
        isAnswered: false,
        showFeedback: false,
        userAnswer: null,
        isCorrect: null,
      });
    }
  }

  isQuestionAnswered(questionId) {
    const state = this.questionStates.get(questionId);
    return state ? state.isAnswered : false;
  }

  getCurrentQuestionState(questionId) {
    return this.questionStates.get(questionId) || {
      questionId,
      isAnswered: false,
      showFeedback: false,
      userAnswer: null,
      isCorrect: null,
    };
  }

  // Record an answer to any question type, and save it as an attempt
  recordAnswer(questionData) {
    const answer = {
      questionId: questionData.questionId || `q-${this.currentSession.questions.length + 1}`,
      questionType: questionData.type,
      userAnswer: questionData.userAnswer,
      correctAnswer: questionData.correctAnswer,
      isCorrect: questionData.isCorrect,
      timestamp: new Date().toISOString(),
      timeSpent: questionData.timeSpent || null,
      attempts: questionData.attempts || 1,
    };

    this.questionStates.set(answer.questionId, {
      questionId: answer.questionId,
      isAnswered: true,
      showFeedback: true,
      userAnswer: answer.userAnswer,
      isCorrect: answer.isCorrect,
    });

    const existingIndex = this.currentSession.questions.findIndex(
      (q) => q.questionId === answer.questionId
    );
    if (existingIndex >= 0) {
      this.currentSession.questions[existingIndex] = {
        ...this.currentSession.questions[existingIndex],
        ...answer,
        attempts: this.currentSession.questions[existingIndex].attempts + 1,
      };
    } else {
      this.currentSession.questions.push(answer);
    }
    this.currentSession.lastActivity = new Date().toISOString();

    this.saveAttempt(answer);
    this.writePage(); // keeps the page result and "last active" current
  }

  saveAttempt(answer) {
    const uid = currentUid();
    if (!uid || !db) return;
    const { level, topic, page, sessionId } = this.currentSession;
    addDoc(collection(db, 'users', uid, 'attempts'), {
      level: String(level || ''),
      topic: String(topic || ''),
      page: Number(page) || 0,
      questionId: String(answer.questionId),
      questionType: String(answer.questionType || ''),
      questionText: this.questionTexts.get(answer.questionId) || '',
      userAnswer: asText(answer.userAnswer),
      correctAnswer: asText(answer.correctAnswer),
      isCorrect: answer.isCorrect === true,
      timeSpent: typeof answer.timeSpent === 'number' ? answer.timeSpent : null,
      sessionId: String(sessionId || ''),
      createdAt: serverTimestamp(),
    }).catch((error) => console.warn('[ProgressManager] Attempt not saved:', error.message));
  }

  // Score for the current page
  getPageProgress() {
    const questions = this.currentSession.questions;
    if (questions.length === 0) return { score: 0, completed: false, passed: false };

    const correctAnswers = questions.filter((q) => q.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      score,
      correctAnswers,
      totalQuestions,
      completed: totalQuestions > 0,
      passed: score >= 70,
      attempts: questions.reduce((sum, q) => sum + q.attempts, 0),
    };
  }

  // Write the current page's result. Returns false only when nobody is signed in.
  writePage(extra = {}) {
    const uid = currentUid();
    const { level, topic, page } = this.currentSession;
    if (!uid || !db || !level) return false;

    const progress = this.getPageProgress();
    const key = pageKey(level, topic, page);
    const previous = this.pages.get(key) || {};
    const data = {
      level: String(level),
      topic: String(topic),
      page: Number(page) || 0,
      score: progress.score,
      // best score of a finished run of the page (0 until one is finished)
      bestScore: extra.completed
        ? Math.max(progress.score, previous.bestScore || 0)
        : (previous.bestScore || 0),
      correctAnswers: progress.correctAnswers || 0,
      totalQuestions: progress.totalQuestions || 0,
      passed: !!progress.passed,
      completed: !!(previous.completed || extra.completed),
      timeSpent: (previous.timeSpent || 0) + this.calculateTimeSpent(),
      lastActiveDay: dayString(new Date()),
      updatedAt: serverTimestamp(),
    };

    // Keep the local copy current for the stats, then queue the write
    this.pages.set(key, { ...data, updatedAt: new Date() });
    this.currentSession.startTime = new Date().toISOString(); // time is counted once
    setDoc(doc(db, 'users', uid, 'pages', key), data)
      .catch((error) => console.warn('[ProgressManager] Page result not saved:', error.message));
    return true;
  }

  // Called on page navigation
  async saveCurrentProgress() {
    if (this.currentSession.questions.length === 0) return true;
    return this.writePage();
  }

  // Called when a page is finished
  async completePage() {
    const progress = this.getPageProgress();
    const saved = this.writePage({ completed: true });
    return {
      level: this.currentSession.level,
      topic: this.currentSession.topic,
      page: this.currentSession.page,
      score: progress.score,
      passed: progress.passed,
      totalQuestions: progress.totalQuestions,
      correctAnswers: progress.correctAnswers,
      saved,
    };
  }

  // "Save Progress" button
  async saveProgress() {
    return this.writePage();
  }

  calculateTimeSpent() {
    if (!this.currentSession.startTime) return 0;
    const start = new Date(this.currentSession.startTime);
    return Math.max(0, Math.round((Date.now() - start) / 1000));
  }

  getPreviousProgress(level, topic, page) {
    return this.pages.get(pageKey(level, topic, page)) || null;
  }

  getOverallStats() {
    const results = Array.from(this.pages.values());
    const completed = results.filter((p) => p.completed);
    const scored = results.filter((p) => p.totalQuestions > 0);
    const averageScore = scored.length
      ? Math.round(scored.reduce((sum, p) => sum + (p.bestScore || p.score || 0), 0) / scored.length)
      : 0;

    // Streak: consecutive days with activity, ending today or yesterday
    const days = new Set(results.map((p) => p.lastActiveDay).filter(Boolean));
    let streak = 0;
    const cursor = new Date();
    if (!days.has(dayString(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(dayString(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const lastActiveDate = results.map((p) => p.lastActiveDay).filter(Boolean).sort().pop() || null;

    return {
      totalTopicsCompleted: completed.length,
      averageScore,
      totalTimeSpent: results.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
      streak,
      lastActiveDate,
    };
  }
}

// Handles one question's lifecycle for the exercise components
class QuestionHandler {
  constructor(progressManager) {
    this.progressManager = progressManager;
    this.questionStartTime = null;
  }

  startQuestion(questionId, questionType) {
    if (!this.progressManager.isQuestionAnswered(questionId)) {
      this.progressManager.initializeQuestion(questionId);
      this.questionStartTime = Date.now();
      this.currentQuestionId = questionId;
      this.currentQuestionType = questionType;
    }
  }

  shouldShowAsAnswered(questionId) {
    return this.progressManager.isQuestionAnswered(questionId);
  }

  getQuestionDisplayState(questionId) {
    return this.progressManager.getCurrentQuestionState(questionId);
  }

  handleAnswer(userAnswer, correctAnswer, isCorrect) {
    if (this.progressManager.isQuestionAnswered(this.currentQuestionId)) {
      return this.progressManager.getCurrentQuestionState(this.currentQuestionId);
    }

    const timeSpent = this.questionStartTime
      ? Math.round((Date.now() - this.questionStartTime) / 1000)
      : null;

    this.progressManager.recordAnswer({
      questionId: this.currentQuestionId,
      type: this.currentQuestionType,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent,
    });

    const progress = this.progressManager.getPageProgress();
    return {
      questionIndex: this.extractQuestionIndex(this.currentQuestionId),
      questionId: this.currentQuestionId,
      isCorrect,
      userAnswer,
      correctAnswer,
      feedback: this.getFeedback(isCorrect, correctAnswer),
      progress,
    };
  }

  extractQuestionIndex(questionId) {
    if (!questionId || typeof questionId !== 'string') return 0;
    const match = questionId.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getFeedback(isCorrect, correctAnswer) {
    if (isCorrect) {
      return { type: 'success', message: 'Correct! Well done!', class: 'feedback-correct' };
    }
    return {
      type: 'error',
      message: `Incorrect. The correct answer is: ${correctAnswer}`,
      class: 'feedback-incorrect',
    };
  }
}

export { ProgressManager, QuestionHandler, describeQuestion };
