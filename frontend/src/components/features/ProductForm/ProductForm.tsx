import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ApiError } from '@/api/client';
import { createProduct, productKeys, updateProduct } from '@/api/products';
import { type ProductCategory } from '@/entities/product/category.schema';
import { type ProductPayload } from '@/entities/product/payload.schema';
import { type Product } from '@/entities/product/product.schema';

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'auto', label: 'Транспорт' },
  { value: 'real_estate', label: 'Недвижимость' },
  { value: 'electronics', label: 'Электроника' },
];

const parsePriceInput = (raw: string) =>
  Number(raw.replace(/\s/g, '').replace(',', '.'));

const DEFAULT_CATEGORY: ProductCategory = 'auto';

export type ProductFormMode = 'create' | 'edit';

export interface ProductFormProps {
  mode: ProductFormMode;
  productId?: number;
  defaultCategory?: ProductCategory;
  defaultName?: string;
  defaultDescription?: string;
  defaultPrice?: number;
  onCancel: () => void;
  onSuccess: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  productId,
  defaultCategory = DEFAULT_CATEGORY,
  defaultName = '',
  defaultDescription = '',
  defaultPrice = 0,
  onCancel,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [priceInput, setPriceInput] = useState(String(defaultPrice));
  const [category, setCategory] = useState(defaultCategory);

  const priceParsed = parsePriceInput(priceInput);
  const priceInvalid =
    priceInput.trim() === '' ||
    !Number.isFinite(priceParsed) ||
    priceParsed < 0;

  const saveMutation = useMutation<Product, Error, void>({
    mutationFn: () => {
      const payload: ProductPayload = {
        category,
        name: name.trim(),
        description: description.trim(),
        price: priceParsed,
      };

      if (mode === 'create') {
        return createProduct(payload);
      }

      if (productId === undefined || productId === null) {
        return Promise.reject(new Error('invalid'));
      }

      return updateProduct(productId, payload);
    },

    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      if (mode === 'edit' && productId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: productKeys.detail(productId),
        });
      }

      onSuccess(product);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveMutation.mutate();
  };

  const handleCategoryChange = (event: SelectChangeEvent<ProductCategory>) => {
    setCategory(event.target.value);
  };

  const submitLabel = mode === 'create' ? 'Создать' : 'Сохранить';

  const errorMessage = (() => {
    if (!saveMutation.isError) return null;
    const err = saveMutation.error;

    if (err instanceof ApiError) {
      if (err.status === 404) return 'Товар не найден.';

      if (err.status >= 400 && err.status < 500) {
        return err.message || 'Проверьте введённые данные.';
      }

      return 'Ошибка сервера. Попробуйте позже.';
    }

    return 'Не удалось сохранить товар.';
  })();

  return (
    <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <InputLabel id="product-form-category-label">Категория</InputLabel>
        <Select
          labelId="product-form-category-label"
          id="product-form-category"
          label="Категория"
          value={category}
          onChange={handleCategoryChange}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        error={name.trim() === ''}
        helperText={name.trim() === '' ? 'Укажите название' : undefined}
      />

      <TextField
        label="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={3}
      />

      <TextField
        label="Цена, ₽"
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
        fullWidth
        error={priceInvalid}
        helperText={priceInvalid ? 'Укажите неотрицательное число' : undefined}
      />

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pt: 1 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={
            name.trim() === '' || priceInvalid || saveMutation.isPending
          }
        >
          {submitLabel}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Отмена
        </Button>
      </Box>
    </Stack>
  );
};

export default ProductForm;
