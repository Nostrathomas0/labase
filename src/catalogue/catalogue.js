// src/catalogue/catalogue.js
// Single source of truth for what content exists and where it lives.
// Adding a lesson = add its JSON file + one entry here. No new components, no new routes.
//
// `load` is a dynamic import, so each lesson's JSON is its own chunk and is only
// downloaded when opened. Later, contentLoader.js can fetch from Firestore instead.
//
// `progress` holds the level/topic keys the current ProgressManager saves under.
// They are kept exactly as the old page files had them so existing progress still
// matches. They will be replaced when progress moves to Firestore.

export const LEVELS = [
  { id: 'A1', label: 'A1 - Beginner' },
  { id: 'A2', label: 'A2 - Elementary' },
  { id: 'B1', label: 'B1 - Pre-Intermediate' },
  { id: 'B2', label: 'B2 - Intermediate' },
];

// layout: 'standard' = split page with page turner; 'timeline' = premium timeline layout
// aliases: old or mistyped URLs that should still open this lesson
export const LESSONS = [
  // ── A1 ──────────────────────────────────────────────
  { id: 'en-grammar-a1-nouns', level: 'A1', slug: 'nouns', title: 'Nouns & Pronouns',
    layout: 'standard', premium: false, progress: { level: 'A1', topic: 'nouns' },
    load: () => import('../data/grammar/A1/1Nouns.json') },
  { id: 'en-grammar-a1-adjectives', level: 'A1', slug: 'adjectives', title: 'Adjectives & other Determiners',
    layout: 'standard', premium: false, progress: { level: 'A1', topic: 'grammar' },
    load: () => import('../data/grammar/A1/2Adjectives.json') },
  { id: 'en-grammar-a1-verbs', level: 'A1', slug: 'verbs', title: 'Verbs',
    layout: 'standard', premium: false, progress: { level: 'A1', topic: 'grammar' },
    load: () => import('../data/grammar/A1/3Verbs.json') },
  { id: 'en-grammar-a1-there', level: 'A1', slug: 'there', title: 'There & Adverbs of Place',
    layout: 'standard', premium: false, progress: { level: 'A1', topic: 'there' },
    load: () => import('../data/grammar/A1/4There.json') },
  { id: 'en-grammar-a1-possessives', level: 'A1', slug: 'possessives', title: 'Possessives',
    layout: 'timeline', premium: true, progress: { level: 'A1', topic: 'possessives' },
    load: () => import('../data/grammar/A1/5Possessives.json') },
  { id: 'en-grammar-a1-articles', level: 'A1', slug: 'articles', title: 'Articles',
    layout: 'timeline', premium: true, progress: { level: 'A1', topic: 'articles' },
    load: () => import('../data/grammar/A1/6Articles.json') },

  // ── A2 ──────────────────────────────────────────────
  { id: 'en-grammar-a2-past-continuous', level: 'A2', slug: 'pastCont', title: 'Past Continuous',
    layout: 'standard', premium: false, progress: { level: 'A2', topic: 'past_continuous' },
    load: () => import('../data/grammar/A2/1PastContinuous.json') },
  { id: 'en-grammar-a2-future', level: 'A2', slug: 'future', title: 'Future Simple',
    layout: 'standard', premium: false, progress: { level: 'A2', topic: 'future' },
    load: () => import('../data/grammar/A2/2Future.json') },
  { id: 'en-grammar-a2-going-to', level: 'A2', slug: 'goingTo', title: 'Going to',
    layout: 'standard', premium: false, progress: { level: 'A2', topic: 'going_to' },
    load: () => import('../data/grammar/A2/3GoingTo.json') },
  { id: 'en-grammar-a2-comparatives', level: 'A2', slug: 'compSupe', title: 'Comparatives and Superlatives',
    layout: 'standard', premium: false, progress: { level: 'A2', topic: 'comparatives_and_superlatives' },
    load: () => import('../data/grammar/A2/4ComparativesAndSuperlatives.json') },
  { id: 'en-grammar-a2-relative-clauses', level: 'A2', slug: 'relClauses', title: 'Relative Clauses',
    layout: 'timeline', premium: true, progress: { level: 'A2', topic: 'relative-clauses' },
    load: () => import('../data/grammar/A2/5RelativeClauses.json') },
  { id: 'en-grammar-a2-helping-verbs', level: 'A2', slug: 'helpVerbs', aliases: ['helpingVerbs'], title: 'Helping Verbs',
    layout: 'timeline', premium: true, progress: { level: 'A2', topic: 'helping-verbs' },
    load: () => import('../data/grammar/A2/6HelpingVerbs.json') },

  // ── B1 ──────────────────────────────────────────────
  { id: 'en-grammar-b1-present-perfect-continuous', level: 'B1', slug: 'presPerfCont', title: 'Present Perfect Continuous',
    layout: 'standard', premium: false, progress: { level: 'B1', topic: 'present_perfect_continuous' },
    load: () => import('../data/grammar/B1/1PresentPerfectContinuous.json') },
  { id: 'en-grammar-b1-past-perfect-continuous', level: 'B1', slug: 'pastPerfCont', title: 'Past Perfect Continuous',
    layout: 'standard', premium: false, progress: { level: 'B1', topic: 'past_perfect_continuous' },
    load: () => import('../data/grammar/B1/2PastPerfectContinuous.json') },
  { id: 'en-grammar-b1-second-conditional', level: 'B1', slug: '2ndCond', title: 'Second Conditional',
    layout: 'standard', premium: false, progress: { level: 'B1', topic: 'second_conditional' },
    load: () => import('../data/grammar/B1/3SecondConditional.json') },
  { id: 'en-grammar-b1-modal-verbs', level: 'B1', slug: 'modalVerbs', title: 'Modal Verbs',
    layout: 'standard', premium: false, progress: { level: 'B1', topic: 'modal_verbs' },
    load: () => import('../data/grammar/B1/4ModalVerbs.json') },
  // progress.level 'A1' is what the old HalfModalsPage saved under (a bug), kept so saved progress still matches
  { id: 'en-grammar-b1-half-modals', level: 'B1', slug: 'halfModals', title: 'Half Modals',
    layout: 'timeline', premium: true, progress: { level: 'A1', topic: 'half-modals' },
    load: () => import('../data/grammar/B1/5HalfModals.json') },
  { id: 'en-grammar-b1-participles', level: 'B1', slug: 'participles', title: 'Participles',
    layout: 'timeline', premium: true, progress: { level: 'B1', topic: 'participles' },
    load: () => import('../data/grammar/B1/6Participles.json') },

  // ── B2 ──────────────────────────────────────────────
  { id: 'en-grammar-b2-mixed-conditionals', level: 'B2', slug: 'mixedCond', title: 'Mixed Conditionals',
    layout: 'standard', premium: false, progress: { level: 'B2', topic: 'MixedCond' },
    load: () => import('../data/grammar/B2/1MixedConditionals.json') },
  { id: 'en-grammar-b2-causatives', level: 'B2', slug: 'causitives', aliases: ['causatives'], title: 'Causatives',
    layout: 'standard', premium: false, progress: { level: 'B2', topic: 'causitives' },
    load: () => import('../data/grammar/B2/2Causitives.json') },
  { id: 'en-grammar-b2-modals-probability', level: 'B2', slug: 'modalsProb', title: 'Modals of Probability',
    layout: 'standard', premium: false, progress: { level: 'B2', topic: 'ModalsProb' },
    load: () => import('../data/grammar/B2/3ModalsProbability.json') },
  { id: 'en-grammar-b2-future-perfect', level: 'B2', slug: 'futurePerf', title: 'Future Perfect',
    layout: 'standard', premium: false, progress: { level: 'B2', topic: 'FuturePerf' },
    load: () => import('../data/grammar/B2/4FuturePerfect.json') },
  { id: 'en-grammar-b2-modals-deduction', level: 'B2', slug: 'modalsDeduction', title: 'Modals of Deduction',
    layout: 'timeline', premium: true, progress: { level: 'B2', topic: 'modals-deduction' },
    load: () => import('../data/grammar/B2/5ModalsDeduction.json') },
  { id: 'en-grammar-b2-gerunds-infinitives', level: 'B2', slug: 'GerInf', aliases: ['gerundsInfinitives'], title: 'Gerunds & Infinitives',
    layout: 'timeline', premium: true, progress: { level: 'B2', topic: 'gerunds-infinities' },
    load: () => import('../data/grammar/B2/6Gerunds.json') },
];

