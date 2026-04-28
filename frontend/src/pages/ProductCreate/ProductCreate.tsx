import { routerUrls } from '@/App';
import ProductForm from '@/components/features/ProductForm';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 6, maxWidth: 640 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Новый товар
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Заполните поля ниже, чтобы добавить объявление в каталог.
      </Typography>

      <ProductForm
        mode="create"
        onCancel={() => void navigate(routerUrls.product.list.create())}
        onSuccess={(product) =>
          void navigate(routerUrls.product.item.create(product.id))
        }
      />
    </Container>
  );
};

export default ProductCreate;
