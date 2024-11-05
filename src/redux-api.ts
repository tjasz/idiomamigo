import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Language, Phrase, PhraseMembership, PhraseTranslation, PhraseTranslationView, Tag, TagPhraseRelation, TagWordRelation, Word, WordTranslation, WordTranslationView } from './types';

enum TagType {
  Language = 'Language',
  Phrase = 'Phrase',
  PhraseMembership = 'PhraseMembership',
  PhraseTranslation = 'PhraseTranslation',
  PhraseTranslationView = 'PhraseTranslationView',
  Tag = 'Tag',
  TagPhraseRelation = 'TagPhraseRelation',
  TagWordRelation = 'TagWordRelation',
  Word = 'Word',
  WordTranslation = 'WordTranslation',
  WordTranslationView = 'WordTranslationView',
};
const tagTypes = [
  TagType.Language,
  TagType.Phrase,
  TagType.PhraseMembership,
  TagType.PhraseTranslation,
  TagType.PhraseTranslationView,
  TagType.Tag,
  TagType.TagPhraseRelation,
  TagType.TagWordRelation,
  TagType.Word,
  TagType.WordTranslation,
  TagType.WordTranslationView,
];

const listTagId = 'LIST';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/data-api' }),
  tagTypes,
  endpoints: (builder) => {
    function createOperation<T, IdFieldName extends keyof (T)>(tagType: TagType) {
      return builder.mutation<T, Omit<T, IdFieldName>>({
        query: (item) => ({
          url: `rest/${tagType}`,
          method: 'POST',
          body: item
        }),
        transformResponse: (response: { value: T[] }) => response.value[0],
        invalidatesTags: [{ type: tagType, id: listTagId }]
      });
    }
    function getOperation<T>(tagType: TagType, idFieldName: keyof (T)) {
      return builder.query<T, string>({
        query: (id) => `rest/${tagType}/${String(idFieldName)}/${id}`,
        transformResponse: (response: { value: T }) => response.value,
        providesTags: (item) => item ? [{ type: tagType, id: String(item[idFieldName]) }] : []
      });
    }
    function listOperation<T, InputType>(
      tagType: TagType,
      idFieldName: keyof (T),
      querySuffixBuilder?: (arg: InputType) => string,
    ) {
      return builder.query<T[], InputType>({
        query: (arg: InputType) => `rest/${tagType}${querySuffixBuilder === undefined ? '' : querySuffixBuilder(arg)}`,
        transformResponse: (response: { value: T[] }) => response.value,
        providesTags: (result) => result
          ? [
            ...result.map<{ type: TagType, id: string }>(item => ({ type: tagType, id: String(item[idFieldName]) })),
            { type: tagType, id: listTagId }
          ]
          : [{ type: tagType, id: listTagId }],
      });
    }
    function updateOperation<T>(tagType: TagType, idFieldName: keyof (T)) {
      return builder.mutation<T, T>({
        query: ({ [idFieldName]: Id, ...patch }) => ({
          url: `rest/${tagType}/${String(idFieldName)}/${Id}`,
          method: 'PUT',
          body: patch,
        }),
        invalidatesTags: (result, error, item) => [{ type: tagType, id: String(item[idFieldName]) }],
      });
    }
    function deleteOperation<T, IdType extends string | number>(tagType: TagType, idFieldName: keyof (T)) {
      return builder.mutation<T, IdType>({
        query: (id) => ({
          url: `rest/${tagType}/${String(idFieldName)}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: tagType, id }],
      });
    }

    return ({
      // Language CRUD operations
      createLanguage: createOperation<Language, 'Name'>(TagType.Language),
      getLanguage: getOperation<Language>(TagType.Language, 'Name'),
      listLanguages: listOperation<Language, void>(TagType.Language, 'Name'),
      updateLanguage: updateOperation<Language>(TagType.Language, 'Name'),
      deleteLanguage: deleteOperation<Language, string>(TagType.Language, 'Name'),
      // Phrase CRUD operations
      createPhrase: createOperation<Phrase, 'Id'>(TagType.Phrase),
      getPhrase: getOperation<Phrase>(TagType.Phrase, 'Id'),
      listPhrases: listOperation<Phrase, void>(TagType.Phrase, 'Id'),
      updatePhrase: updateOperation<Phrase>(TagType.Phrase, 'Id'),
      deletePhrase: deleteOperation<Phrase, number>(TagType.Phrase, 'Id'),
      // PhraseMembership CRUD operations
      createPhraseMembership: createOperation<PhraseMembership, 'Id'>(TagType.PhraseMembership),
      getPhraseMembership: getOperation<PhraseMembership>(TagType.PhraseMembership, 'Id'),
      listPhraseMemberships: listOperation<PhraseMembership, void>(TagType.PhraseMembership, 'Id'),
      updatePhraseMembership: updateOperation<PhraseMembership>(TagType.PhraseMembership, 'Id'),
      deletePhraseMembership: deleteOperation<PhraseMembership, number>(TagType.PhraseMembership, 'Id'),
      // PhraseTranslation CRUD operations
      createPhraseTranslation: createOperation<PhraseTranslation, 'Id'>(TagType.PhraseTranslation),
      getPhraseTranslation: getOperation<PhraseTranslation>(TagType.PhraseTranslation, 'Id'),
      listPhraseTranslations: listOperation<PhraseTranslation, void>(TagType.PhraseTranslation, 'Id'),
      updatePhraseTranslation: updateOperation<PhraseTranslation>(TagType.PhraseTranslation, 'Id'),
      deletePhraseTranslation: deleteOperation<PhraseTranslation, number>(TagType.PhraseTranslation, 'Id'),
      listTranslationsForPhrase: listOperation<PhraseTranslation, number>(
        TagType.PhraseTranslation,
        'Id',
        (id) => `?$filter=Source eq ${id} or Target eq ${id}`
      ),
      // PhraseTranslationView read operation
      getPhraseTranslationView: getOperation<PhraseTranslationView>(TagType.PhraseTranslationView, 'Id'),
      listPhraseTranslationViews: listOperation<PhraseTranslationView, void>(TagType.PhraseTranslationView, 'Id'),
      listTranslationViewsForPhrase: listOperation<PhraseTranslationView, number>(
        TagType.PhraseTranslationView,
        'Id',
        (id) => `?$filter=SourceId eq ${id} or TargetId eq ${id}`
      ),
      // Tag CRUD operations
      createTag: createOperation<Tag, 'Name'>(TagType.Tag),
      getTag: getOperation<Tag>(TagType.Tag, 'Name'),
      listTags: listOperation<Tag, void>(TagType.Tag, 'Name'),
      updateTag: updateOperation<Tag>(TagType.Tag, 'Name'),
      deleteTag: deleteOperation<Tag, string>(TagType.Tag, 'Name'),
      // TagPhraseRelation CRUD operations
      createTagPhraseRelation: createOperation<TagPhraseRelation, 'Id'>(TagType.TagPhraseRelation),
      getTagPhraseRelation: getOperation<TagPhraseRelation>(TagType.TagPhraseRelation, 'Id'),
      listTagPhraseRelations: listOperation<TagPhraseRelation, void>(TagType.TagPhraseRelation, 'Id'),
      updateTagPhraseRelation: updateOperation<TagPhraseRelation>(TagType.TagPhraseRelation, 'Id'),
      deleteTagPhraseRelation: deleteOperation<TagPhraseRelation, number>(TagType.TagPhraseRelation, 'Id'),
      // TagWordRelation CRUD operations
      createTagWordRelation: createOperation<TagWordRelation, 'Id'>(TagType.TagWordRelation),
      getTagWordRelation: getOperation<TagWordRelation>(TagType.TagWordRelation, 'Id'),
      listTagWordRelations: listOperation<TagWordRelation, void>(TagType.TagWordRelation, 'Id'),
      updateTagWordRelation: updateOperation<TagWordRelation>(TagType.TagWordRelation, 'Id'),
      deleteTagWordRelation: deleteOperation<TagWordRelation, number>(TagType.TagWordRelation, 'Id'),
      // Word CRUD operations
      createWord: createOperation<Word, 'Id'>(TagType.Word),
      getWord: getOperation<Word>(TagType.Word, 'Id'),
      listWords: listOperation<Word, void>(TagType.Word, 'Id', () => '?$orderby=Language,Spelling,Creation'),
      updateWord: updateOperation<Word>(TagType.Word, 'Id'),
      deleteWord: deleteOperation<Word, number>(TagType.Word, 'Id'),
      listWordsWithFilter: listOperation<Word, string>(TagType.Word, 'Id', (filter) => `?$filter=${filter}`),
      // WordTranslation CRUD operations
      createWordTranslation: createOperation<WordTranslation, 'Id'>(TagType.WordTranslation),
      getWordTranslation: getOperation<WordTranslation>(TagType.WordTranslation, 'Id'),
      listWordTranslations: listOperation<WordTranslation, void>(TagType.WordTranslation, 'Id'),
      updateWordTranslation: updateOperation<WordTranslation>(TagType.WordTranslation, 'Id'),
      deleteWordTranslation: deleteOperation<WordTranslation, number>(TagType.WordTranslation, 'Id'),
      listTranslationsForWord: listOperation<WordTranslation, number>(
        TagType.WordTranslation,
        'Id',
        (id) => `?$filter=Source eq ${id} or Target eq ${id}`
      ),
      // WordTranslationView read operation
      // TODO because it's a view, it provides different tags than these reusable function say it does
      // E.g. it provides WordTranslation LIST
      getWordTranslationView: getOperation<WordTranslationView>(TagType.WordTranslationView, 'Id'),
      listWordTranslationViews: listOperation<WordTranslationView, void>(TagType.WordTranslationView, 'Id'),
      listTranslationViewsForWord: listOperation<WordTranslationView, number>(
        TagType.WordTranslationView,
        'Id',
        (id) => `?$filter=SourceId eq ${id} or TargetId eq ${id}`
      ),
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
  useCreateWordTranslationMutation,
  useGetWordTranslationViewQuery,
  useListWordTranslationViewsQuery,
  useListTranslationViewsForWordQuery,
  useGetPhraseTranslationViewQuery,
  useListPhraseTranslationViewsQuery,
  useListTranslationViewsForPhraseQuery,
} = api;