import { createCategory } from './src/app/(admin)/dashboard/catalog/actions.ts';

async function run() {
  console.log("Simulating Category 1 form data...");
  const fd1 = new FormData();
  fd1.append('nameAr', 'حلويات 2');
  fd1.append('nameEn', 'Desserts 2');
  fd1.append('slug', '');
  fd1.append('descriptionAr', '');
  fd1.append('descriptionEn', '');
  fd1.append('image', new File([], ''));
  fd1.append('titleImageAr', new File([], ''));
  fd1.append('titleImageEn', new File([], ''));
  fd1.append('isActive', 'on');
  fd1.append('sortOrder', '0');
  
  const res1 = await createCategory(fd1);
  console.log("Cat 1:", res1);

  console.log("Simulating Category 2 form data...");
  const fd2 = new FormData();
  fd2.append('nameAr', 'أطباق رئيسية 2');
  fd2.append('nameEn', 'Main Dishes 2');
  fd2.append('slug', '');
  fd2.append('descriptionAr', '');
  fd2.append('descriptionEn', '');
  fd2.append('image', new File([], ''));
  fd2.append('titleImageAr', new File([], ''));
  fd2.append('titleImageEn', new File([], ''));
  fd2.append('isActive', 'on');
  fd2.append('sortOrder', '0');

  const res2 = await createCategory(fd2);
  console.log("Cat 2:", res2);
}

run();
