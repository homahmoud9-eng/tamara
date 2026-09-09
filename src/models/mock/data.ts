import { Offer, Category, Product, Banner } from '../types';

export const mockOffers: Offer[] = [
  {
    id: "offer-1",
    title: { ar: "عرض الغداء", en: "Lunch Offer" },
    subtitle: { ar: "خصم ٣٠٪ على وجبات الغداء الفردية", en: "30% off all individual lunch meals" },
    image: "/assets/images/tamara_offer_weekly_saver.jpg",
    discountType: 'percentage',
    discountValue: 30,
    ctaText: { ar: "اطلب الآن", en: "Order Now" },
    ctaLink: '/menu',
    active: true,
  },
  {
    id: "offer-2",
    title: { ar: "باقات الاشتراكات", en: "Subscription Packages" },
    subtitle: { ar: "وفر حتى ٥٠٠ درهم مع باقات التوفير", en: "Save up to 500 AED with our packages" },
    image: "/assets/images/tamara_package_lunch_saver.jpg",
    discountType: 'fixed',
    discountValue: 500,
    ctaText: { ar: "استكشف الباقات", en: "Explore Packages" },
    ctaLink: '/menu/packages',
    active: true,
  }
];

export const mockCategories: Category[] = [
  { id: "cat-packages", name: { ar: "باقات الاشتراكات", en: "Subscriptions" }, slug: "packages", image: "/assets/images/tamara_package_lunch_saver.jpg", titleImage: "/assets/packages_word_logo.png", sortOrder: 1, active: true },
  { id: "cat-meals", name: { ar: "الوجبات الشاملة", en: "Complete Meals" }, slug: "meals", image: "/assets/images/tamara_product_stuffed_chicken.jpg", titleImage: "/assets/meals_word_logo.png", sortOrder: 2, active: true },
  { id: "cat-tagines", name: { ar: "الطواجن والأطباق", en: "Tagines & Mains" }, slug: "tagines", image: "/assets/images/tamara_product_okra_tagine.jpg", titleImage: "/assets/tagines_word_logo.png", sortOrder: 3, active: true },
  { id: "cat-mahashi", name: { ar: "المحاشي والطيور", en: "Mahashi & Poultry" }, slug: "mahashi", image: "/assets/images/tamara_category_mahashi.jpg", titleImage: "/assets/mahashi_word_logo.png", sortOrder: 4, active: true },
  { id: "cat-sandwiches", name: { ar: "مقبلات وسندوتشات", en: "Appetizers & Sandwiches" }, slug: "sandwiches", image: "/assets/images/tamara_category_grills.jpg", titleImage: "/assets/sandwiches_word_logo.png", sortOrder: 5, active: true },
  { id: "cat-frozen", name: { ar: "تفريزات ومخللات", en: "Frozen & Pickles" }, slug: "frozen", image: "/assets/images/tamara_freezer_prepared.jpg", titleImage: "/assets/frozen_word_logo.png", sortOrder: 6, active: true },
  { id: "cat-offers", name: { ar: "عروض وعزومات", en: "Feasts & Offers" }, slug: "offers", image: "/assets/images/tamara_offer_weekly_saver.jpg", titleImage: "/assets/offers_word_logo.png", sortOrder: 7, active: true },
];

