import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { LanguageView, WordView } from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './slice';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    ],
  },
]);

ReactDOM.render(<React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
</React.StrictMode>, document.getElementById('root'));
