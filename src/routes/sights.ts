import { Router, Request, Response } from 'express';
import asyncMiddleware from '../middleware/asyncMiddleware';
import { Rating } from '../model/sight';
import { CountryService, SightsService } from '../service';
import validateUserPermissions from '../middleware/validateUserPermissionMiddleware';

const SightRouter = (countryService: CountryService, sightsService: SightsService): Router => {
  const SECRET = process.env['SECRET'] || '';
  const router = Router();

  router.post(
    '/:countryCode/sights/:sightId/rate',
    validateUserPermissions(SECRET),
    asyncMiddleware(async (request: Request, response: Response) => {
      const { countryCode, sightId } = request.params;
      const data = request.body as Rating;
      const country = await countryService.getFullCountryById(countryCode);
      const sight = country.sights.find((sight) => sight.id === sightId);
      await sightsService.rateSight(sight, data);
      await countryService.updateCountry(country);
      response.status(201).send();
    })
  );

  return router;
};

export default SightRouter;
