import React from 'react';
import { useCreatePhraseMutation, useCreateWordMutation, useDeletePhraseMutation, useDeleteWordMutation, useListLanguagesWithWordsQuery, useListPhrasesQuery, useListWordsQuery, useUpdatePhraseMutation, useUpdateWordMutation } from './redux-api';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './slice';
import { router } from './router';

function App() {
  return <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
}

export function LanguageView() {
  const { data, error, isLoading } = useListLanguagesWithWordsQuery();

  return <div>
    <h1>Languages</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {data && data.map(lang => <li>
        {lang.Name}
        <ul>
          {lang.Words.map(word => <li>{word.Spelling}</li>)}
        </ul>
      </li>)}
    </ul>
  </div>
}

export function WordView() {
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

export function PhraseView() {
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

export default App;
