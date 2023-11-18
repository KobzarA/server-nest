import express from 'express';
import CatalogService from '../../services/CatalogService';
import { Product } from '../../models/products/product.mongo';

const productsRouter = express.Router();

const createResponse = () => {};
const validateProduct = () => {};

productsRouter.get('/', async (req, res) => {
  try {
    const products = await CatalogService.getProducts();
    if (!products)
      return res
        .status(404)
        .json({ success: false, message: 'No products data found' });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await CatalogService.getProductById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'No product data found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const product = await CatalogService.saveProduct(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(503)
      .json({ success: false, message: 'Something went wrong' });
  }
});
productsRouter.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await CatalogService.updateProductById(
      req.params.id,
      req.body as Partial<Product>
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res
      .status(503)
      .json({ success: false, message: 'Something went wrong' });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const removedProduct = await CatalogService.removeProduct(req.params.id);
    return res.status(200).json({ success: true, data: removedProduct });
  } catch (error) {
    return res
      .status(503)
      .json({ success: false, message: 'Something went wrong' });
  }
});

export default productsRouter;
