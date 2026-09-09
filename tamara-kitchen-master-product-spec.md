# مطبخ تمارا — Master Product, UX/UI & Engineering Brief

## 0. تعريف الوثيقة

هذه الوثيقة هي المرجع الأساسي لتصميم وتنفيذ **Mataam/Restaurant Web Experience + PWA/Web App + Admin Dashboard** لمطبخ تمارا.

الوثيقة لا تتعامل مع المشروع كموقع مطعم تقليدي، بل كمنتج رقمي كامل هدفه الأساسي:

1. جعل المستخدم يشتهي الأكل بصريًا.
2. تقليل عدد الخطوات بين الرغبة والطلب.
3. جعل اختيار الحجم/الكمية/المكونات طبيعيًا للأكل، وليس كواجهة ملابس أو متجر عام.
4. تحويل العميل الجديد إلى عميل متكرر.
5. إعطاء الإدارة تحكمًا شبه كامل في المحتوى والعروض والطلبات والإشعارات.
6. بناء تجربة متماسكة جدًا على الموبايل مع Web/Desktop قوي بنفس المستوى.

المرجع البصري الأول المرفق هو صورة **Recipes & Restaurant App Design**: استخدام خلفية داكنة، صورة طبق بطابع Hero مركزي، عناصر جانبية تلمح لوجود عناصر أخرى، بطاقات زجاجية/مظلمة، تنقل سفلي بسيط، وحركة ناعمة. المرجع الثاني هو لوحة الهوية **Modern Egyptian Heritage** التي تحدد الألوان الأساسية والـ typography.

> لا يتم نسخ أي شاشة من المرجع حرفيًا. يتم أخذ مبادئ التكوين، الـ depth، الـ hierarchy، والـ visual rhythm فقط ثم بناء هوية تمارا الخاصة.

---

# 1. القرار الإبداعي النهائي

## 1.1 الفكرة

**Egyptian home food, presented like a premium digital dining experience.**

تمارا يجب أن تبدو كأنها مطبخ مصري أصيل تم تقديمه بروح منتج Luxury Digital حديث، وليس صفحة مطعم تقليدية.

الانطباع المطلوب خلال أول 3–5 ثوانٍ:

> "ده أكل مصري حقيقي، شكله فخم، وجعان وعاوز أطلب." 

لا نريد كثرة مؤثرات بلا وظيفة. كل animation يجب أن يخدم واحدًا من ثلاثة أهداف: جذب العين، توضيح الحالة، أو دفع المستخدم نحو الطلب.

---

# 2. المبادئ غير القابلة للتفاوض

## 2.1 Mobile-first

الموبايل هو المرجع الأول لكل شاشة، لكن لا يسمح ذلك بإخراج Desktop متوسط. كل breakpoint له تصميم مدروس وليس مجرد تكبير لنسخة الموبايل.

## 2.2 Food-first

الصور هي أهم عنصر بصري في المنتج. النص يشرح ويبيع، لكن الصورة هي التي تخلق الشهية.

## 2.3 Native food sizing

حجم الوجبة يغير **المنتج البصري نفسه** وليس مجرد رقم كمية.

مثال:

- ربع فرخة = صورة منتج منفصلة.
- نصف فرخة = صورة منفصلة.
- فرخة كاملة = صورة منفصلة.
- الحجم الأكبر من طبق معين قد يغيّر توزيع المكونات بالكامل.

لا تستخدم صورة واحدة ثم تبديل السعر فقط.

## 2.4 Arabic + English

اللغة الابتدائية تكون تلقائيًا حسب لغة النظام/المتصفح أو إعداد الجهاز، مع إمكانية تغيير اللغة يدويًا.

- Arabic = RTL.
- English = LTR.
- لا توجد عناصر positioned بشكل يعتمد على left/right ثابتة عندما يجب أن تتغير مع RTL.

## 2.5 Light + Dark

الوضع الافتراضي على الموبايل يتبع system preference أول مرة.
بعد ذلك يحفظ اختيار المستخدم.

## 2.6 Glass, not gimmick

استخدام glassmorphism على طبقات محددة: navigation، floating actions، cards المهمة، sheets، modals.
لا يتم تطبيق blur على كل شيء حتى لا تتحول الصفحة إلى ضوضاء بصرية أو مشكلة readability/performance.

## 2.7 Motion with purpose

كل زر يمكن أن يستجيب بحركة صغيرة:

- press scale: تقريبًا 0.98.
- bounce/light rebound عند التأكيد.
- light sweep سريع عندما يكون CTA رئيسيًا.
- transition بين الصفحات/الحالات بمدة قصيرة.

لا توجد animations طويلة تؤخر الطلب.

---

# 3. Brand / Design System

## 3.1 الألوان الأساسية من لوحة الهوية

| Token | Value | الاستخدام |
|---|---|---|
| `--brand-primary` | `#173F35` | اللون الرئيسي، الأزرار، navigation، العناوين المهمة |
| `--brand-secondary` | `#B85C38` | CTA ثانوي، عروض، badges، accents |
| `--brand-tertiary` | `#C69A52` | premium/gold accent، الأسعار المميزة، active indicators |
| `--neutral-50` | `#F7F0E3` | الخلفية الأساسية في Light |

## 3.2 Derived Light palette

- Background: `#F7F0E3`
- Surface: `#FFFDF8`
- Surface elevated: `#FFFFFF`
- Text primary: `#18211E`
- Text secondary: `#66706B`
- Border: `rgba(23,63,53,0.10)`
- Primary: `#173F35`
- Secondary: `#B85C38`
- Gold: `#C69A52`
- Success: `#2E7D57`
- Warning: `#B87B27`
- Error: `#B33A32`

## 3.3 Derived Dark palette

هذه القيم مشتقة من الهوية وليست جزءًا من الصورة الأصلية، ويمكن ضبطها أثناء التنفيذ مع الالتزام بدرجات الهوية:

- Background: `#07110E`
- Surface 1: `#0C1714`
- Surface 2: `#10211C`
- Glass: `rgba(255,255,255,0.055)`
- Glass strong: `rgba(255,255,255,0.085)`
- Text primary: `#F7F0E3`
- Text secondary: `#B9C1BC`
- Border: `rgba(247,240,227,0.11)`
- Primary: `#173F35`
- Secondary: `#B85C38`
- Gold: `#C69A52`

## 3.4 Gradients

لا يتم استخدام gradients على مساحات كبيرة بشكل عشوائي.

الاستخدام الأساسي:

- Logo glow.
- Hero overlays.
- Gold highlight.
- Light sweep على CTA.
- Subtle dark vignette خلف صور الطعام.

Gradient premium مقترح:

`linear-gradient(135deg, #173F35 0%, #0C1714 55%, #B85C38 125%)`

Gold highlight:

`linear-gradient(100deg, transparent 20%, rgba(198,154,82,0.18) 48%, transparent 76%)`

---

# 4. Typography

الهوية المرفقة تعرض:

- Body: IBM Plex Sans Arabic.
- Label: Inter.

نستخدم:

### Arabic
- IBM Plex Sans Arabic Regular 400
- IBM Plex Sans Arabic Medium 500
- IBM Plex Sans Arabic SemiBold 600
- IBM Plex Sans Arabic Bold 700 عند الضرورة

### English / Latin labels
- Inter 400 / 500 / 600 / 700

## 4.1 scale

Mobile:

- Display: 36–44px
- H1: 30–34px
- H2: 24–28px
- H3: 20–22px
- Body large: 17px
- Body: 15–16px
- Small: 13px
- Label: 12px
- Caption: 11px

Desktop:

- Display: 56–72px
- H1: 44–56px
- H2: 32–40px
- H3: 24–28px
- Body: 16–18px
- Label: 12–13px

Line-height:

- Headings: 1.12–1.25
- Body: 1.55–1.75

لا تستخدم أكثر من 2 عائلات Fonts في المشروع.

