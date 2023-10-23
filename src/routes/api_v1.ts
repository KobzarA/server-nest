import express from 'express';
import productsRouter from './products/products.router';
import ordersRouter from './orders/orders.router';
import usersRouter from './users/users.router';
import authRouter from './auth/auth.router';
import { checkAuth } from '../lib/checkauth';

const api_v1 = express();

api_v1.use('/products', productsRouter);
api_v1.use('/orders', checkAuth, ordersRouter);
api_v1.use('/users', checkAuth, usersRouter);
api_v1.use('/admin', authRouter);

export default api_v1;
