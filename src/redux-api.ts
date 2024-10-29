import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Language, Phrase, PhraseMembership, PhraseTranslation, Tag, TagPhraseRelation, TagWordRelation, Word, WordTranslation } from './types';

enum TagType {
  Language = 'Language',
  Phrase = 'Phrase',
  PhraseMembership = 'PhraseMembership',
  PhraseTranslation = 'PhraseTranslation',
  Tag = 'Tag',
  TagPhraseRelation = 'TagPhraseRelation',
  TagWordRelation = 'TagWordRelation',
  Word = 'Word',
  WordTranslation = 'WordTranslation',
};
const tagTypes = [
  TagType.Language,
  TagType.Phrase,
  TagType.PhraseMembership,
  TagType.PhraseTranslation,
  TagType.Tag,
  TagType.TagPhraseRelation,
  TagType.TagWordRelation,
  TagType.Word,
  TagType.WordTranslation,
];

const listTagId = 'LIST';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api' }),
  tagTypes,
  endpoints: (builder) => {
    return ({
      // Language CRUD operations
      getLanguage: builder.query<Language, string>({
        query: (name) => `rest/Language/Name/${name}`,
        transformResponse: (response: { value: Language }) => response.value,
        providesTags: (lang) => lang ? [{ type: TagType.Language, id: lang.Name }] : []
      }),
      listLanguages: builder.query<Language[], void>({
        query: () => `rest/Language`,
        transformResponse: (response: { value: Language[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.Language, id: string }>(lang => ({ type: TagType.Language, id: lang.Name })),
            { type: TagType.Language, id: listTagId }
          ]
          : [{ type: TagType.Language, id: listTagId }],
      }),
      // Phrase CRUD operations
      createPhrase: builder.mutation<Phrase, Omit<Phrase, 'Id'>>({
        query: (phrase) => ({
          url: `rest/Phrase`,
          method: 'POST',
          body: phrase,
        }),
        transformResponse: (response: { value: Phrase[] }) => response.value[0],
        invalidatesTags: [{ type: TagType.Phrase, id: listTagId }],
      }),
      getPhrase: builder.query<Phrase, number>({
        query: (id) => `rest/Phrase/Id/${id}`,
        transformResponse: (response: { value: Phrase }) => response.value,
        providesTags: phrase => phrase ? [{ type: TagType.Phrase, id: phrase.Id }] : []
      }),
      listPhrases: builder.query<Phrase[], void>({
        query: () => `rest/Phrase`,
        transformResponse: (response: { value: Phrase[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.Phrase, id: number }>(phrase => ({ type: TagType.Phrase, id: phrase.Id })),
            { type: TagType.Phrase, id: listTagId }
          ]
          : [{ type: TagType.Phrase, id: listTagId }],
      }),
      updatePhrase: builder.mutation<Phrase, Phrase>({
        query: ({ Id, ...patch }) => ({
          url: `rest/Phrase/Id/${Id}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, phrase) => [{ type: TagType.Phrase, id: phrase.Id }],
      }),
      deletePhrase: builder.mutation<Phrase, number>({
        query: (id) => ({
          url: `rest/Phrase/Id/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: TagType.Phrase, id }],
      }),
      // PhraseMembership CRUD operations
      createPhraseMembership: builder.mutation<PhraseMembership, Omit<PhraseMembership, 'Id'>>({
        query: (membership) => ({
          url: `rest/PhraseMembership`,
          method: 'POST',
          body: membership,
        }),
        invalidatesTags: [{ type: TagType.PhraseMembership, id: listTagId }],
      }),
      // PhraseTranslation CRUD operations
      listTranslationsForPhrase: builder.query<PhraseTranslation[], number>({
        query: (id) => `rest/PhraseTranslation?$filter=Source eq ${id} or Target eq ${id}`,
        transformResponse: (response: { value: PhraseTranslation[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.PhraseTranslation, id: number }>(phraseTranslation => ({ type: TagType.PhraseTranslation, id: phraseTranslation.Id })),
            { type: TagType.PhraseTranslation, id: listTagId }
          ]
          : [{ type: TagType.PhraseTranslation, id: listTagId }],
      }),
      // Tag CRUD operations
      listTags: builder.query<Tag[], void>({
        query: () => `rest/Tag`,
        transformResponse: (response: { value: Tag[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.Tag, id: string }>(tag => ({ type: TagType.Tag, id: tag.Name })),
            { type: TagType.Tag, id: listTagId }
          ]
          : [{ type: TagType.Tag, id: listTagId }],
      }),
      // TagPhraseRelation CRUD operations
      createTagPhraseRelation: builder.mutation<TagPhraseRelation, Omit<TagPhraseRelation, 'Id'>>({
        query: (membership) => ({
          url: `rest/TagPhraseRelation`,
          method: 'POST',
          body: membership,
        }),
        invalidatesTags: [{ type: TagType.TagPhraseRelation, id: listTagId }],
      }),
      deleteTagPhraseRelation: builder.mutation<TagPhraseRelation, number>({
        query: (id) => ({
          url: `rest/TagPhraseRelation/Id/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: TagType.TagPhraseRelation, id }],
      }),
      // TagWordRelation CRUD operations
      createTagWordRelation: builder.mutation<TagWordRelation, Omit<TagWordRelation, 'Id'>>({
        query: (membership) => ({
          url: `rest/TagWordRelation`,
          method: 'POST',
          body: membership,
        }),
        invalidatesTags: [{ type: TagType.TagWordRelation, id: listTagId }],
      }),
      // Word CRUD operations
      createWord: builder.mutation<Word, Omit<Word, 'Id'>>({
        query: (word) => ({
          url: `rest/Word`,
          method: 'POST',
          body: word,
        }),
        transformResponse: (response: { value: Word[] }) => response.value[0],
        invalidatesTags: [{ type: TagType.Word, id: listTagId }],
      }),
      getWord: builder.query<Word, number>({
        query: (id) => `rest/Word/Id/${id}`,
        transformResponse: (response: { value: Word }) => response.value,
        providesTags: word => word ? [{ type: TagType.Word, id: word.Id }] : []
      }),
      listWords: builder.query<Word[], void>({
        query: () => `rest/Word?$orderby=Language,Spelling,Creation`,
        transformResponse: (response: { value: Word[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.Word, id: number }>(word => ({ type: TagType.Word, id: word.Id })),
            { type: TagType.Word, id: listTagId }
          ]
          : [{ type: TagType.Word, id: listTagId }],
      }),
      listWordsWithFilter: builder.query<Word[], string>({
        query: (filter) => `rest/Word?$filter=${filter}`,
        transformResponse: (response: { value: Word[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.Word, id: number }>(word => ({ type: TagType.Word, id: word.Id })),
            { type: TagType.Word, id: listTagId }
          ]
          : [{ type: TagType.Word, id: listTagId }],
      }),
      updateWord: builder.mutation<Word, Word>({
        query: ({ Id, ...patch }) => ({
          url: `rest/Word/Id/${Id}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, word) => [{ type: TagType.Word, id: word.Id }],
      }),
      deleteWord: builder.mutation<Word, number>({
        query: (id) => ({
          url: `rest/Word/Id/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: TagType.Word, id }],
      }),
      // WordTranslation CRUD operations
      createTag: builder.mutation<Tag, Tag>({
        query: (tag) => ({
          url: `rest/Tag`,
          method: 'POST',
          body: tag,
        }),
        invalidatesTags: [{ type: TagType.Tag, id: listTagId }],
      }),
      listTranslationsForWord: builder.query<WordTranslation[], number>({
        query: (id) => `rest/WordTranslation?$filter=Source eq ${id} or Target eq ${id}`,
        transformResponse: (response: { value: WordTranslation[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType.WordTranslation, id: number }>(wordTranslation => ({ type: TagType.WordTranslation, id: wordTranslation.Id })),
            { type: TagType.WordTranslation, id: listTagId }
          ]
          : [{ type: TagType.WordTranslation, id: listTagId }],
      }),
      //
      // More complex graphql queries that follow relations
      //
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
        providesTags: (lang) => lang
          ? [
            { type: TagType.Language, id: lang.Name },
            { type: TagType.Word, id: listTagId },
            ...lang.Words.map(word => ({ type: TagType.Word, id: word.Id })),
            { type: TagType.Phrase, id: listTagId },
            ...lang.Phrases.map(phrase => ({ type: TagType.Phrase, id: phrase.Id })),
          ]
          : []
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
        providesTags: word => word
          ? [
            { type: TagType.Word, id: word.Id },
            { type: TagType.Phrase, id: listTagId },
            ...word.Phrases.map(phrase => ({ type: TagType.Phrase, id: phrase.Id })),
            { type: TagType.Tag, id: listTagId },
            ...word.Tags.map(tag => ({ type: TagType.Phrase, id: tag.Name })),
            { type: TagType.PhraseMembership, id: listTagId },
            { type: TagType.TagWordRelation, id: listTagId },
          ]
          : []
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
        providesTags: phrase => phrase
          ? [
            { type: TagType.Phrase, id: phrase.Id },
            { type: TagType.Word, id: listTagId },
            ...phrase.Words.map(word => ({ type: TagType.Phrase, id: word.Id })),
            { type: TagType.Tag, id: listTagId },
            ...phrase.Tags.map(tag => ({ type: TagType.Phrase, id: tag.Name })),
            { type: TagType.PhraseMembership, id: listTagId },
            { type: TagType.TagPhraseRelation, id: listTagId },
          ]
          : []
      }),
      getTagWithWordsAndPhrases: builder.query<Tag & { Words: Word[], Phrases: Phrase[] }, string>({
        query: (name) => ({
          url: 'graphql',
          method: 'POST',
          body: { query: `{tags(filter:{Name:{eq:"${name}"}}){items{Name tag_words{items{Id Spelling}} tag_phrases{items{Id Spelling}}}}}` },
        }),
        transformResponse:
          (response: { data: { tags: { items: (Tag & { tag_words: { items: Word[] }, tag_phrases: { items: Phrase[] } })[] } } }, meta, arg) => ({
            Name: response.data.tags.items[0].Name,
            Words: response.data.tags.items[0].tag_words.items,
            Phrases: response.data.tags.items[0].tag_phrases.items,
          }),
        providesTags: (tag) => tag
          ? [
            { type: TagType.Tag, id: tag.Name },
            { type: TagType.Word, id: listTagId },
            ...tag.Words.map(word => ({ type: TagType.Phrase, id: word.Id })),
            { type: TagType.Phrase, id: listTagId },
            ...tag.Phrases.map(phrase => ({ type: TagType.Phrase, id: phrase.Id })),
            { type: TagType.TagWordRelation, id: listTagId },
            { type: TagType.TagPhraseRelation, id: listTagId },
          ]
          : []
      }),
    });
  },
});

export const {
  useListLanguagesQuery,
  useGetLanguageQuery,
  useGetLanguageWithWordsAndPhrasesQuery,
  useListWordsQuery,
  useListWordsWithFilterQuery,
  useGetWordQuery,
  useGetWordWithPhrasesAndTagsQuery,
  useListTranslationsForWordQuery,
  useCreateWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
  useListPhrasesQuery,
  useGetPhraseQuery,
  useGetPhraseWithWordsAndTagsQuery,
  useListTranslationsForPhraseQuery,
  useCreatePhraseMutation,
  useUpdatePhraseMutation,
  useDeletePhraseMutation,
  useCreatePhraseMembershipMutation,
  useListTagsQuery,
  useGetTagWithWordsAndPhrasesQuery,
  useCreateTagMutation,
  useCreateTagPhraseRelationMutation,
  useDeleteTagPhraseRelationMutation,
  useCreateTagWordRelationMutation,
} = api;