export const EXAMS = [
  {
    id: 'fede',
    title: 'FEDE Exams',
    summary: [
      ['Format', 'Reading comprehension + Gap fill'],
      ['Time', '1h45'],
      ['Level', 'B2 (CECR)'],
    ],
    description:
      'The FEDE (Fédération Européenne des Écoles) English exam tests your reading comprehension ' +
      'and language skills through multiple-choice questions and gap-fill exercises.',
    about: [
      ['Format', '3 reading texts with multiple choice and gap-fill questions'],
      ['Navigation', 'Free movement between texts and questions'],
      ['Scoring', '3 points per correct answer, 0 for incorrect/blank'],
      ['Level', 'B2 level (CECR framework)'],
    ],
    tests: [
      { id: 'fede-juin-2023', title: 'FEDE Practice Test 1',
        description: 'Amazon Growth, iPhone Factory, Biden Car Persona',
        load: () => import('../data/exams/fede/Juin2023.json') },
      { id: 'fede-jan-2023', title: 'FEDE Practice Test 2',
        description: 'Drought Risk, Elon Musk Twitter, Europe Energy',
        load: () => import('../data/exams/fede/Jan2023.json') },
    ],
  },
  {
    id: 'toeic',
    title: 'TOEIC Exams',
    comingSoon: true,
    summary: [
      ['Format', 'Listening + Reading'],
      ['Time', '2h'],
      ['Level', 'All levels'],
    ],
    description:
      'The TOEIC (Test of English for International Communication) measures your English ' +
      'proficiency in business and everyday contexts.',
    about: [
      ['Listening Section', '45 minutes, 100 questions'],
      ['Reading Section', '75 minutes, 100 questions'],
      ['Score Range', '10-990 points'],
      ['Question Types', 'Multiple choice, audio comprehension'],
    ],
    tests: [],
  },
];

// ── Lookups ───────────────────────────────────────────

export const lessonPath = (lesson) => `/${lesson.level}/${lesson.slug}`;

export const getLevel = (levelId) =>
  LEVELS.find((l) => l.id.toLowerCase() === String(levelId).toLowerCase()) || null;

export const getLessonsByLevel = (levelId) =>
  LESSONS.filter((l) => l.level.toLowerCase() === String(levelId).toLowerCase());

// Matches the slug or any alias, ignoring case and stray spaces
export const findLesson = (levelId, slug) => {
  const wanted = String(slug).trim().toLowerCase();
  return getLessonsByLevel(levelId).find((l) =>
    [l.slug, ...(l.aliases || [])].some((s) => s.toLowerCase() === wanted)
  ) || null;
};

// Next lesson in the same tier (free → free, premium → premium), across levels
export const getNextLesson = (lesson) => {
  const sameTier = LESSONS.filter((l) => l.premium === lesson.premium);
  const i = sameTier.findIndex((l) => l.id === lesson.id);
  return i >= 0 && i < sameTier.length - 1 ? sameTier[i + 1] : null;
};

export const getExam = (examId) =>
  EXAMS.find((e) => e.id.toLowerCase() === String(examId).toLowerCase()) || null;
