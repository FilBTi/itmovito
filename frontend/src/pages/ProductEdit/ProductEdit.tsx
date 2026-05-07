import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';

import { routerUrls } from '@/App';
import { ApiError } from '@/api/client';
import { fetchProductById, productKeys } from '@/api/products';
import ProductForm from '@/components/features/ProductForm';

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();

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
    <Container sx={{ py: 6, maxWidth: 640 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Редактирование товара
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {product.name}
      </Typography>

      <ProductForm
        key={product.id}
        mode="edit"
        productId={product.id}
        defaultCategory={product.category.slug}
        defaultName={product.name}
        defaultDescription={product.description}
        defaultPrice={product.price}
        onCancel={() =>
          void navigate(routerUrls.product.item.create(product.id))
        }
        onSuccess={() =>
          void navigate(routerUrls.product.item.create(product.id))
        }
      />
    </Container>
  );
};

export default ProductEdit;
