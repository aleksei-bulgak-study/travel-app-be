import { Capital } from '../model/capital';
import { Currency } from '../model/currency';
import { Sight } from '../model/sight';
import CountrySchema, { Country } from '../model/country';
import ServerError from '../model/serverError';

type Locale = 'en' | 'ru' | 'uk';

export default class CountryService {
  async getCountries(search = '', locale: Locale = 'en'): Promise<Country[]> {
    let countries: Country[] = [];
    if (search) {
      const countryName = `translations.${locale}.name`;
      countries = await CountrySchema.find({
        [countryName]: { $regex: new RegExp(search, 'gi') },
      }).exec();
      const capitalName = `capital.translations.${locale}.name`;
      const countriesByCapital = await CountrySchema.find({
        [capitalName]: { $regex: new RegExp(search, 'gi') },
      }).exec();
      countries = [...countries, ...countriesByCapital];
    } else {
      countries = await CountrySchema.find({}).exec();
    }

    return this.convertArrayBasedOnLocale(countries, locale);
  }

  async getCountryById(isoCode = '', locale: Locale = 'en'): Promise<Country> {
    const country = await CountrySchema.findOne({ isoCode }).exec();
    if (country === null) {
      throw new ServerError(404, `Country with specified isoCode ${isoCode} was not found`);
    }
    return this.convertBasedOnLocale(country, locale);
  }

  async updateCountry(country: Country): Promise<Country> {
    await CountrySchema.updateOne({_id: country._id}, country).exec();
    return country;
  }

  async createCountry(country: Country): Promise<Country> {
    const countryFromDB = await CountrySchema.create(country);
    if (countryFromDB === null) {
      throw new ServerError(404, `Country with specified isoCode ${country.isoCode} was not found`);
    }

    return countryFromDB;
  }

  private convertArrayBasedOnLocale(countries: Country[], locale: Locale): Country[] {
    countries.forEach((country) => this.convertBasedOnLocale(country, locale));
    return countries;
  }

  private convertBasedOnLocale(country: Country, locale: Locale): Country {
    if (!country) {
      return country;
    }

    const translation = country.translations ? country.translations[locale] : null;
    if (locale !== 'en' && translation) {
      country.name = translation.name;
      country.description = translation.description;
      this.changeCapitalTranslations(country.capital, locale);
      this.changeCurrencyTranslations(country.currency, locale);
      this.changeSightsTranslations(country.sights, locale);
    }
    return this.removeTranslationFields(country);
  }

  private removeTranslationFields(country: Country): Country {
    country.translations = undefined;
    country.capital.translations = undefined;
    country.currency.translations = undefined;
    country.sights.forEach((sight) => (sight.translations = undefined));
    return country;
  }

  private changeCapitalTranslations(capital: Capital, locale: Locale): Capital {
    const translation = capital.translations ? capital.translations[locale] : null;
    if (translation) {
      capital.name = translation.name;
    }
    return capital;
  }

  private changeCurrencyTranslations(currency: Currency, locale: Locale): Currency {
    const translation = currency.translations ? currency.translations[locale] : null;

    if (translation) {
      currency.name = translation.name;
    }
    return currency;
  }

  private changeSightsTranslations(sights: Sight[], locale: Locale): Sight[] {
    sights.forEach((sight) => this.changeSightTranslations(sight, locale));
    return sights;
  }

  private changeSightTranslations(sight: Sight, locale: Locale): Sight {
    const translation = sight.translations ? sight.translations[locale] : null;

    if (translation) {
      sight.name = translation.name;
      sight.description = translation.description;
    }
    return sight;
  }
}
