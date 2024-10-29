import React, { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreatePhraseMembershipMutation, useCreateTagPhraseRelationMutation, useCreateWordMutation, useGetPhraseWithWordsAndTagsQuery, useGetTranslationsForPhraseQuery, useListTagsQuery, useListWordsWithFilterQuery } from "../redux-api";
import splitIntoWords from "../text/splitIntoWords";
import { Phrase, Tag, Word } from "../types";
import ApiError from "../ApiError";
import { CircularProgress, Dialog, DialogTitle, LinearProgress } from "@mui/material";

export function PhraseView() {
  const params = useParams();
  const { Id } = params;
  const IdAsInt = parseInt(Id ?? "0");
  const { data: phrase, error, isLoading } = useGetPhraseWithWordsAndTagsQuery(IdAsInt, { skip: Id === undefined });
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useGetTranslationsForPhraseQuery(IdAsInt, { skip: Id === undefined });

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!phrase) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    {phrase && <div>
      <h1>Phrase: '{phrase.Spelling}' (<Link to={`/Languages/${phrase.Language}`}>{phrase.Language}</Link>)</h1>
      Created: {phrase.Creation.toLocaleString()}
      {!!translationsError
        ? <span style={{ color: "red" }}>{JSON.stringify(translationsError)}</span>
        : translationsIsLoading
          ? "..."
          : <div>
            <h2>Translations</h2>
            <ul>
              {translations!.map(translation => {
                const otherPhrase = translation.Source === IdAsInt ? translation.Target : translation.Source;
                return <li key={translation.Id}>
                  <Link to={`/Phrases/${otherPhrase}`}>{otherPhrase}</Link>
                </li>
              })}
            </ul>
          </div>
      }
      <WordDetails phrase={phrase} />
      <TagDetails tags={phrase.Tags} phraseId={phrase.Id} />
    </div>}
  </div>
}

interface IWordDetailsParams { phrase: Phrase & { Words: Word[] } };

const WordDetails: FC<IWordDetailsParams> = ({ phrase }) => {
  // TODO use lookup to make this more efficient - TODO make it case-insensitive
  const potentialWords = splitIntoWords(phrase.Spelling).filter(w => !phrase.Words.map(w => w.Spelling).includes(w));

  const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();
  const [createPhraseMembership, { isLoading: isCreatingPhraseMembership }] = useCreatePhraseMembershipMutation();
  const { data: potentialWordsInDb, error: potentialWordsError, isLoading: potentialWordsLoading } = useListWordsWithFilterQuery(
    potentialWords.map(word => `Spelling eq '${word}'`).join(" or "),
    { skip: phrase.Spelling.length === 0 || potentialWords.length < 1 }
  );

  // TODO use lookup to make this more efficient - TODO make it case-insensitive
  const wordsNotInDb = potentialWords.filter(w => potentialWordsInDb ? !potentialWordsInDb.map(w => w.Spelling).includes(w) : true);

  if (potentialWordsError) {
    return <ApiError error={potentialWordsError} />
  }

  if (potentialWordsLoading) {
    return <LinearProgress />;
  }

  return <div>
    <h2>Words</h2>
    <h3>Words connected to Phrase</h3>
    <ul>
      {phrase.Words.map(word => <li key={word.Id}><Link to={`/Phrases/${word.Id}`}>{word.Spelling}</Link></li>)}
    </ul>
    <h3>Words in DB that might be in Phrase</h3>
    <ul>
      {potentialWordsInDb?.map(word => <li key={word.Id}>
        <Link to={`/Phrases/${word.Id}`}>{word.Spelling}</Link>
        <button
          disabled={isCreatingPhraseMembership}
          onClick={() => createPhraseMembership({ Word: word.Id, Phrase: phrase.Id, Creation: new Date() })}
        >
          Link
        </button>
      </li>)}
    </ul>
    <h3>Words not in DB that might be in Phrase</h3>
    <ul>
      {wordsNotInDb.map(word => <li key={word}>
        {word}
        <button disabled={isCreatingWord} onClick={() => {
          createWord({
            Language: phrase.Language,
            Spelling: word,
            Creation: new Date(),
          }).then(wordResult => {
            console.log(wordResult)
            if (wordResult.data) {
              createPhraseMembership({
                Word: wordResult.data.Id,
                Phrase: phrase.Id,
                Creation: new Date(),
              })
            }
          })
        }}>Create and Link</button>
      </li>)}
    </ul>
  </div>
}

interface ITagDetailsParams { tags: Tag[], phraseId: number };

const TagDetails: FC<ITagDetailsParams> = ({ tags, phraseId }) => {
  const [attachTag, { isLoading: isAttaching }] = useCreateTagPhraseRelationMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  return <div>
    <h2>Tags:</h2>
    <ul>
      {tags.map(tag => <li key={tag.Name}>
        <Link to={`/Tags/${tag.Name}`}>{tag.Name}</Link>
      </li>)}
    </ul>
    <button onClick={() => setDialogOpen(true)}>Add</button>
    <Dialog open={dialogOpen}>
      <DialogTitle>Attach Tag</DialogTitle>
      {isAttaching
        ? <CircularProgress />
        : <TagSelector disabledTagnames={new Set(tags.map(tag => tag.Name))} onConfirm={(value: Tag) => {
          attachTag({
            Tag: value.Name,
            Phrase: phraseId,
            Creation: new Date(),
          });
          setDialogOpen(false);
        }} />
      }
    </Dialog>
  </div>
}

interface ITagSelectorProps {
  onConfirm: (value: Tag) => void,
  disabledTagnames: Set<string>,
};
const TagSelector: FC<ITagSelectorProps> = ({ onConfirm, disabledTagnames }) => {
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useListTagsQuery();
  const [tag, setTag] = useState<Tag | undefined>(undefined);

  if (tagsLoading) {
    return <LinearProgress />
  }

  if (tagsError) {
    return <ApiError error={tagsError} />
  }

  return <div>
    <select onChange={event => setTag(tags?.[parseInt(event.target.value)])}>
      <option value={undefined} disabled selected><em>Select...</em></option>
      {tags?.map((tag, index) => <option key={index} value={index}> disabled={disabledTagnames.has(tag.Name)}
        {tag.Name}
      </option>)}
    </select>
    <button onClick={() => {
      if (tag === undefined) {
        alert("Tag name must be defined to confirm.")
      } else {
        onConfirm(tag)
      }
    }}>Confirm</button>
  </div>
}