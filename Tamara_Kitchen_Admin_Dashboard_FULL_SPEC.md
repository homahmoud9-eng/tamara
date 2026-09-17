# Tamara Kitchen — Admin Dashboard Full Production Specification & Implementation Contract

## DOCUMENT PURPOSE

هذا الملف هو **المواصفة التنفيذية الكاملة** للـ Admin Dashboard الجديدة الخاصة بـ Tamara Kitchen.

الهدف ليس إعادة تصميم شكل الداشبورد فقط، وإنما بناء **Admin / Back Office حقيقي Production-Ready** بحيث تكون كل شاشة وكل زر وكل نموذج وكل عملية CRUD مرتبطة فعليًا بقاعدة البيانات وبالـ public website.

المبدأ الأساسي:

> UI → Validation → Authorization → Server Action / API → Prisma → PostgreSQL → Revalidation → UI/Public Website

قاعدة البيانات الحالية هي **Source of Truth**.

لا يوجد في النظام النهائي:
- Fake CRUD
- Mock business data
- localStorage كبديل لقاعدة البيانات
- Buttons بدون Action
- Forms تظهر نجاحًا بدون حفظ
- بيانات hardcoded بدل PostgreSQL
- حسابات أسعار من الـ browser فقط
- Admin protection بالواجهة فقط

---

# 1. NON-NEGOTIABLE RULES

## 1.1 Production Safety

المشروع Production حقيقي.

ممنوع منعًا باتًا:

```text
prisma migrate reset
DROP DATABASE
DROP TABLE
Database reset
Mass deletion
Destructive migration بدون مراجعة
حذف Orders القديمة بسبب حذف Customer/Product
تغيير Google OAuth/NextAuth بدون سبب مباشر
```

أي Migration جديد يجب أن:
- يحافظ على البيانات الحالية.
- يكون backward-compatible قدر الإمكان.
- لا يكسر العلاقات التاريخية.
- لا يستخدم حذفًا Cascade بشكل غير آمن.

## 1.2 Existing Architecture First

قبل إنشاء أي Model أو API أو Route جديدة:

1. افحص Prisma Schema.
2. افحص العلاقات.
3. افحص الـ existing API routes.
4. افحص Server Actions.
5. افحص الـ auth.
6. افحص طريقة جلب البيانات في الموقع.
7. افحص caching/revalidation.
8. أعد استخدام الموجود إذا كان صالحًا.
9. أصلح الموجود إذا كان قريبًا من المطلوب.
10. أنشئ جديدًا فقط عند الحاجة الحقيقية.

## 1.3 No Fake Functionality

أي Button ظاهر للمستخدم يجب أن يكون له Behavior حقيقي.

مثال:

```text
Save
→ validation
→ API/server action
→ database
→ success
→ revalidation
→ updated UI
```

إذا العملية فشلت:
- لا يظهر Success.
- يظهر Error حقيقي.
- تحفظ تفاصيل الخطأ في logs المناسبة بدون كشف أسرار للمستخدم.

---

# 2. PRODUCT VISION

الـ Admin Dashboard يجب أن تتحول إلى **Operating System لمطبخ/مطعم Tamara Kitchen**.

من مكان واحد يتم التحكم في:

```text
Orders
Customers
Products
Categories
Add-ons
Offers
Coupons
Homepage
Sections
Pages
Blog
Media
Notifications
Analytics
Settings
```

بدون الحاجة لتعديل source code في العمليات اليومية المعتادة.

---

# 3. INFORMATION ARCHITECTURE

الـ Sidebar الرئيسية:

```text
لوحة التحكم
الطلبات
القائمة / Catalog
    المنتجات
    الأقسام
    الإضافات
    أقسام الصفحة / Sections

التسويق
    العروض
    الكوبونات

العملاء

المحتوى
    الصفحة الرئيسية
    الصفحات
    المدونة

مكتبة الوسائط

الإشعارات

التحليلات

الإعدادات
```

كل Section يدعم:
- Active state
- Breadcrumbs
- Search
- Filters عند الحاجة
- Empty state
- Loading state
- Error state
- Toast
- Confirmation dialogs
- RTL/LTR

---

# 4. GLOBAL ADMIN SHELL

## 4.1 Header

Header ثابت ومتسق ويحتوي على:

- شعار/اسم Tamara Kitchen Admin
- Global Search
- Quick Create
- Notifications bell
- unread count
- Language switcher
- Admin profile menu
- Logout
- Mobile navigation trigger

## 4.2 Sidebar

Desktop:
- ثابت
- قابل للطي إذا كان التصميم الحالي يدعم ذلك

Mobile:
- drawer
- لا يستهلك مساحة الشاشة بشكل دائم

## 4.3 Global Search

يبحث في:

- Products
- Orders
- Customers
- Categories
- Offers
- Coupons
- Blog posts
- Pages

Search result يعرض:
- entity type
- name
- identifier
- status
- quick open

## 4.4 Command Palette

Shortcut:

```text
Ctrl/Cmd + K
```

Actions:

