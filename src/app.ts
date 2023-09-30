import path from 'path';

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config';

import api_v1 from './routes/api_v1';
import mongoose from 'mongoose';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `${process.env.MONGO_URL}${process.env.DB_NAME}`,
    }),
  })
);

app.use(passport.authenticate('session'));
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('combined'));
app.use(helmet());

app.use(express.json());

app.use('/v1', api_v1);
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

export default app;
