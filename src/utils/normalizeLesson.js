// src/utils/normalizeLesson.js
// Lets lessons be written as one flat `content` list (the session-packet format)
// and turns them into the `pages` structure the lesson views use.
//
// A new page starts at each `instructions` item whose first line is bold
// (e.g. "Part 2: Vocabulary"), once the current page already has items.
// Files that already have `pages` are returned unchanged.

const isSectionHeading = (item) =>
  item &&
  item.type === 'instructions' &&
  Array.isArray(item.instructions) &&
  item.instructions[0] &&
  item.instructions[0].textStyle === 'bold';

export function normalizeLesson(data) {
  if (!data || Array.isArray(data.pages) || !Array.isArray(data.content)) return data;

  const pages = [];
  let current = null;

  data.content.forEach((item) => {
    if (!current || (isSectionHeading(item) && current.questions.length > 0)) {
      current = {
        title: isSectionHeading(item) ? item.instructions[0].text : data.title || '',
        questions: [],
      };
      pages.push(current);
    }
    current.questions.push(item);
  });

  return { ...data, pages };
}

export default normalizeLesson;
