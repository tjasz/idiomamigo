import React, { useState } from "react";
import { useCreateWordMutation, useDeleteWordMutation, useListLanguagesQuery, useListWordsQuery } from "../redux-api";
import { Link } from "react-router-dom";
import ApiError from "../ApiError";
import { LinearProgress } from "@mui/material";
import { DataTable } from "../DataTable";

export function WordsView() {
  const { data, error, isLoading } = useListWordsQuery();

  // TODO show error if delete fails (may be due to being part of a PhraseMembership or other relation)
  const [deleteWord, { isLoading: isDeletingWord }] = useDeleteWordMutation();

  if (error) {
    return <ApiError error={error} />
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!data) {
    return <span style={{ color: "red" }}>Data not defined, even though not loading.</span>;
  }

  return <div>
    <h1>Words</h1>
    <DataTable />
    <table>
      <tbody>
        <tr>
          <th>Language</th>
          <th>Spelling</th>
          <th>Creation</th>
          <th>DELETE</th>
        </tr>
        {data.map(word => <tr key={word.Id}>
          <td><Link to={`/Languages/${word.Language}`}>{word.Language}</Link></td>
          <td><Link to={word.Id.toString()}>{word.Spelling}</Link></td>
          <td>{word.Creation.toLocaleString()}</td>
          <td><button disabled={isDeletingWord} onClick={() => deleteWord(word.Id)}><span style={{ color: "red" }}>DELETE</span></button></td>
        </tr>)}
        <AddWordRow />
      </tbody>
    </table>
  </div>
}

function AddWordRow() {
  const { data: languages, error: getLanguageError, isLoading: isLoadingLanguages } = useListLanguagesQuery();
  const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();

  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [spelling, setSpelling] = useState<string | undefined>(undefined);

  if (getLanguageError) {
    return <tr><td colSpan={4}><ApiError error={getLanguageError} /></td></tr>
  }

  if (isLoadingLanguages) {
    return <tr><td colSpan={4}><LinearProgress /></td></tr>;
  }

  if (!languages) {
    return <tr><td colSpan={4}><span style={{ color: "red" }}>Languages list not defined, even though not loading.</span></td></tr>;
  }

  return <tr>
    <td>
      <select onChange={(event) => setLanguage(event.target.value)}>
        <option value={undefined} disabled selected><em>Select...</em></option>
        {languages.map(language => <option key={language.Name} value={language.Name}>
          {language.Name}
        </option>)}
      </select>
    </td>
    <td>
      <input id="newWordSpelling" type="text" onChange={(event) => setSpelling(event.target.value)} />
    </td>
    <td>
      <button disabled={isCreatingWord} onClick={() => {
        if (language === undefined || spelling === undefined) {
          alert("Language and spelling required to create a word.")
        } else {
          createWord({
            Language: language,
            Spelling: spelling,
            Creation: new Date(),
          });
          setSpelling(undefined);
        }
      }}>Create</button>
    </td>
    <td></td>
  </tr>
}