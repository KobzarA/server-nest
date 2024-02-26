import mongoose, { Schema } from 'mongoose';

export interface Product {
  sku: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const ProductSchema = new Schema<Product>(
  {
    sku: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    description: String,
  },
  { id: true, timestamps: true }
);

const ProductModel = mongoose.model('Product', ProductSchema);
export default ProductModel;
