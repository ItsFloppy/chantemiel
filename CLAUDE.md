# Chantemiel — Context for Claude

## What this project is

Site vitrine one-page for **Chantemiel**, the honey farm of **Sophie Mus**, a certified-organic beekeeper in L'Isle-sur-la-Sorgue (Vaucluse, Provence). The site lets visitors browse six honey varieties, find retail points of sale on an interactive map, and submit an order request by email.

No online payment. Orders are sent via Formspree and Sophie follows up by email.

## Stack

- **Next.js 14** (App Router) — `next@14.2.29`
- **React 18**
- **TypeScript**
- **Tailwind CSS 3**
- **Sanity v3** — headless CMS, optional (site works without it)
- **Leaflet 1.9** — interactive map, client-only
- **Formspree** — order form submission by email, optional

## Deployment

- **Live in production** on **Netlify** (config in `netlify.toml`).
- Domain **`chantemiel.fr`** — purchased via **Hostinger**, DNS pointed at Netlify.
- The canonical origin is hard-coded as `SITE_URL` in `lib/seo.ts` (`https://chantemiel.fr`) and reused by `metadataBase`, `robots.ts`, `sitemap.ts` and all JSON-LD. **Update `SITE_URL` if the domain ever changes.**

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
npm run seed     # seed Sanity with the 6 miels (requires SANITY_API_TOKEN)
```

## Environment variables

Defined in `.env.local` (copy from `.env.local.example`).

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | No |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, default `production` | No |
| `SANITY_API_TOKEN` | Sanity write token, seed script only | No |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | Formspree form ID | No |

**Without Sanity**: `getMiels()` returns the static data from `lib/data.ts`.  
**Without Formspree**: `submitOrder` skips the HTTP call and sets `envoye = true` immediately (dev mode).

## Design tokens

### Colors (Tailwind custom tokens)

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FAF3E6` | Page background, light sections |
| `paper` | `#FFFCF5` | Cards, lighter surfaces |
| `honey` | `#E78300` | Primary accent, CTAs, links |
| `honey-deep` | `#C96A00` | Hover states, prices |
| `ink` | `#2A1C0E` | Main text, dark sections |
| `ink-soft` | `#5C4A35` | Secondary text |
| `sage` | `#7A7F52` | Tertiary accent |
| `sage-deep` | `#5E633C` | Sage hover |

### Typography

| CSS variable | Font | Tailwind class | Usage |
|---|---|---|---|
| `--font-display` | Playfair Display | `font-display` | Section titles, quotes, logotype |
| `--font-body` | EB Garamond | `font-body` | Body text, nav, buttons |
| `--font-hand` | Great Vibes | `font-hand` | Logotype "Chantemiel", SectionLabel filigrane |

Fonts loaded via `next/font/google` in `app/layout.tsx` and injected as CSS variables on `<html>`.

### Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-jar` | `0 24px 60px -24px rgba(42,28,14,0.55)` | Cards, FAB, modals |
| `shadow-soft` | `0 18px 50px -28px rgba(42,28,14,0.45)` | Lighter elevation |

## Architecture

### Data flow

```
app/page.tsx (server component)
  └─ getMiels()           ← Sanity GROQ or static fallback
       ↓
  miels: Miel[]           ← passed as props to client components
       ↓
  Catalogue, BonDeCommande, CartFab
```

`miels` is never stored in React context — it lives in server memory and is passed as props. This keeps `page.tsx` as a server component with ISR (`revalidate = 60`).

### Cart state