```text
إضافة منتج
إضافة قسم
إضافة إضافة
إضافة عرض
إضافة كوبون
إضافة مقال
فتح الطلبات
فتح العملاء
فتح الإشعارات
```

## 4.5 Global Quick Create

زر واضح:

```text
+ إضافة
```

ويعرض:

```text
منتج
قسم
إضافة
عرض
كوبون
مقال
صفحة
```

---

# 5. OVERVIEW DASHBOARD

Route:

```text
/dashboard
```

## 5.1 Page Header

يظهر:

- "لوحة التحكم"
- الفترة الحالية
- Refresh
- Date range selector

## 5.2 KPI Cards

استخدم البيانات الحقيقية:

- طلبات اليوم
- إيرادات اليوم
- الطلبات المعلقة
- الطلبات المكتملة
- العملاء
- المنتجات النشطة
- العروض النشطة
- الكوبونات النشطة

لا تعرض رقمًا إذا لا يمكن حسابه من البيانات الحالية بشكل موثوق.

## 5.3 Revenue Card

يعرض:

- total revenue
- مقارنة بالفترة السابقة إذا كان الحساب موثوقًا
- Mini chart

## 5.4 Orders Card

يعرض:

- total
- pending
- completed
- cancelled

## 5.5 Live Orders Feed

جدول/Feed للطلبات الحديثة.

كل صف:

- Order #
- العميل
- الإجمالي
- الحالة
- الوقت
- Open

## 5.6 Top Products

يعرض المنتجات الأكثر طلبًا خلال الفترة المحددة.

## 5.7 Operational Alerts

مثل:

- Pending orders
- Products without image
- Expired offers
- Expiring coupons
- Failed notifications
- Draft blog posts
- Unpublished homepage changes

## 5.8 Empty State

إذا لا توجد طلبات:

```text
لا توجد طلبات حتى الآن
ستظهر الطلبات الجديدة هنا بمجرد وصولها.
```

---

# 6. ORDERS MODULE

Route:

```text
/dashboard/orders
```

## 6.1 Orders List

Toolbar:

- Search
- Status filter
- Date filter
- Customer filter
- Amount filter
- Payment filter if supported
- Delivery filter if supported
- Refresh

Columns:

- Order number
- Customer
- Phone
- Items
- Add-ons
- Subtotal
- Discount
- Total
- Status
- Date
- Actions

## 6.2 Row Actions

كل Order:

```text
عرض
فتح WhatsApp
تغيير الحالة
```

Actions خطرة:
- Cancel
- Delete

تظهر فقط حسب الحالة والقواعد.

## 6.3 Order Detail

Route:

```text
/dashboard/orders/[id]
```

Layout:

### Header

- Order number
- Created time
- status badge
- action menu

### Customer Card

- name
- phone
- email
- open customer

### Delivery Card

- saved address
- details
- notes
- shipping status

### Order Items

لكل Item:

- product image
- product name
- quantity
- base price snapshot
- selected add-ons
- addon price snapshot
- line total

### Financial Summary

```text
Subtotal
Discount
Coupon
Shipping
Grand Total
```

الشحن في النظام الحالي:

```text
غير محسوب أونلاين
سيتم تأكيده عبر WhatsApp
```

### Order Timeline

اعرض التاريخ الزمني للتغييرات إذا كان available.

## 6.4 Change Status

Modal:

```text
الحالة الحالية
الحالة الجديدة
سبب/ملاحظة إذا supported
```

بعد Save:

```text
database update
→ notification
→ revalidation
→ UI update
```

## 6.5 Order Status

استخدم **ENUM الموجود في Prisma**.

لا تخترع statuses جديدة دون التأكد من schema.

## 6.6 Order Historical Integrity

Order يجب أن يحتفظ snapshots اللازمة للمنتج والسعر والإضافات وقت الطلب.

حذف/Archive Product لاحقًا يجب ألا يغير التاريخ القديم.

---

# 7. PRODUCTS MODULE

Route:

```text
/dashboard/catalog/products
```

هذا module أساسي ويجب أن يكون كاملًا.

## 7.1 Product List

Toolbar:

- Add Product
- Search
- Category
- Availability
- Active/Inactive
- Offer
- Sort
- Pagination
- Bulk actions where safe

## 7.2 Product Row

يعرض:

- primary image
- الاسم العربي
- الاسم الإنجليزي
- category
- price
- sale/offer indication
- availability
- status
- updated at

Actions:

```text
View
Edit
Duplicate
Hide
Restore
Archive
Delete if safe
```

## 7.3 Product Create

Route:

```text
/dashboard/catalog/products/new
```

Editor sections:

### Basic Information

- Arabic Name
- English Name
- Arabic Description
- English Description
- Slug if supported
- SKU if supported

Validation:
- Arabic name required if Arabic product support is intended.
- English name required if bilingual product support is intended.
- slug unique when applicable.

### Pricing

- Base Price
- Compare Price if schema supports it

Do not duplicate offer pricing logic into base price fields.

### Category

Select from real Categories.

### Availability

- Available
- Unavailable
- Active
- Inactive