---

# 5. Spacing / Grid

نستخدم 4px/8px hybrid grid.

المقاسات الأساسية:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

Mobile side padding:

- 16px في شاشات 360–390.
- 20px في 391–430.
- يمكن الوصول إلى 24px على الشاشات الأكبر.

Desktop:

- container max width: 1280–1440px.
- content width الداخلي: 1180–1240px تقريبًا.
- gutter: 24–32px.

لا يتم وضع النص أو الأزرار بمحاذاة حافة الشاشة بدون سبب بصري.

---

# 6. Breakpoints

الحد الأدنى المطلوب:

- 360px
- 375px
- 390px
- 414px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

لا تستخدم breakpoint واحد للموبايل فقط.

يجب اختبار RTL في كل المقاسات المهمة.

---

# 7. Assets structure

يتم وضع الملفات في:

```text
assets/
  tamara_logo_1788544990894.png
  wh_logo_mt.*
```

## استخدام الملفات

### `tamara_logo_1788544990894.png`

- Logo الأساسي.
- يستخدم في splash، navbar، footer، app shell.
- لا يتم تغيير الـ proportions.
- يسمح له glow خفيف في dark mode فقط.

### `wh_logo_mt`

الفيديو المقدم من المستخدم، ويستخدم كـ premium visual asset حسب محتواه، خصوصًا في hero أو intro storytelling.

لا يتم إجبار الفيديو على autoplay بالصوت.

عند autoplay:
- muted
- playsInline
- loop عند الحاجة
- poster image إلزامية
- fallback إلى صورة ثابتة إذا لم يتم تشغيل الفيديو.

---

# 8. Global Experience / App Shell

## 8.1 Splash Screen

أول شاشة عند فتح التطبيق/الويب app shell.

### العناصر

1. Background كامل الشاشة.
2. Logo تمارا في المنتصف.
3. motion logo المجهز مسبقًا من After Effects.
4. subtle ambient glow.
5. بعد انتهاء الحركة: transition ناعم إلى Home.

### Timing

- لا نسمح بأن تصبح splash عائقًا للطلب.
- max target: حوالي 1.5–2.0s بصريًا، ويمكن تجاوزها فقط إذا لم يكتمل تحميل الـ critical app shell.

### Loading state

لو الشبكة بطيئة:

- يظهر الـ logo motion.
- يظهر progress indicator بسيط جدًا.
- لا تظهر شاشة بيضاء.

---

# 9. Global Top Announcement Bar

شريط رفيع جدًا فوق كل صفحات الموقع الرئيسية.

مثال:

> اطلب بأكثر من 500 درهم واحصل على توصيل مجاني ✨

أو:

> خصم 5% على أول طلبك — استخدم كود TAMARA5

## التحكم

الإدارة تحدد:

- النص بالعربية.
- النص بالإنجليزية.
- icon.
- نوع العرض.
- start date.
- end date.
- priority.
- background style.
- CTA optional.
- active/inactive.

## الحركة

- marquee/slide خفيف في حالة النص الطويل.
- transition عند تغير الرسالة.
- زر close اختياري.
- لو أغلقه المستخدم، يمكن حفظ الحالة محليًا لمدة تحددها الإدارة.

لا يتحرك بسرعة تزعج المستخدم.

---

# 10. Landing Page — الصفحة الأهم

Landing Page ليست صفحة تعريفية فقط. هي conversion engine.

ترتيب الصفحة المقترح:

1. Splash/initial reveal.
2. Announcement bar.
3. Main navigation.
4. Hero.
5. Exclusive offers rail.
6. Quick categories.
7. Signature meals / best sellers.
8. Interactive meal-size storytelling.
9. Egyptian home food story.
10. Monthly / half-month meal packages.
11. Freezer/prepared food section.
12. Social proof / ratings.
13. Delivery/value proposition.
14. App download / web-app CTA.
15. FAQ.
16. Footer.

لا يجب أن يكون كل section بنفس الشكل؛ الهدف أن يشعر المستخدم بأن الصفحة تتنفس وتتغير بصريًا.

---

# 11. Navigation — Mobile

## Header

ارتفاع تقريبي: 64–72px.

العناصر:

- Hamburger / menu.
- Logo.
- Notification icon بعد تسجيل الدخول أو icon عام للرسائل عند الحاجة.
- Cart badge.

Header يكون:

- transparent فوق Hero.
- يتحول إلى glass surface عند scroll.
- sticky بعد تخطي جزء من Hero.

## Bottom Navigation

5 عناصر كحد أقصى:

1. الرئيسية.
2. المنيو.
3. زر الطلب/السلة كعنصر بارز.
4. الطلبات.
5. الحساب.

يجب أن يدعم active state واضح جدًا بدون ألوان كثيرة.

زر الطلب يمكن أن يكون أكبر قليلًا، مع gold accent.

---

# 12. Navigation — Desktop

Navbar عرض كامل مع container داخلي.

Left / RTL equivalent:

- logo
- الرئيسية
- المنيو
- العروض
- الباقات
- عن تمارا
- تواصل

Right:

- language switch.
- theme switch.
- account.
- cart.

عند scroll تصبح الـ navbar glassmorphic وتظهر border + shadow خفيف.

---

# 13. HERO — Landing

Hero يجب أن يكون أكثر شاشة مبهرة بعد splash.

## Composition

الخلفية:

- Light: neutral cream + subtle food photography texture.
- Dark: deep green-black.

في المنتصف أو على محور بصري واضح:

- صورة طبق رئيسية عالية الجودة.
- الصورة لها depth وshadow وليس مجرد rectangle.

في desktop يمكن أن تكون الصورة على 45–55% من الـHero، والنص على الجزء الآخر.

في mobile:

- النص مختصر جدًا.
- الصورة تصبح العنصر الأساسي.
- CTA واضح أسفل الصورة.

## Copy

لا تكتب فقرة تسويقية طويلة.

مثال بنائي:

`طعم البيت المصري، أقرب مما تتخيل.`

subtext:

`أكل مصري بيتعمل بطعم البيت ويتوصل طازة في أبوظبي.`

CTA:

`اطلب دلوقتي`

Secondary:

`شوف المنيو`

النص النهائي يجب أن يكون قابلًا للتعديل من Dashboard.

## Hero media

يمكن تغيير hero من dashboard بين:

- image.
- video.
- carousel.

مع تحديد:

- desktop asset.
- mobile asset.
- focal point.
- overlay opacity.
- title/subtitle.
- CTA labels/actions.

---

# 14. Exclusive Offers — أول عنصر بصري متغير

بعد Hero مباشرة أو متداخل معه قليلًا.

التصميم المطلوب شبيه بفكرة "نبرات/شرائح" عروض صغيرة متجاورة:

- العرض الأساسي في المنتصف.
- عروض أخرى تظهر جزئيًا يمين/يسار على mobile.
- على desktop تظهر rail أو cards منظمة.

كل card:

- background image.
- gradient readability layer.
- title.
- micro description.
- price أو discount.
- CTA.
- countdown optional.

## Interaction

Swipe أفقي على mobile.
Drag بسيط.
Snap to card.

عند الانتقال:

- scale card الجديد إلى 1.00.
- neighboring cards حوالي 0.92–0.96.
- opacity أقل قليلًا.

## Dashboard

الإدارة تتحكم في:

- create offer.
- reorder.
- publish/unpublish.
- schedule.
- upload image/video.
- Arabic/English copy.
- discount type.
- discount value.
- minimum order.
- validity.
- CTA.
- target segment.

---

# 15. Quick Categories

صف أفقي على mobile:

- الوجبات.
- المحاشي.
- المشويات.
- الحلويات.
- العروض.
- الباقات.
- الفريزر.

كل category لها icon/mini image وليس icon فقط بالضرورة.

تكون scrollable horizontally.

