# Lorem Ipsum — Try-on product page

A standalone product detail page (PDP) for the **Lorem Ipsum** storefront, built with Next.js 16,
React 19 and Tailwind CSS 4. The site hosts one product — the *Racer back mini dress* — and lets a
visitor upload up to five of their own images: the first becomes the enlarged hero and the rest are
arranged two-up beneath it, exactly like the Figma design.

Everything runs client-side. Uploaded images never leave the browser.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run test:e2e   # headless Playwright interaction suite
```

Node **20.9+** (`.nvmrc` pins 22). **No environment variables are required.** This app is not
connected to Shopify — product data lives in `lib/catalog.ts` and the bag is client-side.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/NachiketKandari/tryon-product-page)

The repository already exists, so use **Import Git Repository** (do not use “Clone”):

1. Open https://vercel.com/new/import?s=https://github.com/NachiketKandari/tryon-product-page
2. Choose **Import Git Repository → `NachiketKandari/tryon-product-page`**.
3. Framework preset **Next.js**, root directory **`/`**. `vercel.json` already sets install/build
   commands; leave the environment variables empty.
4. Deploy. `NEXT_PUBLIC_SITE_URL` is optional; set it only for a custom domain.

You can also deploy from the CLI:

```bash
npx vercel        # preview
npx vercel --prod # production
```

## The try-on / image upload flow

| Step | What happens |
| ---- | ------------ |
| Entry points | “Upload your images” in the buy column, the pill on the hero, and the upload button on the mobile hero. |
| Bulk upload | File picker (`multiple`), camera capture, or drag-and-drop. **No image cap** (12 MB each, JPG/PNG/WebP/HEIC). |
| Auto-arrange | Image 1 → enlarged hero (800 × 1432 desktop, 2:3 mobile). Every later image → the two-up gallery grid, growing in pairs. Uploaded images use `object-contain`, so the whole photo is visible — never cropped. |
| Rearrange | In the studio: drag rows, use ↑ / ↓, or promote any image with **Hero**. The cap is deliberately absent — the layout extends for as many images as you add. |
| Apply | “Add N images to the page” replaces the product media. “Reset to product photos” restores them. |
| Scrolling | The studio sheet is a single scroll container on both mobile and desktop (`studio-scroll`, `overscroll-contain`); the page scroll is restored when it closes. |
| Persistence | `blob:` URLs only — refreshing the page clears the images (privacy by default). |

The studio lives in `components/try-on/try-on-studio.tsx`; the gallery swap lives in
`components/pdp/product-media.tsx`.

## Demo states

A compact **Demo state** bar sits above the product. **Out of stock** greys the apparel only (the
recommendation row, footer and chrome stay in colour), disables every size chip and swaps the CTA
for the design’s outlined **Notify me when available** panel. **Back in stock** restores it. Size
**M** carries the designed low-stock state (`Only 1 left in stock`) when in stock.

## Tests

`npm run test:e2e` runs a headless Chromium suite against a production build on port 3100:

- desktop **and** Pixel 5 mobile projects;
- gallery geometry (one hero + two-up), no-crop containment, recommendations 2-up scroller;
- upload: 1 image, bulk 5, 6+ (no cap), reorder/promote, reset, scroll inside the sheet, body-scroll unlock;
- size guide, accordions, size → add to bag → checkout feedback, search, wishlist, category/help
  panels, footer policies, newsletter, mobile menu;
- a final sweep that every visible button has a name and no `href="#"` links remain.

## Design source

The layout comes from the Figma file **“Lorem Ipsum Design I (Copy)”**:

| Role | Frame | id | Size |
| ---- | ----- | -- | ---- |
| Desktop PDP | `PDP - Default State (In Stock)` | `2044:2602` | 1440 × 3742 |
| Mobile PDP | `Mobile PDP - Default State (In Stock)` | `16:6217` | 390 × 4080 |

Full measurements, typography, colour and state deltas: [`docs/figma/pdp-design-spec.md`](docs/figma/pdp-design-spec.md).
Machine-readable trimmed trees: [`docs/figma/pdp-frames.json`](docs/figma/pdp-frames.json).
The frame/Journey inventory and interaction contract: [`docs/research/pdp-contract.md`](docs/research/pdp-contract.md).

How the Figma export works (the plugin in the template repo, and how frames were read offline):
`docs/research/pdp-contract.md § export plugin`.

### Design notes / deliberate deviations

- **Typography is DM Sans throughout.** The design file uses Helvetica for the footer and mobile
  header and Inter for modal buttons; the brand direction is DM Sans, so those are normalised.
- **Labels are sentence-cased** (`Colors`, `Description`, `Details`, `Shipping`, `You may also
  like`) per product direction; Figma draws them lowercase. The product title keeps Figma's
  12/600 uppercase, −0.02em treatment, stacked above the 14/600 price.
- **Low stock** is wired to size **M** (`Only 1 left in stock`, amber on desktop, black on mobile)
  so the designed low-stock state is reachable.
- **Buttons use the design-I 4 px radius** even though the inherited template token layer is
  zero-radius. Type sizes, spacing, gallery ratios and the 800/592 split follow the Figma file.
- **Mobile gallery is a swipe carousel** (the frame draws a single hero); it keeps the 2:3 ratio.
- **Recommendation images are placeholders** from the UniPlus catalogue; the design’s Figma
  `imageRef`s have no bytes in the export.
- Low-stock copy is demo data, not live inventory.

## Structure

```
app/
  layout.tsx            DM Sans, metadata, providers, header/footer
  page.tsx              the PDP + Product JSON-LD
  globals.css           design tokens, type roles, PDP + studio utilities
components/
  pdp/                  gallery, buy panel, accordions, size guide, recommendations
  try-on/               multi-image upload studio
  site/                 header, footer, bag drawer, feedback + search
lib/catalog.ts          the single product + recommendations (mock data)
public/                 wordmark, icons, product photography
docs/                   Figma spec, frame JSON, research
```

## What is not connected

Cart/checkout, accounts, search index and the wider catalogue are demonstration surfaces; they show
feedback or panels rather than calling a backend. Product data is local (`lib/catalog.ts`). To make
the page shoppable, replace the catalog module and the bag provider with real commerce calls; to run
an AI try-on model, add a server route and keep the upload opt-in (see `.env.example`).
