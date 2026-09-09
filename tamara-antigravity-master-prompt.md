# TAMARA KITCHEN — ANTIGRAVITY IDE MASTER EXECUTION PROMPT

You are the lead product designer, UX architect, frontend engineer, motion designer, and interaction engineer for the **Tamara Kitchen** digital product.

This is **not** a generic restaurant website. You are building a premium, emotionally persuasive food-commerce experience consisting of:

1. A world-class responsive **Landing Page / Marketing Homepage**.
2. A mobile-first **Web App / PWA ordering experience**.
3. A production-grade **Admin Dashboard / CMS** that controls the customer experience.

The user has already supplied a complete product specification in the project workspace. Treat that specification as the source of truth.

---

## 0. FILES AND EXISTING PROJECT CONTEXT — INSPECT FIRST

Before changing code, inspect the existing project structure and identify:

- the current frontend framework and build system;
- routing;
- styling system;
- existing components;
- current database/API structure, if any;
- current public/static asset handling;
- current PWA configuration, if any;
- environment/config files;
- the `assets` folder;
- all existing Tamara-related assets.

Do **not** delete working project infrastructure merely to replace it with a new stack.
Reuse a sound existing architecture when possible, but refactor weak structure when necessary for the specification.

The project contains an `assets` folder with:

```text
assets/
  tamara_logo_1788544990894.png
  wh_logo_mt.*
```

Important:

- `tamara_logo_1788544990894` is the Tamara logo. Use the actual file already present in the project. Do not invent a substitute logo.
- `wh_logo_mt` is the **animated loading/splash asset/video**. Use the actual asset already present. Do not replace it with a fake CSS animation when the supplied asset can be used.
- Preserve original assets and never overwrite or destructively edit them.
- Inspect the dimensions, format, transparency, duration, and visual behavior of the provided assets before implementing their presentation.

The user has also supplied two visual references in this conversation:

1. **Recipes & Restaurant App Design** — reference for visual depth, dark premium food presentation, centered food hero composition, surrounding peripheral food imagery, glass/dark cards, and restrained navigation.
2. **Modern Egyptian Heritage** — source of truth for the Tamara color identity.

Do **not** clone either reference. Extract the visual principles and create a distinctive Tamara design.

---

# 1. READ THE MASTER SPECIFICATION BEFORE IMPLEMENTING

There is a file in the project workspace named:

```text
tamara-kitchen-master-product-spec.md
```

Read this entire file before implementation.

It is the master UX/UI/product/engineering specification. It contains detailed requirements for:

- brand system;
- colors;
- typography;
- spacing;
- responsive breakpoints;
- splash screen;
- global announcement bar;
- landing page;
- hero;
- exclusive offers;
- categories;
- best sellers;
- product detail;
- native food-size imagery;
- add-ons;
- cart;
- checkout;
- address selection;
- Google Maps location selection;
- delivery timing;
- order confirmation;
- order tracking;
- ratings/reviews;
- monthly and half-month meal packages;
- freezer/prepared food;
- large orders/catering;
- search;
- account;
- push notifications;
- PWA behavior;
- first-order discount;
- free-delivery rules;
- promotions engine;
- admin dashboard;
- WhatsApp handoff;
- homepage builder;
- banner/offer management;
- reviews management;
- notification center;
- customers;
- analytics;
- micro-interactions;
- glassmorphism;
- motion;
- accessibility;
- performance;
- SEO;
- localization;
- theme management;
- authentication;
- database model;
- promotions/banner/homepage data;
- roles/security;
- future card payments;
- notification permission UX;
- empty/error/loading states;
- responsive behavior;
- food photography direction;
- image CMS;
- blog/FAQ/footer;
- conversion rules;
- recommendations;
- abandoned cart;
- reorder;
- personalization;
- component library;
- content management;
- seed data;
- order integrity;
- notification architecture;
- analytics events;
- QA criteria;
- implementation phases.

**You must implement from this file, not from memory and not from assumptions.**

Where this prompt and the master specification overlap, follow the master specification. Where this prompt gives a visual or implementation clarification, use it as an execution constraint.

---

# 2. PRIMARY PRODUCT OBJECTIVE

The product must accomplish this in the first few seconds:

> Make the visitor hungry enough to want to order immediately, while communicating that Tamara is authentic Egyptian home food presented with premium digital craftsmanship.

The experience should feel:

**Egyptian Heritage + Premium Food Photography + Cinematic Depth + Warm Luxury + Modern Commerce + iPhone-level Interaction Polish.**

Do not make it feel like:

- a template restaurant website;
- a generic Shopify storefront;
- an overly decorated Arabic website;
- a random glassmorphism demo;
- a design-system exercise;
- a UI copied from the reference image.

Every visual decision must support appetite, trust, clarity, speed, and conversion.

---

# 3. NON-NEGOTIABLE PRINCIPLES

## 3.1 Mobile-first is the product priority

Design mobile first and validate the experience at real phone widths before desktop.