`CartProvider` (in `app/layout.tsx`) exposes:
- `selection: Selection` — `Record<"mielId__poids", quantity>`
- `client: ClientInfo` — form fields (nom, email, tel, adresseNumero, adresseRue, codePostal, ville, siret, message)
- `clientType: 'particulier' | 'entreprise'` — drives pricing (TTC vs HT) across catalogue + order form; **persists** across submit (not reset)
- `livraison: boolean` — particulier delivery toggle; adds La Poste shipping fee to the total
- `envoye`, `envoiEnCours`, `erreur`, `cartOpen` — UI state (`envoiEnCours` locks the submit button during the Formspree POST to prevent double-sends)
- `onAdd(miel, poids)` / `onRemove(miel, poids)` — increment/decrement selection
- `setQte(miel, poids, q)` — set an exact quantity (used by the catalogue number input); clamps to integers ≥ 0
- `resetClient()` — clears `client` + `livraison` (called after a successful submit)
- `submitOrder(e, miels)` — Formspree POST; takes `miels` as argument (not stored in context). Reads `clientType` + `livraison` from context; blocks particulier delivery > 5 kg and requires SIRET in entreprise mode

Cart key format: `"fleurs-luberon__500g"` (miel id + `__` + poids string).

### Pricing & shipping (particulier vs entreprise)

- **Particulier** — `prix` (TTC). Optional postal delivery (`livraison`) adds **frais de port** to the customer's charge per `fraisLivraison()`: ≤ 3 kg → 18,00 € · 3–5 kg → 24,50 € · > 5 kg → not shippable (blocked). Weight from `poidsToGrammes()` summed over the cart.
- **Entreprise** — `prixPro` (HT, per pot, from the Biosphère invoice — see gitignored `docs/facture-biosphere.md`). Sold à l'unité or by carton of 12 (`POTS_PAR_CARTON`). Recap shows sous-total HT + TVA 5,5 % (`TVA_PRO`) + total TTC and the carton breakdown. No frais de port (transport arranged directly). SIRET required.
- `prixFormat(format, type)` returns the right price string; `panierTotaux(selection, miels, type)` returns `{ lignes, totalArticles, totalPrix, poidsGrammes }`.

### Sanity

- Client: `lib/sanity.client.ts` — `sanityClient` + `urlFor()` image builder
- Queries: `lib/sanity.queries.ts` — `getMiels()` with `{ next: { revalidate: 60 } }`
- Schema: `sanity/schemaTypes/miel.ts` — `id` (slug), `nom`, `enLigne` (bool, "Visible sur le site", `initialValue: true`), `image` (with hotspot), `saison`, `terroir`, `description`, `notes[]`, `formats[]` (poids/prix/prixPro/disponible), `ordre`. Document preview flags `🚫 Masqué du site` when `enLigne === false`.
- Embedded studio at `/studio` — `app/studio/[[...tool]]/page.tsx` (server) + `StudioClient.tsx` (`'use client'`)
- Config: `sanity.config.ts` — `structureTool` + `visionTool`

GROQ projection in `getMiels()` (filters out hidden honeys — `enLigne != false` keeps legacy docs without the field visible):
```groq
*[_type == "miel" && enLigne != false] | order(ordre asc) {
  "id": id.current,
  nom,
  "image": image.asset->url,
  saison, terroir, description, notes, formats
}
```

### Leaflet map

`components/PointsDeVente.tsx` is `'use client'` and dynamically imports Leaflet inside `useEffect` (SSR-safe). It is also dynamically imported in `page.tsx` with `{ ssr: false }`.

Tiles: CARTO Voyager with a sepia filter (`filter: sepia(0.18) saturate(0.92)`) defined in `globals.css` under `#carte-pdv .leaflet-tile-pane`.

Map pins use `L.divIcon` with CSS class `.pin-miel` (honey teardrop) or `.pin-miellerie` (dark circle). Active pin gets `.is-active` (scale + darker). All pin styles are in `globals.css`.

### SEO

All SEO is centralised around `SITE_URL` in `lib/seo.ts`.