On tap:
- animated indicator.
- smooth transition إلى menu filtered view.

---

# 16. Best Sellers / Signature Meals

Cards الطعام لا تكون generic e-commerce cards.

## Card anatomy

- صورة الطعام كبيرة.
- اسم الطبق.
- وصف قصير جدًا.
- rating.
- عدد التقييمات.
- starting price.
- size indicator إن وجد.
- CTA سريع.

في mobile:

card عرض 78–88% من viewport ليظهر جزء من العنصر التالي ويشجع على السحب.

في desktop:

3–4 cards في الصف حسب العرض.

## Image behavior

صور الطعام تستخدم object-fit: cover فقط عندما يكون التكوين آمنًا.
الأفضل للصور ذات الأطباق المميزة: contain/transparent cutout + shadow إذا كان الأصل يسمح.

---

# 17. الصفحة الأهم: Product / Meal Detail

هذه الشاشة يجب أن تتبنى فكرة الصورة المرفقة المرجعية.

## 17.1 Hero food stage

في أعلى الشاشة:

- خلفية deep/neutral.
- طبق كبير في منتصف الشاشة.
- صور الأحجام الأخرى تظهر جزئيًا يمين ويسار.

مثال:

```text
[ نصف فرخة ]     [ طبق مختار: نصف فرخة ]     [ فرخة كاملة ]
                  ↓
                 السعر
```

## 17.2 الحجم = أصل بصري مستقل

كل variant له:

- id
- name AR
- name EN
- price
- image
- optional mobile image
- optional 360/video
- availability
- stock status
- nutrition/allergens optional

عند swipe من صورة إلى الصورة التالية:

1. العنصر السابق يتحرك للخارج.
2. العنصر الجديد يتقدم للمنتصف.
3. الصورة نفسها تتغير.
4. السعر يتغير.
5. وصف الحجم يتغير.
6. quantity/add-to-cart controls تظل مستقرة.

لا تستخدم fade-only في الحالات التي توحي بأن الصورة نفسها لم تتغير.

## 17.3 Examples

### Chicken
- ربع فرخة.
- نصف فرخة.
- فرخة كاملة.

### Molokhia
يمكن أن تتغير حسب:
- حجم العبوة.
- فرد/2 أفراد/عائلة.

### Mahashi
يمكن أن تكون الأحجام:
- Small.
- Medium.
- Family.

لكن أسماء الأحجام الفعلية تأتي من الـmenu، وليس hardcoded.

---

# 18. Product page layout

الترتيب:

1. back button.
2. image carousel / stage.
3. rating.
4. name.
5. short description.
6. variant/size selector.
7. add-ons.
8. special instructions.
9. quantity.
10. price.
11. sticky Add to Cart.
12. ingredients/allergens.
13. reviews.
14. related dishes.

Mobile:

زر Add to Cart sticky أسفل الشاشة داخل glass bar.

Desktop:

التصميم two-column:

- left/right بحسب RTL: media.
- opposite: product configuration.

ويجب ألا يضطر المستخدم للـscroll بعيدًا لمجرد إضافة المنتج.

---

# 19. Add-ons / Customization

لا كل المنتجات تحتاج customization.

المجموعة يمكن أن تشمل:

- side.
- sauce.
- extra rice.
- extra molokhia.
- drink.
- dessert.

Admin يحدد لكل product:

- optional.
- required.
- min selection.
- max selection.
- price delta.

مثال:

`اختر الإضافة`

`+ أرز إضافي 5 AED`

`+ صوص 3 AED`

الواجهة يجب أن تعرض السعر قبل وبعد التغيير لحظيًا.

---

# 20. Cart — السلة

السلة يجب أن تكون شديدة الوضوح.

## Cart item

- thumbnail.
- name.
- selected size.
- selected add-ons.
- quantity stepper.
- unit price.
- line total.
- edit.
- remove.

## Smart upsell

بعد وصول المستخدم لعدد مناسب من العناصر:

`ضيف حلو مع الطلب؟`

أو:

`ناقصك 40 AED للتوصيل المجاني.`

هذه الرسالة مرتبطة بالـannouncement/promotion rules من dashboard.

---

# 21. Checkout

لا يوجد دفع Visa فعلي حاليًا.

خيارات الدفع الحالية تعرض فقط طرق الدفع المتاحة فعليًا.

Visa / Card component موجود بصريًا لكن disabled مع النص:

`الدفع بالبطاقة — هيتوفر قريبًا`

لا توحي الواجهة بأن البطاقة تعمل حاليًا.

## Checkout sections

1. customer details.
2. address.
3. location.
4. delivery time.
5. order notes.
6. payment method.
7. promo code.
8. order summary.
9. confirm order.

---

# 22. Address / Location System

نحتاج طريقتين:

## A. Manual address

Fields:

- Emirate.
- Area.
- Street.
- Building/Villa.
- Apartment/Floor optional.
- Landmark optional.
- Recipient name.
- Phone.

## B. Exact map location

زر:

`حدد موقعي على الخريطة`

يستخدم Google Maps / Google Maps Platform أو بديل موثوق حسب البنية النهائية.

الـUX:

1. يفتح map full-screen / sheet.
2. Pin ثابت في المنتصف أو current-location marker.
3. user يحرك الخريطة.
4. reverse geocoding يعرض عنوانًا تقريبيًا.
5. المستخدم يؤكد.
6. تحفظ:
   - lat
   - lng
   - formatted address
   - accuracy عند الإمكان

ممنوع الاعتماد على النص وحده عند وجود geo location.

---

# 23. Delivery Time

خيارات قابلة للإدارة:

- ASAP.
- Scheduled.

لو Scheduled:

- اليوم.
- time slots متاحة فعليًا.

slot calculation يجب أن يأخذ في الاعتبار:

- business hours.
- preparation time.
- delivery lead time.
- blocked periods.
- holidays.

---

# 24. Order Confirmation

بعد الطلب:

- visual success animation.
- order number.
- estimated time.
- selected address.
- summary.
- CTA: متابعة الطلب.
- CTA: العودة للمنيو.

استخدم celebration خفيف جدًا، لا fireworks.

---

# 25. Order Tracking

شاشة الطلب تحتوي timeline:

1. تم استلام الطلب.
2. جارٍ التحضير.
3. خرج للتوصيل.
4. تم التسليم.

كل status له:

- icon.
- timestamp.
- microcopy عربي/إنجليزي.

Order ID واضح ويسهل نسخه.

---

# 26. Ratings & Reviews

نظام تقييم كامل لكل item تم تجربته.

بعد اكتمال الطلب:

- rating order.
- rating لكل منتج.
- optional text.
- photo upload optional.

لا يُسمح للعميل بتقييم منتج لم يظهر ضمن طلب مكتمل إلا لو الإدارة فعلت ذلك صراحة.

## Rating display

- 5 stars.
- average.
- total reviews.
- distribution bars.

مثال:

`4.8 ★ (126 تقييم)`

## Post-purchase review UX

notification بعد فترة مناسبة من التسليم:

`جربت الكشري؟ قيّمه في 10 ثواني.`

لكن لا تزعج العميل برسائل كثيرة.

---

# 27. Home Storytelling

قسم قصصي يشرح لماذا تمارا.

بدل section نصي ثقيل:

- صورة أو video.
- 2–3 نقاط فقط.
- micro copy.

الرسالة:

`أكل بيتي مصري أصيل، متحضر بحب ويوصل لك في أبوظبي.`

يمكن تغيير الصور والنصوص من dashboard.

---

# 28. Monthly & Half-Month Meal Packages

يجب أن يكون لها تجربة مختلفة عن المنتجات المفردة.

## Package card

- package name.
- number of meals.
- duration.
- included items.
- savings.
- delivery rules.
- final price.
- CTA.

مثال:

`باقة 15 وجبة`

يمكن الإدارة تعديل العدد، المحتوى، السعر، الخصم، والمدة من dashboard.

