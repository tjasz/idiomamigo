import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreatePhraseMembershipMutation, useCreateTagPhraseRelationMutation, useCreateWordMutation, useGetPhraseWithWordsAndTagsQuery, useListTranslationViewsForPhraseQuery, useListWordsWithFilterQuery } from "../redux-api";
import splitIntoWords from "../text/splitIntoWords";
import { Phrase, Word } from "../types";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";
import TagDetails from "../TagDetails";

export function PhraseView() {
  const params = useParams();
  const { Id } = params;
  const IdAsInt = parseInt(Id ?? "0");
  const { data: phrase, error, isLoading } = useGetPhraseWithWordsAndTagsQuery(IdAsInt, { skip: Id === undefined });
  const { data: translations, error: translationsError, isLoading: translationsIsLoading } = useListTranslationViewsForPhraseQuery(IdAsInt, { skip: Id === undefined });
  const [attachTag, { isLoading: isAttaching }] = useCreateTagPhraseRelationMutation();

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
      <h1>Phrase</h1>
      <ul>
        <li><strong>Language:</strong> <Link to={`/Languages/${phrase.Language}`}>{phrase.Language}</Link></li>
        <li><strong>Created:</strong> {phrase.Creation.toLocaleString()}</li>
      </ul>
      <PhraseSpelling phrase={phrase} />
      {!!translationsError
        ? <span style={{ color: "red" }}>{JSON.stringify(translationsError)}</span>
        : translationsIsLoading
          ? "..."
          : <div>
            <h2>Translations</h2>
            <ul>
              {translations!.map(translation => {
                const otherPhrase = translation.SourceId === IdAsInt ? {
                  Id: translation.TargetId,
                  Language: translation.TargetLanguage,
                  Spelling: translation.TargetSpelling,
                } : {
                  Id: translation.SourceId,
                  Language: translation.SourceLanguage,
                  Spelling: translation.SourceSpelling,
                };
                return <li key={translation.Id}>
                  <Link to={`/Phrases/${otherPhrase.Id}`}><strong>{otherPhrase.Language}: </strong>{otherPhrase.Spelling}</Link>
                </li>
              })}
            </ul>
          </div>
      }
      <WordDetails phrase={phrase} />
      <TagDetails tags={phrase.Tags} isAttaching={isAttaching} onAttachTag={(tagName) => attachTag({
        Tag: tagName,
        Phrase: phrase.Id,
        Creation: new Date(),
      })} />
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
      {phrase.Words.map(word => <li key={word.Id}><Link to={`/Words/${word.Id}`}>{word.Spelling}</Link></li>)}
    </ul>
    <h3>Words in DB that might be in Phrase</h3>
    <ul>
      {potentialWordsInDb?.map(word => <li key={word.Id}>
        <Link to={`/Words/${word.Id}`}>{word.Spelling}</Link>
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

interface IPhraseSpellingProps {
  phrase: Phrase & { Words: Word[] };
}
const PhraseSpelling: FC<IPhraseSpellingProps> = ({ phrase }) => {
  const tokens = splitIntoWords(phrase.Spelling)

  const tokensWithLinks = tokens.map((token, index) => {
    // TODO use lookup to make this more efficient
    const word = phrase.Words.find(v => v.Spelling === token)
    if (word) {
      return <Link key={index} to={`/Words/${word.Id}`}>{token} </Link>
    } else {
      return <React.Fragment key={index}>{token} </React.Fragment>;
    }
  });

  return <div>
    <p>{phrase.Spelling}</p>
    <p>{tokensWithLinks}</p>
  </div>
}