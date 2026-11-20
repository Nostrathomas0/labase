# labase

React (Create React App) PWA for Languapps: grammar lessons, practice exams and class session exercises.

- **Content rules and lesson JSON format: read `CONTENT.md` before creating or editing any lesson.** Session content goes in `content/lessons/<CODE>.json` + `content/vocab/<CODE>.md`; app content in `src/data/`.
- When turning plain-text questions into a lesson, follow the type table in `CONTENT.md` exactly, then run `npm run validate -- <file>` and fix every error.
- Keep the author's JSON formatting when editing a lesson: change only what is asked.
- Branches: `staging` deploys to https://staging.languapps.com (Firebase Hosting); `master` deploys the live site (S3/CloudFront). Work on `staging`; only merge to `master` when asked.
- Lessons, levels and exams are listed in `src/catalogue/catalogue.js`; routes are generic (`/:level/:slug`, `/exams/:examId`, `/session/:sessionId`).
