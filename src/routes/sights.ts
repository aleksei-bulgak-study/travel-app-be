import { Router, Request, Response } from 'express';
import asyncMiddleware from '../middleware/asyncMiddleware';
import { Rating } from 'src/model/sight';
import { CountryService, SightsService } from '../service';

const SightRouter = (countryService: CountryService, sightsService: SightsService): Router => {
  const router = Router();

  router.get(
    '/:countryCode/sights/:sightId',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { countryCode, sightId } = request.params;
      const data = request.body as Rating;
      const country = await countryService.getCountryById(countryCode, 'en');
      const sight = country.sights.find((sight) => sight.id === sightId);
      sightsService.rateSight(sight, data);
      countryService.updateCountry(country);
      response.status(201).send();
    })
  );

  return router;
};

export default SightRouter;