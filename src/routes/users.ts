import { Request, Response, Router } from 'express';
import { User } from '../model/user';
import asyncMiddleware from '../middleware/asyncMiddleware';
import ServerError from '../model/serverError';
import { UserService } from '../service';

const UserRouter = (userService: UserService): Router => {
  const router = Router();

  router.get(
    '/',
    asyncMiddleware(async (_: Request, response: Response) => {
      const users = await userService.getUsers();
      response.status(200).json(users);
    })
  );

  router.get(
    '/:username',
    asyncMiddleware(async (request: Request, response: Response) => {
      const { username } = request.params;
      const user = await userService.getUser('' + username);
      response.status(200).json(user);
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
    '/',
    asyncMiddleware(async (request: Request, response: Response) => {
      const user = request.body as User;
      const createdUser = await userService.createUser(user);

      response.status(201).json(createdUser);
    })
  );

  return router;
};

export default UserRouter;