---

# 29. Freezer / Prepared Food

المشروع يتضمن فئة الأطعمة المحضرة للفريزر.

بناءً على ملف prep list المقدم، يوجد توجه نحو تجهيز/تجميد وتحضير سريع لبعض المنتجات، مع عناصر محاشي وأطعمة محشية/متبلة ومقسمة بأوزان وحالات تجهيز مختلفة. هذا يجعل قسم الفريزر منتجًا مستقلًا وليس مجرد category عادية. fileciteturn1file1L125-L155

## UX

Card يظهر:

- الحالة: جاهز للقلي / جاهز للطبخ / مطبوخ / حسب وصف المنتج.
- الوزن.
- الكمية.
- طريقة التحضير.
- مدة التحضير المتوقعة.
- storage instruction optional.

يجب أن تكون هذه المعلومات قابلة للتعديل من Dashboard.

---

# 30. Menu Architecture

اعتمادًا على ملف المينيو المقدم، الأسعار هي بالدرهم الإماراتي، وهناك أحجام/فئات متعددة لبعض العناصر، بالإضافة إلى وجبات كاملة وأصناف مصرية وحلويات وعناصر أخرى. fileciteturn1file0L17-L67

الـmenu يجب ألا يتحول إلى PDF viewer داخل الموقع.

المينيو تتحول إلى **structured database-driven catalog**.

Suggested categories:

- الوجبات.
- الأرز.
- المكرونة.
- المشويات.
- المحاشي.
- الحلويات.
- العزومات / الطلبات الكبيرة.
- الباقات.
- الفريزر.
- عروض حصرية.

القائمة النهائية يجب أن تأتي من الـdatabase/admin.

---

# 31. Large Orders / Catering

ملف المينيو يشير أيضًا إلى قسم للعزومات/الولائم، مع حجز مسبق قبل العزومة بعدة أيام في بعض الحالات، وتنفيذ الأنواع المصرية والحلويات حسب الاتفاق. fileciteturn1file0L70-L75

يجب أن يكون هناك CTA:

`عندك عزومة؟`

يفتح form:

- event date.
- number of guests.
- preferred dishes.
- budget optional.
- delivery area.
- notes.
- phone.

هذا lead منفصل عن order العادي.

---

# 32. Search

Search عالمي.

Mobile:

- full-screen sheet.
- input ثابت أعلى الشاشة.
- recent searches.
- trending dishes.

Desktop:

- command-style search overlay.

Search across:

- products.
- categories.
- offers.
- packages.
- blog.

Search results يجب أن تعرض الصور أولًا، خاصة على mobile.

---

# 33. Account

## Profile

- name.
- phone.
- email.
- default address.
- language.
- theme.
- notification permissions.

## Orders

- active.
- completed.
- cancelled.

## Favorites

قائمة الطعام المفضلة.

## Reviews

كل التقييمات المكتوبة من المستخدم.

---

# 34. Push Notifications

ميزة أساسية وليست إضافة ثانوية.

في أول استخدام فعلي مناسب:

`حابين نبلغك بأوردراتك والعروض الجديدة؟`

ثم طلب notification permission عبر browser/PWA APIs أو native wrapper حسب التنفيذ النهائي.

لا نطلب permission قبل أن يفهم المستخدم سبب الطلب.

## Notification types

- Order confirmed.
- Order preparing.
- Out for delivery.
- Delivered.
- New offer.
- Flash offer.
- New menu item.
- Re-engagement.
- Review reminder.
- Abandoned cart optional.

## Dashboard composer

الإدارة تقدر تعمل Notification:

- Title AR.
- Body AR.
- Title EN.
- Body EN.
- Image optional.
- Deep link.
- audience.
- schedule.
- active/inactive.

### Targeting

Audience examples:

- all users.
- first-time customers.
- users who ordered chicken.
- inactive 30 days.
- users in Abu Dhabi area.
- users who have app notifications enabled.

لا تنفذ targeting فعليًا إلا لو البيانات المطلوبة موجودة في analytics/database.

---

# 35. PWA / Web App behavior

الهدف أن يشعر المستخدم أن الموقع تطبيق.

Features:

- installable PWA.
- service worker.
- app shell caching.
- offline fallback page.
- web push where supported.
- add-to-home-screen prompt at suitable time.

يجب أيضًا وجود CTA داخل الموقع:

`حمّل تجربة تمارا على موبايلك واحصل على 5% على أول طلب.`

لكن يتم صياغتها بما يتوافق مع القناة الفعلية المتاحة.

---

# 36. 5% First Order Offer

يتم إنشاء campaign rule:

`FIRST_ORDER_5`

Conditions:

- user has zero completed orders.
- promo active.
- optional minimum order.

Admin controls:

- percentage.
- start/end.
- minimum order.
- max discount.
- eligible users.

CTA في الموقع لا تكون hardcoded.

---

# 37. Smart Free Delivery Rule

مثال:

`FREE_DELIVERY_OVER_500`

Rule engine يجب أن يسمح:

- threshold.
- currency.
- zones.
- days.
- start/end.
- delivery method.

على Cart:

`باقي 65 AED وتاخد التوصيل مجانًا.`

هذه رسالة conversion مهمة.

---

# 38. Promotions Engine

كل Promotion object يحتوي:

```text
id
name
status
type
value
min_order
max_discount
start_at
end_at
coupon_code
eligible_segments
categories
products
stackable
priority
banner_asset
cta
```

Types:

- percentage discount.
- fixed discount.
- free delivery.
- BOGO optional.
- bundle pricing.
- first order.

---

# 39. Admin Dashboard — نظرة عامة

Dashboard يجب ألا تكون مجرد CRUD بدائي.

Home dashboard:

- Today sales.
- Orders today.
- Pending orders.
- Active users.
- Conversion rate.
- Average order value.
- Top products.
- Low availability items.
- Campaign performance.
- Notification performance.

---

# 40. Admin — Orders

Table / board يحتوي:

- order number.
- customer.
- phone.
- total.
- payment.
- address.
- delivery slot.
- status.
- timestamp.

Order detail:

- customer.
- all items.
- selected size/variants.
- notes.
- map.
- timeline.
- WhatsApp shortcut.
- print/preparation view.

Order statuses يجب أن يكون لها role permissions.

---

# 41. WhatsApp order handoff

الطلب يجب أن يسجل في النظام أولًا ثم يمكن إرسال نسخة منظمة إلى WhatsApp.

Message template example:

```text
طلب جديد — مطبخ تمارا

رقم الطلب: TM-10482
العميل: ...
الهاتف: ...
العنوان: ...

1 × نصف فرخة
الحجم: ...
الإضافات: ...

الإجمالي: 145 AED
الدفع: عند الاستلام
الوقت: ASAP
```

WhatsApp ليس database بديلًا. الـdatabase هو المصدر الأساسي للحقيقة.

---

# 42. Admin — Menu Management

كل Product يجب أن يكون structured.

Fields:

- Name AR.
- Name EN.
- Slug.
- Description AR.
- Description EN.
- Category.
- Images.
- Mobile image.
- Variants.
- Price.
- Availability.
- Tags.
- Ingredients.
- Allergens.
- Add-ons.
- Rating aggregate.
- Featured.
- Bestseller.
- New.
- Sort order.

## Variant system

```text
Product
  └── Variants
       ├── Variant name
       ├── Variant image
       ├── price
       ├── availability
       └── optional metadata
```

هذا هو الجزء الأساسي لضمان اختلاف شكل الطبق مع اختلاف الحجم.

---

# 43. Admin — Homepage Builder

بدل تغيير الكود كل مرة، الإدارة تتحكم في sections.

Section types:

- Hero.
- Offer rail.
- Category rail.
- Product carousel.
- Story block.
- Video block.
- Package block.
- Review block.
- FAQ.
- CTA.