But **mobile-first must never mean desktop-second-rate**.

Desktop must feel intentionally art-directed, spacious, cinematic, and premium rather than stretched from a phone layout.

## 3.2 Food is the hero

Food imagery has the highest visual priority.

Use large, carefully cropped, high-quality images, with realistic shadows, depth, subtle overlays, and enough negative space for readable text.

Never bury the food underneath UI decoration.

## 3.3 Food variants are true visual variants

This is critical.

For food, a size/portion is not equivalent to a clothing-size selector.

Example:

- Quarter chicken = its own actual plate/image.
- Half chicken = a different actual plate/image.
- Whole chicken = another actual plate/image.

The image, composition, visual mass, serving presentation, quantity, and sometimes supporting sides can change between variants.

Therefore:

- Each product variant must be able to store its own image.
- Variant selection must swap the actual hero media.
- Transition between variant images must feel intentional and premium.
- Price changes with the selected variant.
- The quantity selector remains separate from portion/size selection.
- Do not fake a larger meal by zooming or scaling one image.

## 3.4 Arabic and English

Initial language must intelligently follow the user's device/browser language when supported:

- Arabic -> Arabic interface + RTL.
- English -> English interface + LTR.

The customer must still be able to switch manually at any time.

RTL is not just text alignment. All directional UI, spacing logic, icon placement, drawers, arrows, carousels, navigation, and motion must correctly mirror.

Do not hardcode left/right assumptions where logical start/end should be used.

## 3.5 Light and Dark mode

First visit: follow system preference.

Then persist the user's manual choice.

Both themes must be first-class designs.

Do not design Dark as merely a darkened copy of Light.

## 3.6 Controlled glassmorphism

Use glass carefully for:

- navigation;
- floating controls;
- high-value cards;
- sheets;
- modals;
- overlays.

Do not blur everything.

Glass must have:

- depth;
- hierarchy;
- readable contrast;
- subtle border treatment;
- appropriate backdrop blur;
- performance awareness.

The final result should feel closer to premium modern mobile product design than a "glassmorphism trend" demo.

## 3.7 Motion must communicate state

Motion should:

- attract attention;
- communicate change;
- reinforce hierarchy;
- create delight;
- never slow ordering down.

Use restrained:

- press compression;
- subtle bounce/rebound;
- short light sweeps on important CTAs;
- smooth image transitions;
- bottom-sheet spring motion;
- success confirmation motion;
- page transitions.

Respect `prefers-reduced-motion`.

---

# 4. BRAND SYSTEM — USE THE SUPPLIED COLOR BOARD AS THE IDENTITY SOURCE

Primary:

```text
#173F35
```

Secondary:

```text
#B85C38
```

Tertiary / premium gold:

```text
#C69A52
```

Light neutral:

```text
#F7F0E3
```

The provided Modern Egyptian Heritage palette is the visual source of truth.

Derived Light palette:

```text
background        #F7F0E3
surface            #FFFDF8
elevated           #FFFFFF
text-primary       #18211E
text-secondary     #66706B
border             rgba(23,63,53,0.10)
primary            #173F35
secondary          #B85C38
gold               #C69A52
success            #2E7D57
warning            #B87B27
error              #B33A32
```

Derived Dark palette:

```text
background         #07110E
surface-1          #0C1714
surface-2          #10211C
glass              rgba(255,255,255,0.055)
glass-strong       rgba(255,255,255,0.085)
text-primary       #F7F0E3
text-secondary     #B9C1BC
border             rgba(247,240,227,0.11)
primary            #173F35
secondary          #B85C38
gold               #C69A52
```

Use gradients sparingly and purposefully.

Preferred premium direction:

```css
linear-gradient(135deg, #173F35 0%, #0C1714 55%, #B85C38 125%)
```

Gold highlight:

```css
linear-gradient(100deg, transparent 20%, rgba(198,154,82,0.18) 48%, transparent 76%)
```

Do not cover the site with gradients.

---

# 5. TYPOGRAPHY

Use the supplied brand direction:

Arabic body:

```text
IBM Plex Sans Arabic
```

Latin / labels:

```text
Inter
```

Use only these two font families unless the project already has a technically necessary exception.

Recommended weights:

- 400 regular
- 500 medium
- 600 semibold
- 700 bold where necessary

Mobile scale should remain close to the master spec:

- Display: 36–44px
- H1: 30–34px
- H2: 24–28px
- H3: 20–22px
- Body large: ~17px
- Body: 15–16px
- Small: 13px
- Label: 12px
- Caption: 11px

Desktop:

- Display: 56–72px
- H1: 44–56px
- H2: 32–40px
- H3: 24–28px

Never use typography to create visual noise.

---

# 6. RESPONSIVE SYSTEM

Design and test at:

```text
360
375
390
414
430
768
1024
1280
1440
1920
```

Do not build one mobile breakpoint and one desktop breakpoint and call it responsive.

