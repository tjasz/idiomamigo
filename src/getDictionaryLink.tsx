import { Link } from "@mui/material";
import React from "react";
import { Word } from "./types";

export function getDictionaryLink(word: Word) {
  if (word.Language === "Spanish") {
    return <Link href={`https://www.spanishdict.com/translate/${word.Spelling}`}>'{word.Spelling}' on SpanishDict.com</Link>
  }
  return null;
}