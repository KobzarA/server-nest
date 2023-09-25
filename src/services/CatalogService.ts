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

  static async updateProductById(id: string, update: Partial<Product>) {
    return await ProductModel.findByIdAndUpdate(id, update, {
      new: true,
    }).exec();
  }

  static async removeProduct(id: string) {
    return await ProductModel.deleteOne({ _id: id }).exec();
  }
}

export default CatalogService;