Use exact existing schema meanings.

### Images

Support the actual media system.

UI:
- drag/drop if appropriate
- select media
- preview
- remove
- reorder
- primary image

### Variants

Only if supported by the existing schema.

### Add-ons

UI:

```text
الإضافات المتاحة لهذا المنتج

☑ سلطة       +15 ج.م
☑ بطاطس      +25 ج.م
☐ مشروب      +20 ج.م
☐ صوص إضافي  +10 ج.م
```

Admin can add/remove associations.

## 7.4 Product Save

Flow:

```text
Validate
→ Authenticate
→ Authorize admin
→ Validate category
→ Validate media
→ Validate add-ons
→ Prisma transaction where required
→ PostgreSQL
→ revalidate
→ success
```

## 7.5 Product Edit

Same editor as Create.

Existing values loaded from DB.

Save modifies actual records.

## 7.6 Product Duplicate

If implemented:

- duplicate product data
- generate unique identifier/slug
- do not duplicate historical orders
- allow changing name/image before final save

## 7.7 Product Hide/Restore

Hide:
- product disappears from intended public listings
- historical orders remain

Restore:
- becomes visible again

## 7.8 Product Archive

Archive is preferred when historical references exist.

## 7.9 Product Delete

Hard delete only if safe.

Confirmation must say exactly what will happen.

If referenced by historical Orders:
- prevent destructive delete
- offer Archive/Disable

## 7.10 Product Public Sync

After product mutation update:

```text
/menu
product detail
category listing
homepage sections if applicable
```

must reflect the current DB values.

Cache must be correctly invalidated.

---

# 8. CATEGORIES MODULE

Route:

```text
/dashboard/catalog/categories
```

## 8.1 List

Show:

- image
- Arabic name
- English name
- product count
- visibility
- sort order
- status

## 8.2 Create

Fields:

- Arabic name
- English name
- description Arabic
- description English
- slug
- image/banner
- sort order
- active/hidden

Use only fields supported by schema.

## 8.3 Edit

Load existing data.

Save to DB.

## 8.4 Hide

Category becomes unavailable to customer-facing navigation/listing.

Product history remains safe.

## 8.5 Restore

Re-enable category.

## 8.6 Reorder

Provide drag-and-drop or explicit ordering UI according to architecture.

Order must persist.

## 8.7 Delete

Safe archive/delete only when relationships permit.

---

# 9. ADD-ONS MODULE

Routes:

```text
/dashboard/catalog/addons
/dashboard/catalog/addons/new
/dashboard/catalog/addons/[id]
```

## 9.1 Add-on List

Columns:

- image
- Arabic name
- English name
- price
- group
- products count
- availability
- status
- actions

## 9.2 Add-on Create

Fields:

- Arabic name
- English name
- price
- image
- availability
- active/inactive

## 9.3 Add-on Group

If existing schema supports:

- group name Arabic
- group name English
- required/optional
- min selections
- max selections
- sort order

Do not invent unsupported schema behavior.

## 9.4 Product Assignment

Admin selects Product:

```text
Burger Meal
```

Then:

```text
Available Add-ons

☑ Salad +15
☑ Fries +25
☐ Drink +20
☐ Sauce +10
```

Save association.

## 9.5 Customer Product Page

Product page should render only the add-ons assigned to it.

Selected extras must continue through:

```text
Product
→ Cart
→ Checkout
→ Order
→ WhatsApp
```

## 9.6 Price Security

The frontend may send selected addon IDs.

The server:
- loads the add-ons
- verifies they are allowed for that product
- retrieves current prices
- calculates totals

Never trust frontend addon prices.

---

# 10. OFFERS MODULE

Routes:

```text
/dashboard/marketing/offers
/dashboard/marketing/offers/new
/dashboard/marketing/offers/[id]
```

## 10.1 Offer List

Show:

- image
- name
- discount
- applicable products/categories
- date range
- status
- actions

## 10.2 Create/Edit

Fields from actual schema:

- Arabic name
- English name
- description
- discount type
- discount value
- start
- end
- applicable products
- applicable categories
- image
- active/inactive

## 10.3 Actions

- Create
- Edit
- Enable
- Disable
- Archive
- Delete when safe

No 404s.

## 10.4 Public Offer Preview

Where supported, show how the offer appears on public pages.

---

# 11. COUPONS MODULE

Routes:

```text
/dashboard/marketing/coupons
/dashboard/marketing/coupons/new
/dashboard/marketing/coupons/[id]
```

## 11.1 List

Show:

- code
- discount
- status
- start
- expiry
- usage
- limit
- minimum order if supported

## 11.2 Create/Edit

Fields supported by schema:

- code
- discount type
- discount value
- min order
- max discount
- start date
- expiration
- usage limit
- per-customer limit
- active/inactive
- product/category restrictions

## 11.3 Usage

Show:

- total usages
- remaining
- expiration
- status
- usage records if available

## 11.4 Server-side Validation

Checkout submits:

```text
couponCode
```

Server checks:

