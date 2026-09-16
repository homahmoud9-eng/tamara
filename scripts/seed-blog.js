const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
  {
    titleAr: "الكشري المصري: أسطورة المطبخ الشعبي",
    titleEn: "Egyptian Koshari: The Legend of Street Food",
    slug: "egyptian-koshari",
    excerptAr: "تعرف على أسرار تحضير الكشري المصري الأصيل، المزيج الرائع من الأرز والمكرونة والعدس مع صلصة الطماطم والبصل المقرمش.",
    excerptEn: "Discover the secrets of making authentic Egyptian Koshari, the wonderful mix of rice, macaroni, and lentils.",
    contentAr: "الكشري هو الطبق الشعبي الأول في مصر، ويعتبر وجبة متكاملة لا غنى عنها في أي بيت مصري. يتكون من مزيج مثالي من الأرز، المكرونة، والعدس بجبة، مغطى بصلصة الطماطم المتبلة بدقة (الدقة) والبصل المقرمش (الورد). في مطبخ تمارا، نقدم لكم هذه التجربة الأصيلة بنفس الطعم الذي تتذوقه في شوارع القاهرة.",
    contentEn: "Koshari is the number one popular dish in Egypt, an essential complete meal in any Egyptian home. It consists of a perfect blend of rice, macaroni, and brown lentils, topped with spiced tomato sauce and crispy onions. At Tamara Kitchen, we bring you this authentic experience.",
    image: "/assets/images/blog/koshari_egyptian_1789552618196.jpg",
    author: "شيف تمارا",
    readTimeMin: 4
  },
  {
    titleAr: "سر طشة الملوخية المصرية",
    titleEn: "The Secret of the Egyptian Molokhia Tasha",
    slug: "egyptian-molokhia",
    excerptAr: "الملوخية ليست مجرد طبق، بل هي طقس مصري! تعرف على سر الطشة التي تمنحها طعمها المميز.",
    excerptEn: "Molokhia is not just a dish, it's an Egyptian ritual! Learn the secret of the 'Tasha' that gives it its distinct taste.",
    contentAr: "لا يكتمل المطبخ المصري بدون الملوخية. سر نجاح هذا الطبق يكمن في 'الطشة'، وهي عبارة عن الثوم المفروم والكزبرة الجافة المحمرة في السمن البلدي. رائحة الطشة تكفي لفتح الشهية. تُقدم عادة مع الأرز بالشعيرية والدجاج المحمر.",
    contentEn: "The Egyptian kitchen is incomplete without Molokhia. The secret to its success lies in the 'Tasha'—minced garlic and dry coriander roasted in ghee. It's usually served with vermicelli rice and roasted chicken.",
    image: "/assets/images/blog/molokhia_egyptian_1789552640646.jpg",
    author: "شيف تمارا",
    readTimeMin: 5
  },
  {
    titleAr: "المحشي المشكل: ملك العزومات",
    titleEn: "Mixed Mahshi: The King of Banquets",
    slug: "egyptian-mahshi",
    excerptAr: "كيفية تحضير أفضل محشي مصري بخلطة الأرز المبهرة والصلصة الغنية، الطبق الرسمي في عزوماتنا.",
    excerptEn: "How to prepare the best Egyptian Mahshi with spiced rice mixture and rich sauce, the official dish for our banquets.",
    contentAr: "المحشي المصري يختلف عن أي محشي آخر بفضل الخلطة السرية التي تعتمد على الطماطم الطازجة، البصل، والكثير من الخضرة (الشبت والكزبرة والبقدونس). سواء كان محشي كرنب، ورق عنب، أو كوسة وباذنجان، فهو دائماً يخطف الأنظار على مائدة الطعام.",
    contentEn: "Egyptian Mahshi stands out thanks to its secret stuffing made of fresh tomatoes, onions, and lots of greens. Whether it's cabbage, vine leaves, or zucchini, it always steals the show.",
    image: "/assets/images/blog/mahshi_egyptian_1789552652627.jpg",
    author: "شيف تمارا",
    readTimeMin: 6
  },
  {
    titleAr: "الشاورما المصرية.. مذاق لا يقاوم",
    titleEn: "Egyptian Shawarma.. Irresistible Taste",
    slug: "egyptian-shawarma",
    excerptAr: "ما الذي يميز الشاورما المصرية عن غيرها؟ اكتشف التتبيلة الخاصة وطريقة التقديم المميزة.",
    excerptEn: "What makes Egyptian Shawarma unique? Discover the special marinade and distinctive serving style.",
    contentAr: "الشاورما المصرية لها طابع خاص، حيث يتم تتبيل شرائح اللحم أو الدجاج بمزيج من البهارات الشرقية والبصل والطماطم. تقدم غالباً في خبز 'الكايزر' أو الخبز الفينو مع الطحينة الغنية. إنها وجبة الشارع المفضلة للكثيرين.",
    contentEn: "Egyptian Shawarma has a special character, marinated with oriental spices, onions, and tomatoes. Often served in soft buns with rich tahini sauce.",
    image: "/assets/images/blog/shawarma_egyptian_1789552661856.jpg",
    author: "شيف تمارا",
    readTimeMin: 4
  },
  {
    titleAr: "الفول والفلافل: إفطار المصريين الأيقوني",
    titleEn: "Ful and Falafel: The Iconic Egyptian Breakfast",
    slug: "ful-and-falafel",
    excerptAr: "رحلة في عالم الإفطار المصري الأصيل وتاريخ الفول المدمس والطعمية المقرمشة.",
    excerptEn: "A journey into the authentic Egyptian breakfast and the history of slow-cooked fava beans and crispy Taameya.",
    contentAr: "لا يبدأ صباح المصريين بدون طبق الفول المدمس بالزيت الحار والليمون، وقرص الطعمية (الفلافل المصرية) المصنوعة من الفول المجروش والخضرة الطازجة. هذا الفطور لا يمنحك الطاقة فحسب، بل يمنحك السعادة.",
    contentEn: "An Egyptian morning doesn't start without a plate of slow-cooked fava beans and Taameya made from split fava beans and fresh greens.",
    image: "/assets/images/blog/falafel_egyptian_1789552692988.jpg",
    author: "شيف تمارا",
    readTimeMin: 3
  },
  {
    titleAr: "عشاق المكرونة بالبشاميل.. هذا المقال لكم",
    titleEn: "Macarona Béchamel Lovers.. This is for You",
    slug: "macarona-bechamel",
    excerptAr: "كيف تحصل على صينية مكرونة بالبشاميل مثالية بطبقة ذهبية مقرمشة وحشوة لحم مفروم غنية؟",
    excerptEn: "How to get the perfect Macarona Béchamel with a crispy golden layer and rich minced meat filling?",
    contentAr: "المكرونة بالبشاميل هي نجمة العزومات. السر يكمن في توازن صوص البشاميل الكريمي مع تعصيجة اللحم المفروم المتبلة بالقرفة ورشة جوزة الطيب. الطبقة الذهبية المحمرة في الفرن هي أكثر جزء ينتظره الجميع.",
    contentEn: "Macarona Béchamel is the star of gatherings. The secret lies in balancing the creamy béchamel sauce with the spiced minced meat.",
    image: "/assets/images/blog/macarona_bechamel_1789552706282.jpg",
    author: "شيف تمارا",
    readTimeMin: 5
  },
  {
    titleAr: "الحواوشي الإسكندراني والبلدي.. أيهما تفضل؟",
    titleEn: "Alexandrian vs. Baladi Hawawshi.. Which do you prefer?",
    slug: "hawawshi-egypt",
    excerptAr: "مقارنة بين أنواع الحواوشي في مصر وأسرار تتبيلة اللحم التي تجعله شهياً للغاية.",
    excerptEn: "A comparison between the types of Hawawshi in Egypt and the secrets of the meat marinade that makes it so delicious.",
    contentAr: "الحواوشي هو مزيج ساحر من اللحم المفروم المتبل بالبصل والفلفل الحار، يُخبز داخل رغيف خبز بلدي حتى يصبح مقرمشاً، أو يُعجن في عجينة طازجة في حالة الحواوشي الإسكندراني. كلاهما يقدم مع المخللات وسلطة الطحينة لتكتمل الوجبة.",
    contentEn: "Hawawshi is a magical mix of minced meat spiced with onions and hot peppers, baked inside crispy baladi bread.",
    image: "/assets/images/blog/hawawshi_egyptian_1789552721066.jpg",
    author: "شيف تمارا",
    readTimeMin: 4
  },
  {
    titleAr: "الفتة المصرية بالخل والثوم.. طعم الأصالة",
    titleEn: "Egyptian Fatteh with Vinegar and Garlic.. Taste of Authenticity",
    slug: "egyptian-fatteh",
    excerptAr: "الطبق الرئيسي في الأعياد والمناسبات، تعرف على طريقة عمل الفتة المصرية خطوة بخطوة.",
    excerptEn: "The main dish in holidays and occasions, learn how to make Egyptian Fatteh step by step.",
    contentAr: "الفتة هي رمز الاحتفال في مصر. طبقات من الخبز المحمص المغمور بمرق اللحم، يعلوه الأرز الأبيض، وتتوج بالصلصة الحمراء المميزة بالخل والثوم. قطع اللحم المحمرة تكمل هذا اللوحة الفنية الشهية.",
    contentEn: "Fatteh is a symbol of celebration in Egypt. Layers of toasted bread soaked in meat broth, topped with white rice and garlic-vinegar tomato sauce.",
    image: "/assets/images/blog/fatteh_egyptian_1789552755683.jpg",
    author: "شيف تمارا",
    readTimeMin: 5
  },
  {
    titleAr: "الأرز بلبن: الحلو الذي لا يُقاوم",
    titleEn: "Roz Bel Laban: The Irresistible Dessert",
    slug: "roz-bel-laban",
    excerptAr: "كيف تصنع الأرز بلبن المصري بوجه مكرمش وقوام كريمي غني؟ السر لدينا.",
    excerptEn: "How to make Egyptian Roz Bel Laban with a wrinkled top and a rich creamy texture? We have the secret.",
    contentAr: "الأرز بلبن هو الحلوى الأسهل والأكثر شهرة. السر في الحصول على القوام الكريمي والوجه المكرمش مثل المحلات هو استخدام الحليب كامل الدسم، والقشطة البلدية، وترك الخليط يبرد ببطء.",
    contentEn: "Roz Bel Laban is the easiest and most popular dessert. The secret to the creamy texture and wrinkled top is full-fat milk and heavy cream.",
    image: "/assets/images/blog/roz_bel_laban_1789552767060.jpg",
    author: "شيف تمارا",
    readTimeMin: 3
  },
  {
    titleAr: "أم علي: دلال الحلويات المصرية",
    titleEn: "Om Ali: The Pampering of Egyptian Desserts",
    slug: "om-ali-dessert",
    excerptAr: "حلوى أم علي الغنية بالمكسرات والقشطة، القصة وراء الاسم وطريقة التحضير الأفضل.",
    excerptEn: "Om Ali dessert rich in nuts and cream, the story behind the name and the best preparation method.",
    contentAr: "أم علي ليست مجرد حلوى، بل هي قصة تاريخية تحولت لطبق من رقائق العجين أو الكرواسون المخبوز مع الحليب الساخن والمكسرات والزبيب وجوز الهند والقشطة. هي الحلوى المثالية لتدفئة القلوب في ليالي الشتاء.",
    contentEn: "Om Ali is not just a dessert; it's a historical story turned into a dish of pastry flakes baked with hot milk, nuts, raisins, and cream.",
    image: "/assets/images/blog/om_ali_egyptian_1789552777711.jpg",
    author: "شيف تمارا",
    readTimeMin: 4
  }
];

async function main() {
  console.log('Seeding blog posts...');
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log('Successfully seeded 10 blog posts!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
