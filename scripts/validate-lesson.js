#!/usr/bin/env node
// scripts/validate-lesson.js
// Checks lesson JSON files against what the app's components actually need.
// Usage: node scripts/validate-lesson.js path/to/lesson.json [more.json ...]
// Exits with code 1 if any file has errors (so CI can block an upload).

const fs = require('fs');
const path = require('path');

const count = (arr) => arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
const sameItems = (a, b) => {
  const ca = count(a);
  const cb = count(b);
  return ca.size === cb.size && [...ca].every(([k, v]) => cb.get(k) === v);
};
const isStrArr = (x) => Array.isArray(x) && x.length > 0 && x.every((s) => typeof s === 'string' && s.trim());
const dupes = (arr) => [...count(arr)].filter(([, n]) => n > 1).map(([k]) => k);

const checks = {
  instructions(q, err) {
    if (!Array.isArray(q.instructions) || !q.instructions.every((i) => i && typeof i.text === 'string')) {
      err('needs `instructions`: a list of { text } objects');
    }
  },
  multipleChoice(q, err) {
    if (!q.question) err('missing `question`');
    if (!isStrArr(q.options) || q.options.length < 2) return err('needs at least 2 `options`');
    if (!q.options.includes(q.correctAnswer)) err(`\`correctAnswer\` "${q.correctAnswer}" is not one of the options`);
    if (dupes(q.options).length) err(`duplicate options: ${dupes(q.options).join(', ')}`);
  },
  gapFill(q, err, warn) {
    if (typeof q.template !== 'string') return err('missing `template`');
    const blanks = q.template.split('_____').length - 1;
    if (blanks !== 1) err(`\`template\` must contain exactly one "_____" (5 underscores); found ${blanks}`);
    if (/_{6,}|(^|[^_])_{1,4}([^_]|$)/.test(q.template)) warn('template has a run of underscores that is not exactly 5');
    if (!isStrArr(q.correctAnswers)) err('needs `correctAnswers`: a list of accepted answers');
    else if (q.correctAnswers.some((a) => /[’‘]/.test(a))) warn('answer contains a curly apostrophe; students typing a straight one will be marked wrong');
  },
  wordBank(q, err) {
    if (!isStrArr(q.wordBank)) return err('needs `wordBank`: a list of choices');
    if (!isStrArr(q.correctAnswers)) return err('needs `correctAnswers` in the correct order');
    const bank = count(q.wordBank);
    for (const [w, n] of count(q.correctAnswers)) {
      if ((bank.get(w) || 0) < n) err(`correct answer "${w}" is not in the word bank${n > 1 ? ` ${n} times` : ''}`);
    }
  },
  sentenceBuilder(q, err) {
    if (!isStrArr(q.tokens) || !isStrArr(q.correctOrder)) return err('needs `tokens` and `correctOrder`');
    if (!sameItems(q.tokens, q.correctOrder)) err('`tokens` and `correctOrder` must contain exactly the same words');
  },
  matchingPairs(q, err) {
    if (!Array.isArray(q.pairs) || q.pairs.length < 2) return err('needs at least 2 `pairs`');
    if (!q.pairs.every((p) => p && p.left && p.right)) return err('every pair needs `left` and `right`');
    const l = dupes(q.pairs.map((p) => p.left));
    const r = dupes(q.pairs.map((p) => p.right));
    if (l.length) err(`duplicate left items: ${l.join(', ')}`);
    if (r.length) err(`duplicate right items: ${r.join(', ')}`);
  },
  popBox(q, err) {
    if (!isStrArr(q.columns) || !Array.isArray(q.rows) || !isStrArr(q.tokens)) {
      return err('needs `columns`, `rows` and `tokens`');
    }
    const blanks = [];
    q.rows.forEach((row, r) => {
      if (!row.header || !Array.isArray(row.blanks)) return err(`row ${r + 1} needs \`header\` and \`blanks\``);
      if (row.blanks.length !== q.columns.length - 1) {
        err(`row "${row.header}" has ${row.blanks.length} blanks; expected ${q.columns.length - 1} (columns minus the header column)`);
      }
      blanks.push(...row.blanks);
    });
    if (!sameItems(blanks, q.tokens)) err('`tokens` must contain exactly the blank answers, once each');
  },
  click(q, err) {
    if (!Array.isArray(q.words) || !q.words.every((w) => w && w.text)) return err('needs `words`: a list of { text, feedback }');
    if (!isStrArr(q.keyWords)) return err('needs `keyWords`: the correct choice(s)');
    const texts = q.words.map((w) => w.text);
    q.keyWords.forEach((k) => { if (!texts.includes(k)) err(`keyWord "${k}" is not one of the words`); });
  },
  imageDisplay(q, err) {
    if (!q.imagePath) err('missing `imagePath`');
  },
};
checks.image = checks.imageDisplay;

function validate(file) {
  const errors = [];
  const warnings = [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return { errors: [`not valid JSON: ${e.message}`], warnings };
  }

  if (!data.id) errors.push('missing top-level `id`');
  if (!data.title) errors.push('missing top-level `title`');
  if (data.source && JSON.stringify(data.source).includes('TODO')) warnings.push('`source` still contains TODO');

  const items = Array.isArray(data.content)
    ? data.content.map((q, i) => [`item ${i + 1}`, q])
    : Array.isArray(data.pages)
      ? data.pages.flatMap((p, pi) => (p.questions || []).map((q, i) => [`page ${pi + 1} item ${i + 1}`, q]))
      : null;
  if (!items) return { errors: [...errors, 'needs a `content` list (or `pages`)'], warnings };

  let exercises = 0;
  items.forEach(([where, q]) => {
    const label = `${where} (${q && q.type})`;
    const check = q && checks[q.type];
    if (!check) return errors.push(`${label}: unknown type; use one of ${Object.keys(checks).join(', ')}`);
    if (!['instructions', 'imageDisplay', 'image'].includes(q.type)) exercises += 1;
    check(q, (m) => errors.push(`${label}: ${m}`), (m) => warnings.push(`${label}: ${m}`));
  });
  if (!exercises) errors.push('no exercises found');

  return { errors, warnings, exercises };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/validate-lesson.js <lesson.json> [...]');
  process.exit(2);
}

let failed = false;
files.forEach((file) => {
  const { errors, warnings, exercises } = validate(file);
  const name = path.relative(process.cwd(), file);
  if (errors.length) failed = true;
  console.log(`${errors.length ? '✗' : '✓'} ${name}${exercises ? ` (${exercises} exercises)` : ''}`);
  errors.forEach((e) => console.log(`   error:   ${e}`));
  warnings.forEach((w) => console.log(`   warning: ${w}`));
});
process.exit(failed ? 1 : 0);
