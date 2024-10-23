import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Language, Phrase, PhraseMembership, PhraseTranslation, Tag, Word, WordTranslation } from './types';

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
    getLanguageWithWordsAndPhrases: builder.query<Language & { Words: Word[], Phrases: Phrase[] }, string>({
      query: (name) => ({
        url: 'graphql',
        method: 'POST',
        body: { query: `{languages(filter:{Name:{eq:"${name}"}}){items{Name language_words{items{Id Spelling}} language_phrases{items{Id Spelling}}}}}` },
      }),
      transformResponse:
        (response: { data: { languages: { items: (Language & { language_words: { items: Word[] }, language_phrases: { items: Phrase[] } })[] } } }, meta, arg) => ({
          Name: response.data.languages.items[0].Name,
          Words: response.data.languages.items[0].language_words.items,
          Phrases: response.data.languages.items[0].language_phrases.items,
        }),
      providesTags: (lang) => lang ? [{ type: 'Language', id: lang.Name }] : []
    }),
    listWords: builder.query<Word[], void>({
      query: () => `rest/Word?$orderby=Language,Spelling,Creation`,
      transformResponse: (response: { value: Word[] }) => response.value,
      providesTags: (result) => result
        ? [
          ...result.map<{ type: 'Word', id: number }>(word => ({ type: 'Word', id: word.Id })),
          { type: 'Word', id: 'LIST' }
        ]
        : [{ type: 'Word', id: 'LIST' }],
    }),
    listWordsWithFilter: builder.query<Word[], string>({
      query: (filter) => `rest/Word?$filter=${filter}`,
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
    getWordWithPhrasesAndTags: builder.query<Word & { Phrases: Phrase[], Tags: Tag[] }, number>({
      query: (id) => ({
        url: 'graphql',
        method: 'POST',
        body: { query: `{words(filter:{Id:{eq:${id}}}) {items{Id Language Spelling Creation word_phrases{items{Id Spelling}} word_tags{items{Name}}}}}` },
      }),
      transformResponse:
        (response: { data: { words: { items: (Word & { word_phrases: { items: Phrase[] }, word_tags: { items: Tag[] } })[] } } }, meta, arg) => ({
          Id: response.data.words.items[0].Id,
          Language: response.data.words.items[0].Language,
          Spelling: response.data.words.items[0].Spelling,
          Creation: response.data.words.items[0].Creation,
          Phrases: response.data.words.items[0].word_phrases.items,
          Tags: response.data.words.items[0].word_tags.items,
        }),
      providesTags: word => word ? [{ type: 'Word', id: word.Id }] : []
    }),
    getTranslationsForWord: builder.query<WordTranslation[], number>({
      query: (id) => `rest/WordTranslation?$filter=Source eq ${id} or Target eq ${id}`,
      transformResponse: (response: { value: WordTranslation[] }) => response.value,
      providesTags: [] // TODO
    }),
    createWord: builder.mutation<Word, Omit<Word, 'Id'>>({
      query: (word) => ({
        url: `rest/Word`,
        method: 'POST',
        body: word,
      }),
      transformResponse: (response: { value: Word[] }) => response.value[0],
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
    getPhraseWithWordsAndTags: builder.query<Phrase & { Words: Word[], Tags: Tag[] }, number>({
      query: (id) => ({
        url: 'graphql',
        method: 'POST',
        body: { query: `{phrases(filter:{Id:{eq:${id}}}) {items{Id Language Spelling Creation phrase_words{items{Id Spelling}} phrase_tags{items{Name}}}}}` },
      }),
      transformResponse:
        (response: { data: { phrases: { items: (Phrase & { phrase_words: { items: Phrase[] }, phrase_tags: { items: Tag[] } })[] } } }, meta, arg) => ({
          Id: response.data.phrases.items[0].Id,
          Language: response.data.phrases.items[0].Language,
          Spelling: response.data.phrases.items[0].Spelling,
          Creation: response.data.phrases.items[0].Creation,
          Words: response.data.phrases.items[0].phrase_words.items,
          Tags: response.data.phrases.items[0].phrase_tags.items,
        }),
      providesTags: phrase => phrase ? [{ type: 'Phrase', id: phrase.Id }] : []
    }),
    getTranslationsForPhrase: builder.query<PhraseTranslation[], number>({
      query: (id) => `rest/PhraseTranslation?$filter=Source eq ${id} or Target eq ${id}`,
      transformResponse: (response: { value: PhraseTranslation[] }) => response.value,
      providesTags: [] // TODO
    }),
    createPhrase: builder.mutation<Phrase, Omit<Phrase, 'Id'>>({
      query: (phrase) => ({
        url: `rest/Phrase`,
        method: 'POST',
        body: phrase,
      }),
      transformResponse: (response: { value: Phrase[] }) => response.value[0],
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
    createPhraseMembership: builder.mutation<PhraseMembership, Omit<PhraseMembership, 'Id'>>({
      query: (membership) => ({
        url: `rest/PhraseMembership`,
        method: 'POST',
        body: membership,
      }),
      invalidatesTags: [], // TODO
    }),
  }),
});

export const {
  useListLanguagesQuery,
  useListLanguagesWithWordsQuery,
  useGetLanguageQuery,
  useGetLanguageWithWordsAndPhrasesQuery,
  useListWordsQuery,
  useListWordsWithFilterQuery,
  useGetWordQuery,
  useGetWordWithPhrasesAndTagsQuery,
  useGetTranslationsForWordQuery,
  useCreateWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
  useListPhrasesQuery,
  useGetPhraseQuery,
  useGetPhraseWithWordsAndTagsQuery,
  useGetTranslationsForPhraseQuery,
  useCreatePhraseMutation,
  useUpdatePhraseMutation,
  useDeletePhraseMutation,
  useCreatePhraseMembershipMutation,
} = api;