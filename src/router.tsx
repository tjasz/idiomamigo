
import React from 'react';
import {
  createBrowserRouter,
} from "react-router-dom";
import Root from './routes/Root';
import { LanguagesView } from './routes/LanguagesView';
import { WordsView } from './routes/WordsView';
import { PhrasesView } from './routes/PhrasesView';
import { LanguageView } from './routes/LanguageView';
import { WordView } from './routes/WordView';
import { PhraseView } from './routes/PhraseView';
import NewPhraseWizard from './routes/wizards/NewPhraseWizard';

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
        path: "languages/:Name",
        element: <LanguageView />,
      },
      {
        path: "words",
        element: <WordsView />,
      },
      {
        path: "words/:Id",
        element: <WordView />,
      },
      {
        path: "phrases",
        element: <PhrasesView />,
      },
      {
        path: "phrases/:Id",
        element: <PhraseView />,
      },
      {
        path: "wizards/newPhrase",
        element: <NewPhraseWizard />,
      },
      {
        path: "tags",
        element: <span style={{ color: "red" }}>Not implemented!</span>,
      },
      {
        path: "tags/:Id",
        element: <span style={{ color: "red" }}>Not implemented!</span>,
      },
    ],
  },
]);