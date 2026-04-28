import * as v from 'valibot';

import { ProductSchema } from './product.schema';

const ProductItemSchema = v.omit(ProductSchema, ['createdAt', 'updatedAt']);

export type ProductItemServer = v.InferInput<typeof ProductItemSchema>;

export type ProductItem = v.InferOutput<typeof ProductItemSchema>;

export const ProductListSchema = v.object({
  items: v.array(ProductItemSchema),
});

export type ProductListServer = v.InferInput<typeof ProductListSchema>;
