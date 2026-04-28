import { routerUrls } from '@/App';
import ProductCard from '@/components/features/ProductCard';
import { ProductListSchema } from '@/entities/product/productItem.shema';
import { getProductsList } from '@/mocks/MOCK_products';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import * as v from 'valibot';

const ProductList = () => {
  const navigate = useNavigate();

  const {
    isPending,
    isError,
    data: products,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      const list = v.parse(ProductListSchema, getProductsList());

      return Promise.resolve(list);
    },
  });

  if (isPending) {
    return 'Loading...';
  }

  if (isError) {
    return 'Error...';
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
        {products.items.map((product) => (
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
