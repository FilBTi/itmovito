import { routerUrls } from '@/App';
import ProductForm from '@/components/features/ProductForm';
import { ProductSchema } from '@/entities/product/product.schema';
import { getProductById } from '@/mocks/MOCK_products';
import { Alert, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import * as v from 'valibot';

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isPending,
    isError,
    data: product,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      const found = getProductById(Number(id));

      if (!found) {
        return null;
      }

      return v.parse(ProductSchema, found);
    },
  });

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
        <Alert severity="error">Не удалось загрузить товар.</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="warning">Товар не найден.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, maxWidth: 640 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Редактирование товара
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {product.title}
      </Typography>

      <ProductForm
        key={product.id}
        mode="edit"
        productId={product.id}
        defaultCategory={product.category.slug}
        defaultTitle={product.title}
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