```text
exists
active
not expired
usage available
customer eligibility
minimum order
restrictions
```

Server calculates final discount.

---

# 12. CUSTOMERS MODULE

Route:

```text
/dashboard/customers
```

## 12.1 Customer List

Columns:

- avatar
- name
- email
- phone
- orders count
- total spend if reliably calculable
- status
- created at
- last activity if available

Filters:

- active
- inactive
- date
- order count

Search:

- name
- phone
- email

## 12.2 Customer Profile

Route:

```text
/dashboard/customers/[id]
```

Header:

- avatar
- name
- email
- phone
- account status

Stats:

- orders
- completed
- cancelled
- spend if valid

Tabs:

```text
Overview
Orders
Addresses
Activity
```

## 12.3 Deactivate

Preferred when historical Orders exist.

## 12.4 Restore

Re-enable account.

## 12.5 Delete

Hard delete only if safe.

Confirmation must show:
- user identity
- consequence
- whether historical records exist

---

# 13. HOMEPAGE CMS

Route:

```text
/dashboard/content/homepage
```

The homepage should be managed as ordered sections where supported.

Example conceptual structure:

```text
1. Hero
2. Categories
3. Featured Products
4. Offers
5. Promotional Banner
6. Popular Items
7. Blog
8. CTA
```

Do not assume this exact list exists in schema.

## 13.1 Section Controls

Each section:

- preview
- edit
- hide/show
- reorder
- duplicate if safe
- archive/delete if safe

## 13.2 Section Editor

Fields depend on actual schema:

- Arabic title
- English title
- descriptions
- image/banner
- linked products
- linked categories
- CTA
- order
- visibility

## 13.3 Public Sync

Changes update homepage after cache invalidation.

---

# 14. PAGES CMS

Route:

```text
/dashboard/content/pages
```

## 14.1 Pages List

Show:

- title
- slug
- status
- SEO status
- updated
- actions

## 14.2 Page Editor

Fields:

- Arabic title
- English title
- Arabic content
- English content
- slug
- SEO title
- meta description
- OG image
- status

Statuses:

- Draft
- Published
- Unpublished/Hidden
- Archived

Only supported statuses should be implemented.

## 14.3 Public Routes

A published page must have a valid customer-facing route.

---

# 15. BLOG MODULE

Routes:

```text
/dashboard/content/blog
/dashboard/content/blog/new
/dashboard/content/blog/[id]
```

## 15.1 List

Show:

- image
- title
- status
- publish date
- updated date
- actions

## 15.2 Editor

Fields:

- Arabic title
- English title
- Arabic content
- English content
- excerpt
- cover image
- slug
- SEO title
- SEO description
- publish status
- publication date

## 15.3 Actions

- Save draft
- Publish
- Unpublish
- Edit
- Archive
- Delete when safe

## 15.4 Preview

Provide a realistic public-article preview.

## 15.5 Public Sync

Publishing:

```text
DB
→ Blog index
→ Article page
→ metadata
→ sitemap
```

---

# 16. MEDIA LIBRARY

Route:

```text
/dashboard/media
```

## 16.1 Grid

Each asset:

- thumbnail
- filename
- type
- dimensions
- size
- date
- usage

## 16.2 Upload

Use existing storage/media implementation.

## 16.3 Preview Drawer

Show:

- large preview
- filename
- type
- dimensions
- size
- references/usages
- safe delete

## 16.4 Safe Delete

Do not delete a media asset currently needed by a product/page/blog section without a safe handling strategy.

---

# 17. NOTIFICATIONS

Route:

```text
/dashboard/notifications
```

## 17.1 Notification Center

Display:

- title
- message
- type
- recipient
- read/unread
- created at

## 17.2 Real Events

Examples:

```text
New Order
Order Status Changed
Important Offer Published
System Event
```

Use only events implemented by real business workflows.

## 17.3 Web Push

Inspect and reuse existing VAPID/Web Push architecture.

Check:

- service worker
- subscription creation
- subscription persistence
- VAPID public key
- VAPID private key
- VAPID subject
- production environment variables
- permission state
- send logic
- error handling

No fake notifications.

## 17.4 Read Status

User can:

- open
- mark read
- mark all read

Unread count must come from persisted state.

---

# 18. ANALYTICS

Route:

```text
/dashboard/analytics
```

## 18.1 Filters

- Today
- 7 days
- 30 days
- Custom

## 18.2 Sales

- revenue
- orders
- average order value
- discounts

## 18.3 Products

- top products
- categories
- addon usage

## 18.4 Customers

- new customers
- returning customers
- order frequency

## 18.5 Marketing

- coupon usage
- offer activity

All metrics must be traceable to real data.

---

# 19. SETTINGS

Route:

```text
/dashboard/settings
```

## General

- Restaurant name
- Logo
- Contact info
- Arabic/English branding

## Ordering

- ordering enabled/disabled
- minimum order if supported
- WhatsApp number
- order settings

## Delivery

Current model:

```text
Delivery fee confirmed by WhatsApp
```

Do not build a fake shipping calculator.

## Notifications

