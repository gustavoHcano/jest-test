import config from 'config';
import { type } from 'os';
import { number, object, string, TypeOf } from 'zod';

const productDescriptionLength: number = config.get( 'productDesriptionLength');

export const payload = {
  body: object({
    title: string({
      required_error: 'Title is required'
    }),
    description: string({
      required_error: 'Description is required'
    }).min(productDescriptionLength,
      `Description should be at least ${productDescriptionLength}`),
    image: string({
      required_error: 'Image is required'
    }),
    price: number({
      required_error: 'Price is required'
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "productId is required"
    })
  })
};

export const createProductSchema = object({
  ...payload
});
export const updateProductSchema = object({
  ...payload,
  ...params
});
export const deleteProductSchema = object({
  ...params
});
export const readProductSchema = object({
  ...params
});

export type CreateProductInput = TypeOf<typeof createProductSchema>
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type ReadProductInput = TypeOf<typeof readProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>