Use fluid sizing and meaningful breakpoint changes where appropriate.

Pay special attention to:

- narrow RTL layouts;
- Arabic line breaks;
- sticky elements;
- bottom navigation safe areas;
- long product names;
- variant names;
- image aspect ratios;
- checkout forms;
- cards at 360–390px widths.

---

# 7. SPLASH / APP ENTRY EXPERIENCE

On initial entry:

1. Present a premium Tamara-branded splash/loading screen.
2. Use the provided `wh_logo_mt` asset/video exactly as the visual source where technically appropriate.
3. Integrate the Tamara logo asset if the supplied animation does not already include it.
4. Keep the entry sequence short and polished.
5. Never create a fake loading delay solely to show animation.
6. If the app is already warm/cached, do not force the user to watch a long splash sequence.
7. Respect reduced-motion preferences.

The splash should feel like a premium digital brand reveal, not a generic spinner.

---

# 8. GLOBAL ANNOUNCEMENT BAR

At the very top of the customer experience, create a thin, highly polished announcement/promotion bar.

It must be admin-controlled.

Example messages:

- "Order over AED 500 and get free delivery"
- "5% off your first order"
- "Fresh Egyptian home cooking, made for you"

Requirements:

- single-line by default;
- horizontally scrolling/marquee only when useful;
- smooth, subtle movement;
- pause/slow behavior when accessibility requires it;
- optional CTA;
- scheduling;
- enabled/disabled state;
- theme-aware styling;
- admin-editable content;
- can rotate multiple messages;
- can be prioritized;
- can be assigned to target segments.

The bar must never consume excessive vertical space on mobile.

---

# 9. LANDING PAGE — THE MOST IMPORTANT SCREEN

This is the primary visual benchmark for the entire project.

Do not treat it as a standard hero + three cards + footer template.

Build a sequence of visual moments with strong pacing.

### Required landing structure

At minimum, derive the following from the master specification:

1. Global announcement bar.
2. Premium responsive header.
3. Hero experience.
4. Exclusive offers section.
5. Quick categories.
6. Signature/best sellers.
7. Storytelling / brand section.
8. Monthly / half-month packages.
9. Prepared/frozen food section.
10. Catering / large orders entry point.
11. Trust / reviews / social proof.
12. App/PWA call-to-action.
13. FAQ / useful information where specified.
14. Footer.

The exact order and density must follow the master specification.

---

# 10. HERO ART DIRECTION

The hero must be visually arresting.

Desktop:

- cinematic composition;
- large hero food image/media;
- controlled negative space;
- layered depth;
- subtle background texture or atmosphere;
- strong but restrained CTA hierarchy;
- editorial typography;
- premium card overlays where useful.

Mobile:

- food must dominate the first viewport;
- headline remains immediately readable;
- CTA must be thumb-friendly;
- avoid pushing the real conversion action below too much decorative content;
- use edge-to-edge imagery when appropriate;
- use layered cards sparingly.

The hero should communicate "Egyptian home food" without needing a paragraph to explain it.

Never use arbitrary stock imagery when real Tamara product imagery is available.

---

# 11. EXCLUSIVE OFFERS — DYNAMIC VISUAL STRIP

At the top of the customer journey, present exclusive offers using a visually rich carousel/strip.

Think of these as premium, image-led offer panels rather than ordinary banners.

Requirements:

- image-first;
- touch swipe on mobile;
- desktop drag/arrow behavior;
- clear active state;
- optional auto-advance;
- pause on interaction;
- CTA per offer;
- deep linking to offer/product/category;
- admin controlled;
- image, title, subtitle, badge, CTA, schedule and destination all editable.

The admin must be able to replace these without changing code.

---

# 12. QUICK CATEGORIES

Provide a fast path into major menu groups.

Use visually distinctive but consistent category tiles/chips.

The system must support categories from the current menu and future categories.

Do not hardcode the category list in the UI.

---

# 13. BEST SELLERS / SIGNATURE MEALS

Create food cards that feel like premium editorial food objects.

Every card should support, as applicable:

- product image;
- product name;
- short description;
- rating;
- review count;
- price or price-from;
- badges;
- favorite control;
- add action;
- variant availability indicator;
- availability state.

Image composition is critical.

Use consistent card geometry but allow the food image itself to breathe.

---

# 14. PRODUCT DETAIL — CORE COMMERCE EXPERIENCE

This screen deserves the strongest interaction design in the product.

### Hero food stage

Create an immersive product visual stage.

On mobile:

- large top-view/hero food image;
- optional peripheral adjacent images visible at the edges to hint that more states exist;
- product title and rating below/around the image;
- price region;
- portion/variant selector;
- customization;
- quantity;
- CTA.

The layout should be inspired by the provided reference principle, but must become uniquely Tamara.

### Variant media behavior

When the user swipes or taps a portion:

- swap the actual image;
- update price;
- update variant metadata;
- update any changed serving description;
- transition the visual smoothly.