لكل section:

- visibility.
- order.
- theme.
- background.
- content AR/EN.
- assets.
- CTA.
- schedule.

هذا يجعل الصفحة "حية" ويمكن تغييرها بدون developer.

---

# 44. Admin — Banner / Offers

Create/edit/delete/schedule banners.

الـbanner قد يكون:

- full-width.
- compact strip.
- hero card.
- carousel card.

يتم تحديد crop/focal point لكل asset لتجنب قص طبق الطعام بشكل سيئ.

---

# 45. Admin — Reviews

Dashboard للتقييمات:

- all.
- pending moderation.
- published.
- hidden.
- reported.

يمكن الرد على review.

يجب عدم التلاعب بالrating المتوسط يدويًا.

---

# 46. Admin — Notifications Center

تبويب كامل بعنوان:

`Notifications`

يحتوي:

- Compose.
- Scheduled.
- Sent.
- Drafts.
- Templates.
- Audience.
- Analytics.

Analytics:

- sent.
- delivered.
- opened.
- converted.

---

# 47. Admin — Customers

Customer 360 view:

- profile.
- total orders.
- total spend.
- average order value.
- favorite categories.
- last order.
- active coupons.
- notification status.
- addresses.
- reviews.

---

# 48. Admin — Analytics

الأحداث الرئيسية:

```text
page_view
hero_cta_click
offer_view
offer_click
product_view
variant_change
add_to_cart
remove_from_cart
checkout_started
address_selected
location_confirmed
order_created
order_paid
order_completed
review_submitted
notification_opened
pwa_installed
```

هذه الأحداث ضرورية لفهم أين يخسر الـfunnel العملاء.

---

# 49. Funnel

الـprimary funnel:

```text
Landing
  ↓
Offer/Menu
  ↓
Product View
  ↓
Variant Selection
  ↓
Add To Cart
  ↓
Cart
  ↓
Checkout
  ↓
Address / Map
  ↓
Confirm
  ↓
Order Tracking
  ↓
Review
  ↓
Repeat Order
```

يجب أن نستطيع معرفة drop-off في كل خطوة.

---

# 50. Visual Interaction Rules

## Buttons

Primary button:

- radius 14–18px mobile.
- height 48–56px.
- font 15–16px.
- subtle inner highlight.

Hover desktop:

- translateY -1px.
- slight shadow.
- light sweep optional.

Press:

- scale 0.985–0.98.
- 100–140ms.

## Cards

radius 18–28px حسب الحجم.

لا تجعل كل شيء card.

Cards المهمة تستخدم:

- border 1px.
- backdrop blur.
- translucent surface.
- shadow بسیار subtle.

---

# 51. Glassmorphism Specification

Glass component:

```text
background: rgba(255,255,255,0.06)
backdrop-filter: blur(18px)
border: 1px solid rgba(255,255,255,0.10)
box-shadow: 0 14px 50px rgba(0,0,0,0.18)
```

Light equivalent must remain readable and should not look like frosted grey boxes.

Glass is forbidden on:

- long text paragraphs.
- huge content areas.
- every list item.

---

# 52. Light Sweep

Primary CTA يمكن أن يحصل على sweep every few seconds فقط عندما يكون ذلك مفيدًا.

مثال:

- diagonal highlight من left-to-right في LTR.
- automatically mirror في RTL.
- duration 750–950ms.
- idle period عدة ثوانٍ.

لا تضع sweep على كل زر.

---

# 53. Page Transition

بين الـroutes:

- opacity + translateY 6–10px.
- duration 180–260ms.
- ease-out.

صور المنتجات لا تعيد تحميل نفسها عند كل transition إن كان يمكن الحفاظ عليها في cache/state.

---

# 54. Bottom Sheets

تستخدم لـ:

- filters.
- address.
- product customization.
- language.
- theme.
- notifications preferences.

Mobile sheet:

- top radius 28px.
- drag handle.
- max-height ~92vh.
- scroll داخلي.

Desktop تتحول غالبًا إلى centered modal حسب المحتوى.

---

# 55. Microinteractions

### Add to cart

المنتج يتحرك visually toward cart icon بشكل قصير جدًا، ثم badge ينبض مرة واحدة.

### Favorite

heart/icon يتحول بحركة scale + spring.

### Variant change

الصورة تتحرك مع direction based transition.

### Quantity

زر + و– يعطي tiny bounce.

### Success

Checkmark stroke animation قصيرة.

---

# 56. Accessibility

الهدف WCAG AA على الأقل.

- contrast مناسب.
- keyboard navigation على desktop.
- visible focus ring.
- aria-labels للأيقونات.
- buttons لا تكون icon-only بدون label accessible.
- text لا يعتمد على اللون فقط.
- reduced-motion preference يجب احترامها.

إذا كان المستخدم فعل `prefers-reduced-motion`:

- أوقف sweeps.
- قلل transitions.
- أوقف parallax.

---

# 57. Performance

الصور هي أكبر risk.

يجب:

- WebP/AVIF عند الإمكان.
- responsive image sizes.
- lazy-load تحت fold.
- preload hero asset فقط.
- poster للفيديو.
- لا تشغل الفيديو الكبير على mobile إذا كان الاتصال ضعيفًا.
- code splitting.
- route-level lazy loading.

Target:

- fast first visual.
- no layout shift واضح.
- cart interactions instant.

---

# 58. SEO

Landing Page لها SSR/SEO friendly structure.

Metadata عربي/إنجليزي.

Open Graph image قابلة للتغيير.

Structured data:

- Restaurant.
- Product.
- Offer.
- AggregateRating عند توفر الشروط المناسبة.

URLs نظيفة:

```text
/menu
/menu/grills
/menu/chicken/half-chicken
/offers
/packages
/freezer
/orders
/account
```

Arabic slugs يمكن تجنبها لتبسيط التكامل، مع عرض عربي كامل داخل المحتوى.

---

# 59. Localization Architecture

كل content object يخزن:

```json
{
  "ar": "...",
  "en": "..."
}
```

لا توجد strings مهمة hardcoded داخل components.

نحتاج أيضًا locale-aware:

- numbers.
- dates.
- currency.
- direction.

Currency:

`AED`

Display:

`145 AED` أو صيغة locale المناسبة مع الاتساق الكامل عبر النظام.

---

# 60. Theme Architecture

Theme tokens يجب أن تكون CSS variables / design tokens.

لا نعيد كتابة styles كاملة في Dark.

نبدل:

- background tokens.
- surfaces.
- text.
- border.
- shadow.
- media treatments.

User choice stored locally and optionally in account profile.

---

# 61. Authentication

الحد الأدنى:

- phone.
- OTP optional.
- email optional.
- password/account flow إذا لزم.

أفضل تجربة لمطعم mobile-first: phone-first authentication، مع email اختياري.

لا نجبر الزائر على إنشاء حساب قبل رؤية المنيو.

يمكن السماح بالـguest cart، ثم طلب بيانات أساسية قبل إنشاء الطلب حسب القرار التجاري النهائي.

---

# 62. Data model — core

## Users

```text
id
name
phone
email
language
theme
created_at
last_active_at
notification_opt_in
```

## Addresses

```text
id
user_id
label
emirate
area
street
building
apartment
landmark
lat
lng
formatted_address
is_default
```

## Categories

```text
id
name_ar
name_en
slug
image
sort_order
active
```

## Products

```text
id
category_id
name_ar
name_en
description_ar
description_en
base_image
mobile_image
active
featured
bestseller
sort_order
```

## Product Variants

```text
id
product_id
name_ar
name_en
price
image
mobile_image
active
sort_order
```

## Addons

```text
id
name_ar
name_en
price
```

## Product Addon Groups

```text
product_id
addon_group_id
required
min_select
max_select
```

## Orders

```text
id
order_number
user_id
status
subtotal
discount
delivery_fee
total
payment_method
payment_status
address_snapshot
lat
lng
scheduled_for
notes
created_at
```

