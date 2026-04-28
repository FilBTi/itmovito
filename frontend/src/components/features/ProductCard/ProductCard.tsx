import { ProductItem } from '@/entities/product/productItem.shema';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';

interface ProductCardProps {
  product: ProductItem;
  to?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);

const ProductCard: React.FC<ProductCardProps> = ({ product, to }) => {
  const description = product.description || 'Без описания';

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardActionArea
        component={to ? RouterLink : 'div'}
        to={to}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gap: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {product.category.name}
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700 }}
                >
                  {product.title}
                </Typography>
              </Box>

              <Chip
                color="default"
                label={product.category.name}
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label={`ID: ${product.id}`} variant="outlined" />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Price
              </Typography>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {formatPrice(product.price)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