Do not zoom a single image to fake portion differences.

Use directional/semantic image transitions where appropriate.

Example conceptual sequence:

```text
Quarter Chicken
      ↓ swipe
Half Chicken
      ↓ swipe
Whole Chicken
```

Each is a separate visual asset.

### Important food-specific logic

Support products where:

- the variant changes serving count;
- the variant changes grams/portion;
- the variant changes number of pieces;
- the variant changes package composition;
- the variant changes sides;
- the variant changes price;
- the variant has unique availability.

The data model must handle this natively.

---

# 15. ADD-ONS / CUSTOMIZATION

Never treat food customization like generic ecommerce options.

Groups may be:

- required or optional;
- single-select or multi-select;
- quantity-limited;
- priced or free;
- variant-specific;
- unavailable at certain times.

UI should make the decision path obvious.

Use bottom sheets on mobile when they improve focus.

Do not overload the screen with nested dropdowns.

---

# 16. CART

The cart must feel fast and tactile.

Use a premium compact summary with:

- product image;
- selected variant;
- customization summary;
- quantity;
- line total;
- remove/edit;
- favorites/reorder opportunities where useful;
- subtotal;
- discount;
- delivery;
- total;
- next CTA.

Include smart upsell when appropriate.

Do not block checkout with unnecessary cross-selling.

Empty cart must still feel designed, not like a blank state.

---

# 17. CHECKOUT

Checkout must minimize cognitive load.

Recommended progression:

1. Contact/account.
2. Delivery location.
3. Exact map pin if needed.
4. Delivery timing.
5. Order summary.
6. Payment method.
7. Final place-order action.

Card payment must be present as a future-ready UI option, but currently display:

**"Coming soon" / "متوفر قريبًا"**

The actual currently-supported payment path must match the project's configured ordering process.

Never present an unavailable payment option as active.

---

# 18. ADDRESS + GOOGLE MAP LOCATION

Support both:

### A. Manual address

User can type:

- building;
- apartment;
- street;
- area;
- city;
- landmarks / notes;
- phone/contact data as required.

### B. Exact map location

Implement a Google Maps-based location selection flow comparable in usability to mainstream delivery apps.

Requirements:

- map picker;
- draggable pin or tap-to-place;
- current-location permission when user chooses it;
- reverse-geocoded address display;
- user confirmation before saving;
- saved addresses;
- delivery address notes.

Do not request location access on page load without context.

Explain why location is needed.

---

# 19. DELIVERY TIME

Create a clear selection interface for:

- ASAP when available;
- scheduled delivery windows;
- unavailable/closed states;
- dynamic rules from the backend.

Do not let users choose impossible time slots.

---

# 20. ORDER CONFIRMATION

After order submission:

- provide immediate confirmation;
- order number;
- expected timing;
- summary;
- address;
- contact/help actions;
- tracking entry point;
- optional WhatsApp continuation when configured.

Use tasteful success motion.

---

# 21. ORDER TRACKING

Create a highly readable status timeline.

Possible states should be data-driven, e.g.:

```text
Order received
Confirmed
Preparing
Out for delivery
Delivered
```

Support timestamps and meaningful status messages.

Do not create fake live progress if the backend does not support it.

---

# 22. RATINGS & REVIEWS — FULL CUSTOMER FEEDBACK LOOP

Customers must be able to rate food they actually ordered.

Important behavior:

- only verified purchasers can leave verified product reviews;
- show overall product rating;
- show review count;
- support star rating;
- optional written review;
- optionally allow photo review in a future-ready design;
- allow review editing within defined rules;
- admin moderation/status management;
- display useful review breakdowns when data volume supports it.

After delivery, provide a tasteful post-purchase review prompt.

The experience should encourage reviews without annoying the customer.

---

# 23. APP / PWA EXPERIENCE

The web application must behave like a premium installable mobile product.

Support:

- installability;
- app shell;
- appropriate icons/manifest;
- offline-safe shell behavior where realistic;
- fast repeat launches;
- push notification readiness;
- mobile safe-area awareness;
- standalone mode styling;
- persistent theme/language preferences.

Do not pretend PWA is a native iOS/Android application. Use web capabilities honestly.

---

# 24. PUSH NOTIFICATIONS

Build the product so admins can send notifications to installed/subscribed users.

Notification center requirements:

- compose title;
- compose body;
- optional image;
- deep link target;
- schedule/send now;
- audience targeting;
- language targeting;
- theme-safe previews where useful;
- history/logs;
- delivery status where supported.

Examples:

- new offer;
- abandoned cart reminder;
- order status update;
- reorder reminder;
- seasonal menu;
- exclusive promotion.

### Permission UX

Do **not** throw the browser notification permission prompt at the user on first page load without context.

Instead:

1. Explain the value.
2. Show a branded, lightweight pre-permission prompt.
3. Ask for browser notification permission after meaningful engagement, or at a contextually appropriate moment.
4. Handle denied permission gracefully.
5. Do not repeatedly harass the user.

