import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Language, Phrase, Word } from './types';

interface Response<T> {
  value: T;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api/rest' }),
  tagTypes: ['Language', 'Word', 'Phrase'],
  endpoints: (builder) => ({
    listLanguages: builder.query<Response<Language[]>, void>({
      query: () => `Language`,
      providesTags: (result) => result
        ? [
          ...result.value.map<{ type: 'Language', id: string }>(lang => ({ type: 'Language', id: lang.Name })),
          { type: 'Language', id: 'LIST' }
        ]
        : [{ type: 'Language', id: 'LIST' }],
    }),
    getLanguage: builder.query<Response<Language>, string>({
      query: (name) => `Language/Name/${name}`,
      providesTags: (lang) => lang ? [{ type: 'Language', id: lang.value.Name }] : []
    }),
    listWords: builder.query<Response<Word[]>, void>({
      query: () => `Word`,
      providesTags: (result) => result
        ? [
          ...result.value.map<{ type: 'Word', id: number }>(word => ({ type: 'Word', id: word.Id })),
          { type: 'Word', id: 'LIST' }
        ]
        : [{ type: 'Word', id: 'LIST' }],
    }),
    getWord: builder.query<Response<Word>, number>({
      query: (id) => `Word/Id/${id}`,
      providesTags: word => word ? [{ type: 'Word', id: word.value.Id }] : []
    }),
    createWord: builder.mutation<Word, Omit<Word, 'Id'>>({
      query: (word) => ({
        url: `Word`,
        method: 'POST',
        body: word,
      }),
      invalidatesTags: [{ type: 'Word', id: 'LIST' }],
    }),
    updateWord: builder.mutation<Word, Word>({
      query: ({ Id, ...patch }) => ({
        url: `Word/Id/${Id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, word) => [{ type: 'Word', id: word.Id }],
    }),
    deleteWord: builder.mutation<Word, number>({
      query: (id) => ({
        url: `Word/Id/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Word', id }],
    }),
    listPhrases: builder.query<Response<Phrase[]>, void>({
      query: () => `Phrase`,
      providesTags: (result) => result
        ? [
          ...result.value.map<{ type: 'Phrase', id: number }>(phrase => ({ type: 'Phrase', id: phrase.Id })),
          { type: 'Phrase', id: 'LIST' }
        ]
        : [{ type: 'Phrase', id: 'LIST' }],
    }),
    getPhrase: builder.query<Response<Phrase>, number>({
      query: (id) => `Phrase/Id/${id}`,
      providesTags: phrase => phrase ? [{ type: 'Phrase', id: phrase.value.Id }] : []
    }),
    createPhrase: builder.mutation<Phrase, Omit<Phrase, 'Id'>>({
      query: (phrase) => ({
        url: `Phrase`,
        method: 'POST',
        body: phrase,
      }),
      invalidatesTags: [{ type: 'Phrase', id: 'LIST' }],
    }),
    updatePhrase: builder.mutation<Phrase, Phrase>({
      query: ({ Id, ...patch }) => ({
        url: `Phrase/Id/${Id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, phrase) => [{ type: 'Phrase', id: phrase.Id }],
    }),
    deletePhrase: builder.mutation<Phrase, number>({
      query: (id) => ({
        url: `Phrase/Id/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Phrase', id }],
    }),
  }),
});

export const {
  useListLanguagesQuery,
  useGetLanguageQuery,
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