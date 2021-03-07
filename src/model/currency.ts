import {Schema, Document} from 'mongoose';

export interface Currency extends Document {
  code: string;
  name: string;
  translations?: CurrencyTranslation[];
};

type CurrencyTranslation = {
  locale: string;
  name: string;
};

const CurrencyTranslationSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

export const CurrencySchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  translations: [{ type: CurrencyTranslationSchema, required: true }]
});