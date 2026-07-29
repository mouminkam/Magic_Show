# Magic Show — Storefront

The customer-facing e-commerce site for **Magic Show** ("Magic Shoe"), a footwear and leather
goods brand. Built with Next.js 16 (App Router, TypeScript, Turbopack) and runs **entirely on an
in-app mock data layer** — no backend, no database, and no environment variables are required to
run it.

This is one of three sibling projects in the Magic Show portfolio:

| Project | Stack | Talks to a real backend? |
| --- | --- | --- |
| **Storefront** (this repo) | Next.js 16 + TypeScript | No — 100% mock data |
| [Admin dashboard](../admin-dashboard) | React + Vite + TypeScript | No — 100% mock data |
| [Backend API](../backend) | Laravel 12 | N/A (real API, not wired to either front end here) |

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

No `.env` file is required. There is nothing to seed or migrate — every product, order, blog post,
review, store location, and customer account is generated in-memory by `src/mocks/` the moment the
app loads.

Other scripts:

```bash
npm run build        # production build (next build)
npm start             # serve the production build
npm run lint          # eslint
npm test               # jest — unit tests
npm run test:watch    # jest --watch
npm run test:coverage # jest --coverage
npm run test:e2e       # playwright test (starts its own dev server)
```

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Server Components) — every route streams its data
  via `Suspense` rather than blocking on a single big fetch.
- **React 19**, **TypeScript** in strict mode — `src/` contains zero `.js`/`.jsx`.
- **Tailwind CSS v4**, tokens defined once in [`src/app/globals.css`](src/app/globals.css) and
  shared in architecture with the admin dashboard's `index.css` (same variable names/shape: a
  `canvas → surface → raised → sunken → overlay` surface scale, an `ink` neutral ramp, one `brand`
  accent, four semantic tones) — see **Brand identity** below.
- **Zustand** for client state (cart, wishlist, auth session, toasts, theme) — each store persists
  to `localStorage` where relevant.
- **Zod** for validation, checked with `.safeParse()` directly in each form's submit handler.
- **framer-motion** / **motion** and **GSAP** for entrance reveals and scroll-triggered animation.
- **Swiper** (carousels), **react-leaflet** + **Leaflet** (the store locator map).
- **Jest** + **Testing Library** for unit tests, **Playwright** for end-to-end tests.

## Brand identity

The accent color is **`#f97316`** (Tailwind's `orange-500`) on a black/gray neutral scale — this is
the original brand's actual identity, not an invented palette. It's shared with the admin
dashboard's design tokens so the two apps read as one brand. Light and dark mode both ship with
correct accent values (`#f97316` light / `#fb923c` dark).

The logo is the brand's real mark (`public/images/logo.png`, wordmark **"MAGIC SHOE"** with a
three-bar angled icon above it) — `src/components/Logo/Logo.tsx` renders it at its native aspect
ratio rather than forcing it into a square tile. The browser tab favicon
(`favicon-32.png`/`icon-512.png`/`apple-icon.png`) is cropped directly from the icon mark, not a
separately drawn shape, so the tab icon and the header logo are the same asset.

## Routes

```
/                          → redirects to the same content as /home
/home                      home page: hero, featured categories, best sellers, new arrivals,
                            latest blog posts, newsletter
/shop                      product listing with filters (price, size, color, season)
/shop/[id]                 product detail — gallery, variant selection, add to cart
/cart                      cart with quantity edit, coupon application
/checkout                  shipping + payment form, order placement (redirects if not signed in)
/order-confirmation/[id]   post-purchase confirmation
/wishlist                  saved items
/blog                      article list
/blog/[id]                 article detail — hero, full body, comments, related posts
/about-us                  brand story, stats, team, testimonials
/contact-us                contact form + map
/stores                    store locator (Leaflet map)
/login /register           auth
/forgot-password /reset-password
/profile                   account details, order history, wishlist tab
```

## Architecture

```
src/
  app/            Next.js App Router routes. Each route folder holds its own
                   page.tsx, loading.tsx, error.tsx, and a _components/ folder
                   for route-local UI. Data fetching follows one consistent
                   pattern throughout: an async Server Component calls the
                   mock service layer and passes the resulting promise down
                   to a client "Stream" component wrapped in <Suspense>.
  mocks/          The mock backend. Seed data (src/mocks/data/) plus a typed,
                   Promise-returning service layer (src/mocks/services/) that
                   simulates latency, pagination, filtering, and search —
                   consumed exactly like a real REST client would be, so
                   swapping in a real API later only touches this folder.
  types/          Domain models (Product, Order, Cart, Customer, BlogPost, …).
  store/          Zustand stores: cart, wishlist, auth, toast, theme.
  hooks/          Shared hooks (cart helpers, theme, language).
  lib/            Utilities, validation schemas, formatters, phone-number
                   normalization, the i18n language-reading helpers.
  components/     Shared UI: Header, Footer, Logo, shadcn-style primitives.
  locales/        i18n config and translation dictionaries (English + Arabic).
```

### Internationalization

The default locale is **Arabic**. `src/lib/getLanguage.ts` reads it server-side from a cookie;
`src/lib/getLanguageClient.ts` exports two things for the client side:

- `useLanguageClient()` — a hook, safe to call during render. Its first return value always
  matches the server-rendered default, then updates to the real cookie value in a `useEffect`
  after mount. **Use this in JSX/render.**
- `getLanguageClient()` — a plain function that reads the real cookie immediately. It is **not**
  hydration-safe and must only be called inside event handlers/callbacks (a submit handler, a
  click handler) — never during render, or it will cause a server/client text mismatch.

### Testing

- **Unit tests** (`npm test`) — Jest + Testing Library, covering business logic that's easy to get
  subtly wrong: cart totals and stock-clamping (`src/store/cartStore.test.ts`), phone number
  normalization, API error message extraction, image URL fallback resolution, and the
  hydration-safe language hook above.
- **End-to-end tests** (`npm run test:e2e`) — Playwright, one spec file per major area (home, auth,
  shop, cart/checkout/wishlist, blog, contact/about, stores, header navigation). These start their
  own dev server automatically per `playwright.config.ts`.

## Known trade-offs

- Every route renders dynamically (`ƒ` in the build output) with no ISR/`revalidate` caching
  strategy — fine for a portfolio demo on mock data, but a real production deployment serving
  content that doesn't change every request (product pages, blog posts) should add
  `export const revalidate = ...` to cut render cost at scale.
- This storefront and the admin dashboard are independent mock-data apps; neither is wired to the
  Laravel backend in this repo. Connecting them is a deliberate next step, not an oversight.
