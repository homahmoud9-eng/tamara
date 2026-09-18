import { createProduct } from './src/app/(admin)/dashboard/catalog/products/actions';

async function testCreateProduct() {
  const formData = new FormData();
  formData.append('nameEn', 'Test Product ' + Date.now());
  formData.append('nameAr', 'منتج تجريبي');
  formData.append('categoryId', 'cm16o3nzi0009mxxw8i774hsw'); // We need a real categoryId. Let's find one first or create one.
  // Wait, I need a real categoryId.
  console.log('We need to fetch a category ID first to create a product.');
}
testCreateProduct();
