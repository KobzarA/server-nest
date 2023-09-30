import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { IUser } from '../../models/users/user.mongo';
import UserService from '../../services/UserService';

const authRouter = express.Router();

passport.use(
  // @ts-ignore comment
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    cb: Function
  ) {
    try {
      const checkUser = await UserService.authenticate(username, password);
      if (!checkUser) {
        return cb(null, false, {
          message: 'Incorrect username or password.',
        });
      }
      return cb(null, checkUser);
    } catch (error) {
      return cb(error);
    }
  })
);

passport.serializeUser<IUser>(function (user, cb) {
  process.nextTick(function () {
    // @ts-ignore
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser<IUser>(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// authRouter.get('/', (req, res) => {
//   console.log(req);
//   return res.json(req);
// });

// authRouter.get('/login', (req, res) => {
//   return res.json('Please log in');
// });

authRouter.post(
  '/login/password',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
  })
);

authRouter.post('/createUser', async (req, res, next) => {
  try {
    const newUser = await UserService.create(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
export default authRouter;
