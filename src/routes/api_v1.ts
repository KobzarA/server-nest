import express from 'express';
import productsRouter from './products/products.router';
import ordersRouter from './orders/orders.router';
import adminUserRouter from './admin/adminUser.router';
import authRouter from './auth/auth.router';

const api_v1 = express();

api_v1.use('/products', productsRouter);
api_v1.use('/orders', ordersRouter);
// api_v1.use('/admin', adminUserRouter);
api_v1.use('/admin', authRouter);

export default api_v1;
