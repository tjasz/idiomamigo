import React from "react";
import { useCreatePhraseMutation, useDeletePhraseMutation, useListPhrasesQuery, useUpdatePhraseMutation } from "../redux-api";

export function PhrasesView() {
  const { data, error, isLoading } = useListPhrasesQuery();
  const [createPhrase, { isLoading: isCreating }] = useCreatePhraseMutation();
  const [updatePhrase, { isLoading: isUpdating }] = useUpdatePhraseMutation();
  const [deletePhrase, { isLoading: isDeleting }] = useDeletePhraseMutation();
  const phrases = data?.value;

  return <div>
    <h1>Phrases</h1>
    <table>
      <tbody>
        <tr>
          <th>Id</th>
          <th>Language</th>
          <th>Spelling</th>
          <th>Creation</th>
          <th></th>
          <th></th>
        </tr>
        {(isLoading || isCreating || isUpdating || isDeleting) && "..."}
        {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
        {phrases && phrases.map(phrase => <tr key={phrase.Id}>
          <td>{phrase.Id}</td>
          <td>{phrase.Language}</td>
          <td>{phrase.Spelling}</td>
          <td>{phrase.Creation.toLocaleString()}</td>
          <td><button onClick={() => updatePhrase({
            Id: phrase.Id,
            Language: "English",
            Spelling: "That",
            Creation: new Date(),
          })}>Update</button></td>
          <td><button onClick={() => deletePhrase(phrase.Id)}>Delete</button></td>
        </tr>)}
      </tbody>
    </table>
    <button onClick={() => {
      createPhrase({
        Language: "English",
        Spelling: "This",
        Creation: new Date(),
      })
    }}>Add</button>
  </div>
}