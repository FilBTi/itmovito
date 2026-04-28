import routerUrls from './routerUrls';

describe('routerUrls', () => {
  it('builds product item URL from id', () => {
    expect(routerUrls.product.item.create(42)).toBe('/products/42');
  });

  it('builds product edit URL from id', () => {
    expect(routerUrls.product.edit.create(7)).toBe('/products/7/edit');
  });

  it('exposes static masks', () => {
    expect(routerUrls.product.list.mask).toBe('/');
    expect(routerUrls.product.createPage.mask).toBe('/products/new');
    expect(routerUrls.product.item.mask).toBe('/products/:id');
    expect(routerUrls.product.edit.mask).toBe('/products/:id/edit');
  });
});
