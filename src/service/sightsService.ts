import ServerError from '../model/serverError';
import { Rating, Sight } from '../model/sight';

export default class SightsService {
  rateSight(sight: Sight | undefined, rating: Rating): Sight {
    if (!sight) {
      throw new ServerError(404, 'Sight not found');
    }

    const existingRate = sight.rating.find((rate) => rate.username === rating.username);
    if (existingRate) {
      existingRate.rate = rating.rate;
    } else {
      sight.rating.push({...rating});
    }

    return sight;
  }
}