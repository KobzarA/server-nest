import jwt from 'jsonwebtoken';
import { privateJWTKey } from '../config';
import { IUser } from '../models/users/user.mongo';

class AuthService {
  static async checkAuth() {}

  static async checkPermission() {}

  static async login(data: Partial<IUser>) {
    const token = jwt.sign(data, privateJWTKey as string, {
      expiresIn: '18h',
    });
    return token;
  }

  static async logout() {}
}

export default AuthService;
