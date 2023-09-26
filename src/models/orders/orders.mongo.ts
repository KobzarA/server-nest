import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../products/product.mongo';

export interface Order extends Document {
  products: { product: Product; quantity: number }[];
  totalSum: number;
  client: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress: {
    country?: string;
    region?: string;
    city: string;
    postIndex?: number;
    postName: string;
    postAddress: string;
  };
  paymentMethod: string;
}

const OrderSchema = new Schema<Order>({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalSum: { type: Number, required: true },
  client: {
    firstName: { type: String, required: true },
    lastName: String,
    email: String,
    phone: String,
  },
  shippingAddress: {
    country: String,
    region: String,
    city: String,
    postIndex: Number,
    postName: { type: String, required: true },
    postAddress: { type: String, required: true },
  },
  paymentMethod: String,
});

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;
