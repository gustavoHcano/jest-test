import { Request, Response } from "express";
import { CreateProductInput, DeleteProductInput, ReadProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findProduct, updateProduct } from "../service/product.service";
import logger from "../utils/logger";

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response) {
  console.log(`createProductHandler ${req.body} `)
try {
  const userId = res.locals.user._id;

const body = req.body;

const product = await createProduct({ ...body, user: userId });

return res.send(product);

} catch (error: any) {
  logger.error(error);
  return res.status(409).send(error.message);
}
}

export async function getProductHandler(req: Request<ReadProductInput['params'], {}, {}>, res: Response) {
try {
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) return res.status(404).send('Product dont exist');

  return res.send(product);

} catch (error: any) {
  logger.error(error);
  return res.status(409).send(error.message);
}
}

export async function updateProductHandler(
req: Request<UpdateProductInput['params'],
  {},
  UpdateProductInput['body']>,
res: Response) {
try {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) return res.status(404).send('Product dont exist');

  if (String(product.user) !== userId) return res.sendStatus(403);

  const updatedProduct = await updateProduct(
    { productId },
    update,
    { new: true }
  )

  return res.send(updatedProduct);

} catch (error: any) {
  logger.error(error);
  return res.status(409).send(error.message);
}
}
export async function deleteProductHandler(
req: Request<DeleteProductInput['params'],
  {},
  {}>,
res: Response) {
try {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) return res.status(404).send('Product dont exist');

  if (String(product.user) !== userId) return res.sendStatus(403);

  await deleteProduct({ productId })

  return res.sendStatus(200);

} catch (error: any) {
  logger.error(error);
  return res.status(409).send(error.message);
}
}