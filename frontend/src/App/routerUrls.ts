const routerUrls = {
  product: {
    list: {
      mask: '/',
      create: () => '/',
    },

    createPage: {
      mask: '/products/new',
      create: () => '/products/new',
    },

    item: {
      mask: '/products/:id',
      create: (id: number) => `/products/${id}`,
    },

    edit: {
      mask: '/products/:id/edit',
      create: (id: number) => `/products/${id}/edit`,
    },
  },
};

export default routerUrls;
