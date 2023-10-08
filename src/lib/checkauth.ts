import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { privateJWTKey } from '../config';
import { IUser } from '../models/users/user.mongo';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.Authorization)
    res
      .status(403)
      .json({ message: 'Please log in!' })
      .redirect('/admin/login');
  const token = req.cookies.Authorization.split(' ')[1];
  //@ts-ignore
  jwt.verify(
    token,
    privateJWTKey as string,
    { complete: false },

    function (err: VerifyErrors | null, user: IUser) {
      if (err) return res.status(403).json(err).redirect('back');
      if (user.role === 'client') return res.sendStatus(403).redirect('back');
      res.locals.user = user;
      return next();
    }
  );
};

export { checkAuth };
