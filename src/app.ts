import path from 'path';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { checkAuth } from './lib/checkauth';
import 'dotenv/config';
import api_v1 from './routes/api_v1';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      'https://localhost:3000',
      'http://localhost:3000',
      'https://custom-admin.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline'");
  next();
});

app.use('/v1', api_v1);
app.use(express.static(path.join(__dirname, '..', 'public', 'admin')));

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});

export default app;