- push status
- preferences

## SEO

- default title
- default description
- OG image
- indexing controls where appropriate

## Administration

- admin users
- roles
- permissions

Never show secrets.

---

# 20. ADMIN PROFILE

Route:

```text
/dashboard/settings/profile
```

Include:

- avatar
- name
- email
- role
- language
- preferences
- sign out

Security controls only if actually supported.

---

# 21. CHECKOUT / WHATSAPP INTEGRATION CONTRACT

Current payment model:

> Order is confirmed through WhatsApp. No online payment gateway is required at this stage.

The checkout flow is:

```text
Cart
→ Checkout
→ customer data
→ address
→ add-ons
→ coupon
→ server validation
→ price calculation
→ Order creation
→ WhatsApp message
```

## 21.1 Customer Data

- Name
- Phone
- Email where available
- Delivery address
- Notes

## 21.2 Cart Summary

For every item:

- product
- quantity
- base price
- add-ons
- addon prices
- line total

## 21.3 Coupon

Input:

```text
كود الخصم
[__________] [تطبيق]
```

After valid coupon:

```text
الإجمالي قبل الخصم
قيمة الخصم
الإجمالي بعد الخصم
```

## 21.4 Shipping Disclosure

Arabic:

```text
الأسعار لا تشمل تكلفة الشحن، وسيتم تحديد تكلفة الشحن وتأكيدها معك عبر واتساب.
```

English:

```text
Prices do not include delivery fees. Delivery fees will be confirmed with you via WhatsApp.
```

## 21.5 Main CTA

```text
إتمام الطلب عبر واتساب
```

## 21.6 Server-Side Calculation

Never trust:

- frontend price
- frontend subtotal
- frontend discount
- frontend total
- frontend addon price

Server loads actual DB values and calculates totals.

## 21.7 WhatsApp Message

The generated message contains:

- order number
- customer name
- phone
- address
- products
- quantities
- add-ons
- subtotal
- coupon
- discount
- final total
- shipping notice

Generate from the verified order record.

---

# 22. CUSTOMER ACCOUNT CONTRACT

The customer account area must use persistent DB data.

Relationship:

```text
User
↓
Customer
↓
Addresses
↓
Orders
↓
Notifications
```

Verify correct identity linking.

Profile edits:
- name editable
- phone editable if schema supports
- authentication email read-only when appropriate

Addresses:
- create
- edit
- delete
- select
- persist

All changes survive:
- page refresh
- leaving page
- logout/login

---

# 23. PUBLIC WEBSITE SYNCHRONIZATION

The dashboard is successful only when public pages change correctly.

## Product

Admin edits price:

```text
DB
→ revalidate
→ product page
→ menu
```

## Category

Admin hides:

```text
DB
→ revalidate
→ navigation/listing
```

## Add-on

Admin associates:

```text
DB
→ product page shows addon
```

## Offer

Admin publishes:

```text
DB
→ offer page/product page update
```

## Coupon

Admin creates:

```text
DB
→ checkout accepts it
```

## Blog

Admin publishes:

```text
DB
→ public article
→ blog index
→ sitemap
```

## Homepage

Admin edits section:

```text
DB
→ homepage cache invalidated
→ new content visible
```

---

# 24. CACHE / REVALIDATION

Do NOT blindly add revalidatePath everywhere.

First determine current architecture:

- Server Components
- static generation
- fetch cache
- Prisma queries
- ISR
- tags

Then establish explicit invalidation rules.

Examples:

Product mutation affects:

```text
/menu
product detail
category pages
homepage if referenced
```

Category mutation affects:

```text
/menu
category page
navigation
homepage if referenced
```

Offer mutation affects:

```text
offers
product/category pages
```

Blog mutation affects:

```text
blog
article
sitemap
```

Homepage section affects:

```text
/
```

---

# 25. ROUTING CONTRACT

All navigation must resolve.

Recommended conceptual routes:

```text
/dashboard
/dashboard/orders
/dashboard/orders/[id]

/dashboard/catalog
/dashboard/catalog/products
/dashboard/catalog/products/new
/dashboard/catalog/products/[id]
/dashboard/catalog/categories
/dashboard/catalog/categories/new
/dashboard/catalog/categories/[id]
/dashboard/catalog/addons
/dashboard/catalog/addons/new
/dashboard/catalog/addons/[id]
/dashboard/catalog/sections

/dashboard/marketing
/dashboard/marketing/offers
/dashboard/marketing/offers/new
/dashboard/marketing/offers/[id]
/dashboard/marketing/coupons
/dashboard/marketing/coupons/new
/dashboard/marketing/coupons/[id]

/dashboard/customers
/dashboard/customers/[id]

/dashboard/content
/dashboard/content/homepage
/dashboard/content/pages
/dashboard/content/pages/new
/dashboard/content/pages/[id]
/dashboard/content/blog
/dashboard/content/blog/new
/dashboard/content/blog/[id]

/dashboard/media
/dashboard/notifications
/dashboard/analytics
/dashboard/settings
/dashboard/settings/profile
```

