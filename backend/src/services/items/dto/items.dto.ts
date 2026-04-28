import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CategorySchema = z.enum(['auto', 'real_estate', 'electronics']);

export const ItemSchema = z.object({
  id: z.int(),
  name: z.string().min(1),
  description: z.string(),
  category: CategorySchema,
  price: z.coerce.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ItemFilterSchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: CategorySchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(['price', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const CreateItemSchema = ItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateItemSchema = CreateItemSchema.partial();

export class ItemDto extends createZodDto(ItemSchema) {}
export class CreateItemDto extends createZodDto(CreateItemSchema) {}
export class UpdateItemDto extends createZodDto(UpdateItemSchema) {}
export class ItemFilterDto extends createZodDto(ItemFilterSchema) {}

export type Item = z.infer<typeof ItemSchema>;