---

# 25. ADMIN-CONTROLLED PROMOTIONS

All key promotional content must be manageable from the dashboard.

The admin must be able to control:

- announcement bar;
- first-order discount;
- free-delivery threshold;
- exclusive offers;
- hero content;
- category visibility;
- product availability;
- campaign dates;
- priority;
- banner order;
- promotional copy;
- CTA destination;
- notification campaigns.

Do not hardcode business rules that the specification expects the admin to control.

---

# 26. FIRST ORDER DISCOUNT

Create a configurable first-order promotion.

Example:

```text
5% off first order
```

But the exact value must be editable.

Support business rules such as:

- first-order only;
- minimum order value;
- maximum discount;
- expiry;
- code or automatic application;
- eligibility conditions.

Show the benefit clearly without spamming the interface.

---

# 27. FREE DELIVERY RULE

Create a configurable threshold.

Example:

```text
Order over AED 500 → free delivery
```

This must be admin controlled.

The cart should communicate progress toward the threshold.

Example:

> "Add AED 72 more to unlock free delivery."

When reached:

> "Free delivery unlocked."

Do not show contradictory delivery messages.

---

# 28. NAVIGATION

## Mobile

Use a premium compact header plus bottom navigation where specified.

Bottom navigation should prioritize core behavior such as:

- home;
- menu/search;
- cart or primary action;
- orders/account depending on final information architecture.

The center action can be visually prominent without becoming a gimmick.

Respect device safe areas.

## Desktop

Use a sophisticated top navigation structure.

Do not simply enlarge mobile controls.

Desktop header should create strong brand presence and easy access to:

- menu;
- offers;
- packages;
- large orders/catering;
- account;
- cart.

---

# 29. SEARCH

Search should support:

- products;
- categories;
- relevant keywords;
- Arabic and English;
- typo tolerance where backend allows;
- useful empty states.

Make search accessible quickly, especially on mobile.

---

# 30. ACCOUNT

Include the customer account experience specified in the master spec.

Core areas:

- profile;
- addresses;
- order history;
- favorites;
- reviews;
- reorder;
- preferences;
- language;
- theme;
- notifications.

The account should feel like part of the same product, not a third-party auth screen.

---

# 31. CONTENT / STORYTELLING

The landing page should communicate authentic Egyptian home cooking through visual storytelling.

Use restrained editorial sections rather than long paragraphs.

The user's supplied menu data and current positioning should inform the content structure.

The menu source material includes Egyptian home food, complete meals, sweets, and event/large-order concepts; preserve the real business offering rather than inventing unrelated cuisine.

The freezer/prepared-food material includes items such as stuffed vegetables and prepared meat/chicken items intended for preparation/frying/cooking later; use this only where the master specification places the prepared-food section.

Do not invent specific prices or products not supported by the supplied source materials.

---

# 32. VISUAL LANGUAGE

Aim for:

### Depth

Use:

- layered backgrounds;
- soft shadows;
- restrained glows;
- realistic food shadows;
- glass surfaces;
- depth separation;
- subtle vignettes.

### Texture

Where appropriate, use extremely subtle Egyptian-inspired visual texture.

Never use obvious decorative patterns that compete with food.

### Shape language

Use a coherent radius system.

Suggested hierarchy:

- small UI: 10–12px;
- cards: 16–24px;
- large editorial surfaces: 24–32px;
- pill controls: fully rounded.

Do not make everything a giant pill.

---

# 33. MICRO-INTERACTIONS

Buttons:

- on press: subtle scale compression around 0.98;
- release: quick return with light rebound;
- primary CTA can receive a subtle light sweep occasionally.

Cards:

- tiny elevation shift on hover desktop;
- touch feedback on mobile;
- image scale only by a very small amount;
- never cause layout jump.

Add to Cart:

- button confirmation state;
- cart indicator update;
- subtle visual confirmation;
- optional mini cart pulse.

Favorite:

- icon state transition;
- lightweight confirmation.

Variant change:

- image transition;
- price transition where appropriate;
- no jarring reflow.

Success:

- minimal celebratory motion;
- accessible status announcement where appropriate.

---

# 34. GLASSMORPHISM SPECIFICATION

Glass surfaces should generally combine:

- low-opacity fill;
- backdrop blur;
- subtle light border;
- soft shadow;
- correct contrast against background.

Never use extreme blur that makes content behind the glass unreadable.

On lower-performance devices, gracefully reduce blur complexity.

Do not apply expensive backdrop filters to every card on a page.

---

# 35. LIGHT SWEEP

A light sweep can be used on high-priority CTAs and promotional surfaces.

Rules:

- brief;
- subtle;
- not constantly repeating;
- should not look like a loading animation;
- pause when reduced motion is preferred.

A CTA should still look premium when the sweep is disabled.

---

# 36. PERFORMANCE — VISUAL QUALITY WITHOUT SLOWNESS

Because food imagery is central, performance is a first-class constraint.

