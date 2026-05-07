import * as v from 'valibot';

import {
  ProductPayloadSchema,
  type ProductPayload,
} from '@/entities/product/payload.schema';
import {
  ProductSchema,
  type Product,
  type ProductServer,
} from '@/entities/product/product.schema';
import {
  ProductListSchema,
  type ProductItem,
  type ProductListServer,
} from '@/entities/product/productItem.shema';

import { apiFetch } from './client';

export const fetchProducts = async (): Promise<ProductItem[]> => {
  const data = await apiFetch<ProductListServer>('/item');

  return v.parse(ProductListSchema, data).items;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const data = await apiFetch<ProductServer>(`/item/${id}`);

  return v.parse(ProductSchema, data);
};

export const createProduct = async (
  payload: ProductPayload,
): Promise<Product> => {
  v.parse(ProductPayloadSchema, payload);

  const data = await apiFetch<ProductServer>('/item', {
    method: 'POST',
    body: payload,
  });

  return v.parse(ProductSchema, data);
};

export const updateProduct = async (
  id: number,
  payload: ProductPayload,
): Promise<Product> => {
  v.parse(ProductPayloadSchema, payload);

  const data = await apiFetch<ProductServer>(`/item/${id}`, {
    method: 'PATCH',
    body: payload,
  });

  return v.parse(ProductSchema, data);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiFetch<void>(`/item/${id}`, { method: 'DELETE' });
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: () => productKeys.lists(),
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};
