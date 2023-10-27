import express from 'express';
import AuthService from '../../services/AuthService';

import { IUser } from '../../models/users/user.mongo';
import UserService from '../../services/UserService';
import { checkAuth } from '../../lib/checkauth';
import { hideSensetiveUserData } from '../../lib/hideSensetiveData';

const authRouter = express.Router();

authRouter.post('/login/password', async (req, res) => {
  const checkedUser = await UserService.authenticate(
    req.body.username,
    req.body.password
  );

  if (checkedUser) {
    const userData = hideSensetiveUserData(checkedUser.toObject());
    const token = await AuthService.login(userData);
    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.status(200).json({ success: true, data: userData });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid login or password',
    });
  }
});

authRouter.get('/login/validate', checkAuth, async (req, res) => {
  return res.json({
    success: true,
    data: hideSensetiveUserData(res.locals.user as IUser),
  });
});

authRouter.get('/logout', (req, res, next) => {
  res.clearCookie('Authorization', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return res.json({ success: true, data: 'Log out success' });
});
export default authRouter;
