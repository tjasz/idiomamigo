import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Language, Phrase, Word } from './types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api' }),
  tagTypes: ['Language', 'Word', 'Phrase'],
  endpoints: (builder) => ({
    listLanguages: builder.query<Language[], void>({
      query: () => `rest/Language`,
      transformResponse: (response: { value: Language[] }) => response.value,
      providesTags: (result) => result
        ? [
          ...result.map<{ type: 'Language', id: string }>(lang => ({ type: 'Language', id: lang.Name })),
          { type: 'Language', id: 'LIST' }
        ]
        : [{ type: 'Language', id: 'LIST' }],
    }),
    listLanguagesWithWords: builder.query<{ Name: string, Words: Word[] }[], void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: { query: `{ languages { items {Name language_words { items { Spelling }} } } }` },
      }),
      transformResponse:
        (response: { data: { languages: { items: (Language & { language_words: { items: Word[] } })[] } } }, meta, arg) => response.data.languages.items.map(
          l => ({ Name: l.Name, Words: l.language_words.items })
        ),
      providesTags: (result) => result
        ? [
          ...result.map<{ type: 'Language', id: string }>(lang => ({ type: 'Language', id: lang.Name })),
          { type: 'Language', id: 'LIST' }
        ]
        : [{ type: 'Language', id: 'LIST' }],
    }),
    getLanguage: builder.query<Language, string>({
      query: (name) => `rest/Language/Name/${name}`,
      transformResponse: (response: { value: Language }) => response.value,
      providesTags: (lang) => lang ? [{ type: 'Language', id: lang.Name }] : []
    }),
    getLanguageWithWords: builder.query<Language & { Words: Word[] }, string>({
      query: (name) => ({
        url: 'graphql',
        method: 'POST',
        body: { query: `{ languages(filter: {Name: {eq: "${name}"}}) { items {Name language_words { items { Spelling }} } } }` },
      }),
      transformResponse:
        (response: { data: { languages: { items: (Language & { language_words: { items: Word[] } })[] } } }, meta, arg) => ({
          Name: response.data.languages.items[0].Name,
          Words: response.data.languages.items[0].language_words.items
        }),
      providesTags: (lang) => lang ? [{ type: 'Language', id: lang.Name }] : []
    }),
    listWords: builder.query<Word[], void>({
      query: () => `rest/Word`,
      transformResponse: (response: { value: Word[] }) => response.value,
      providesTags: (result) => result
        ? [
          ...result.map<{ type: 'Word', id: number }>(word => ({ type: 'Word', id: word.Id })),
          { type: 'Word', id: 'LIST' }
        ]
        : [{ type: 'Word', id: 'LIST' }],
    }),
    getWord: builder.query<Word, number>({
      query: (id) => `rest/Word/Id/${id}`,
      transformResponse: (response: { value: Word }) => response.value,
      providesTags: word => word ? [{ type: 'Word', id: word.Id }] : []
    }),
    createWord: builder.mutation<Word, Omit<Word, 'Id'>>({
      query: (word) => ({
        url: `rest/Word`,
        method: 'POST',
        body: word,
      }),
      invalidatesTags: [{ type: 'Word', id: 'LIST' }],
    }),
    updateWord: builder.mutation<Word, Word>({
      query: ({ Id, ...patch }) => ({
        url: `rest/Word/Id/${Id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, word) => [{ type: 'Word', id: word.Id }],
    }),
    deleteWord: builder.mutation<Word, number>({
      query: (id) => ({
        url: `rest/Word/Id/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Word', id }],
    }),
    listPhrases: builder.query<Phrase[], void>({
      query: () => `rest/Phrase`,
      transformResponse: (response: { value: Phrase[] }) => response.value,
      providesTags: (result) => result
        ? [
          ...result.map<{ type: 'Phrase', id: number }>(phrase => ({ type: 'Phrase', id: phrase.Id })),
          { type: 'Phrase', id: 'LIST' }
        ]
        : [{ type: 'Phrase', id: 'LIST' }],
    }),
    getPhrase: builder.query<Phrase, number>({
      query: (id) => `rest/Phrase/Id/${id}`,
      transformResponse: (response: { value: Phrase }) => response.value,
      providesTags: phrase => phrase ? [{ type: 'Phrase', id: phrase.Id }] : []
    }),
    createPhrase: builder.mutation<Phrase, Omit<Phrase, 'Id'>>({
      query: (phrase) => ({
        url: `rest/Phrase`,
        method: 'POST',
        body: phrase,
      }),
      invalidatesTags: [{ type: 'Phrase', id: 'LIST' }],
    }),
    updatePhrase: builder.mutation<Phrase, Phrase>({
      query: ({ Id, ...patch }) => ({
        url: `rest/Phrase/Id/${Id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, phrase) => [{ type: 'Phrase', id: phrase.Id }],
    }),
    deletePhrase: builder.mutation<Phrase, number>({
      query: (id) => ({
        url: `rest/Phrase/Id/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Phrase', id }],
    }),
  }),
});

export const {
  useListLanguagesQuery,
  useListLanguagesWithWordsQuery,
  useGetLanguageQuery,
  useGetLanguageWithWordsQuery,
  useListWordsQuery,
  useGetWordQuery,
  useCreateWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
  useListPhrasesQuery,
  useGetPhraseQuery,
  useCreatePhraseMutation,
  useUpdatePhraseMutation,
  useDeletePhraseMutation,
} = api;