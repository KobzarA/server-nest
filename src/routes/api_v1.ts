import express from 'express';
import productsRouter from './products/products.router';

const api_v1 = express();

api_v1.use('/products', productsRouter);

export default api_v1;
