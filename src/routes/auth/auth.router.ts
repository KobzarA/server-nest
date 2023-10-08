import express from 'express';
import AuthService from '../../services/AuthService';

import { IUser } from '../../models/users/user.mongo';
import UserService from '../../services/UserService';
import { checkAuth } from '../../lib/checkauth';

const hideSensetiveData = (data: IUser): Partial<IUser> => {
  const { email, username, role } = data;

  return {
    email,
    username,
    role,
  };
};

const authRouter = express.Router();

authRouter.post('/login/password', async (req, res) => {
  console.log(req.body);
  const checkedUser = await UserService.authenticate(
    req.body.username,
    req.body.password
  );

  if (checkedUser) {
    const userData = hideSensetiveData(checkedUser.toObject());
    const token = await AuthService.login(userData);
    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('user', JSON.stringify(userData), {
      sameSite: 'none',
    });
    return res.json(userData);
  } else {
    return res.status(400).json('Invalid login or password');
  }
});

authRouter.get('/login/validate', checkAuth, async (req, res) => {
  return res.json(hideSensetiveData(res.locals.user as IUser));
});

authRouter.post('/createUser', async (req, res, next) => {
  try {
    const newUser = await UserService.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/logout', function (req, res, next) {
  res.clearCookie('Authorization', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return res.json({ message: 'Log out success' });
});
export default authRouter;
