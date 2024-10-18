import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Response<T> = {
  value: T;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api/rest' }),
  tagTypes: ['Language', 'Word'],
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
    getWord: builder.query<Response<Word[]>, number>({
      query: (id) => `Word/Id/${id}`,
    }),
    createWord: builder.mutation<Word, Omit<Word, 'Id'>>({
      query: (word) => ({
        url: `Word`,
        method: 'POST',
        body: word,
      }),
      invalidatesTags: [{ type: 'Word', id: 'LIST' }]
    }),
  }),
});

export const {
  useListLanguagesQuery,
  useGetLanguageQuery,
  useListWordsQuery,
  useGetWordQuery,
  useCreateWordMutation,
} = api;