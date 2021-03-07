import { Schema } from "mongoose";

export type Capital = {
  name: string;
  coordinates: Coordinates;
  translations?: CapitalTranslation[];
};

export type CapitalTranslation = {
  locale: string;
  name: string;
};

type Coordinates = {
  lat: number;
  lon: number;
};

const CapitalTranslationSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

const CoordinatesSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

export const CapitalSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  coordinates: { type: CoordinatesSchema, required: true },
  translations: [{ type: CapitalTranslationSchema, required: true }]
});