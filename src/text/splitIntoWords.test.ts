import splitIntoWords from "./splitIntoWords";

describe("splitIntoWords", () => {
  it.each<[string, string[]]>([
    // Test with an English contraction
    [
      "Let's get this party started.",
      ["let's", "get", "this", "party", "started"]
    ],
    // Test with Spanish question marks, á, ó, and ñ
    [
      "¿Dónde está el baño?",
      ["dónde", "está", "el", "baño"]
    ],
    // Test with é
    [
      "Chouinard es también un surfista.",
      ["chouinard", "es", "también", "un", "surfista"]
    ],
    // Test with é at the beginning of a word
    [
      "Ha escrito sobre temas y ética de la escalada.",
      ["ha", "escrito", "sobre", "temas", "y", "ética", "de", "la", "escalada"]
    ],
  ])(
    "splitIntoWords(%p) = %p",
    (text: string, expected: string[]) => {
      const res = splitIntoWords(text);
      expect(res).toStrictEqual(expected);
    },
  );
});