## Order Items

```text
id
order_id
product_id
variant_id
name_snapshot
variant_snapshot
unit_price_snapshot
quantity
addons_snapshot
line_total
```

Snapshot fields مهمة حتى لا تتغير فاتورة الطلب القديم عندما تغير الإدارة المنتج.

---

# 63. Promotion / Banner / Homepage data

كل عنصر content يجب أن يحتوي على:

- status.
- created_at.
- updated_at.
- created_by.
- publish_at.
- unpublish_at.

حتى يمكن audit trail.

---

# 64. Admin roles

Roles مقترحة:

- Super Admin.
- Manager.
- Content Manager.
- Order Manager.
- Marketing Manager.

كل role له permissions دقيقة.

---

# 65. Security

- Validate all server inputs.
- Server-side authorization.
- Rate limiting على auth/order endpoints.
- Signed URLs أو protected upload paths عند الحاجة.
- Sanitize rich text.
- لا تخزن payment information حساسة.
- لا تعتمد على client-side price.

السعر النهائي يجب أن يحسب من server/database.

---

# 66. Future Card Payment

الهيكل من البداية يسمح بإضافة card payments لاحقًا بدون إعادة بناء checkout بالكامل.

Payment provider abstraction:

```text
PaymentMethod
  ├── CashOnDelivery
  └── Card (future)
```

الواجهة الحالية تعرض:

`بطاقات الائتمان — هيتوفر قريبًا`

وتكون disabled لكن أنيقة.

---

# 67. Notification permission UX

لا تظهر نافذة permission browser مباشرة في أول ثانية.

First-party explainer داخل التطبيق:

`فعّل الإشعارات عشان تعرف طلبك وصل لفين، وتوصلك العروض اللي تهمك.`

CTA:

`تفعيل الإشعارات`

Secondary:

`مش دلوقتي`

ثم نستدعي permission API عندما يكون المستخدم قد تفاعل.

---

# 68. Empty states

كل شاشة تحتاج empty state حقيقية.

Examples:

### Cart empty

صورة/illustration صغيرة لطعام.

`السلة فاضية… نملأها بحاجة تحبها؟`

CTA `شوف المنيو`

### Orders empty

`لسه مفيش طلبات.`

CTA `أول طلب علينا.`

### Favorites empty

`احفظ الأكل اللي هتطلبه تاني.`

---

# 69. Error states

لا تظهر رسائل تقنية.

مثال:

`حصلت مشكلة بسيطة. جرّب تاني.`

مع retry.

في checkout إذا فشل submit:

- لا تضيع البيانات.
- لا تكرر إنشاء الطلب.
- idempotency على server.

---

# 70. Skeleton loaders

Skeletons يجب أن تحاكي شكل العنصر النهائي.

لا تستخدم spinner وحده لصفحات menu الطويلة.

Hero يفضل له poster/placeholder حقيقي وليس skeleton رمادي.

---

# 71. Landing Page exact responsive behavior

## 360–390px

- side padding 16px.
- Hero image dominates viewport.
- CTA full width.
- offers horizontal scroll.
- product cards ~84vw.
- bottom nav fixed.

## 414–430px

- padding 20px.
- Hero أكثر اتساعًا.
- offer card يمكن أن يصل 78–82vw.
- product card 80–84vw.

## 768px

- tablet composition.
- bottom nav يمكن أن تتحول إلى desktop-ish header.
- 2 product columns.

## 1024px

- full desktop header.
- 3 columns.

## 1280+

- max width container.
- Hero two-column.
- 4 item grid في sections المناسبة.

## 1440+

زيادة الفراغ لا زيادة أحجام كل شيء بشكل مبالغ.

---

# 72. Desktop landing art direction

على Desktop لا نريد صفحة "موبايل مكبر".

Hero يمكن أن يمتد عبر مساحة كبيرة مع:

- big food image.
- background depth.
- copy panel.
- floating glass card للعرض.

يمكن استخدام overlap بين sections:

- Hero image يتداخل قليلًا مع offer rail.
- cards لها z-depth.

لكن لا يجب أن تصبح الصفحة متاهة layering.

---

# 73. Food Photography Direction

الصورة المثالية:

- top-down أو 45-degree حسب الطبق.
- background متوافق مع theme.
- highlight على الطعام.
- no distracting props.
- realistic texture.
- authentic Egyptian portions.

للطبق الذي يتغير حجمه:

كل variant يصور بطريقة متقاربة جدًا من زاوية وتكوين الكاميرا نفسها حتى يكون transition مقنعًا، مع تغيير الكمية الفعلية في الصورة.

---

# 74. Image CMS

Admin upload يجب أن يسمح:

- asset.
- alt text AR.
- alt text EN.
- focal point X/Y.
- crop presets.
- mobile variant.
- status.

هذا مهم جدًا لأن صورة طبق كبيرة لا يمكن قصها عشوائيًا في banner.

---

# 75. Blog / Content

Blog موجود لأن المشروع سبق الاتفاق عليه، لكنه ليس محور الـconversion.

يمكن استخدامه لـ:

- حكايات أكل مصري.
- قصص أطباق.
- نصائح تخزين/تحضير.
- أخبار تمارا.

الـblog يجب ألا يطغى على menu.

---

# 76. FAQ

أسئلة مثل:

- مناطق التوصيل.
- مواعيد العمل.
- الدفع.
- الطلبات الكبيرة.
- الفريزر.
- استرجاع/إلغاء.
- وقت التوصيل.

كلها CMS editable.

---

# 77. Footer

## Mobile

Accordion groups.

## Desktop

4 columns تقريبًا:

- تمارا.
- المنيو.
- المساعدة.
- تواصل.

ثم:

- language.
- social links.
- legal.
- copyright.

Footer لا يكون مزدحمًا.

---

# 78. Landing page conversion rules

كل viewport رئيسي يجب أن يكون فيه path واضح للطلب.

أمثلة:

- Hero CTA.
- floating cart.
- sticky mobile order action.
- offer CTA.
- best seller CTA.
- package CTA.
- final CTA.

لكن لا تجعل كل العناصر تصرخ "اطلب" في نفس اللحظة.

---

# 79. Recommendation engine — المرحلة الأولى

حتى بدون AI حقيقي، نقدر نعمل rules:

- Best seller.
- Similar category.
- Frequently ordered together.
- Based on last category.

مثال:

بعد طلب مشويات:

`ممكن يعجبك معها…`

---

# 80. Abandoned cart

بعد فترة configurable:

- in-app reminder.
- push notification إذا permission متاحة.

Copy:

`الطلب اللي سبتُه لسه مستنيك 🍽️`

لكن لا ترسل إذا السعر/التوفر تغير بطريقة تجعل الرسالة مضللة.

---

# 81. Reorder

في completed order:

زر:

`اطلب نفس الطلب مرة تانية`

يجب إعادة التحقق من:

- availability.
- current prices.
- current variants.
- current promotion rules.

لا تنسخ الأسعار القديمة كأنها current.

---

# 82. Home personalization

بعد معرفة العميل:

Home قد تعرض:

`مرحبًا محمود 👋`

ثم:

`تحب تطلب إيه النهارده؟`

مع آخر طلب / favorites.

للزائر الجديد:

Hero عام بدون personalization.

---

# 83. Visual hierarchy score

كل شاشة يجب تقييمها قبل التسليم:

1. أين تنظر العين أولًا؟
2. أين CTA الأساسي؟
3. هل السعر واضح؟
4. هل الصورة شهية؟
5. هل المستخدم يعرف ماذا يفعل بعد ذلك؟

إذا كانت الإجابة غير واضحة خلال 2–3 ثوانٍ يجب إعادة ترتيب الشاشة.

---

# 84. Component Library

يجب بناء components قابلة لإعادة الاستخدام:

