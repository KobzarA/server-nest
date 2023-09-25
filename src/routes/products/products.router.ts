import express from 'express';
import { getProducts, saveProducts } from './products.controller';
import CatalogService from '../../services/CatalogService';
import { Product } from '../../models/products/product.mongo';

const productsRouter = express.Router();

const createResponse = () => {};
const validateProduct = () => {};

productsRouter.get('/', async (req, res) => {
  const products = await CatalogService.getProducts();
  res.status(200).json(products);
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await CatalogService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {}
});

productsRouter.post('/', async (req, res) => {
  try {
    const product = await CatalogService.saveProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(503);
  }
});
productsRouter.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await CatalogService.updateProductById(
      req.params.id,
      req.body as Partial<Product>
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(503);
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const removedProduct = await CatalogService.removeProduct(req.params.id);
    res.status(200).json(removedProduct);
  } catch (error) {
    console.error(error);
    res.status(503);
  }
});

export default productsRouter;
