import React from 'react';
import { useCreateWordMutation, useDeleteWordMutation, useListLanguagesQuery, useListWordsQuery, useUpdateWordMutation } from './redux-api';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

function App() {
  const drawerWidth = 150;
  return <div>
    <Drawer open={true} variant="persistent">
      <Box sx={{ width: drawerWidth }} role="presentation">
        <List>
          {['Language', 'Word'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText>
                  <Link to={text}>{text}</Link>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    <div style={{ marginLeft: drawerWidth }}>
      <Outlet />
    </div>
  </div>
}

export function LanguageView() {
  const { data, error, isLoading } = useListLanguagesQuery();
  const languages = data?.value;

  return <div>
    <h1>Languages</h1>
    {isLoading && "..."}
    {error && <span style={{ color: "red" }}>{JSON.stringify(error)}</span>}
    <ul>
      {languages && languages.map(lang => <li>{lang.Name}</li>)}
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

export default App;
