import { Schema } from 'mongoose';

export type Sight = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: Rating[];
  translations?: SightTranslation;
};

export type Rating = {
  username: string;
  rate: number;
};

type SightTranslation = {
  en: TranslationFields;
  ru: TranslationFields;
  uk: TranslationFields;
};

type TranslationFields = {
  name: string;
  description: string;
};

const TranslationFieldsSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true},
});

const SightTranslationSchema: Schema = new Schema({
  en: { type: TranslationFieldsSchema, required: true},
  ru: { type: TranslationFieldsSchema, required: true},
  uk: { type: TranslationFieldsSchema, required: true},
});

const RatingSchema: Schema = new Schema({
  username: { type: String, required: true },
  rate: { type: Number, required: true },
});

export const SightSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: [{ type: RatingSchema, required: true }],
  translations: { type: SightTranslationSchema, required: true },
});