Before final routing, reconcile with existing Next.js structure.

No dead links.

No 404 buttons.

---

# 26. FORM UX

All complex forms must support:

## Initial State

Fields populated correctly.

## Editing

Clear editable controls.

## Validation

Field-level error.

## Saving

Button becomes:

```text
جاري الحفظ...
```

Duplicate submit disabled.

## Success

Success message only after DB success.

## Error

Retain entered values so the user does not lose work.

## Unsaved Changes

Show warning when navigating away from large editors if supported.

---

# 27. MODALS / DRAWERS

Use reusable patterns.

## Confirmation Modal

For destructive actions:

- clear title
- concise consequence
- Cancel
- destructive action

## Detail Drawer

Useful for:
- quick product preview
- order preview
- customer preview
- notification detail
- media preview

---

# 28. TABLE UX

Tables must support:

- sticky header when useful
- responsive behavior
- readable columns
- row actions
- status badges
- pagination
- sorting
- filters
- empty state
- loading skeleton

On mobile:
- transform rows into cards or horizontal scroll only when genuinely usable.

---

# 29. STATUS SYSTEM

Use consistent semantic badges.

Examples:

```text
Active
Inactive
Published
Draft
Hidden
Archived
Pending
Completed
Cancelled
```

But only use statuses supported by the relevant domain model.

---

# 30. INTERNATIONALIZATION

Arabic primary.

English secondary.

Every screen must support:

- labels
- placeholders
- validation
- errors
- success
- empty states
- buttons
- tooltips
- confirmation dialogs

Currency:

```text
EGP / ج.م
```

Dates/times should respect appropriate locale.

---

# 31. RTL / LTR

Do not simply flip everything.

Review:

- icons
- chevrons
- breadcrumbs
- sidebars
- table alignment
- input alignment
- numbers
- dates
- price presentation
- status badges

---

# 32. MOBILE ADMIN

Required responsive versions:

- Overview
- Orders
- Order Detail
- Products
- Product Editor
- Categories
- Add-ons
- Offers
- Coupons
- Customers
- Customer Detail
- Blog Editor
- Notifications
- Settings

Mobile interactions can use:
- drawers
- bottom sheets
- sticky footer actions
- stacked forms
- responsive cards

The goal is usability, not simply shrinking desktop.

---

# 33. ACCESSIBILITY

Support:

- semantic controls
- keyboard navigation
- visible focus
- labels
- accessible dialogs
- logical tab order
- appropriate contrast
- screen-reader labels

---

# 34. SECURITY

Server-side authorization on every mutation.

Verify:

```text
session
→ user
→ role
→ permission
```

Never trust IDs from browser without verifying access.

Protect against:

- cross-customer access
- ID manipulation
- price manipulation
- discount manipulation
- unauthorized admin actions

---

# 35. AUDIT LOG

Where infrastructure exists or can be safely added, track operational changes.

Examples:

```text
Product created
Product updated
Product archived
Category changed
Addon assigned
Offer created
Coupon changed
Customer deactivated
Order status changed
Blog published
Notification sent
```

Audit record:

- admin
- action
- entity
- entity id
- timestamp
- safe metadata

Never store passwords/API secrets/private keys.

---

# 36. EMPTY / ERROR / LOADING STATES

Every major module gets:

## Loading

Skeleton matching content structure.

## Empty

Example:

```text
لا توجد منتجات حتى الآن
[إضافة منتج]
```

## Error

```text
تعذر تحميل البيانات
[إعادة المحاولة]
```

## Permission

```text
ليس لديك صلاحية لتنفيذ هذا الإجراء
```

## Not Found

```text
العنصر غير موجود أو تم حذفه
```

---

# 37. ADMIN DESIGN SYSTEM

The existing approved visual direction should be maintained and systematized.

Characteristics:

- Premium dark enterprise UI
- Deep navy/near-black background
- Elevated cards
- Strong green primary/success
- Orange warning/action
- Red destructive/error
- White/high-contrast typography
- Subtle borders
- Compact but readable data density
- Professional tables
- Rounded cards
- Consistent status badges
- Restaurant operations feeling
- RTL-first composition

Do not introduce random colors per page.

Create reusable primitives for:

```text
PageHeader
SectionHeader
StatCard
DataTable
Toolbar
Search
FilterBar
StatusBadge
Button
IconButton
Input
Select
DatePicker
Dialog
Drawer
Toast
Tabs
Pagination
EmptyState
ErrorState
Skeleton
MediaUploader
RichTextEditor where required
```

---

# 38. PERFORMANCE

Admin should remain fast with large datasets.

Prefer:
- server-side pagination
- server-side filtering when appropriate
- efficient Prisma queries
- select only required fields
- avoid N+1 queries
- lazy-load heavy editors/media
- debounce global/search inputs
- optimistic UI only when operation safety is high and server result is reconciled

---

# 39. DATA INTEGRITY

Where multiple records must update together, use Prisma transactions.

Examples:

Product + add-on associations.

Order + OrderItems + coupon usage.

Homepage section + ordering.

