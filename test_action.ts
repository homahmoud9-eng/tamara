import { createCategory } from './src/app/(admin)/dashboard/catalog/actions.ts';

async function run() {
  const formData1 = new FormData();
  formData1.append('nameEn', 'Desserts');
  formData1.append('nameAr', 'حلويات');
  
  const res1 = await createCategory(formData1);
  console.log("Cat 1:", res1);

  const formData2 = new FormData();
  formData2.append('nameEn', 'Main Dishes');
  formData2.append('nameAr', 'أطباق رئيسية');
  
  const res2 = await createCategory(formData2);
  console.log("Cat 2:", res2);
}

run();
