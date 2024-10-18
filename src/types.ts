export interface Language {
  Name: string;
}

export interface Word {
  Id: number;
  Language: string;
  Spelling: string;
  Creation: Date;
}

export interface Phrase {
  Id: number;
  Language: string;
  Spelling: string;
  Creation: Date;
}