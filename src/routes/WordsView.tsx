import React from "react";
import { useCreateWordMutation, useDeleteWordMutation, useListWordsQuery, useUpdateWordMutation } from "../redux-api";

export function WordsView() {
  const { data, error, isLoading } = useListWordsQuery();
  const [createWord, { isLoading: isCreating }] = useCreateWordMutation();
  const [updateWord, { isLoading: isUpdating }] = useUpdateWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();
  const words = data?.value;

  return <div>
    <h1>Words</h1>
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
        {words && words.map(word => <tr key={word.Id}>
          <td>{word.Id}</td>
          <td>{word.Language}</td>
          <td>{word.Spelling}</td>
          <td>{word.Creation.toLocaleString()}</td>
          <td><button onClick={() => updateWord({
            Id: word.Id,
            Language: "English",
            Spelling: "That",
            Creation: new Date(),
          })}>Update</button></td>
          <td><button onClick={() => deleteWord(word.Id)}>Delete</button></td>
        </tr>)}
      </tbody>
    </table>
    <button onClick={() => {
      createWord({
        Language: "English",
        Spelling: "This",
        Creation: new Date(),
      })
    }}>Add</button>
  </div>
}