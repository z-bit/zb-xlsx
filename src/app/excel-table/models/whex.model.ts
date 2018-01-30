export interface WhexModel {
  kom: string;
  satzart: string;
  text: string;
  eknr: string;
  ekdatum: Date;
  budatum: Date;
  ekwert: number;
  ausstattung: string;
  ekbkz: string;
  lieferant: string;
  ka: string;
  kont: string;
  stcd: string;
  stpr: number;
  care: string;
  bem1: string;
  bem2: string;
}

export const whexInit: WhexModel = {
  kom: null,
  satzart: null,
  text: null,
  eknr: null,
  ekdatum: null,
  budatum: null,
  ekwert: null,
  ausstattung: null,
  ekbkz: null,
  lieferant: null,
  ka: null,
  kont: null,
  stcd: null,
  stpr: null,
  care: null,
  bem1: null,
  bem2: null,
};