- **Metadata** — `app/layout.tsx` exports a full `Metadata`: `metadataBase`, title template, keywords (geo-targeted), canonical, `robots`, OpenGraph (`fr_FR`, 1200×630 image) and Twitter card. Page `<title>`/`<meta>` carry the keywords; on-page headings stay editorial.
- **Generated routes** (Next.js file conventions): `app/robots.ts` (allows all, disallows `/studio`, declares sitemap), `app/sitemap.ts` (homepage + section anchors), `app/manifest.ts` (PWA), `app/icon.jpg` + `app/apple-icon.jpg` (favicons, copies of `logo.jpg`).
- **Structured data (JSON-LD)** — `lib/seo.ts` builds it, `components/JsonLd.tsx` (server component) injects it in `page.tsx`:
  - `buildLocalBusinessLd()` — `LocalBusiness` (address, geo, tel, Ecocert credential) → Google local pack. Not `FoodEstablishment` (that type expects `servesCuisine`, irrelevant for a honey farm).
  - `buildProductsLd(miels)` — one `Product` per honey, one `Offer` per format (price EUR, in/out of stock).
  - `buildFaqLd()` — `FAQPage` from `FAQ_ITEMS` (same array feeds the visible `Faq.tsx` section, so copy stays in sync).
- **`/studio` is `noindex`** — `app/studio/[[...tool]]/page.tsx` spreads `next-sanity/studio` metadata and overrides `robots: { index: false, follow: false }`.

**Off-code SEO (not in repo, to be done by the owner):** Google Business Profile, Search Console + sitemap submission, local backlinks. These drive the local ranking more than anything in the code.

## File map

```
app/
  globals.css               All CSS: Tailwind, scrollbars, animations, Leaflet overrides
  layout.tsx                Fonts, CartProvider, full SEO metadata
  page.tsx                  Server component, ISR, assembles all sections + <JsonLd />
  robots.ts                 robots.txt (allow all, disallow /studio, sitemap ref)
  sitemap.ts                sitemap.xml (homepage + section anchors)
  manifest.ts               PWA web manifest
  icon.jpg / apple-icon.jpg Favicons (copies of logo.jpg, file-based convention)
  studio/[[...tool]]/
    page.tsx                Server shell, metadata + robots noindex
    StudioClient.tsx        'use client' NextStudio wrapper

components/
  ui/
    BioBadge.tsx            Leaf SVG + "Certifié BIO · Ecocert" badge
    Reveal.tsx              IntersectionObserver fade-in (translateY 24px → 0)
    SectionLabel.tsx        Great Vibes filigrane label, -translate-y-[130%], z-index -1; opacity via --section-label-opacity
    StatutPastille.tsx      Sage dot "Dispo" / grey dot "Épuisé"
    ClientTypeToggle.tsx    Particulier / Entreprise segmented control; drives clientType in cart (tone light|dark)
  Header.tsx                Scroll-aware fixed nav, solid = scrolled || open, mobile burger
  Hero.tsx                  Full-bleed autoplay video (BeeOnLavender), poster fallback, BioBadge, two CTAs
  Valeurs.tsx               4 trust pillars; centered, numbers in honey ring, vertical dividers
  Catalogue.tsx             Honey card grid; Particulier/Entreprise toggle; qty = input number + −/+ buttons; mode-aware pricing; duochromie on sold-out
  BonDeCommande.tsx         Order form + cart recap; structured address, SIRET (pro), delivery checkbox (particulier), HT/TVA/TTC vs frais de port; confetti on submit success
  CartFab.tsx               Floating cart button, spring animation, order panel overlay
  APropos.tsx               Sophie's story, portrait, italic quote, AB logo
  PointsDeVente.tsx         Leaflet map, 18 store pins, fly-to on list click
  Faq.tsx                   FAQ section, copy sourced from FAQ_ITEMS in lib/seo.ts
  Footer.tsx                Contact, nav links, BioBadge, copyright
  JsonLd.tsx                Server component injecting LocalBusiness + Product + FAQ JSON-LD

lib/
  types.ts                  Miel, Format (prix + prixPro), ClientType, PointDeVente, Contact, ClientInfo, Selection
  data.ts                   Static fallback: MIELS_STATIC (prix + prixPro), POINTS_DE_VENTE, MIELLERIE, CONTACT
  cart.tsx                  CartContext, CartProvider, useCart (clientType, livraison, setQte, resetClient)
  order.ts                  prixToNumber, poidsToGrammes, prixFormat, cartonLabel, fraisLivraison, formatEuro, panierTotaux, trouveItem, buildOrderBody; consts TVA_PRO, POTS_PAR_CARTON, FRAIS_PORT
  seo.ts                    SITE_URL, JSON-LD builders, FAQ_ITEMS
  sanity.client.ts          createClient + urlFor image builder
  sanity.queries.ts         getMiels() — Sanity or static fallback

sanity/
  schemaTypes/miel.ts       Sanity schema for honey documents

scripts/
  seed-sanity.ts            Uploads images + creates/replaces all 6 miel documents

public/images/
  miel-*.jpg                Six honey product photos
  BeeOnLavender.mp4         Hero background video (720×1280, ~7 MB, H.264; compressed from a .mov master that is gitignored)
  pyramide-pots.jpg         Hero poster / video fallback
  sophie-ruches.jpg         APropos portrait
  ruches-verte.jpg          APropos thumbnail vignette
  ruches-bleue.jpg          Unused (available)
  logo-ab.png               AB/BIO certification logo
  logo.jpg                  Site logo
```

