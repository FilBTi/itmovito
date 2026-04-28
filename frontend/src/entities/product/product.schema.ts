import * as v from 'valibot';

import { DateSchema } from '../date/datetime.schema';

import { CategorySchema } from './category.schema';

export const ProductSchema = v.object({
  id: v.number(),
  category: CategorySchema,
  title: v.string(),
  description: v.string(),
  price: v.number(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export type ProductServer = v.InferInput<typeof ProductSchema>;

export type Product = v.InferOutput<typeof ProductSchema>;
