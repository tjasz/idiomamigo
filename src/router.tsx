
import React from 'react';
import { LanguageView, WordView, PhraseView } from './App';
import {
  createBrowserRouter,
} from "react-router-dom";
import Root from './routes/Root';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "language",
        element: <LanguageView />,
      },
      {
        path: "word",
        element: <WordView />,
      },
      {
        path: "phrase",
        element: <PhraseView />,
      },
    ],
  },
]);