import MainLayout from '@/components/layout/MainLayout';
import ProductCreate from '@/pages/ProductCreate';
import ProductDetails from '@/pages/ProductDetails';
import ProductEdit from '@/pages/ProductEdit';
import ProductList from '@/pages/ProductList';
import { createBrowserRouter } from 'react-router';

import routerUrls from './routerUrls';

const router = createBrowserRouter([
  {
    path: routerUrls.product.list.mask,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProductList />,
      },
      {
        path: routerUrls.product.createPage.mask,
        element: <ProductCreate />,
      },
      {
        path: routerUrls.product.item.mask,
        element: <ProductDetails />,
      },
      {
        path: routerUrls.product.edit.mask,
        element: <ProductEdit />,
      },
    ],
  },
]);

export default router;
