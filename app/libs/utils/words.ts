export const wordCount = (words: string) => words.trim().split(/\s+/).length;

export const getNumberOfWords = (words: string, num: number) =>
  words.trim().split(/\s+/).slice(0, num).join(" ");