Implement:

- responsive images;
- proper image formats when supported;
- lazy loading below the fold;
- eager/priority loading for hero media;
- correct width/height to prevent layout shift;
- compression;
- caching;
- route-level code splitting where beneficial;
- animation efficiency;
- minimal unnecessary JavaScript;
- graceful fallback for video.

Do not sacrifice the hero experience, but do not load the entire restaurant catalog at first paint.

---

# 37. ACCESSIBILITY

Target strong WCAG-oriented implementation.

At minimum:

- semantic HTML;
- correct heading hierarchy;
- visible focus states;
- keyboard navigation;
- accessible names for icons;
- sufficient contrast;
- meaningful alt text;
- form labels;
- error messaging;
- reduced-motion support;
- screen-reader state announcements where appropriate;
- touch targets suitable for mobile.

Glass and visual effects must never reduce readability.

---

# 38. SEO

Landing pages should include:

- meaningful title;
- meta description;
- canonical strategy;
- Open Graph data;
- structured data where appropriate for restaurant/product/content;
- semantic content;
- indexable text;
- clean URLs;
- multilingual metadata when supported.

Do not hide all important content inside client-only effects.

---

# 39. DATA ARCHITECTURE

Use the master specification's data model as the source of truth.

Core concepts include:

- users;
- addresses;
- categories;
- products;
- product variants;
- addons;
- addon groups;
- orders;
- order items;
- promotions;
- banners;
- homepage sections;
- notifications;
- reviews;
- customers/preferences;
- analytics events.

Do not create one giant JSON object for the entire application.

Separate content data from business logic.

---

# 40. WHAT MUST NOT BE HARDCODED

Do not hardcode things that the admin is explicitly supposed to control.

Examples:

- offer text;
- banner ordering;
- free-delivery threshold;
- first-order discount;
- product availability;
- variant availability;
- prices;
- image assignments;
- homepage sections;
- notification campaigns;
- review publication status;
- announcement bar content.

The frontend should render controlled content from data/configuration.

---

# 41. ADMIN DASHBOARD — PREMIUM INTERNAL PRODUCT

The admin dashboard is part of the same product ecosystem.

It must support the required management workflows from the master specification.

Core areas:

- overview;
- orders;
- WhatsApp handoff;
- menu management;
- product variants;
- homepage builder;
- banners/offers;
- reviews;
- notifications;
- customers;
- analytics;
- settings;
- promotion rules.

The dashboard should prioritize clarity and speed over decorative effects.

Do not apply the customer-facing visual effects indiscriminately to the admin experience.

---

# 42. HOMEPAGE BUILDER

Admins should be able to control the sequence and visibility of important homepage content without modifying code.

Support, according to the master spec:

- sections;
- ordering;
- visibility;
- content;
- hero content;
- offers;
- categories;
- featured products;
- packages;
- prepared food;
- storytelling blocks;
- CTA destinations.

Where practical, use draft/publish concepts.

---

# 43. WHATSAPP HANDOFF

The order flow must support the configured WhatsApp handoff process.

Do not duplicate or lose customer order data when handing off.

Create a stable order identifier.

The dashboard should allow staff to see the same order details that are sent to WhatsApp.

Do not depend solely on the WhatsApp message as the database record.

---

# 44. ERROR, EMPTY, LOADING AND OFFLINE STATES

Every important screen needs designed states.

Examples:

- empty cart;
- no orders;
- no favorites;
- no reviews;
- no search results;
- product unavailable;
- network error;
- map unavailable;
- notification permission denied;
- location permission denied;
- payment coming soon;
- loading products;
- submitting order.

Use skeletons and placeholders that preserve layout geometry.

Avoid generic spinner-only experiences.

---

# 45. DESKTOP ART DIRECTION

Desktop should not be a wide mobile phone.

Use:

- editorial whitespace;
- intentional asymmetry;
- wider food imagery;
- layered hero layouts;
- stronger grid rhythm;
- premium hover behavior;
- balanced multi-column sections;
- carefully limited floating elements.

At 1440px and above, create a real sense of breathing room.

At 1920px, prevent content from becoming awkwardly stretched.

---

# 46. PHOTO DIRECTION

Food photography should generally favor:

- top-down where the dish benefits from it;
- 45-degree angle for dimensional dishes;
- cinematic soft shadows;
- authentic textures;
- realistic portion scale;
- clean surfaces;
- warm food highlights;
- dark or neutral backgrounds depending on theme;
- enough negative space for UI overlays.

The photography should make portion differences obvious.

Example:

Quarter chicken must visually feel like a quarter serving.
Whole chicken must visually feel meaningfully larger.

The image is part of the product data, not merely decoration.

---

# 47. DO NOT FAKE THE PRODUCT CATALOG

Where actual menu data is available in the provided source material, use it.

The supplied menu includes Arabic food items and pricing by size/category in AED, and the current business materials should be reflected without fabricating unsupported inventory.

