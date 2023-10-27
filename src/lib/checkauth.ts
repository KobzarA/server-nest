import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { privateJWTKey } from '../config';
import { IUser } from '../models/users/user.mongo';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.Authorization) {
    return res.status(403).json({
      success: false,
      message: 'Please log in',
    });
  }
  const token = req.cookies.Authorization.split(' ')[1];
  //@ts-ignore
  jwt.verify(
    token,
    privateJWTKey as string,
    { complete: false },

    function (err: VerifyErrors | null, user: IUser) {
      if (err) {
        res.clearCookie('Authorization', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        return res.status(403).send({
          success: false,
          message: err.message,
        });
      } else if (user.role === 'client')
        return res
          .sendStatus(403)
          .send({ success: false, message: 'Access forbiden' });
      res.locals.user = user;
      return next();
    }
  );
};

export { checkAuth };
