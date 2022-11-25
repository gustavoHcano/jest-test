import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { any } from "zod";
import ProductModel, { ProductDocument } from "../models/product.model";
import logger from "../utils/logger";

export async function createProduct(input: DocumentDefinition<Omit<ProductDocument, 'createdAt' | 'updateAt' | 'productId'>>) {
  try {
    const product = await ProductModel.create(input);
    return product.toJSON();
  } catch (error: any) {
    logger.error(error);
  }
}

export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = {lean: true}) {
  try {
    return ProductModel.findOne(query, {}, options);

  } catch (error: any) {

  }
}

export async function updateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
  ) {
    try {
      return ProductModel.findOneAndUpdate(query, update, options)
    } catch (error: any) {
      
    }
  }

  export async function deleteProduct(query: FilterQuery<ProductDocument>) {
    try {
      return ProductModel.deleteOne(query);
    } catch (error: any) {
  
    }
  }