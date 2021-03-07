import { Capital } from '../model/capital';
import { Currency } from '../model/currency';
import { Sight } from '../model/sight';
import CountrySchema, { Country } from '../model/country';
import ServerError from '../model/serverError';

export default class CountryService {
  async getCountries(search = '', locale = 'en'): Promise<Country[]> {
    let countries: Country[] = [];
    if (search) {
      countries = await CountrySchema.find({ name: { $regex: new RegExp(search, 'gi') } }).exec();
      const countriesByCapital = await CountrySchema.find({
        'capital.name': { $regex: new RegExp(search, 'gi') },
      }).exec();
      countries = [...countries, ...countriesByCapital];
    } else {
      countries = await CountrySchema.find({}).exec();
    }

    return this.convertArrayBasedOnLocale(countries, locale);
  }

  async getCountryById(isoCode = '', locale = 'en'): Promise<Country> {
    const country = await CountrySchema.findOne({ isoCode }).exec();
    if (country === null) {
      throw new ServerError(404, `Country with specified isoCode ${isoCode} was not found`);
    }
    return this.convertBasedOnLocale(country, locale);
  }

  async updateCountry(country: Country): Promise<Country> {
    const countryFromDB = await CountrySchema.findOne({ isoCode: country.isoCode }).exec();
    if (countryFromDB === null) {
      throw new ServerError(404, `Country with specified isoCode ${country.isoCode} was not found`);
    }

    await CountrySchema.updateOne().exec();
    return countryFromDB;
  }

  async createCountry(country: Country): Promise<Country> {
    const countryFromDB = await CountrySchema.create(country);
    if (countryFromDB === null) {
      throw new ServerError(404, `Country with specified isoCode ${country.isoCode} was not found`);
    }

    return countryFromDB;
  }

  private convertArrayBasedOnLocale(countries: Country[], locale: string): Country[] {
    countries.forEach(country => this.convertBasedOnLocale(country, locale));
    return countries;
  }

  private convertBasedOnLocale(country: Country, locale: string): Country {
    if (!country) {
      return country;
    }

    const translation = country.translations?.find(
      (translation) => translation.locale === locale
    );
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

  private changeCapitalTranslations(capital: Capital, locale: string): Capital {
    const translation = capital.translations?.find(
      (translation) => translation.locale === locale
    );

    if (translation) {
      capital.name = translation.name;
    }
    return capital;
  }

  private changeCurrencyTranslations(currency: Currency, locale: string):Currency {
    const translation = currency.translations?.find(
      (translation) => translation.locale === locale
    );

    if (translation) {
      currency.name = translation.name;
    }
    return currency;
  }

  private changeSightsTranslations(sights: Sight[], locale: string): Sight[] {
    sights.forEach(sight => this.changeSightTranslations(sight, locale));
    return sights;
  }

  private changeSightTranslations(sight: Sight, locale: string): Sight {
    const translation = sight.translations?.find(
      (translation) => translation.locale === locale
    );

    if (translation) {
      sight.name = translation.name;
      sight.description = translation.description;
    }
    return sight;
  }
}
