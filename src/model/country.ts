import mongoose, { Schema, Document } from 'mongoose';
import { Capital, CapitalSchema } from './capital';
import { Currency, CurrencySchema } from './currency';
import { Sight, SightSchema } from './sight';
import { Timezone, TimezoneSchema } from './timezone';

export interface Country extends Document {
  isoCode: string;
  name: string;
  description: string;
  image: string;
  video: string;
  currency: Currency;
  timezone: Timezone;
  capital: Capital;
  sights: Sight[];
  translations?: CountryTranslation[];
}

type CountryTranslation = {
  locale: string;
  name: string;
  description: string;
};

const CountryTranslationSchema: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true},
});

const CountrySchema: Schema = new Schema({
  isoCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String, required: true },
  currency: { type: CurrencySchema, required: true },
  capital: { type: CapitalSchema, required: true },
  timezone: { type: TimezoneSchema, required: true },
  sights: [{ type: SightSchema, required: true }],
  translations: [{ type: CountryTranslationSchema, required: true }],
});

export default mongoose.model<Country>('countries', CountrySchema);