Where images are not yet available:

- create correct image slots;
- use tasteful placeholders only during development;
- make it trivial for the admin to upload/assign the final image;
- do not pretend placeholder images are real Tamara food photography.

---

# 48. CUSTOMER PSYCHOLOGY / CONVERSION

Every primary screen should answer:

1. What can I eat?
2. Does it look good?
3. How much does it cost?
4. What exactly do I get?
5. Can I trust it?
6. How fast can I order?
7. What should I click next?

Remove unnecessary friction.

Do not force account creation before browsing.

Do not force location permission before it is useful.

Do not hide prices.

Do not make the add-to-cart action ambiguous.

Do not make customers dig through menus to find the popular items.

---

# 49. VISUAL HIERARCHY

The visual priority should generally be:

1. Food image.
2. Main value proposition.
3. Primary CTA.
4. Price / offer.
5. Supporting information.
6. Secondary actions.

No decorative object should overpower the primary food/product action.

---

# 50. IMPLEMENTATION ORDER

Implement in this order unless the existing project architecture requires a slight variation:

### Phase 1 — Foundation

- audit repo;
- establish design tokens;
- theme architecture;
- typography;
- spacing;
- breakpoints;
- shared primitives;
- localization direction system;
- motion primitives;
- icon system;
- asset pipeline.

### Phase 2 — Entry + Landing

- splash;
- global announcement bar;
- header;
- hero;
- exclusive offers;
- categories;
- best sellers;
- storytelling;
- package sections;
- reviews/trust;
- app CTA;
- footer.

### Phase 3 — Commerce

- menu;
- search;
- category browsing;
- product detail;
- variant image switching;
- customization;
- cart;
- checkout;
- map location;
- delivery slots;
- confirmation;
- tracking.

### Phase 4 — Account / Loyalty

- profile;
- addresses;
- orders;
- favorites;
- reviews;
- reorder;
- preferences;
- notifications.

### Phase 5 — Admin

- dashboard overview;
- orders;
- WhatsApp;
- menu;
- variants;
- homepage builder;
- offers;
- reviews;
- notifications;
- customers;
- analytics;
- settings.

### Phase 6 — PWA / Push / Performance

- manifest;
- service worker strategy;
- installation UX;
- push permission UX;
- notification infrastructure;
- image optimization;
- performance pass;
- accessibility pass;
- SEO pass;
- QA.

---

# 51. DEVELOPMENT WORKFLOW — DO THIS BEFORE CODING EACH MAJOR AREA

For each major feature:

1. Read the corresponding master-spec section.
2. Inspect existing implementation.
3. Identify reusable components.
4. Define the data contract.
5. Define responsive behavior.
6. Define loading/error/empty states.
7. Define motion/state transitions.
8. Implement.
9. Test at required breakpoints.
10. Test both themes.
11. Test Arabic RTL and English LTR.
12. Check accessibility.
13. Check console/runtime errors.
14. Check visual regression risks.

Do not implement visually first and functionality later if doing so causes rework.

---

# 52. VISUAL QA STANDARD

The final product should be judged at:

### Mobile

360 × 800-ish
375 × 812-ish
390 × 844-ish
414 × 896-ish
430 × 932-ish

### Tablet

768 width
1024 width

### Desktop

1280
1440
1920

For each:

- Light mode.
- Dark mode.
- Arabic RTL.
- English LTR where meaningful.

Look specifically for:

- overflowing text;
- broken Arabic wrapping;
- layout jumps;
- incorrect directional icons;
- oversized glass blur;
- weak contrast;
- poor hero crop;
- tiny touch targets;
- excessive scrolling before CTA;
- variant image mismatch;
- expensive animations;
- desktop whitespace issues;
- mobile sticky navigation collisions;
- safe-area collisions.

---

# 53. FUNCTIONAL QA STANDARD

Verify at minimum:

- browse menu;
- search;
- open product;
- change variant;
- image updates with variant;
- price updates with variant;
- customize;
- quantity changes;
- add to cart;
- edit cart item;
- remove item;
- first-order discount logic;
- free-delivery threshold logic;
- address entry;
- map location selection;
- delivery time selection;
- order creation;
- order identifier creation;
- WhatsApp handoff;
- order tracking;
- product review eligibility;
- review submission;
- language switching;
- RTL/LTR;
- theme switching;
- PWA installation readiness;
- notification permission flow;
- admin content changes reflected in customer UI.

---

# 54. CRITICAL DESIGN QUALITY BAR

Do not stop when the app is merely functional.

The desired quality level is:

**"This looks like a premium, bespoke food-commerce product that could confidently be shown as a flagship digital experience."**

The product should have:

- visual identity;
- emotional impact;
- consistency;
- speed;
- polish;
- restraint;
- excellent typography;
- convincing food presentation;
- meaningful motion;
- clear conversion hierarchy.

Do not chase visual novelty at the expense of usability.

Do not add random features just to look impressive.

---

