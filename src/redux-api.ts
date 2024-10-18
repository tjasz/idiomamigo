import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api/rest' }),
  endpoints: (builder) => ({
    listLanguages: builder.query<Language[], void>({
      query: () => `Language`,
    }),
  }),
});

export const { useListLanguagesQuery } = api;