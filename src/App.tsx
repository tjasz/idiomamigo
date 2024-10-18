import React from 'react';

function App() {
  const list = async () => {
    const endpoint = '/data-api/rest/Person';
    const response = await fetch(endpoint);
    const data = await response.json();
    console.table(data.value);
  };

  const get = async () => {
    const id = 1;
    const endpoint = `/data-api/rest/Person/Id`;
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

  return <div>
    <h1>Static Web Apps Database Connections</h1>
    <blockquote>
      Open the console in the browser developer tools to see the API responses.
    </blockquote>
    <div>
      <button id="list" onClick={list}>List</button>
      <button id="get" onClick={get}>Get</button>
      <button id="update" onClick={update}>Update</button>
      <button id="create" onClick={create}>Create</button>
      <button id="delete" onClick={del}>Delete</button>
    </div>
  </div>;
}

export default App;
