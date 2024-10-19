import React from "react";
import { useParams } from "react-router-dom";
import { useGetLanguageWithWordsQuery } from "../redux-api";

export function LanguageView() {
  const params = useParams();
  const { Name } = params;
  const { data, error, isLoading } = useGetLanguageWithWordsQuery(Name!, { skip: Name === undefined });

  return <div>
    <h1>Language: '{Name}'</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {data && data.Words.map(word => <li key={word.Spelling}>{word.Spelling}</li>)}
    </ul>
  </div>
}