export const mockProducts: Product[] = [
  // --- باقات الاشتراكات ---
  {
    id: 'prod-pkg-1', categoryId: 'cat-packages',
    name: { ar: 'الباقة الأسبوعية (6 وجبات)', en: 'Weekly Package (6 Meals)' },
    description: { ar: '6 وجبات تشمل الأرز، الخضار باللحم أو دجاج، والسلطة. سعر مميز لتوفير يومي.', en: '6 meals including rice, veg with meat/chicken, and salad.' },
    baseImage: '/assets/images/tamara_package_lunch_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 1, ratingAggregate: 4.8, reviewsCount: 75,
    variants: [{ id: 'v-pkg1', name: { ar: '6 وجبات', en: '6 Meals' }, price: 160, image: '/assets/images/tamara_package_lunch_saver.jpg', isDefault: true, active: true }]
  },
  {
    id: 'prod-pkg-2', categoryId: 'cat-packages',
    name: { ar: 'الباقة نصف الشهرية (12 وجبة)', en: 'Half-Month Package (12 Meals)' },
    description: { ar: '12 وجبة متنوعة حسب جدول المطبخ مع مقبلات مجانية. توفير كبير.', en: '12 varied meals based on kitchen schedule with free appetizers.' },
    baseImage: '/assets/images/tamara_package_lunch_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 2, ratingAggregate: 4.9, reviewsCount: 42,
    variants: [{ id: 'v-pkg2', name: { ar: '12 وجبة', en: '12 Meals' }, price: 300, image: '/assets/images/tamara_package_lunch_saver.jpg', isDefault: true, active: true }]
  },
  {
    id: 'prod-pkg-3', categoryId: 'cat-packages',
    name: { ar: 'الباقة الشهرية الشاملة (24 وجبة)', en: 'Full Month Package (24 Meals)' },
    description: { ar: '24 وجبة كاملة مع مقبلات وسلطات وتوصيل يومي طازج. أفضل توفير.', en: '24 complete meals with salads and daily fresh delivery.' },
    baseImage: '/assets/images/tamara_package_lunch_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 3, ratingAggregate: 5.0, reviewsCount: 22,
    variants: [{ id: 'v-pkg3', name: { ar: '24 وجبة', en: '24 Meals' }, price: 550, image: '/assets/images/tamara_package_lunch_saver.jpg', isDefault: true, active: true }]
  },

  // --- الوجبات الشاملة ---
  {
    id: 'prod-meal-1', categoryId: 'cat-meals',
    name: { ar: 'وجبة ملوخية + أرز + ربع فرخة/قطعة لحم', en: 'Molokhia + Rice + 1/4 Chicken/Meat' },
    description: { ar: 'وجبة متكاملة مع الأرز والسلطة', en: 'Complete meal with rice and salad' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: false, bestseller: true, sortOrder: 1, ratingAggregate: 4.8, reviewsCount: 120,
    variants: [
      { id: 'v-m1-sm', name: { ar: 'صغير (فرد)', en: 'Small' }, price: 28, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-m1-md', name: { ar: 'وسط (2-3 أفراد)', en: 'Medium' }, price: 52, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-m1-lg', name: { ar: 'كبير (4-5 أفراد)', en: 'Large' }, price: 85, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },
  {
    id: 'prod-meal-2', categoryId: 'cat-meals',
    name: { ar: 'وجبة لوبيا + أرز + ربع فرخة/قطعة لحم', en: 'Cowpeas + Rice + 1/4 Chicken/Meat' },
    description: { ar: 'وجبة متكاملة', en: 'Complete meal' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: false, bestseller: false, sortOrder: 2, ratingAggregate: 4.5, reviewsCount: 40,
    variants: [
      { id: 'v-m2-sm', name: { ar: 'صغير', en: 'Small' }, price: 28, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-m2-md', name: { ar: 'وسط', en: 'Medium' }, price: 52, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-m2-lg', name: { ar: 'كبير', en: 'Large' }, price: 85, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },
  {
    id: 'prod-meal-3', categoryId: 'cat-meals',
    name: { ar: 'وجبة فاصوليا بيضاء + أرز + ربع فرخة/لحم', en: 'White Beans + Rice + 1/4 Chicken/Meat' },
    description: { ar: 'وجبة متكاملة', en: 'Complete meal' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: false, bestseller: false, sortOrder: 3, ratingAggregate: 4.6, reviewsCount: 30,
    variants: [
      { id: 'v-m3-sm', name: { ar: 'صغير', en: 'Small' }, price: 28, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-m3-md', name: { ar: 'وسط', en: 'Medium' }, price: 52, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-m3-lg', name: { ar: 'كبير', en: 'Large' }, price: 85, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },
  {
    id: 'prod-meal-4', categoryId: 'cat-meals',
    name: { ar: 'وجبة بسلة + أرز + ربع فرخة/لحم', en: 'Peas + Rice + 1/4 Chicken/Meat' },
    description: { ar: 'وجبة متكاملة', en: 'Complete meal' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: false, bestseller: true, sortOrder: 4, ratingAggregate: 4.7, reviewsCount: 50,
    variants: [
      { id: 'v-m4-sm', name: { ar: 'صغير', en: 'Small' }, price: 28, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-m4-md', name: { ar: 'وسط', en: 'Medium' }, price: 52, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-m4-lg', name: { ar: 'كبير', en: 'Large' }, price: 85, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },
  {
    id: 'prod-meal-5', categoryId: 'cat-meals',
    name: { ar: 'وجبة كفتة أرز بالبطاطس + أرز', en: 'Rice Kofta with Potatoes + Rice' },
    description: { ar: 'أرز أبيض أو بشعرية', en: 'White or Vermicelli rice' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: false, bestseller: true, sortOrder: 5, ratingAggregate: 4.8, reviewsCount: 45,
    variants: [
      { id: 'v-m5-sm', name: { ar: 'صغير', en: 'Small' }, price: 26, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-m5-md', name: { ar: 'وسط', en: 'Medium' }, price: 48, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-m5-lg', name: { ar: 'كبير', en: 'Large' }, price: 78, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },
  {
    id: 'prod-meal-6', categoryId: 'cat-meals',
    name: { ar: 'وجبة مكرونة صوص أحمر + 2 قطعة بفتيك', en: 'Red Sauce Pasta + 2 Beef Steak' },
    description: { ar: 'وجبة متكاملة', en: 'Complete meal' },
    baseImage: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true, featured: true, bestseller: true, sortOrder: 6, ratingAggregate: 4.9, reviewsCount: 88,
    variants: [
      { id: 'v-m6-sm', name: { ar: 'صغير', en: 'Small' }, price: 32, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', isDefault: true, active: true },
      { id: 'v-m6-md', name: { ar: 'وسط', en: 'Medium' }, price: 60, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true },
      { id: 'v-m6-lg', name: { ar: 'كبير', en: 'Large' }, price: 95, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true }
    ]
  },

  // --- الطواجن ---
  {
    id: 'prod-tagine-1', categoryId: 'cat-tagines',
    name: { ar: 'طاجن عكاوي بالبصل', en: 'Oxtail Tagine with Onions' },
    description: { ar: 'عكاوي بالدقة والصلصة', en: 'Oxtail tagine with sauce' },
    baseImage: '/assets/images/tamara_product_okra_tagine.jpg', active: true, featured: true, bestseller: true, sortOrder: 1, ratingAggregate: 4.9, reviewsCount: 150,
    variants: [
      { id: 'v-t1-sm', name: { ar: 'صغير', en: 'Small' }, price: 35, image: '/assets/images/tamara_product_okra_tagine.jpg', isDefault: true, active: true },
      { id: 'v-t1-md', name: { ar: 'وسط', en: 'Medium' }, price: 65, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true },
      { id: 'v-t1-lg', name: { ar: 'كبير', en: 'Large' }, price: 100, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true }
    ]
  },
  {
    id: 'prod-tagine-2', categoryId: 'cat-tagines',
    name: { ar: 'طاجن بامية باللحم', en: 'Okra Tagine with Meat' },
    description: { ar: 'بامية طازجة باللحم الضاني أو البقري', en: 'Okra baked with meat' },
    baseImage: '/assets/images/tamara_product_okra_tagine.jpg', active: true, featured: false, bestseller: true, sortOrder: 2, ratingAggregate: 4.8, reviewsCount: 120,
    variants: [
      { id: 'v-t2-sm', name: { ar: 'صغير', en: 'Small' }, price: 32, image: '/assets/images/tamara_product_okra_tagine.jpg', isDefault: true, active: true },
      { id: 'v-t2-md', name: { ar: 'وسط', en: 'Medium' }, price: 60, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true },
      { id: 'v-t2-lg', name: { ar: 'كبير', en: 'Large' }, price: 90, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true }
    ]
  },
  {
    id: 'prod-tagine-3', categoryId: 'cat-tagines',
    name: { ar: 'طاجن خضار مشكل باللحم (تورلي)', en: 'Mixed Veggies Tagine with Meat' },
    description: { ar: 'خضار مشكل طازج', en: 'Fresh mixed vegetables' },
    baseImage: '/assets/images/tamara_product_okra_tagine.jpg', active: true, featured: false, bestseller: false, sortOrder: 3, ratingAggregate: 4.6, reviewsCount: 80,
    variants: [
      { id: 'v-t3-sm', name: { ar: 'صغير', en: 'Small' }, price: 30, image: '/assets/images/tamara_product_okra_tagine.jpg', isDefault: true, active: true },
      { id: 'v-t3-md', name: { ar: 'وسط', en: 'Medium' }, price: 55, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true },
      { id: 'v-t3-lg', name: { ar: 'كبير', en: 'Large' }, price: 85, image: '/assets/images/tamara_product_okra_tagine.jpg', active: true }
    ]
  },
  {
    id: 'prod-tagine-4', categoryId: 'cat-tagines',
    name: { ar: 'مكرونة بشاميل', en: 'Macaroni Bechamel' },
    description: { ar: 'لحم / دجاج / جلاش باللحم', en: 'Meat or chicken or meat goulash' },
    baseImage: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true, featured: true, bestseller: true, sortOrder: 4, ratingAggregate: 4.8, reviewsCount: 180,
    variants: [
      { id: 'v-t4-sm', name: { ar: 'صغير', en: 'Small' }, price: 25, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', isDefault: true, active: true },
      { id: 'v-t4-md', name: { ar: 'وسط', en: 'Medium' }, price: 45, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true },
      { id: 'v-t4-lg', name: { ar: 'كبير', en: 'Large' }, price: 70, image: '/assets/images/tamara_product_macaroni_bechamel.jpg', active: true }
    ]
  },
  {
    id: 'prod-tagine-5', categoryId: 'cat-tagines',
    name: { ar: 'فراخ مشوية بالفرن / محشية أرز', en: 'Roasted/Stuffed Chicken' },
    description: { ar: 'دجاجة محمرة أو محشية', en: 'Roasted or stuffed chicken' },
    baseImage: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true, featured: true, bestseller: true, sortOrder: 5, ratingAggregate: 4.9, reviewsCount: 200,
    variants: [
      { id: 'v-t5-sm', name: { ar: 'ربع فرخة', en: '1/4 Chicken' }, price: 25, image: '/assets/images/tamara_product_stuffed_chicken.jpg', isDefault: true, active: true },
      { id: 'v-t5-md', name: { ar: 'نصف فرخة', en: '1/2 Chicken' }, price: 45, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true },
      { id: 'v-t5-lg', name: { ar: 'فرخة كاملة', en: 'Whole Chicken' }, price: 75, image: '/assets/images/tamara_product_stuffed_chicken.jpg', active: true }
    ]
  },

  // --- المحاشي ---
  {
    id: 'prod-mah-1', categoryId: 'cat-mahashi',
    name: { ar: 'محشي مشكل', en: 'Mixed Mahashi' },
    description: { ar: 'كرنب، ورق عنب، كوسة، فلفل وباذنجان', en: 'Stuffed cabbage, vine leaves, zucchini, bell peppers and eggplant' },
    baseImage: '/assets/images/tamara_category_mahashi.jpg', active: true, featured: true, bestseller: true, sortOrder: 1, ratingAggregate: 4.7, reviewsCount: 140,
    variants: [
      { id: 'v-mh1-sm', name: { ar: 'صغير', en: 'Small' }, price: 22, image: '/assets/images/tamara_category_mahashi.jpg', isDefault: true, active: true },
      { id: 'v-mh1-md', name: { ar: 'وسط', en: 'Medium' }, price: 40, image: '/assets/images/tamara_category_mahashi.jpg', active: true },
      { id: 'v-mh1-lg', name: { ar: 'كبير', en: 'Large' }, price: 65, image: '/assets/images/tamara_category_mahashi.jpg', active: true }
    ]
  },
  {
    id: 'prod-mah-2', categoryId: 'cat-mahashi',
    name: { ar: 'حمام محشي', en: 'Stuffed Pigeons' },
    description: { ar: 'أرز بالخلطة أو فريك مع المكسرات', en: 'Stuffed with spiced rice or freekeh and nuts' },
    baseImage: '/assets/images/tamara_category_mahashi.jpg', active: true, featured: true, bestseller: true, sortOrder: 2, ratingAggregate: 4.8, reviewsCount: 85,
    variants: [
      { id: 'v-mh2-sm', name: { ar: 'حبة', en: '1 Piece' }, price: 38, image: '/assets/images/tamara_category_mahashi.jpg', isDefault: true, active: true },
      { id: 'v-mh2-md', name: { ar: 'جوز', en: '1 Pair' }, price: 75, image: '/assets/images/tamara_category_mahashi.jpg', active: true },
      { id: 'v-mh2-lg', name: { ar: '2 جوز', en: '2 Pairs' }, price: 145, image: '/assets/images/tamara_category_mahashi.jpg', active: true }
    ]
  },

  // --- مقبلات وسندوتشات ---
  {
    id: 'prod-sand-1', categoryId: 'cat-sandwiches',
    name: { ar: 'حواوشي لحم مصري', en: 'Egyptian Hawawshi' },
    description: { ar: 'إسكندراني بحبة البركة والسمسم', en: 'Alexandrian style with sesame and black seed' },
    baseImage: '/assets/images/tamara_category_grills.jpg', active: true, featured: false, bestseller: true, sortOrder: 1, ratingAggregate: 4.7, reviewsCount: 65,
    variants: [
      { id: 'v-s1-1', name: { ar: 'رغيف', en: '1 Loaf' }, price: 15, image: '/assets/images/tamara_category_grills.jpg', isDefault: true, active: true },
      { id: 'v-s1-2', name: { ar: 'وجبة رغيفين', en: '2 Loaves Meal' }, price: 28, image: '/assets/images/tamara_category_grills.jpg', active: true }
    ]
  },
  {
    id: 'prod-sand-2', categoryId: 'cat-sandwiches',
    name: { ar: 'سمبوسك', en: 'Samosa' },
    description: { ar: 'لحم / دجاج / أجبان', en: 'Meat / Chicken / Cheese' },
    baseImage: '/assets/images/tamara_category_grills.jpg', active: true, featured: false, bestseller: true, sortOrder: 2, ratingAggregate: 4.6, reviewsCount: 110,
    variants: [
      { id: 'v-s2-1', name: { ar: 'قطعة', en: '1 Piece' }, price: 2, image: '/assets/images/tamara_category_grills.jpg', isDefault: true, active: true },
      { id: 'v-s2-2', name: { ar: 'طبق (20 قطعة)', en: 'Plate (20 pieces)' }, price: 38, image: '/assets/images/tamara_category_grills.jpg', active: true }
    ]
  },
  
  // --- تفريزات ---
  {
    id: 'prod-froz-1', categoryId: 'cat-frozen',
    name: { ar: 'كرنب محشي / ورق عنب (جاهز للتسوية)', en: 'Stuffed Cabbage/Vine Leaves (Ready)' },
    description: { ar: 'محشي جاهز للتسوية الفورية، سعر الكيلو', en: 'Ready to cook mahashi, kilo price' },
    baseImage: '/assets/images/tamara_freezer_prepared.jpg', active: true, featured: false, bestseller: true, sortOrder: 1, ratingAggregate: 4.8, reviewsCount: 90,
    variants: [
      { id: 'v-fz1-kg1', name: { ar: 'كرنب (كيلو)', en: 'Cabbage (1kg)' }, price: 55, image: '/assets/images/tamara_freezer_prepared.jpg', isDefault: true, active: true },
      { id: 'v-fz1-kg2', name: { ar: 'ورق عنب (كيلو)', en: 'Vine Leaves (1kg)' }, price: 60, image: '/assets/images/tamara_freezer_prepared.jpg', active: true }
    ]
  },
  {
    id: 'prod-froz-2', categoryId: 'cat-frozen',
    name: { ar: 'كفتة أرز نية / كفتة الحاتي', en: 'Raw Rice Kofta / Hati Kofta' },
    description: { ar: 'جاهزة للشوي أو القلي، سعر الكيلو', en: 'Ready to grill or fry, kilo price' },
    baseImage: '/assets/images/tamara_freezer_prepared.jpg', active: true, featured: false, bestseller: true, sortOrder: 2, ratingAggregate: 4.9, reviewsCount: 85,
    variants: [
      { id: 'v-fz2-kg1', name: { ar: 'كفتة أرز نية (كيلو)', en: 'Rice Kofta (1kg)' }, price: 65, image: '/assets/images/tamara_freezer_prepared.jpg', isDefault: true, active: true },
      { id: 'v-fz2-kg2', name: { ar: 'كفتة الحاتي (كيلو)', en: 'Hati Kofta (1kg)' }, price: 80, image: '/assets/images/tamara_freezer_prepared.jpg', active: true }
    ]
  },
  {
    id: 'prod-froz-3', categoryId: 'cat-frozen',
    name: { ar: 'بفتيك متبل / بانيه / استربس', en: 'Marinated Steak / Pane / Strips' },
    description: { ar: 'جاهزة للقلي/الشوي، سعر الكيلو', en: 'Ready to cook, kilo price' },
    baseImage: '/assets/images/tamara_freezer_prepared.jpg', active: true, featured: false, bestseller: true, sortOrder: 3, ratingAggregate: 4.9, reviewsCount: 85,
    variants: [
      { id: 'v-fz3-kg1', name: { ar: 'بفتيك/بانيه (كيلو)', en: 'Steak/Pane (1kg)' }, price: 70, image: '/assets/images/tamara_freezer_prepared.jpg', isDefault: true, active: true },
      { id: 'v-fz3-kg2', name: { ar: 'استربس (كيلو)', en: 'Strips (1kg)' }, price: 95, image: '/assets/images/tamara_freezer_prepared.jpg', active: true }
    ]
  },

  // --- عروض وعزومات ---
  {
    id: 'prod-offer-1', categoryId: 'cat-offers',
    name: { ar: 'عرض الوجبة العائلية', en: 'Family Meal Offer' },
    description: { ar: 'سيرفيس محشي كبير، فرخة كاملة، طاجن مسقعة وسط، سمبوسك، وسلطات. توفير 28 درهم.', en: 'Large mahashi service, whole chicken, medium moussaka, samosa, salads. Saves 28 AED.' },
    baseImage: '/assets/images/tamara_offer_weekly_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 1, ratingAggregate: 5.0, reviewsCount: 40,
    variants: [
      { id: 'v-o1', name: { ar: 'عرض حصري', en: 'Exclusive Offer' }, price: 195, image: '/assets/images/tamara_offer_weekly_saver.jpg', isDefault: true, active: true }
    ]
  },
  {
    id: 'prod-offer-2', categoryId: 'cat-offers',
    name: { ar: 'عرض لمة العيلة', en: 'Family Gathering Offer' },
    description: { ar: '2 جوز حمام محشي، طاجن ورق عنب بالكوارع كبير، بامية باللحم كبير، مكرونة بشاميل، وسلطات. توفير 50 درهم.', en: '4 stuffed pigeons, large vine leaves with knuckles, large okra with meat, macaroni bechamel, salads. Saves 50 AED.' },
    baseImage: '/assets/images/tamara_offer_weekly_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 2, ratingAggregate: 4.9, reviewsCount: 35,
    variants: [
      { id: 'v-o2', name: { ar: 'عرض حصري', en: 'Exclusive Offer' }, price: 345, image: '/assets/images/tamara_offer_weekly_saver.jpg', isDefault: true, active: true }
    ]
  },
  {
    id: 'prod-offer-3', categoryId: 'cat-offers',
    name: { ar: 'عرض الولائم الفاخرة', en: 'Premium Feast Offer' },
    description: { ar: 'بطة كاملة محشية، 2 فرخة كاملة، سيرفيس محشي كبير، صينية جلاش، طاجن عكاوي بصل كبير وتشكيلة سلطات. توفير 70 درهم.', en: 'Whole stuffed duck, 2 whole chickens, large mahashi service, goulash tray, large oxtail tagine and assorted salads. Saves 70 AED.' },
    baseImage: '/assets/images/tamara_offer_weekly_saver.jpg', active: true, featured: true, bestseller: true, sortOrder: 3, ratingAggregate: 5.0, reviewsCount: 60,
    variants: [
      { id: 'v-o3', name: { ar: 'عرض حصري', en: 'Exclusive Offer' }, price: 490, image: '/assets/images/tamara_offer_weekly_saver.jpg', isDefault: true, active: true }
    ]
  }
];

export const mockReviews = [
  {
    id: 'rev-1',
    author: 'أحمد سعيد',
    rating: 5,
    text: 'طعم الأكل فعلاً بيفكرني بأكل والدتي، البامية بالضاني ممتازة.',
    date: 'منذ يومين'
  },
  {
    id: 'rev-2',
    author: 'سارة محمد',
    rating: 5,
    text: 'التغليف رائع والأكل بيوصل سخن، الفراخ المحشية خطيرة.',
    date: 'منذ أسبوع'
  }
];

export const mockBanners: Banner[] = [
  {
    id: "banner-home-top",
    type: "compact-strip",
    title: { ar: "اطلب بأكثر من 500 درهم واحصل على توصيل مجاني ✨", en: "Order over AED 500 and get free delivery ✨" },
    image: "",
    active: true,
  }
];
