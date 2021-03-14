import { Request, Response, Router } from 'express';
import { User } from '../model/user';
import asyncMiddleware from '../middleware/asyncMiddleware';
import ServerError from '../model/serverError';
import { UserService } from '../service';
import jwt from 'jsonwebtoken';
import validateUserPermissions from '../middleware/validateUserPermissionMiddleware';

const UserRouter = (userService: UserService): Router => {
  const router = Router();
  const SECRET = process.env['SECRET'] || '';

  router.get(
    '/',
    asyncMiddleware(async (_: Request, response: Response) => {
      const users = await userService.getUsers();
      response.status(200).json(users);
    })
  );

  router.get(
    '/autologin',
    validateUserPermissions(SECRET),
    asyncMiddleware(async (request: Request, response: Response) => {
      const username = request.headers['USERNAME'];
      if (!!username) {
        const user = await userService.getUser('' + username);
        response.status(200).json(user);
      } else {
        throw new ServerError(401, 'Invalid credentials');
      }
    })
  );

  router.get('/logout', (_: Request, response: Response) => {
    response.cookie('AUTH', '', { httpOnly: false, maxAge: 0, sameSite: 'none', secure: true }).status(200).send();
  });

  router.get(
    '/:username',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { username } = request.params;
      const user = await userService.getUser('' + username);
      generateAuthCookie(response, user).status(200).json(user);
    })
  );

  router.put(
    '/:username',
    asyncMiddleware(async (request: Request, response: Response) => {
      const user = request.body as User;
      const { username } = request.params;

      if (user.username !== username) {
        throw new ServerError(
          409,
          `User ${username} does not have access to update another user info`
        );
      }

      const updatedUser = await userService.updateUser(user);
      response.status(200).json(updatedUser);
    })
  );

  router.post(
    '/:username',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { username } = request.params;
      if (!username) {
        throw new ServerError(400, 'Invalid username was provided');
      }
      const user = request.body as User;
      if (username !== user.username) {
        throw new ServerError(400, 'Invalid request provided');
      }

      const userFromDB = await userService.getUser(user.username);

      if (
        userFromDB &&
        userFromDB.username === user.username &&
        userFromDB.password === user.password
      ) {
        generateAuthCookie(response, userFromDB).status(200).json(userFromDB);
      }
      throw new ServerError(400, 'Invalid credentials were provided');
    })
  );

  router.post(
    '/',
    asyncMiddleware(async (request: Request, response: Response) => {
      const user = request.body as User;
      const createdUser = await userService.createUser(user);

      generateAuthCookie(response, createdUser).status(201).json(createdUser);
    })
  );

  const generateAuthCookie = (response: Response, user: User): Response => {
    const token = jwt.sign({ username: user.username }, SECRET);
    return response.cookie('AUTH', token, { httpOnly: false, maxAge: 3600000, sameSite: 'none', secure: true });
  };

  return router;
};

export default UserRouter;
