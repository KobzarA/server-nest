import { RequestHandler } from 'express';

const getProducts: RequestHandler = (req, res) => {};

const getProduct: RequestHandler = (req, res) => {};

const saveProducts: RequestHandler = async (req, res) => {
  // const db = await mongoClient.db(process.env.DB_NAME as string);
  // const col = await db.collection('products');
  // const products = req.body;
  // try {
  //   let result;
  //   if (Array.isArray(products))
  //     result = await col.updateMany({}, products, { upsert: true });
  //   else result = await col.updateOne({}, products, { upsert: true });
  //   res.status(200).json(result);
  // } catch (error) {
  //   res.status(400).json(error);
  // }
};

const deleteProduct: RequestHandler = (req, res) => {};
const deleteProducts: RequestHandler = (req, res) => {};

export { getProducts, saveProducts };