# 55. IMPORTANT: DO NOT ASK FOR PERMISSION TO FOLLOW THE SPEC

Do not pause after reading the specification to ask whether you should build the requested pieces.

Proceed with implementation.

Do not replace the requested architecture with a simpler mock just because it is easier.

Do not generate fake screenshots and call them implementation.

Build the real responsive interface in the existing project.

When backend dependencies are not yet available, create clear, typed interfaces/mock services that can later be replaced without rewriting the UI.

---

# 56. IMPORTANT: DO NOT INVENT VISUAL IDENTITY

The Tamara visual identity is defined by the supplied color board and assets.

Do not introduce:

- neon purple;
- random gradients;
- unrelated typefaces;
- generic food-delivery red;
- excessive beige decoration;
- random ornamental Egyptian graphics;
- cartoon food illustrations;
- generic stock restaurant imagery as final art.

The signature should remain:

```text
#173F35
#B85C38
#C69A52
#F7F0E3
```

with deep dark surfaces derived from the system.

---

# 57. IMPORTANT: THE PRODUCT PAGE IMAGE SYSTEM MUST BE DATA-DRIVEN

Implement a reusable variant media model resembling:

```ts
type ProductVariant = {
  id: string;
  name: string;
  labelAr: string;
  labelEn: string;
  price: number;
  image: string;
  thumbnail?: string;
  gallery?: string[];
  descriptionAr?: string;
  descriptionEn?: string;
  servingInfo?: string;
  available: boolean;
};
```

The actual schema should match the project's backend conventions and master spec, but the principle is mandatory:

**variant → media → price → serving metadata**

are linked.

---

# 58. IMAGE TRANSITION QUALITY BAR

When a variant changes:

- do not instantly flash a different image;
- do not use a crude crossfade if the composition would look like an accidental dissolve;
- use a short, elegant transition that preserves focus;
- maintain stage dimensions to avoid layout shift;
- make the selected variant clearly active.

For swipe gestures, the interaction should feel physically connected to the user's gesture whenever technically appropriate.

---

# 59. LANDING PAGE CONVERSION RULES

The landing page should expose the ordering path early.

A visitor should be able to reach the menu/product flow quickly.

Hero CTA should be unmistakable.

Popular food should not be hidden behind several secondary sections.

Offers should be visually obvious.

Social proof should appear after meaningful product exposure, not before the user knows what is being sold.

The page should alternate:

**desire → proof → choice → action → trust → deeper discovery**

rather than becoming one continuous wall of cards.

---

# 60. RECOMMENDATIONS / REORDER / PERSONALIZATION

Where specified by the master spec, support first-stage personalization based on non-sensitive product behavior such as:

- previous orders;
- favorites;
- category affinity;
- abandoned cart;
- recently viewed products.

Recommendations must remain transparent and useful.

Reorder should be fast.

Do not introduce intrusive personalization.

---

# 61. ANALYTICS

Track meaningful events using the naming system from the master specification.

At minimum conceptually:

- landing_view;
- offer_view;
- offer_click;
- category_view;
- product_view;
- variant_change;
- addon_select;
- add_to_cart;
- remove_from_cart;
- checkout_start;
- address_saved;
- map_location_confirmed;
- delivery_slot_selected;
- order_created;
- order_completed;
- review_started;
- review_submitted;
- notification_prompt_shown;
- notification_permission_result;
- pwa_install_prompted;
- pwa_installed.

Use the actual event naming contract in the master spec.

---

# 62. SECURITY

Follow the security requirements in the master specification.

Never expose secrets in frontend code.

Validate order totals and promotion eligibility on the server side when a backend exists.

Do not trust client-supplied prices.

Do not trust client-supplied discount amounts.

Do not trust client-supplied order totals.

Use secure authentication patterns appropriate to the existing stack.

---

# 63. FUTURE CARD PAYMENT

Design the payment architecture so card payment can be activated later without redesigning checkout.

For now:

- show the payment option;
- visually communicate "Coming soon / متوفر قريبًا";
- do not allow submission through an unavailable gateway;
- keep the data model extensible.

---

# 64. FINAL COMMAND — EXECUTE THE PRODUCT, NOT A DEMO

Start now.

First inspect the repository and the complete `tamara-kitchen-master-product-spec.md`.

Then inspect every relevant asset in `assets/`.

Then establish the shared design foundation.

Then implement the Landing Page first and make it the visual benchmark for all customer-facing screens.

Then implement the commerce flow and app shell.

Then implement the admin system.

Continuously validate:

- mobile-first;
- desktop excellence;
- Arabic RTL;
- English LTR;
- Light;
- Dark;
- food-first visual hierarchy;
- real variant imagery;
- premium motion;
- controlled glass;
- fast performance;
- accessibility;
- conversion.

Do not settle for "looks okay".

Iterate until the experience feels like a deliberate, bespoke, premium product.

The final result should make a user think:

> **"I came to look… and now I am hungry enough to order."**

