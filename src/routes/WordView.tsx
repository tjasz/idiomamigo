import React, { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateTagWordRelationMutation, useListTranslationViewsForWordQuery, useGetWordWithPhrasesAndTagsQuery, useCreateWordTranslationMutation, useListWordsWithFilterQuery, useCreateWordMutation, useDeleteWordMutation } from "../redux-api";
import TagDetails from "../TagDetails";
import ApiError from "../ApiError";
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField } from "@mui/material";
import { Word } from "../types";
import { getDictionaryLink } from "../getDictionaryLink";
import { LanguageSelector } from "../LanguageSelector";

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

  const dictionaryLink = !!data ? getDictionaryLink(data) : null;

  return <div>
    {data && <div>
      <h1>Word: '{data.Spelling}' (<Link to={`/Languages/${data.Language}`}>{data.Language}</Link>)</h1>
      <ul>
        <li>Created: {data.Creation.toLocaleString()}</li>
        {dictionaryLink ? <li>{dictionaryLink}</li> : null}
      </ul>
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
      <DeleteWord wordId={data.Id} />
    </div>}
  </div>
}

interface TranlationViewProps {
  word: Word;
}
const TranslationView: FC<TranlationViewProps> = ({ word }: TranlationViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otherWord, setOtherWord] = useState<Word | string | undefined>(undefined);
  const [otherLanguage, setOtherLanguage] = useState<string | undefined>(undefined);
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useListTranslationViewsForWordQuery(word.Id);
  const [addTranslation, { isLoading: isAddingTranslation }] = useCreateWordTranslationMutation();
  const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();

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
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Add Translation</DialogTitle>
      <DialogContent>
        {isAddingTranslation || isCreatingWord
          ? <CircularProgress />
          : <div>
            <WordSelector sourceWord={word} disabledWordIds={disabledWordIds} onChange={(value) => {
              setOtherWord(value);
            }} />
            <LanguageSelector disabledLanguages={new Set<string>([word.Language])} onChange={value => setOtherLanguage(value?.Name)} />
          </div>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          if (otherWord === undefined) {
            alert("Word must be defined to confirm.")
          }
          else if (typeof otherWord === "string") {
            if (!otherLanguage) {
              alert("Language must be defined to create a new Word.");
            } else {
              // create word and add translation
              createWord({
                Spelling: otherWord,
                Language: otherLanguage,
                Creation: new Date(),
              }).then(result => {
                if (result.error) {
                  alert(result.error);
                } else if (result.data) {
                  addTranslation({
                    Source: word.Id,
                    Target: result.data.Id,
                    Creation: new Date(),
                  });
                  setDialogOpen(false);
                }
              }
              )
            }
          }
          else {
            addTranslation({
              Source: word.Id,
              Target: otherWord.Id,
              Creation: new Date(),
            });
            setDialogOpen(false);
          }
        }}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </div>;
}

interface IWordSelectorProps {
  sourceWord: Word,
  onChange: (value: Word | string | undefined) => void,
  disabledWordIds: Set<number>,
};
const WordSelector: FC<IWordSelectorProps> = ({ sourceWord, onChange, disabledWordIds }) => {
  const disabledIdsFilter = [...disabledWordIds].map(id => `Id ne ${id}`).join(" and ");
  const { data: words, isLoading: wordsLoading, error: wordsError } = useListWordsWithFilterQuery(
    `Language ne '${sourceWord.Language}'${disabledIdsFilter.length > 0 ? ` and ${disabledIdsFilter}` : ""}&$orderby=Spelling`
  );

  if (wordsLoading) {
    return <LinearProgress />
  }

  if (wordsError) {
    return <ApiError error={wordsError} />
  }

  if (!words) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    <Autocomplete
      freeSolo
      options={words}
      getOptionLabel={option => typeof option === "string" ? option : `${option.Spelling} (${option.Language})`}
      renderInput={(params) => <TextField {...params} label="Select Word..." />}
      onChange={(ev, value) => onChange(value ?? undefined)}
    />
  </div>
}

interface IDeleteWordProps {
  wordId: number;
}
const DeleteWord: FC<IDeleteWordProps> = ({ wordId }) => {
  const [deleteWord, { isLoading, error }] = useDeleteWordMutation();
  const navigate = useNavigate();

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return <Button onClick={() => {
    deleteWord(wordId);
    navigate("..", { relative: "path" })
  }}>
    Delete Word
  </Button>
}