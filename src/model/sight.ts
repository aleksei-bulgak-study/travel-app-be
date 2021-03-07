import { Schema } from 'mongoose';

export type Sight = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: Rating[];
  translations?: SightTranslation[];
};

type SightTranslation = {
  locale: string;
  name: string;
  description: string;
};

export type Rating = {
  username: string;
  rate: number;
};

const SightTranslationSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const RatingSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  rate: { type: Number, required: true },
});

export const SightSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: [{ type: RatingSchema, required: true }],
  translations: [{ type: SightTranslationSchema, required: true }],
});
