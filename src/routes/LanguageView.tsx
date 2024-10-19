import React from "react";
import { useParams } from "react-router-dom";
import { useGetLanguageWithWordsQuery } from "../redux-api";

export function LanguageView() {
  const params = useParams();
  console.log({ params });
  const { Name } = params;
  const { data, error, isLoading } = useGetLanguageWithWordsQuery(Name!, { skip: Name === undefined });

  if (Name === undefined) {
    console.log("No Name parameter.")
    return <h1>Language: [undefined]</h1>
  }
  if (data === undefined) {
    console.log("No Language found.")
    return <h1>Language: [undefined]</h1>
  }

  return <div>
    <h1>Language: '{data.Name}'</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {data.Words.map(word => <li key={word.Spelling}>{word.Spelling}</li>)}
    </ul>
  </div>
}