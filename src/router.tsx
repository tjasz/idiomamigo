
import React from 'react';
import {
  createBrowserRouter,
} from "react-router-dom";
import Root from './routes/Root';
import { LanguagesView } from './routes/LanguagesView';
import { WordsView } from './routes/WordsView';
import { PhrasesView } from './routes/PhrasesView';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "languages",
        element: <LanguagesView />,
      },
      {
        path: "words",
        element: <WordsView />,
      },
      {
        path: "phrases",
        element: <PhrasesView />,
      },
    ],
  },
]);