import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetTagWithWordsAndPhrasesQuery } from "../redux-api";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function TagView() {
  const params = useParams();
  const { Name } = params;
  const { data, error, isLoading } = useGetTagWithWordsAndPhrasesQuery(Name!, { skip: Name === undefined });

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return <div>
    <h1>Tag: '{Name}'</h1>
    {data && <div>
      <h2>Words:</h2>
      <ul>
        {data.Words.map(word => <li key={word.Spelling}><Link to={`/Words/${word.Id}`}>{word.Spelling}</Link></li>)}
      </ul>
      <h2>Phrases:</h2>
      <ul>
        {data.Phrases.map(phrase => <li key={phrase.Spelling}><Link to={`/Phrases/${phrase.Id}`}>{phrase.Spelling}</Link></li>)}
      </ul>
    </div>}
  </div>
}