Any transaction must:
- rollback on failure
- not leave partial data.

---

# 40. SEO ADMIN CONTRACT

Admin content should expose the fields needed by public SEO.

Potential fields:

- SEO title
- meta description
- slug
- canonical
- OG image

Public SEO requirements:

```text
robots.txt
sitemap.xml
canonical URLs
Restaurant structured data
Product structured data
Offer data where valid
BlogPosting
BreadcrumbList
WebSite/Organization where appropriate
```

Production canonical domain:

```text
https://www.tamara-kitchen.com
```

Exclude from indexing:

```text
/dashboard
/account
/settings
/cart
/checkout
/login
/api
```

Do not invent:
- ratings
- reviews
- opening hours
- prices
- address
- social profiles

Use real data only.

---

# 41. ANALYTICS DATA RULES

Do not fabricate analytics.

If a metric needs data not currently available:
- either derive it safely
- or hide it until reliable.

Historical order calculations must use actual stored snapshots/statuses.

---

# 42. MEDIA RULES

Do not store fake image paths.

Every media reference must point to an actual uploaded/managed asset.

Deleting media:
- check references
- protect assets still in use
- update/remove references safely

---

# 43. ORDERING + WHATSAPP RULES

The order creation process should be idempotent enough to prevent accidental duplicate submissions.

Protect against:

- double clicking
- repeated submit
- stale cart
- deleted product
- price changed between cart and submit
- addon no longer available
- invalid coupon

At final submission the server re-verifies everything.

---

# 44. CUSTOMER DATA SECURITY

Customer can access only:
- own profile
- own addresses
- own orders
- own notifications

Admin can access customers according to role.

No customer ID from the client should be accepted without verifying ownership.

---

# 45. ADMIN PERMISSIONS

At minimum conceptual permissions:

```text
view_dashboard
manage_orders
manage_products
manage_categories
manage_addons
manage_offers
manage_coupons
manage_customers
manage_content
manage_media
manage_notifications
view_analytics
manage_settings
manage_admins
```

If current system only has a simple admin role:
- keep current architecture
- do not over-engineer role management unless required.

---

# 46. LEGACY DASHBOARD TRANSITION

Do NOT immediately delete the old dashboard files.

Plan:

```text
Old Dashboard
    ↓
Legacy / isolated
    ↓
New Dashboard
    ↓
Production verification
    ↓
Old code removal after approval
```

Avoid duplicate routes.

Only remove legacy code after the new implementation is proven.

---

# 47. IMPLEMENTATION STRATEGY

Implementation should be done in controlled phases.

## Phase 1 — Admin Foundation

- admin shell
- sidebar
- header
- global search
- command palette
- auth/authorization
- overview

## Phase 2 — Catalog

- Products
- Categories

## Phase 3 — Add-ons

- Add-ons
- Groups if supported
- Product assignments

## Phase 4 — Operations

- Orders
- Customers

## Phase 5 — Marketing

- Offers
- Coupons

## Phase 6 — CMS

- Homepage
- Sections
- Pages
- Blog
- Media

## Phase 7 — Notifications

- In-app
- Web Push

## Phase 8 — Analytics & Settings

- Analytics
- Settings
- Admin profile

## Phase 9 — Integration

- Public synchronization
- Revalidation
- Cart
- Checkout
- WhatsApp
- End-to-end regression

## Phase 10 — SEO

- metadata
- sitemap
- robots
- structured data
- canonical strategy
- crawlability verification

---

# 48. GIT / DEPLOYMENT RULE

Each phase:

```text
Implement
→ npx tsc --noEmit
→ npm run build
→ functional test
→ review changed files
→ commit
→ push main
→ wait Vercel production
→ test live production
```

Do not hide multiple phases inside one giant commit.

Suggested commit naming:

```text
feat(admin): build admin foundation
feat(admin): build catalog management
feat(admin): build addon management
feat(admin): build orders and customers
feat(admin): build offers and coupons
feat(admin): build cms and media
feat(admin): implement notifications
feat(admin): build analytics and settings
fix(sync): synchronize public website with database
feat(seo): implement production technical seo
```

---

# 49. TESTING MATRIX

## Users

- list users
- search
- open profile
- deactivate
- restore
- safe deletion

## Products

- create
- save
- refresh
- edit
- price update
- image update
- category update
- hide
- restore
- archive
- safe delete

## Categories

- create
- edit
- reorder
- hide
- restore
- public page

## Add-ons

- create
- edit
- associate to product
- remove association
- customer selection
- cart price
- checkout price
- order snapshot
- WhatsApp message

## Offers

- create
- edit
- enable
- disable
- archive
- image
- public display

## Coupons

- create
- edit
- valid apply
- invalid apply
- expired apply
- usage limit
- minimum order
- server-side discount

## Orders

- creation
- listing
- details
- status update
- historical data
- notifications

## Customers

- profile
- address
- orders
- status

## Blog

- create
- draft
- edit
- publish
- unpublish
- public article
- SEO
- sitemap

## Notifications

- DB record
- unread count
- read
- push subscription
- push delivery where supported

