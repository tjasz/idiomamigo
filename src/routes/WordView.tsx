import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateTagWordRelationMutation, useListTranslationViewsForWordQuery, useGetWordWithPhrasesAndTagsQuery } from "../redux-api";
import TagDetails from "../TagDetails";

export function WordView() {
  const params = useParams();
  const { Id } = params;
  const IdAsInt = parseInt(Id ?? "0");
  const { data, error, isLoading } = useGetWordWithPhrasesAndTagsQuery(IdAsInt, { skip: Id === undefined });
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useListTranslationViewsForWordQuery(IdAsInt, { skip: Id === undefined });
  const [attachTag, { isLoading: isAttaching }] = useCreateTagWordRelationMutation();

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
                const otherWord = translation.SourceId === IdAsInt ? {
                  Id: translation.TargetId,
                  Language: translation.TargetLanguage,
                  Spelling: translation.TargetSpelling,
                } : {
                  Id: translation.SourceId,
                  Language: translation.SourceLanguage,
                  Spelling: translation.SourceSpelling,
                };
                return <li key={translation.Id}>
                  <Link to={`/Words/${otherWord.Id}`}>{otherWord.Spelling} ({otherWord.Language})</Link>
                </li>
              })}
            </ul>
          </div>
      }
      <h2>Phrases:</h2>
      <ul>
        {data.Phrases.map(phrase => <li key={phrase.Id}><Link to={`/Phrases/${phrase.Id}`}>{phrase.Spelling}</Link></li>)}
      </ul>
      <TagDetails tags={data.Tags} isAttaching={isAttaching} onAttachTag={(tagName) => attachTag({
        Tag: tagName,
        Word: data.Id,
        Creation: new Date(),
      })} />
    </div>}
  </div>
}