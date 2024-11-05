import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateTagWordRelationMutation, useListTranslationViewsForWordQuery, useGetWordWithPhrasesAndTagsQuery } from "../redux-api";
import TagDetails from "../TagDetails";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function WordView() {
  const params = useParams();
  const { Id } = params;
  const IdAsInt = parseInt(Id ?? "0");
  const { data, error, isLoading } = useGetWordWithPhrasesAndTagsQuery(IdAsInt, { skip: Id === undefined });
  const [attachTag, { isLoading: isAttaching }] = useCreateTagWordRelationMutation();

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return <div>
    {data && <div>
      <h1>Word: '{data.Spelling}' (<Link to={`/Languages/${data.Language}`}>{data.Language}</Link>)</h1>
      Created: {data.Creation.toLocaleString()}
      <TranslationView wordId={IdAsInt} />
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

interface TranlationViewProps {
  wordId: number;
}
const TranslationView: FC<TranlationViewProps> = ({ wordId }: TranlationViewProps) => {
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useListTranslationViewsForWordQuery(wordId);

  if (translationsError) {
    return <ApiError error={translationsError} />
  }

  if (translationsIsLoading) {
    return <LinearProgress />;
  }

  return <div>
    <h2>Translations</h2>
    <ul>
      {translations!.map(translation => {
        const otherWord = translation.SourceId === wordId ? {
          Id: translation.TargetId,
          Language: translation.TargetLanguage,
          Spelling: translation.TargetSpelling,
        } : {
          Id: translation.SourceId,
          Language: translation.SourceLanguage,
          Spelling: translation.SourceSpelling,
        };
        return <li key={translation.Id}>
          <Link to={`/Words/${otherWord.Id}`}><strong>{otherWord.Language}: </strong>{otherWord.Spelling}</Link>
        </li>
      })}
    </ul>
  </div>;
}