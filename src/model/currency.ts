import {Schema, Document} from 'mongoose';

export interface Currency extends Document {
  code: string;
  name: string;
  translations?: CurrencyTranslation;
};

type CurrencyTranslation = {
  en: TranslationFields;
  ru: TranslationFields;
  uk: TranslationFields;
};

type TranslationFields = {
  name: string;
};

const TranslationFieldsSchema: Schema = new Schema({
  name: { type: String, required: true }
});

const CurrencyTranslationSchema: Schema = new Schema({
  en: { type: TranslationFieldsSchema, required: true},
  ru: { type: TranslationFieldsSchema, required: true},
  uk: { type: TranslationFieldsSchema, required: true},
});

export const CurrencySchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  translations: { type: CurrencyTranslationSchema, required: true }
});
