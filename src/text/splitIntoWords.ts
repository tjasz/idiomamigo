export default function splitIntoWords(text: string) {
  const words = text.match(/\b(\S+)\b/g) ?? [];
  return words.map(w => w.toLowerCase());
}