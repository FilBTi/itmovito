import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { routerUrls } from '@/App';
import { ApiError } from '@/api/client';
import { deleteProduct, fetchProductById, productKeys } from '@/api/products';
import ProductCard from '@/components/features/ProductCard';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    isPending,
    isError,
    error,
    data: product,
  } = useQuery({
    queryKey: productKeys.detail(numericId),
    queryFn: () => fetchProductById(numericId),
    enabled: Number.isFinite(numericId),
    retry: (failureCount, err) =>
      err instanceof ApiError && err.status === 404 ? false : failureCount < 3,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(numericId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(numericId) });
      void navigate(routerUrls.product.list.create());
    },
  });

  if (isPending) {
    return (
      <Container sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <Container sx={{ py: 6 }}>
          <Alert severity="warning">Товар не найден.</Alert>
        </Container>
      );
    }

    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Не удалось загрузить товар.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {product.name}
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

        {deleteMutation.isError && (
          <Alert severity="error">Не удалось удалить товар.</Alert>
        )}

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
            disabled={deleteMutation.isPending}
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
            Вы действительно хотите удалить товар «{product.name}»? Это действие
            нельзя будет отменить.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>

          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              setIsDeleteDialogOpen(false);
              deleteMutation.mutate();
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;