```text
AppShell
AnnouncementBar
GlassHeader
BottomNav
Hero
OfferRail
CategoryRail
FoodCard
FoodStage
VariantCarousel
VariantSelector
AddonGroup
RatingStars
ReviewCard
PriceBlock
QuantityStepper
StickyCTA
CartDrawer
CheckoutForm
AddressCard
MapPicker
OrderTimeline
NotificationComposer
ThemeSwitcher
LanguageSwitcher
Modal
BottomSheet
Toast
Skeleton
EmptyState
```

لا تبن كل صفحة كجزيرة مستقلة.

---

# 85. Content Management principle

كل شيء يتغير كثيرًا يجب أن يكون CMS controlled.

Admin editable:

- hero.
- offers.
- banners.
- products.
- prices.
- variants.
- category order.
- packages.
- announcement bar.
- notifications.
- reviews moderation.
- FAQ.
- blog.
- delivery rules.
- promotions.
- homepage section order.

---

# 86. What must NOT be hardcoded

ممنوع hardcode:

- product prices.
- product names.
- offers.
- free delivery threshold.
- first-order discount.
- announcement text.
- delivery windows.
- category order.
- notification copy.
- card availability.
- hero content.

---

# 87. Initial database seed

لا يتم ملء كل المنتجات يدويًا داخل components.

يتم تجهيز seed/import structure للمينيو الحالية، ثم الإدارة تعدل من dashboard.

بعض بيانات المينيو الحالية تشمل وجبات كاملة، أرز معمر بأكثر من نوع بروتين، مكرونات بشاميل/جلاش، وأصناف وحلويات أخرى بحسب ملف الأسعار المقدم. fileciteturn1file0L34-L67

---

# 88. Order creation integrity

عند إنشاء order:

1. validate customer.
2. validate address.
3. validate all products.
4. validate variant ids.
5. validate addon selections.
6. calculate price server-side.
7. apply promotions.
8. calculate delivery.
9. create order transactionally.
10. return order id.
11. trigger confirmation message/push asynchronously.

---

# 89. Notification architecture

Service abstraction:

```text
NotificationService
  ├── InApp
  ├── WebPush
  └── FutureNativePush
```

حتى لو بدأنا Web/PWA، لا نصمم backend بحيث يمنع native app مستقبلًا.

---

# 90. Future native app readiness

المشروع يمكن لاحقًا تغليفه أو نقل الـfrontend إلى native app بدون إعادة تصميم الـbusiness logic.

يجب فصل:

- API.
- data.
- auth.
- order engine.
- notifications.
- promotions.

عن:

- web presentation.

---

# 91. Analytics / events naming

استخدم أسماء events ثابتة بالإنجليزية، والخصائص يمكن أن تحمل AR/EN display strings.

مثال:

```json
{
  "event": "variant_change",
  "product_id": "123",
  "from_variant": "quarter",
  "to_variant": "half",
  "source": "product_page"
}
```

---

# 92. QA checklist — Visual

قبل اعتبار أي صفحة مكتملة:

- no overflow.
- no cropped Arabic.
- no English/Arabic direction bugs.
- images centered correctly.
- price updates immediately.
- CTA visible.
- fixed bars do not cover content.
- glass readable.
- animation smooth.
- reduced motion works.
- dark mode looks intentionally designed, not inverted.
- light mode maintains premium appearance.

---

# 93. QA checklist — Functional

- language switch.
- theme switch.
- cart persistence.
- product variant persistence.
- address selection.
- map coordinate save.
- checkout validation.
- order creation.
- order status update.
- review authorization.
- push permission flow.
- offer scheduling.
- homepage CMS.
- admin access control.

---

# 94. Landing Page acceptance criteria

Landing تُعتبر ناجحة عندما:

1. المستخدم يفهم خلال ثوانٍ أن تمارا مطبخ مصري.
2. الطعام يحتل الأولوية البصرية.
3. الـCTA الأساسي ظاهر بدون بحث.
4. العروض يمكن تغييرها من dashboard.
5. الموقع responsive حقيقي.
6. dark/light متماسكين.
7. AR/EN متماسكتين.
8. كل الصور قابلة للإدارة.
9. الصفحة لا تعتمد على PDF للمينيو.
10. الحركة فخمة وسريعة وليست استعراضية فقط.

---

# 95. Product Page acceptance criteria

1. Variant carousel يعمل بالـswipe.
2. كل variant له صورة أصلية مستقلة.
3. السعر والوصف يتغيران مع variant.
4. الإضافات تحدث total فورًا.
5. Add to Cart واضح.
6. reviews مرئية.
7. mobile sticky CTA لا يغطي المحتوى.
8. desktop layout ممتاز.

---

# 96. Design direction — final visual recipe

استخدم هذا كـvisual north star:

```text
Egyptian heritage
+
Premium editorial food photography
+
Deep emerald
+
Terracotta
+
Muted gold
+
Warm cream
+
Dark cinematic mode
+
Controlled glassmorphism
+
Soft spring microinteractions
+
Large food imagery
+
Minimal copy
+
Strong conversion hierarchy
```

الناتج يجب أن يبدو **premium, warm, edible, confident, modern**.

ليس:

- template restaurant.
- generic Shopify store.
- noisy Arabic website.
- overdone neon glass.
- app clone.

---

# 97. AI / Coding Agent Master Prompt

استخدم النص التالي عند إعطاء المشروع لأداة coding/agent:

