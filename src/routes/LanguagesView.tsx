import React from "react";
import { useListLanguagesWithWordsQuery } from "../redux-api";

export function LanguagesView() {
  const { data, error, isLoading } = useListLanguagesWithWordsQuery();

  return <div>
    <h1>Languages</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {data && data.map(lang => <li>
        {lang.Name}
        <ul>
          {lang.Words.map(word => <li>{word.Spelling}</li>)}
        </ul>
      </li>)}
    </ul>
  </div>
}