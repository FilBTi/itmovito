import * as v from 'valibot';

import { ProductSchema } from './product.schema';

export const ProductPayloadSchema = v.pick(ProductSchema, [
  'category',
  'name',
  'description',
  'price',
]);

export type ProductPayload = v.InferInput<typeof ProductPayloadSchema>;
