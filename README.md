<p align="center">
  <img src=".github/assets/logo.png" alt="Magic Show" width="260" />
</p>

<h1 align="center">Magic Show — Storefront</h1>

<p align="center">
  <em>Footwear and leather goods, lasted by hand in Damascus.<br/>
  Built to be resoled, not replaced — and so is this codebase.</em>
</p>

<p align="center">
  <a href="https://magic-show.vercel.app/">
    <img alt="Live Demo" src="https://img.shields.io/badge/▶_LIVE_DEMO-magic--show.vercel.app-f97316?style=for-the-badge&logoColor=white" />
  </a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Tests" src="https://img.shields.io/badge/tests-jest_%2B_playwright-25c2a0" />
</p>

---

## What this is

This is the customer-facing storefront for **Magic Show** ("Magic Shoe"), a fictional footwear and
leather goods brand built as a portfolio piece — a full, opinionated Next.js e-commerce build with
no shortcuts taken on the parts that are usually skipped in a demo: real TypeScript everywhere,
a properly typed mock backend instead of a pile of hardcoded arrays, hydration-safe internationalization,
and a design system that isn't just "whatever Tailwind's defaults happen to look like."

It runs **entirely on an in-app mock data layer** — clone it, `npm install`, `npm run dev`, and
you're browsing a fully populated store in seconds. No database, no `.env` file, no backend server
to spin up first.

> 🔗 **[magic-show.vercel.app](https://magic-show.vercel.app/)** is this exact repository, deployed
> as-is — click through instead of cloning it if you just want to see it running.

This is one of three sibling projects that make up the Magic Show portfolio:

| Project | Stack | Role |
| --- | --- | --- |
| **Storefront** *(this repo)* | Next.js 16 + TypeScript | The public-facing shop |
| Admin dashboard | React + Vite + TypeScript | The internal console staff would use to run the store |
| Backend API | Laravel 12 | The real REST API the frontends are modeled against |

Each one runs standalone on its own mock/seed data, so you can clone and evaluate any single piece
without the other two.

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. That's it — no environment variables, no seeding step, nothing to
configure. Every product, order, blog post, review, store location, and customer account is
generated the moment the app boots.

```bash
npm run build          # production build
npm start                # serve the production build
npm run lint             # eslint
npm test                  # jest — unit tests
npm run test:watch       # jest --watch
npm run test:coverage    # jest --coverage
npm run test:e2e          # playwright — starts its own dev server
```

## What's actually in the box

- **Full storefront flow** — browse, filter, view a product, add to cart, check out, receive an
  order confirmation, leave the site, come back, and your cart/wishlist/session are still there
  (persisted via `localStorage`).
- **Blog** with a real article detail page — hero, author byline, reading time, threaded comments,
  related posts — not just a list of titles that go nowhere.
- **Store locator** with an interactive Leaflet map.
- **Full auth flow** — register, log in, forgot/reset password — running against the mock layer,
  including the edge cases (invalid credentials, validation errors) that get skipped in most demos.
- **Bilingual** (English/Arabic), with correct RTL handling and a locale system built to survive
  server-side rendering without a hydration mismatch (see below — this is a real, easy-to-get-wrong
  problem that this codebase handles deliberately, not by accident).

## Brand identity

The accent color is **`#f97316`**, on a black-and-gray neutral scale — this is the brand's actual
identity, carried over faithfully rather than reinvented. It's shared in architecture with the
admin dashboard's own design tokens (same variable names, same shape), so the two apps read as one
product family even though they're built with entirely different tools.

The logo above is the brand's real mark — a "MAGIC SHOE" wordmark with a three-bar angled icon.
`src/components/Logo/Logo.tsx` renders it at its true aspect ratio instead of squashing it into a
square tile, and the browser tab icon is cropped directly from that same icon mark, so the tab and
the header are never out of sync with each other.

## Routes

```
/home                      hero, featured categories, best sellers, new arrivals, blog, newsletter
/shop                      product listing — price/size/color/season filters
/shop/[id]                 product detail — gallery, variant selection, add to cart
/cart                      cart with quantity edit and coupon application
/checkout                  shipping + payment, order placement
/order-confirmation/[id]   post-purchase confirmation
/wishlist                  saved items
/blog  /blog/[id]           article list and detail (hero, full body, comments, related posts)
/about-us                  brand story, stats, team, testimonials
/contact-us                contact form + map
/stores                    store locator
/login /register /forgot-password /reset-password
/profile                   account details, order history, wishlist tab
```

## How it's put together

```
src/
  app/            Next.js App Router routes. Every route follows the same
                   data-fetching shape throughout the app: an async Server
                   Component calls the mock service layer and hands the
                   resulting promise to a client "Stream" component wrapped
                   in <Suspense> — so the same pattern you learn on one page
                   works everywhere else too.
  mocks/          The mock backend: seed data plus a typed, Promise-returning
                   service layer that simulates latency, pagination, and
                   search — used exactly the way a real REST client would be,
                   so swapping in a real API later touches only this folder.
  types/          Domain models (Product, Order, Cart, Customer, BlogPost, …).
  store/          Zustand stores — cart, wishlist, auth, toast, theme.
  hooks/           Shared hooks (cart helpers, theme, language).
  lib/            Utilities, zod validation schemas, formatters, phone-number
                   normalization, and the i18n language-reading helpers.
  components/     Shared UI — Header, Footer, Logo, design-system primitives.
  locales/        i18n config and translation dictionaries (English + Arabic).
```

### A worked example: hydration-safe internationalization

The default locale is **Arabic**, read server-side from a cookie. That sounds simple until you
need to read that same preference on the client — and this is exactly the kind of detail that
looks fine in a demo and then breaks the moment a real user with a saved preference visits your
site. If a Client Component reads `document.cookie` directly during render, React's hydration pass
runs on the client where the cookie already exists, so the very first client render disagrees with
what the server actually sent — a hydration mismatch.

This codebase solves it with two clearly separated tools in `src/lib/getLanguageClient.ts`:

- **`useLanguageClient()`** — a hook. Its first return value always matches the server-rendered
  default, then updates to the real cookie value inside a `useEffect` once mounted. **Use this
  anywhere you read the language during render.**
- **`getLanguageClient()`** — a plain function for event handlers/callbacks only (a submit handler,
  a click handler), where there's no server render to disagree with.

It's a small thing, but it's the difference between a demo that happens to work in English and a
storefront that actually works correctly for a bilingual audience.

### Testing

- **Unit tests** (`npm test`) — Jest + Testing Library. Coverage is deliberately concentrated on
  the logic that's easy to get subtly wrong: cart totals and stock-clamping, phone number
  normalization across countries, API error message extraction, image fallback resolution, and the
  hydration-safe language hook described above.
- **End-to-end tests** (`npm run test:e2e`) — Playwright, one spec per major user journey (home,
  auth, shop, cart/checkout/wishlist, blog, contact/about, stores, header navigation). These spin
  up their own dev server automatically.

## Honest trade-offs

Nobody's portfolio project is finished, and pretending otherwise isn't useful to anyone evaluating
this code:

- Every route renders dynamically with no ISR/`revalidate` caching — the right call for a demo on
  mock data, but a real production deployment serving content that doesn't change every request
  (product pages, blog posts) should add `export const revalidate = ...` to cut render cost.
- This storefront and the admin dashboard are two independent mock-data apps — neither is wired to
  the Laravel backend in this portfolio. Connecting them is a deliberate next step, not an
  oversight; the mock service layer exists specifically so that swap is a small, contained change.
