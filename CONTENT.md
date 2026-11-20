# Where content lives

**One rule:** content that is the same for everyone ships with the app. Content made for a class session lives in `content/` and is delivered separately.

| | App content | Session content |
|---|---|---|
| What | Grammar lessons, practice exams | One class session: its app exercises and its vocab email |
| Where | `src/data/grammar/`, `src/data/exams/` | `content/lessons/`, `content/vocab/` |
| Who sees it | Everyone with the app. Premium lessons are hidden unless the user's `premium` flag is true | Students of that session |
| How it reaches the student | Built into the app | Now: bundled at build time. Later: uploaded to Firestore, nothing bundled |
| Listed in | `src/catalogue/catalogue.js` | Found automatically from `content/lessons/` |

Note: premium lessons are inside the app's files. The premium flag decides what the app shows; it does not make the files secret.

## Session files

Each session is **two files with the same name**:

```
content/lessons/PB0.json   app exercises (lesson JSON, see below)
content/vocab/PB0.md       vocabulary list, sent in the reminder email the day before class
```

- The name is the **session code**: class prefix + number, e.g. `PB0`, `PB1`.
- The `"id"` inside the JSON must equal the code.
- Never rename or reuse a code after it has been sent to students. It is the app address (`/session/PB0`), the Firestore document name and the key progress is saved under.
- The build stops if a lesson has no vocab file (or the reverse), if an `id` doesn't match, or if a lesson has errors.

### Class prefixes

| Prefix | Class |
|---|---|
| PB | Plateau Breaker |

## Workflow

1. Write `content/vocab/<CODE>.md` and `content/lessons/<CODE>.json` on the `staging` branch.
2. Check: `npm run validate -- content/lessons/<CODE>.json`
3. Preview while editing: `npm start`, then open the "On Your Network" address on your phone at `/session/<CODE>`.
4. `git push`: about 2 minutes later it's on https://staging.languapps.com (app menu → Class Sessions).
5. Happy with it: merge `staging` into `master` to put it on the live site.

## Lesson JSON

```json
{
  "schema_version": "1.0",
  "id": "PB0",
  "class_id": "plateau-breaker",
  "title": "Could we build Iron Man's arc reactor?",
  "level": "Intermediate",
  "language": "en",
  "source": { "title": "...", "url": "..." },
  "content": [ ...items... ]
}
```

`content` is one list of items. A new page starts at each `instructions` item whose first line has `"textStyle": "bold"`. Instructions and click items show in the left panel, exercises in the right panel, one at a time.

| type | Required fields | Rules |
|---|---|---|
| `instructions` | `instructions`: list of `{ text, textStyle?, newParagraph?, newLine? }` | `textStyle`: `bold` or `italic` |
| `multipleChoice` | `question`, `options`, `correctAnswer` | `correctAnswer` must be one of `options`, word for word |
| `gapFill` | `template`, `correctAnswers` | exactly one `_____` (5 underscores); list every accepted answer |
| `wordBank` | `paragraph`, `wordBank`, `correctAnswers` | answers in order; each must be in `wordBank` |
| `sentenceBuilder` | `tokens`, `correctOrder` | same words in both, shuffled in `tokens` |
| `matchingPairs` | `pairs`: list of `{ left, right }` | no repeated left or right items |
| `popBox` | `columns`, `rows`: `{ header, blanks }`, `tokens` | blanks per row = columns − 1; `tokens` = all blanks once each |
| `click` | `instructions`, `words`: `{ text, feedback }`, `keyWords` | each `keyWords` entry must be a `words` text |
| `imageDisplay` | `imagePath` (`altText` recommended) | path as in `src/imageMap.js` |

Use straight apostrophes (`'`) in answers: curly ones (`’`) mark students wrong.