## CMS

- section create
- edit
- reorder
- hide
- restore
- public sync

## SEO

Verify:

```text
/robots.txt
/sitemap.xml
```

Verify:
- canonical
- metadata
- product HTML
- category HTML
- blog HTML
- no accidental noindex
- no preview canonical URLs

---

# 50. DEFINITION OF DONE

The dashboard is NOT done because it looks good.

It is done when:

1. All visible primary actions work.
2. Every CRUD operation persists.
3. Refresh does not lose data.
4. Logout/login does not lose relevant persistent data.
5. Admin authorization works server-side.
6. Historical Orders remain intact.
7. Public website reflects dashboard changes.
8. Add-ons work through Cart → Checkout → Order → WhatsApp.
9. Coupons calculate server-side.
10. Offers work.
11. Blog publishing works.
12. Notifications use real records.
13. Web Push works where supported and permitted.
14. Arabic/English work.
15. RTL/LTR work.
16. Mobile and desktop work.
17. No unexplained 404s.
18. No fake production data remains.
19. TypeScript passes.
20. Production build passes.
21. Git is committed and pushed.
22. Vercel production deployment succeeds.
23. Live production tests pass.

---

# 51. FINAL USER FLOWS

## FLOW A — Product

```text
Admin
→ Products
→ Add Product
→ Fill data
→ Select category
→ Upload images
→ Assign add-ons
→ Save
→ DB
→ Revalidate
→ Menu
→ Product page
→ visible
```

## FLOW B — Add-on

```text
Admin
→ Add-ons
→ Create Salad
→ Save
→ Product
→ Assign Salad
→ Save
→ Public Product
→ Salad appears
→ Customer selects
→ Cart
→ Checkout
→ Order
→ WhatsApp
```

## FLOW C — Coupon

```text
Admin
→ Coupons
→ Create
→ Save
→ Customer Checkout
→ Enter code
→ Server validation
→ Discount
→ Updated total
→ Order
→ WhatsApp
```

## FLOW D — Offer

```text
Admin
→ Offers
→ Create/Edit
→ Save
→ DB
→ Revalidation
→ Public offer/product
```

## FLOW E — Blog

```text
Admin
→ Blog
→ Create
→ Draft
→ Publish
→ DB
→ Public Blog
→ Article
→ SEO
→ Sitemap
```

## FLOW F — Customer

```text
Google Login
→ Account
→ Edit Profile
→ Save
→ PostgreSQL
→ Refresh
→ Updated profile
```

## FLOW G — Address

```text
Account
→ Addresses
→ Add Address
→ Save
→ PostgreSQL
→ Leave
→ Return
→ Address still exists
```

## FLOW H — Order

```text
Customer
→ Cart
→ Checkout
→ Address
→ Add-ons
→ Coupon
→ Server verification
→ Create Order
→ WhatsApp
→ Admin Order List
→ Admin changes status
→ Customer notification
```

---

# 52. IMPLEMENTATION INSTRUCTION TO ANTIGRAVITY

Before coding:

1. Read this entire document.
2. Inspect the actual Prisma schema.
3. Inspect current Admin routes.
4. Inspect current public data queries.
5. Inspect existing APIs and Server Actions.
6. Inspect NextAuth/authorization.
7. Inspect media/storage.
8. Inspect VAPID/Web Push.
9. Inspect caching/revalidation.
10. Produce a concise implementation map internally.

Then implement the new dashboard incrementally.

Do NOT rewrite the public website unnecessarily.

Do NOT break existing Google authentication.

Do NOT reset the database.

Do NOT fabricate schema fields.

Do NOT show a successful save until PostgreSQL confirms the operation.

Every visible action must have a complete working flow.

---

# 53. FINAL ARCHITECTURE

The intended architecture is:

```text
                         TAMARA ADMIN
                              |
        +---------------------+----------------------+
        |                     |                      |
      CATALOG             OPERATIONS              CONTENT
        |                     |                      |
 Products/Categories       Orders               Homepage
 Add-ons                  Customers             Sections
 Offers/Coupons           Notifications          Pages
        |                                         Blog
        |                                         Media
        +---------------------+----------------------+
                              |
                         AUTH / RBAC
                              |
                       SERVER ACTIONS / API
                              |
                            PRISMA
                              |
                         POSTGRESQL
                              |
                    CACHE / REVALIDATION
                              |
                       PUBLIC WEBSITE
                              |
                 MENU → PRODUCT → CART
                              |
                CHECKOUT → ORDER → WHATSAPP
```

---

# 54. FINAL QUALITY BAR

The new Tamara Kitchen Admin Dashboard should look:

- premium
- modern
- enterprise-grade
- fast
- clean
- operational
- coherent
- obvious to use

and behave:

- reliably
- predictably
- securely
- with real persistence
- with real synchronization
- with clear feedback
- without dead ends
- without unexplained 404s

The dashboard should feel like a professional restaurant operations platform, not a collection of unrelated CRUD pages.

**Design quality + UX quality + technical correctness + data integrity are all required.**
