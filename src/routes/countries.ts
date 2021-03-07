import { Router, Request, Response } from 'express';
import { Country } from '../model/country';
import asyncMiddleware from '../middleware/asyncMiddleware';
import { CountryService } from '../service';

type Locale = 'en' | 'ru' | 'uk';

const CountryRouter = (countryService: CountryService): Router => {
  const router = Router();

  router.get(
    '/',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { search = '', locale = 'en' } = request.query;
      const countries = await countryService.getCountries('' + search, convertLocale('' + locale));
      response.status(200).json(countries);
    })
  );

  router.get(
    '/:isoCode',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { isoCode } = request.params;
      const { locale = 'en' } = request.query;
      const country = await countryService.getCountryById(isoCode, convertLocale('' + locale));
      response.status(200).json(country);
    })
  );

  router.post(
    '/',
    asyncMiddleware(async (request: Request, response: Response) => {
      const country = request.body as Country;
      const result = await countryService.createCountry(country);
      response.status(201).json(result);
    })
  );

  return router;
};

const convertLocale = (locale: string): Locale => {
  if(['en', 'ru', 'uk'].includes(locale.toLowerCase())) {
    return locale.toLowerCase() as Locale;
  }
  return 'en';
};

export default CountryRouter;
