import express from 'express';
import productsRouter from './products/products.router';
import ordersRouter from './orders/orders.router';

const api_v1 = express();

api_v1.use('/products', productsRouter);
api_v1.use('/orders', ordersRouter);

export default api_v1;
