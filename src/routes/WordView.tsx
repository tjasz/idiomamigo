import React, { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateTagWordRelationMutation, useListTranslationViewsForWordQuery, useGetWordWithPhrasesAndTagsQuery, useCreateWordTranslationMutation, useListWordsWithFilterQuery } from "../redux-api";
import TagDetails from "../TagDetails";
import ApiError from "../ApiError";
import { CircularProgress, Dialog, DialogTitle, LinearProgress } from "@mui/material";
import { Word } from "../types";

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
      <TranslationView word={data} />
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
  word: Word;
}
const TranslationView: FC<TranlationViewProps> = ({ word }: TranlationViewProps) => {
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useListTranslationViewsForWordQuery(word.Id);
  const [addTranslation, { isLoading: isAddingTranslation }] = useCreateWordTranslationMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (translationsError) {
    return <ApiError error={translationsError} />
  }

  if (translationsIsLoading) {
    return <LinearProgress />;
  }

  if (!translations) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  const disabledWordIds = (new Set(translations!.map(translation =>
    translation.SourceId === word.Id ? translation.TargetId : translation.SourceId)));

  return <div>
    <h2>Translations</h2>
    <ul>
      {translations!.map(translation => {
        const otherWord = translation.SourceId === word.Id ? {
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
    <button onClick={() => setDialogOpen(true)}>Add</button>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Add Translation</DialogTitle>
      {isAddingTranslation
        ? <CircularProgress />
        : <WordSelector sourceWord={word} disabledWordIds={disabledWordIds} onConfirm={(value: Word) => {
          addTranslation({
            Source: word.Id,
            Target: value.Id,
            Creation: new Date(),
          });
          setDialogOpen(false);
        }} />
      }
    </Dialog>
  </div>;
}

interface IWordSelectorProps {
  sourceWord: Word,
  onConfirm: (value: Word) => void,
  disabledWordIds: Set<number>,
};
const WordSelector: FC<IWordSelectorProps> = ({ sourceWord, onConfirm, disabledWordIds }) => {
  const disabledIdsFilter = [...disabledWordIds].map(id => `Id ne ${id}`).join(" and ");
  const { data: words, isLoading: wordsLoading, error: wordsError } = useListWordsWithFilterQuery(
    `Language ne '${sourceWord.Language}'${disabledIdsFilter.length > 0 ? ` and ${disabledIdsFilter}` : ""}&$orderby=Spelling`
  );
  const [word, setWord] = useState<Word | undefined>(undefined);

  if (wordsLoading) {
    return <LinearProgress />
  }

  if (wordsError) {
    return <ApiError error={wordsError} />
  }

  return <div>
    <select onChange={event => setWord(words?.[parseInt(event.target.value)])}>
      <option value={undefined} disabled selected><em>Select...</em></option>
      {words?.map((word, index) => <option key={index} value={index} disabled={disabledWordIds.has(word.Id)}>
        {word.Spelling} ({word.Language})
      </option>)}
    </select>
    <button onClick={() => {
      if (word === undefined) {
        alert("Word must be defined to confirm.")
      } else {
        onConfirm(word)
      }
    }}>Confirm</button>
  </div>
}