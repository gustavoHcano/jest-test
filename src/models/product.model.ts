import { Document, model, Schema } from "mongoose";
import { UserDocument } from "./user.model";
import { v4 as uuidv4 } from 'uuid';

export interface ProductDocument extends Document {
  user: UserDocument["_id"];
  productId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  createdAt: Date;
  updateAt: Date;
}

const productSchema = new Schema(
  {
    productId: { 
      type: String,
      required: true,
      unique: true,
      default: () => `product_${uuidv4()}`,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  }
)

const ProductModel = model<ProductDocument>("Product", productSchema);

export default ProductModel;