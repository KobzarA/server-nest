import express from 'express';
import OrderService from '../../services/OrderService';
import { Order } from '../../models/orders/orders.mongo';

const ordersRouter = express.Router();

const createResponse = () => {};
const validateOrder = () => {};

ordersRouter.get('/', async (req, res) => {
  const orders = await OrderService.getOrders();
  res.status(200).json(orders);
});

ordersRouter.get('/:id', async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {}
});

ordersRouter.post('/', async (req, res) => {
  try {
    const order = await OrderService.saveOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(503);
  }
});
ordersRouter.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await OrderService.updateOrderById(
      req.params.id,
      req.body as Partial<Order>
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(503);
  }
});

ordersRouter.delete('/:id', async (req, res) => {
  try {
    const removedOrder = await OrderService.removeOrder(req.params.id);
    res.status(200).json(removedOrder);
  } catch (error) {
    res.status(503);
  }
});

export default ordersRouter;
