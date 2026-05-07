import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { routerUrls } from '@/App';
import { fetchProducts, productKeys } from '@/api/products';
import ProductCard from '@/components/features/ProductCard';

const ProductList = () => {
  const navigate = useNavigate();

  const { isPending, isError, data } = useQuery({
    queryKey: productKeys.list(),
    queryFn: () => fetchProducts(),
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
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Не удалось загрузить товары.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Stack
        component="form"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Каталог
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Объявления о продаже и аренде
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => void navigate(routerUrls.product.createPage.create())}
        >
          Добавить товар
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {data.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            to={routerUrls.product.item.create(product.id)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ProductList;
