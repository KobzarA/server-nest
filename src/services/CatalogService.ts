import ProductModel, { Product } from '../models/products/product.mongo';

class CatalogService {
  static async saveProduct(product: Product) {
    const item = await new ProductModel(product);
    return item.save();
  }

  static async getProducts() {
    return await ProductModel.find({}).exec();
  }

  static async getProductById(id: string) {
    return await ProductModel.findById(id).exec();
  }

  static async removeProduct(id: string) {
    return await ProductModel.deleteOne({ _id: id }).exec();
  }
}

export default CatalogService;
