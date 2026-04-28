import { routerUrls } from '@/App';
import ProductCard from '@/components/features/ProductCard';
import { ProductSchema } from '@/entities/product/product.schema';
import { deleteProductById, getProductById } from '@/mocks/MOCK_products';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as v from 'valibot';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
  }).format(date);

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    isPending,
    isError,
    data: product,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      const foundProduct = getProductById(Number(id));

      if (!foundProduct) {
        return null;
      }

      return v.parse(ProductSchema, foundProduct);
    },
  });

  const handleDelete = () => {
    if (!id) return;

    deleteProductById(Number(id));

    void queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.removeQueries({ queryKey: ['product', id] });

    void navigate(routerUrls.product.list.mask);
  };

  if (isPending) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Failed to load product.</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="warning">Product not found.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {product.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Подробная информация о выбранном товаре.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <ProductCard product={product} />

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            gap: 0.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Дополнительно
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Создано: {formatDate(product.createdAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Обновлено: {formatDate(product.updatedAt)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              void navigate(routerUrls.product.edit.create(product.id))
            }
          >
            Редактировать
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Удалить товар
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Удалить товар?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить товар «{product.title}»? Это
            действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>

          <Button color="error" variant="contained" onClick={handleDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;
