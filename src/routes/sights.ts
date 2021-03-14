import { Router, Request, Response, NextFunction } from 'express';
import asyncMiddleware from '../middleware/asyncMiddleware';
import { Rating } from '../model/sight';
import { CountryService, SightsService } from '../service';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import ServerError from '../model/serverError';

const SightRouter = (countryService: CountryService, sightsService: SightsService): Router => {
  const SECRET = process.env['SECRET'] || '';
  const router = Router();

  const validateUserPermissions = (request: Request, _: Response, next: NextFunction) => {
    const authCookie = request.cookies['AUTH'];
    try {
      const userInfo = jwt.verify(authCookie, SECRET) as { username: string };
      const rating = request.body as Rating;
      if (userInfo.username === rating.username) {
        next();
      } else {
        throw new ServerError(401, 'Invalid credentials');
      }
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new ServerError(401, 'Invalid auth credentials provided');
      }
      throw err;
    }
  };

  router.post(
    '/:countryCode/sights/:sightId/rate',
    validateUserPermissions,
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
