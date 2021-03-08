import { Schema } from "mongoose";

export type Capital = {
  name: string;
  coordinates: Coordinates;
  translations?: CapitalTranslation;
};

type Coordinates = {
  lat: number;
  lon: number;
};

type CapitalTranslation = {
  en: TranslationFields;
  ru: TranslationFields;
  uk: TranslationFields;
};

type TranslationFields = {
  name: string;
};

const TranslationFieldsSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const CapitalTranslationSchema: Schema = new Schema({
  en: { type: TranslationFieldsSchema, required: true},
  ru: { type: TranslationFieldsSchema, required: true},
  uk: { type: TranslationFieldsSchema, required: true},
});

const CoordinatesSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

export const CapitalSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  coordinates: { type: CoordinatesSchema, required: true },
  translations: { type: CapitalTranslationSchema, required: true }
});