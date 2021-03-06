import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import ServerError from "../model/serverError";
import { Rating } from "../model/sight";

const validateUserPermissions = (secret: string) => (request: Request, _: Response, next: NextFunction) => {
    const authCookie = request.cookies['AUTH'];
    try {
      const userInfo = jwt.verify(authCookie, secret) as { username: string };
      if(request.method === 'GET') {
        request.headers['USERNAME'] = userInfo.username;  
        return next();
      }
      const rating = request.body as Rating;
      if (userInfo.username === rating.username) {
        return next();
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

  export default validateUserPermissions;