## Key CSS classes (not Tailwind)

Defined in `app/globals.css`:

| Class | What it does |
|---|---|
| `section-label` | Filigrane opacity, driven by the `--section-label-opacity` CSS variable (default `0.5`) so the honey-deep color stays at full opacity |
| `scroll-soft` | Honey-tinted thin scrollbar for lists |
| `scroll-cart` | Dark-bg scrollbar for the order panel |
| `fab-bump` | Scale pulse on cart badge count change |
| `cart-expand` / `cart-collapse` | Spring in / ease out for order panel |
| `backdrop-in` / `backdrop-out` | Fade in/out for the overlay backdrop |
| `qte-input` | Catalogue quantity `<input type=number>` — hides the native spin buttons |
| `merci-check`, `merci-item`, `merci-confetti`, `merci-shine` | Post-submit success animation |
| `pin-miel`, `pin-miellerie`, `.is-active` | Leaflet map pin styles |

## Important constraints

- **`next.config.mjs`** not `.ts` — Next.js 14 doesn't support TypeScript config files.
- **Leaflet CSS** is imported in `globals.css` via `@import 'leaflet/dist/leaflet.css'` — never dynamically import it inside a component.
- **`metadata` cannot be exported from a `'use client'` component** — that's why the Sanity studio is split into a server `page.tsx` + client `StudioClient.tsx`.
- **`miels` is never stored in CartContext** — always passed as a prop to `submitOrder(e, miels)` and to the cart components directly, so `page.tsx` stays a server component.
- **Sanity `id` field is a slug type**, stored as `{ _type: 'slug', current: string }`. The GROQ query projects it as `"id": id.current` to match the `Miel` interface.
- **`createOrReplace` in the seed script** uses deterministic `_id` values (`miel-fleurs-luberon`, etc.) so re-running doesn't create duplicates.

## Real-world data

- **Sophie Mus** — apicultrice récoltante, 200 ruches
- **Address**: 315 Hameau Petit Palais, 84800 L'Isle-sur-la-Sorgue
- **Email**: chantemiel@wanadoo.fr — **Tel**: 06 34 99 23 99
- **Certification**: Agriculture Biologique, certified by **Ecocert**
- 6 honey varieties: Fleurs du Luberon, Châtaignier, Lavande, Bruyère Blanche, Acacia, Romarin
- 18 retail points of sale across Vaucluse, Bouches-du-Rhône
- **Wholesale (entreprise) prices** — HT, from the Biosphère invoice (kept in gitignored `docs/facture-biosphere.md`). Two tiers: low (Fleurs du Luberon, Châtaignier) `5,56 / 9,11 / 17,01 €`; high (Lavande, Bruyère, Acacia) `6,09 / 10,54 / 17,94 €`; Romarin ≈ high +0,02/0,03 € (`6,12 / 10,56 / 17,96 €`). Honey TVA = **5,5 %**. Cartons of 12.
- **Shipping (frais de port, particulier)** — customer's charge, La Poste rates: ≤ 3 kg → 18,00 € · 3–5 kg → 24,50 € · no postal delivery > 5 kg.
