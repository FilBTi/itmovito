import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ProductItem } from '@/entities/product/productItem.shema';

import ProductCard from './ProductCard';

const product: ProductItem = {
  id: 42,
  category: {
    slug: 'electronics',
    name: 'Электроника',
  },
  name: 'Ноутбук Lenovo',
  description: 'Игровой ноутбук в хорошем состоянии',
  price: 125000,
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={product} />);

    expect(
      screen.getByRole('heading', { name: product.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getAllByText(product.category.name)).toHaveLength(2);
    expect(screen.getByText(`ID: ${product.id}`)).toBeInTheDocument();
    expect(screen.getByText('125 000 ₽')).toBeInTheDocument();
  });

  it('renders fallback description and link when target is passed', () => {
    render(
      <MemoryRouter>
        <ProductCard
          product={{
            ...product,
            description: '',
          }}
          to="/products/42"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Без описания')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/42');
  });
});
