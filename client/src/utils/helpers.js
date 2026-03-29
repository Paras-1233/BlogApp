export const wordCount = (str) =>
  str.trim().split(/\s+/).filter(Boolean).length;

export const readTime = (str) =>
  Math.max(1, Math.ceil(wordCount(str) / 200));