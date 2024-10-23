export default function splitIntoWords(text: string) {
  // [A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ']
  const words = text.match(/([^\s.¿?¡!,;:"()]+)/g) ?? [];
  return words.map(
    w => w.toLowerCase().replace(/^[^A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ]*|[^A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ]*$/g, '')
  ).filter(w => w.length > 0);
}