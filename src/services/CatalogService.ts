import ProductModel, { Product } from '../models/products/product.mongo';
import { IProduct } from '../../../shared/src/types/models';
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

  static async updateManyProducts(products: Product[]) {
    for (let i = 0; i++; i < products.length) {
      await ProductModel.updateOne({ sku: products[i].sku }, products[i], {
        upsert: true,
      }).exec();
    }
    // return await ProductModel.updateMany({},products,{'upsert': true})
  }

  static async removeProduct(id: string) {
    return await ProductModel.deleteOne({ _id: id }).exec();
  }
}

export default CatalogService;
