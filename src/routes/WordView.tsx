import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetTranslationsForWordQuery, useGetWordWithPhrasesAndTagsQuery } from "../redux-api";

export function WordView() {
  const params = useParams();
  const { Id } = params;
  const IdAsInt = parseInt(Id ?? "0");
  const { data, error, isLoading } = useGetWordWithPhrasesAndTagsQuery(IdAsInt, { skip: Id === undefined });
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useGetTranslationsForWordQuery(IdAsInt, { skip: Id === undefined });

  return <div>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    {data && <div>
      <h1>Word: '{data.Spelling}' (<Link to={`/Languages/${data.Language}`}>{data.Language}</Link>)</h1>
      Created: {data.Creation.toLocaleString()}
      {!!translationsError
        ? <span style={{ color: "red" }}>{JSON.stringify(translationsError)}</span>
        : translationsIsLoading
          ? "..."
          : <div>
            <h2>Translations</h2>
            <ul>
              {translations!.map(translation => {
                const otherWord = translation.Source === IdAsInt ? translation.Target : translation.Source;
                return <li key={translation.Id}>
                  <Link to={`/Words/${otherWord}`}>{otherWord}</Link>
                </li>
              })}
            </ul>
          </div>
      }
      <h2>Phrases:</h2>
      <ul>
        {data.Phrases.map(phrase => <li key={phrase.Id}><Link to={`/Phrases/${phrase.Id}`}>{phrase.Spelling}</Link></li>)}
      </ul>
      <h2>Tags:</h2>
      <ul>
        {data.Tags.map(tag => <li key={tag.Name}><Link to={`/Tags/${tag.Name}`}>{tag.Name}</Link></li>)}
      </ul>
    </div>}
  </div>
}