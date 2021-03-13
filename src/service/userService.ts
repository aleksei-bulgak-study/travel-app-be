import ServerError from '../model/serverError';
import UserSchema, { User } from '../model/user';
import { Error } from 'mongoose';
import {MongoError} from 'mongodb';

export default class UserService {
  async getUser(username: string): Promise<User> {
    const user = await UserSchema.findOne({ username }).exec();
    if (user === null) {
      throw new ServerError(404, `User with name ${username} was not found`);
    }
    return user;
  }
  async createUser(user: User): Promise<User> {
    try {
      const result = await UserSchema.create(user);
      return result;
    } catch (e) {
      console.log(e);
      if (e instanceof Error.ValidationError) {
        throw new ServerError(400, e.message);
      }
      if(e instanceof MongoError && e.code === 11000) {
        throw new ServerError(400, `User with name ${user.username} has already exists`);
      }
      throw new ServerError(500, e.message);
    }
  }

  async updateUser(user: User): Promise<User> {
    const existingUser = await UserSchema.findOne({ username: user.username }).exec();
    if (existingUser === null) {
      throw new ServerError(404, `User with ${user.username} does not exist in database`);
    }
    existingUser.password = user.password;
    existingUser.logo = user.logo;
    await UserSchema.updateOne(
      { _id: existingUser._id, __v: existingUser.__v },
      existingUser
    ).exec();
    return existingUser;
  }

  async getUsers(): Promise<User[]> {
    return await UserSchema.find().exec();
  }
}
