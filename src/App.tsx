import React, { useEffect, useMemo, useState } from 'react';
import { useListLanguagesQuery } from './redux-api';
import { Provider } from 'react-redux';
import { store } from './slice';

function App() {
  const list = async (table: string) => {
    const endpoint = `/data-api/rest/${table}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    console.table(data.value);
  };

  const get = async (table: string) => {
    const id = 1;
    const endpoint = `/data-api/rest/${table}/Id`;
    const response = await fetch(`${endpoint}/${id}`);
    const result = await response.json();
    console.table(result.value);
  };

  const update = async () => {
    const id = 1;
    const data = {
      Name: "Molly"
    };

    const endpoint = '/data-api/rest/Person/Id';
    const response = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.table(result.value);
  };

  const create = async () => {
    const data = {
      Name: "Pedro"
    };

    const endpoint = `/data-api/rest/Person/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.table(result.value);
  };

  const del = async () => {
    const id = 3;
    const endpoint = '/data-api/rest/Person/Id';
    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      console.log(`Record deleted: ${id}`)
    } else {
      console.log(response);
    }
  };

  return <Provider store={store}>
    <div>
      <LanguageView />
      <h1>Static Web Apps Database Connections</h1>
      <blockquote>
        Open the console in the browser developer tools to see the API responses.
      </blockquote>
      <div>
        <button id="list" onClick={() => list("Person")}>List</button>
        <button id="get" onClick={() => list("Person")}>Get</button>
        <button id="update" onClick={update}>Update</button>
        <button id="create" onClick={create}>Create</button>
        <button id="delete" onClick={del}>Delete</button>
      </div>
      <div>
        <button id="list" onClick={() => list("Language")}>List</button>
      </div>
    </div>
  </Provider>;
}

function LanguageView() {
  const { data: languages, error, isLoading } = useListLanguagesQuery();

  // languages.map(lang => <li>{lang.Name}</li>)

  return <div>
    <h1>Languages</h1>
    <ul>
      {JSON.stringify(languages)}
    </ul>
  </div>
}

export default App;
