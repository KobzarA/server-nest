// import ProductModel, { Product } from '../models/products/product.mongo';
import OrderModel, { Order } from '../models/orders/orders.mongo';

class OrderService {
  static async saveOrder(data: Order) {
    const item = await new OrderModel(data);
    return item.save();
  }

  static async getOrders() {
    return await OrderModel.find({}).populate('products.product').exec();
  }

  static async getOrderById(id: string) {
    return await OrderModel.findById(id).populate('products.product').exec();
  }

  static async updateOrderById(id: string, update: Partial<Order>) {
    return await OrderModel.findByIdAndUpdate(id, update, {
      new: true,
    }).exec();
  }

  static async removeOrder(id: string) {
    return await OrderModel.deleteOne({ _id: id }).exec();
  }
}

export default OrderService;
