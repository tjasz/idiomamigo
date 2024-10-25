import React, { useState } from "react";
import { useCreatePhraseMutation, useListLanguagesQuery, useListPhrasesQuery } from "../redux-api";
import { Link } from "react-router-dom";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";

export function PhrasesView() {
  const { data: languages, error: getLanguageError, isLoading: isLoadingLanguages } = useListLanguagesQuery();
  const { data: phrases, error: listPhrasesError, isLoading: isLoadingPhrases } = useListPhrasesQuery();

  const [createPhrase, { isLoading: isCreatingPhrase }] = useCreatePhraseMutation();
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [spelling, setSpelling] = useState<string | undefined>(undefined);

  if (getLanguageError) {
    return <ApiError error={getLanguageError} />
  }
  if (listPhrasesError) {
    return <ApiError error={listPhrasesError} />
  }

  if (isLoadingLanguages || isLoadingPhrases) {
    return <LinearProgress />;
  }

  if (!phrases || !languages) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    <h1>Phrases</h1>
    <table>
      <tbody>
        <tr>
          <th>Language</th>
          <th>Spelling</th>
          <th>Creation</th>
        </tr>
        {phrases.map(phrase => <tr key={phrase.Id}>
          <td><Link to={`/Languages/${phrase.Language}`}>{phrase.Language}</Link></td>
          <td><Link to={phrase.Id.toString()}>{phrase.Spelling}</Link></td>
          <td>{phrase.Creation.toLocaleString()}</td>
        </tr>)}
        <tr>
          <td>
            <select onChange={(event) => setLanguage(event.target.value)}>
              {languages.map(language => <option key={language.Name} value={language.Name}>
                {language.Name}
              </option>)}
            </select>
          </td>
          <td>
            <input id="newPhraseSpelling" type="text" onChange={(event) => setSpelling(event.target.value)} />
          </td>
          <td>
            <button disabled={isCreatingPhrase} onClick={() => {
              if (language === undefined || spelling === undefined) {
                alert("Language and spelling required to create a phrase.")
              } else {
                createPhrase({
                  Language: language,
                  Spelling: spelling,
                  Creation: new Date(),
                });
              }
            }}>Create</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
}