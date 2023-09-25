import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import api_v1 from './routes/api_v1';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('combined'));

app.use(express.json());

app.use('/v1', api_v1);

export default app;
