export interface Language {
  Name: string;
}

export interface Phrase {
  Id: number;
  Language: string;
  Spelling: string;
  Creation: Date;
}

export interface PhraseMembership {
  Id: number;
  Word: number;
  Phrase: number;
  Creation: Date;
}

export interface PhraseMembershipTranslation {
  Id: number;
  PhraseMembership: number;
  Word: number;
  Creation: Date;
}

export interface PhraseTranslation {
  Id: number;
  Source: number;
  Target: number;
  Creation: Date;
}

export interface Tag {
  Name: string;
}

export interface TagPhraseRelation {
  Id: number;
  Tag: string;
  Phrase: number;
  Creation: Date;
}

export interface TagWordRelation {
  Id: number;
  Tag: string;
  Word: number;
  Creation: Date;
}

export interface Word {
  Id: number;
  Language: string;
  Spelling: string;
  Creation: Date;
}

export interface WordTranslation {
  Id: number;
  Source: number;
  Target: number;
  Creation: Date;
}