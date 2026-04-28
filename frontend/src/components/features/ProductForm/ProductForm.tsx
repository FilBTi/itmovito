import { ProductSchema, type Product } from '@/entities/product/product.schema';
import {
  type ProductCategory,
  createProduct,
  updateProductById,
} from '@/mocks/MOCK_products';
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
import * as v from 'valibot';

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
  defaultTitle?: string;
  defaultDescription?: string;
  defaultPrice?: number;
  onCancel: () => void;
  onSuccess: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  productId,
  defaultCategory = DEFAULT_CATEGORY,
  defaultTitle = '',
  defaultDescription = '',
  defaultPrice = 0,
  onCancel,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [priceInput, setPriceInput] = useState(String(defaultPrice));
  const [category, setCategory] = useState(defaultCategory);

  const priceParsed = parsePriceInput(priceInput);
  const priceInvalid =
    priceInput.trim() === '' ||
    !Number.isFinite(priceParsed) ||
    priceParsed < 0;

  const saveMutation = useMutation<Product, Error, void>({
    mutationFn: async () => {
      if (!Number.isFinite(priceParsed) || priceParsed < 0) {
        throw new Error('invalid');
      }

      const payload = {
        category,
        title: title.trim(),
        description: description.trim(),
        price: priceParsed,
      };

      if (mode === 'create') {
        const created = createProduct(payload);

        return v.parse(ProductSchema, created);
      }

      if (productId === null || productId === undefined) {
        throw new Error('invalid');
      }

      const updated = updateProductById(productId, payload);

      if (!updated) {
        throw new Error('not_found');
      }

      return Promise.resolve(v.parse(ProductSchema, updated));
    },

    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });

      if (mode === 'edit' && productId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: ['product', String(productId)],
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        error={title.trim() === ''}
        helperText={title.trim() === '' ? 'Укажите название' : undefined}
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

      {saveMutation.isError && (
        <Alert severity="error">
          {saveMutation.error instanceof Error &&
          saveMutation.error.message === 'not_found'
            ? 'Товар не найден.'
            : 'Проверьте введённые данные.'}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pt: 1 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={
            title.trim() === '' || priceInvalid || saveMutation.isPending
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
