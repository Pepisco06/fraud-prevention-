const climpText = (text: string, to: number): string =>
  text.length >= to ? text.slice(0, to) : text;

export default climpText;
