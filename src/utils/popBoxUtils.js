// utils/popBoxUtils.js
export const parseBlanks = (template) => {
  if (!template) return [];
  // splits '___' consistent with GapFill's '_____' pattern
  // returns alternating [string, null, string, null, string]
  return template.split('___').flatMap((seg, i, arr) =>
    i < arr.length - 1 ? [seg, null] : [seg]
  );
};