> أنت مسؤول عن بناء تجربة رقمية كاملة لمطبخ تمارا، مطبخ أكل مصري بيتي في أبوظبي. لا تتعامل مع المشروع كـtemplate لمطعم. ابنِ نظامًا بصريًا ومنطقيًا متكاملًا يعتمد على الطعام كعنصر بصري رئيسي، وعلى سرعة الطلب كهدف أساسي.
>
> يجب أن يكون التصميم Mobile-first لكن Desktop يجب أن يكون بنفس مستوى الجودة. يجب دعم Arabic RTL وEnglish LTR، وLight Mode وDark Mode، مع اكتشاف اللغة الأولى من لغة الجهاز/المتصفح ثم السماح للمستخدم بالتغيير يدويًا وحفظ اختياره.
>
> استخدم هوية Modern Egyptian Heritage: primary #173F35، secondary #B85C38، tertiary #C69A52، neutral #F7F0E3، مع dark surfaces مشتقة من نفس الهوية. استخدم IBM Plex Sans Arabic للواجهة العربية وInter للـlabels/Latin.
>
> استخدم glassmorphism بعقلانية في navigation، sheets، cart، floating actions والعناصر ذات الأولوية. لا تحول الشاشة كلها إلى زجاج. اجعل الخلفيات عميقة، typography واضحة، والصور هي البطل.
>
> المرجع البصري المرفق لتكوين تطبيق المطعم يُستخدم لاستلهام: الطبق الكبير في المنتصف، صور أخرى تظهر جزئيًا من الجانبين، dark cinematic composition، بطاقات ذات depth، navigation سفلي، وحركة ناعمة. لا تنسخ التصميم حرفيًا؛ أنشئ design system أصلي لتمارا.
>
> استخدم `assets/tamara_logo_1788544990894.png` كـlogo الرئيسي. استخدم video asset `assets/wh_logo_mt` حيث يكون مناسبًا للـhero/storytelling، مع poster وmuted autoplay وfallback image.
>
> نفّذ splash screen حقيقية تستخدم حركة logo المجهزة مسبقًا، ثم transition قصير إلى الـapp shell دون إعاقة المستخدم.
>
> أعلى الصفحة يوجد Announcement Bar رفيع متحرك، لكنه CMS controlled بالكامل. الإدارة يجب أن تستطيع تغيير النص العربي والإنجليزي، نوع العرض، الخصم، الحد الأدنى، تاريخ البداية والنهاية والـCTA.
>
> الـLanding Page يجب أن تتكون من Hero قوي جدًا، Exclusive Offers rail، Categories، Best Sellers، Storytelling، Packages، Freezer section، Ratings، Delivery benefits، App/PWA CTA، FAQ، Footer. اجعل كل section مختلفًا بصريًا مع الحفاظ على نفس النظام.
>
> الـHero يجب أن يكون configurable من Dashboard: image/video، mobile asset، desktop asset، focal point، title، subtitle، CTA، CTA action.
>
> Exclusive Offers يجب أن تعمل كـhorizontal carousel على الموبايل مع cards كبيرة تظهر جزئيًا من اليمين واليسار. كل offer قابل للإدارة من Dashboard.
>
> ابنِ Product Detail كتجربة طعام premium. لا تعامل الحجم مثل variants في الملابس. كل حجم/حصة لها صورة أصلية مستقلة. مثال: ربع فرخة، نصف فرخة، فرخة كاملة. عند الـswipe تتغير الصورة فعليًا، السعر والوصف والبيانات تتغير فورًا، وتتحرك الصورة الجديدة إلى المنتصف. يجب أن تبدو العملية مثل استعراض أطباق حقيقية.
>
> أنشئ Product Variant data model مستقلًا يحتوي الاسم، السعر، الصورة، صورة الموبايل، availability، sort order. لا hardcode variant names داخل components.
>
> ابنِ customization engine للإضافات with min/max/required and price deltas. احسب السعر النهائي server-side.
>
> Cart يجب أن يكون واضحًا جدًا، مع line items، variant، addons، quantity، edit، remove، promotion progress، smart upsell، وsticky CTA على mobile.
>
> Checkout يجب أن يدعم بيانات العميل والعنوان والتوقيت والدفع والقسيمة والخريطة. الدفع بالبطاقة غير متاح حاليًا: اعرضه disabled مع عبارة "هيتوفر قريبًا" ولا تعطي انطباعًا أنه يعمل.
>
> العنوان يجب أن يقبل كتابة يدوية أو تحديدًا دقيقًا من Google Maps. احفظ latitude وlongitude والعنوان النصي، ولا تعتمد على النص فقط.
>
> order flow يجب أن ينشئ رقم طلب فريد، يسجله في قاعدة البيانات، ثم يسمح بإرسال نسخة منظمة عبر WhatsApp. WhatsApp ليس database؛ قاعدة البيانات هي المصدر الأساسي.
>
> نفّذ Order Tracking بتسلسل واضح: received → preparing → out_for_delivery → delivered.
>
> ابنِ Reviews system بحيث يستطيع العميل تقييم كل منتج جربه ضمن الطلب المكتمل، مع average rating، total reviews، distribution، text review، وصورة اختيارية. لا تسمح بتقييم fake items خارج completed orders.
>
> نفّذ Monthly Packages، Half-Month Packages، Freezer/Prepared Foods، وLarge Orders/Catering كأنظمة محتوى واضحة وليست مجرد صور.
>
> ملف المينيو المقدم يحتوي على أسعار بالدرهم الإماراتي وفئات متعددة وأحجام ووجبات كاملة وحلويات، والملف الآخر يحتوي على أصناف وتحضيرات للفريزر. حوّل هذه البيانات إلى database-driven catalog وليس PDF viewer. لا تخترع أسعارًا أو variants غير موجودة في البيانات.
>
> نفّذ PWA app-like behavior: installable، service worker، cache strategy، offline fallback، web push، install CTA، وdeep links.
>
> اطلب permission للإشعارات بعد شرح القيمة للمستخدم، وليس مباشرة عند أول لحظة. أنشئ Notifications Center في Dashboard يستطيع إنشاء إشعارات AR/EN، اختيار audience، الصورة، الرابط، الجدولة، والقوالب، مع analytics sent/delivered/opened/conversion.
>
> Promotions يجب أن تكون rules-based وCMS controlled. يجب أن يدعم النظام 5% first-order discount، free delivery threshold مثل 500 AED، coupon codes، date ranges، min order، max discount، audience، categories/products، stacking policy.
>
> يجب أن يستطيع Dashboard تغيير ترتيب الـhomepage بالكامل، وإضافة/إزالة sections، تغيير hero، banners، offers، categories، products، packages، reviews moderation، FAQ، blog، delivery rules، notifications، promotions.
>
> لا hardcode الأسعار أو النصوص أو العروض أو صور hero أو threshold التوصيل أو notification copy.
>
> build reusable component library تشمل AppShell، AnnouncementBar، GlassHeader، BottomNav، Hero، OfferRail، FoodCard، FoodStage، VariantCarousel، AddonGroup، PriceBlock، StickyCTA، Cart، Checkout، MapPicker، OrderTimeline، Reviews، NotificationComposer، ThemeSwitcher، LanguageSwitcher، Modal، BottomSheet، Toast، Skeleton، EmptyState.
>
> كل حركة يجب أن تكون قصيرة وهادئة: press scale ~0.98، spring/bounce بسيط، light sweep محدود، route transition 180–260ms. احترم prefers-reduced-motion.
>
> أعط الأولوية للصور والأداء. استخدم AVIF/WebP عند الإمكان، responsive images، lazy load، hero preload، poster للفيديو، وavoid layout shift.
>
> كل component يجب أن يعمل RTL بشكل حقيقي، وليس عبر hacks left/right. استخدم logical CSS properties مثل margin-inline, inset-inline-start/end حيثما يلزم.
>
> افصل business logic عن presentation. الـAPI/database/order engine/promotions/notifications يجب أن تكون مستقلة عن واجهة الويب حتى نستطيع إضافة native app لاحقًا.
>
> قبل التسليم، اختبر 360px و390px و430px و768px و1024px و1280px و1440px و1920px، واختبر Arabic RTL وEnglish LTR، Light/Dark، reduced motion، cart، checkout، map، order tracking، reviews، admin، notifications.
>
> معيار النجاح ليس أن المشروع "يعمل" فقط. معيار النجاح أن الشخص يدخل الصفحة، يرى الطعام، يفهم البراند بسرعة، يتحمس للأكل، يجد المنيو، يختار الحجم الصحيح بصريًا، يضيف للسلة، يكمل checkout بأقل احتكاك، ويخرج بتجربة يشعر أنها premium ومتكاملة.

---

# 98. Implementation order

لا تبنِ كل شيء دفعة واحدة.

## Phase 1 — Design Foundation

1. tokens.
2. typography.
3. buttons.
4. glass surfaces.
5. navigation.
6. bottom nav.
7. food cards.
8. product stage.

## Phase 2 — Landing

1. Splash.
2. Announcement.
3. Header.
4. Hero.
5. Offers.
6. Categories.
7. Best sellers.
8. Packages.
9. Story.
10. Reviews.
11. FAQ.
12. Footer.

## Phase 3 — Commerce

1. Product detail.
2. Variants.
3. Addons.
4. Cart.
5. Checkout.
6. Location.
7. Order confirmation.
8. Tracking.

## Phase 4 — Account + Loyalty

1. Profile.
2. Orders.
3. Favorites.
4. Reviews.
5. Reorder.

## Phase 5 — Admin

1. Auth.
2. Orders.
3. Products.
4. Variants.
5. Offers.
6. Homepage builder.
7. Customers.
8. Reviews.
9. Notifications.
10. Analytics.

## Phase 6 — PWA / Push / Performance

1. service worker.
2. install flow.
3. web push.
4. cache.
5. performance.
6. SEO.

---

# 99. Final product statement

**مطبخ تمارا يجب أن يكون موقع طلب طعام يبدو كمنتج digital premium، لا كمنيو إلكتروني.**

كل pixel يجب أن يخدم أحد ثلاثة أشياء:

**شهية → ثقة → طلب.**

والرحلة بأكملها يجب أن تنتهي بشكل طبيعي إلى:

**"اطلب دلوقتي"**.
