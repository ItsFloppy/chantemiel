# Chantemiel — Context for Claude

## What this project is

Site vitrine one-page for **Chantemiel**, the honey farm of **Sophie Mus**, a certified-organic beekeeper in L'Isle-sur-la-Sorgue (Vaucluse, Provence). The site lets visitors browse her honey varieties, find retail points of sale on an interactive map, and submit an order request by email.

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
npm run seed     # seed Sanity with the 6 static miels (requires SANITY_API_TOKEN)
npm run seed:points # seed Sanity with the static points de vente (requires SANITY_API_TOKEN)
npm run restore  # restore prod Sanity from a local backup (DESTRUCTIVE; dry-run unless --yes)
```

Local Sanity ops live in `scripts/local/` (gitignored, need `SANITY_API_TOKEN`) — see the `scripts/` file map below.

## Environment variables

Defined in `.env.local` (copy from `.env.local.example`).

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | No |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, default `production` | No |
| `SANITY_API_TOKEN` | Sanity write token — seed + local backup/restore/migration tooling | No |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | Formspree form ID | No |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | Behold.so Instagram feed id — shows the `InstagramFeed` section | No |
| `NEXT_PUBLIC_FEATURABLE_ID` | Featurable widget id — shows the `AvisGoogle` section (live Google reviews) | No |

**Without Sanity**: `getMiels()` returns the static data from `lib/data.ts`.  
**Without Formspree**: `submitOrder` skips the HTTP call and sets `envoye = true` immediately (dev mode).  
**Without Behold / Featurable**: the `InstagramFeed` and `AvisGoogle` sections render `null` (fail-safe) — they appear only once their id env var is set.

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
- `clientType: 'particulier' | 'entreprise'` — particulier shows TTC pricing; entreprise shows **no price** and switches the flow to a **quote request (devis)** across catalogue + order form; **persists** across submit (not reset)
- `livraison: boolean` — particulier delivery toggle; adds La Poste shipping fee to the total
- `envoye`, `envoiEnCours`, `erreur`, `cartOpen` — UI state (`envoiEnCours` locks the submit button during the Formspree POST to prevent double-sends)
- `onAdd(miel, poids)` — increment selection (decrement/exact qty go through `setQte`)
- `setQte(miel, poids, q)` — set an exact quantity (used by the catalogue number input); clamps to integers ≥ 0
- `resetClient()` — clears `client` + `livraison` (called after a successful submit)
- `submitOrder(e, miels)` — Formspree POST; takes `miels` as argument (not stored in context). Reads `clientType` + `livraison` from context; blocks particulier delivery > 5 kg and requires SIRET in entreprise mode

Cart key format: `"fleurs-luberon__500g"` (miel id + `__` + poids string).

### Pricing & shipping (particulier vs entreprise)

- **Particulier** — `prix` (TTC). Optional postal delivery (`livraison`) adds **frais de port** to the customer's charge per `fraisLivraison()`: ≤ 3 kg → 18,00 € · 3–5 kg → 24,50 € · > 5 kg → not shippable (blocked). Weight from `poidsToGrammes()` summed over the cart.
- **Entreprise** — **demande de devis, aucun prix affiché.** The business composes a selection (same catalogue, no price shown) and submits a quote request; the CTA reads **« Demander un devis »** and Sophie replies with a personalised price by email. Recap shows only pot count + weight + carton breakdown (`cartonLabel`, carton of 12 = `POTS_PAR_CARTON`) — no HT/TVA/TTC, no total, no frais de port. SIRET required. **`prixPro` (HT, per pot, from the Biosphère invoice — gitignored `docs/facture-biosphere.md`) is kept in the schema/`MIELS_STATIC`/`normaliseMiels` as internal reference data but is no longer surfaced anywhere on the site or in the order email** (`prixValeur`/`prixFormat` still support the `entreprise` branch and `TVA_PRO` is still exported, but nothing displays them). `buildOrderBody` for entreprise sends the selection without unit prices and no totals.
- **Prices are stored as numbers** (euros — e.g. `6.5`, `17.01`) in Sanity (`number` field) and in `MIELS_STATIC`. The `€` is appended at display by `formatPrix()` — "11 €" / "6,50 €" (cents shown only when non-zero). `prixToNumber()` tolerates numbers *and* legacy strings ("6,50 €"), so a string↔number transition never breaks the render.
- `prixValeur(format, type)` → numeric unit price for the client type; `prixFormat(format, type)` → that value formatted with `€`; `panierTotaux(selection, miels, type)` returns `{ lignes, totalArticles, totalPrix, poidsGrammes }`.

### Sanity

- Client: `lib/sanity.client.ts` — `sanityClient` (the GROQ query projects `image.asset->url` directly, so no image-url builder is needed)
- Queries: `lib/sanity.queries.ts` — `getMiels()` + `getPointsDeVente()`, both with `{ next: { revalidate: 60 } }` and static fallback
- Schema: `sanity/schemaTypes/miel.ts` — `id` (slug), `nom`, `enLigne` (bool, "Visible sur le site", `initialValue: true`), `image` (with hotspot), `saison`, `terroir`, `description`, `notes[]`, `formats[]` (poids, `prix`/`prixPro` as **`number`** in euros — `€` added at render, `prix` required + positive — `disponible`), `ordre`. Document preview flags `🚫 Masqué du site` when `enLigne === false`; format preview renders the numeric price as "6,50 €".
- Schema: `sanity/schemaTypes/pointDeVente.ts` — `nom`, `ville`, `enLigne` (bool, "Visible sur la carte", `initialValue: true`), `lat`, `lng` (numbers, required, range-validated, descriptions explain how to get coords from Google Maps), `url?`, `ordre`. Feeds the interactive map via `getPointsDeVente()`.
- Both schemas are registered in `sanity/schemaTypes/index.ts` and listed in the **custom** studio structure in `sanity.config.ts` (a new doc type must be added there or it won't appear in the desk).
- Embedded studio at `/studio` — `app/studio/[[...tool]]/page.tsx` (server) + `StudioClient.tsx` (`'use client'`)
- Config: `sanity.config.ts` — `structureTool` (custom structure: Miels + Points de vente) + `visionTool`

GROQ projection in `getMiels()` (filters out hidden honeys — `enLigne != false` keeps legacy docs without the field visible):
```groq
*[_type == "miel" && enLigne != false] | order(ordre asc) {
  "id": id.current,
  nom,
  "image": image.asset->url,
  saison, terroir, description, notes, formats
}
```

`getMiels()` passes every Sanity result through **`normaliseMiels()`**, which enforces the non-nullable `Miel` contract so a single incomplete document can never crash the render (a render crash would freeze prod on the stale ISR page — the schema only requires `id` + `nom`, every other field can be empty). It guarantees: missing `image` → placeholder `/images/pyramide-pots.jpg`; `prix`/`prixPro` coerced to numbers via `prixToNumber`; `notes`/`formats` → `[]`; string fields → `''`; `disponible` → `false`; and `prixPro` back-filled from `MIELS_STATIC` (matched by slug + poids) when absent.

### Leaflet map

`components/PointsDeVente.tsx` is `'use client'` and dynamically imports Leaflet inside `useEffect` (SSR-safe). It is also dynamically imported in `page.tsx` with `{ ssr: false }`.

**Points de vente are Sanity-managed** (like miels): `page.tsx` server-fetches `getPointsDeVente()` and passes the result to `<PointsDeVente points={...} />` (the `dynamic` import still accepts props). `getPointsDeVente()` mirrors `getMiels()` — GROQ `*[_type == "pointDeVente" && enLigne != false] | order(ordre asc)` with `revalidate: 60`, a `normalisePointsDeVente()` null-safety layer, and a **static fallback to `POINTS_DE_VENTE` (lib/data.ts)** when Sanity is absent/empty/errors. Schema: `sanity/schemaTypes/pointDeVente.ts` (nom, ville, lat, lng, url?, `enLigne`, ordre); registered in `schemaTypes/index.ts` and in the custom studio structure in `sanity.config.ts`. Seed the 18 existing points with `npm run seed:points` (`scripts/seed-points.ts`, deterministic `_id: pdv-<id>`). **The `MIELLERIE` marker stays static in `lib/data.ts`** (Sophie's own fixed location). The fallback makes deploying code before seeding safe.

Tiles: CARTO Voyager with a sepia filter (`filter: sepia(0.18) saturate(0.92)`) defined in `globals.css` under `#carte-pdv .leaflet-tile-pane`.

Map pins use `L.divIcon` with CSS class `.pin-miel` (honey teardrop) or `.pin-miellerie` (dark circle). Active pin gets `.is-active` (scale + darker). All pin styles are in `globals.css`.

### SEO

All SEO is centralised around `SITE_URL` in `lib/seo.ts`.

- **Metadata** — `app/layout.tsx` exports a full `Metadata`: `metadataBase`, title template, keywords (geo-targeted), canonical, `robots`, OpenGraph (`fr_FR`, 1200×630 image) and Twitter card. Page `<title>`/`<meta>` carry the keywords; on-page headings stay editorial.
- **Generated routes** (Next.js file conventions): `app/robots.ts` (allows all, disallows `/studio`, declares sitemap), `app/sitemap.ts` (homepage + section anchors), `app/manifest.ts` (PWA), `app/icon.png` + `app/apple-icon.png` (favicons, file-based convention).
- **Structured data (JSON-LD)** — `lib/seo.ts` builds it, `components/JsonLd.tsx` (server component) injects it in `page.tsx`:
  - `buildLocalBusinessLd()` — `LocalBusiness` (address, geo, tel, Ecocert credential) → Google local pack. Not `FoodEstablishment` (that type expects `servesCuisine`, irrelevant for a honey farm).
  - `buildProductsLd(miels)` — one `Product` per honey, one `Offer` per format (price EUR, in/out of stock).
  - `buildFaqLd()` — `FAQPage` from `FAQ_ITEMS` (same array feeds the visible `Faq.tsx` section, so copy stays in sync).
- **`/studio` is `noindex`** — `app/studio/[[...tool]]/page.tsx` spreads `next-sanity/studio` metadata and overrides `robots: { index: false, follow: false }`.

**Off-code SEO (not in repo, to be done by the owner):** Google Business Profile, Search Console + sitemap submission, local backlinks. These drive the local ranking more than anything in the code.

### Acquisition : B2B, Instagram, avis Google

Three acquisition levers, built as fail-safe sections that render only once configured.

- **B2B / vente en gros** — `components/Professionnels.tsx`, a block rendered **inside `Catalogue`, directly under the Particulier/Entreprise switch** (`id=professionnels`). **Gated on `clientType === 'entreprise'`** — hidden in the default particulier mode; appears when the visitor flips the toggle, clicks the Hero pro link (`ProSwitchLink`), or the nav « Professionnels » item (both switch to entreprise then scroll to it). Its CTA reuses the **devis** flow (scroll to `#commander`). The order form gains **pro qualification fields** in entreprise mode (type d'établissement via `DropdownDark`, volume estimé) plus an opt-in « livraisons régulières » (both modes, default off — most orders are one-off) that flow into `buildOrderBody`. Nav + Hero link + sitemap anchor + B2B keywords (`layout.tsx`) + a wholesale FAQ item remain for discovery/SEO. Note: gating hides the pitch from the default SSR HTML — B2B SEO leans on the FAQ item + keywords. No white-label offering. Decision on record: **integrated (not a dedicated `/professionnels` route)**; the route stays the SEO upgrade path if B2B becomes the priority.
- **Instagram feed** — `components/InstagramFeed.tsx` via the **Behold.so** web component (`<behold-widget>` + `w.behold.so/widget.js`, `NEXT_PUBLIC_BEHOLD_FEED_ID`). Chosen over the Instagram Graph API (Basic Display API was shut down 2024-12-04; self-hosting needs a Business/Creator account + 60-day token refresh). Behold's free plan handles auth. **Prereq**: Instagram account converted to Business/Creator + a Behold feed.
- **Avis Google** — the priority is **collection**. `components/AvisGoogle.tsx` is an always-visible « Avis » section (gated only on `GOOGLE_AVIS_URL`, already set) with a strong CTA + the **displayed QR** (`public/images/qr-avis-google.png`, encodes `GOOGLE_AVIS_URL`) + stars. Extra collection touchpoints: the Footer button and a review pill on the order success screen. The same QR is meant for print on pots / points de vente. **Display** of live Google reviews is a bonus layered on top via **Featurable** (`react-google-reviews` dep, `NEXT_PUBLIC_FEATURABLE_ID`) — chosen over the Places API (New) which caps at 5 reviews, forbids storage, and bills the pricey Enterprise SKU. **Do NOT** add `AggregateRating` to `LocalBusiness` JSON-LD — self-serving reviews are ineligible for SERP stars (not a penalty, just no stars); the on-site widget is social proof only.

## File map

```
app/
  globals.css               All CSS: Tailwind, scrollbars, animations, Leaflet overrides
  layout.tsx                Fonts, CartProvider, full SEO metadata
  page.tsx                  Server component, ISR, assembles all sections + <JsonLd />
  robots.ts                 robots.txt (allow all, disallow /studio, sitemap ref)
  sitemap.ts                sitemap.xml (homepage + section anchors)
  manifest.ts               PWA web manifest
  icon.png / apple-icon.png Favicons (file-based convention)
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
    ProSwitchLink.tsx       'use client' link that sets clientType='entreprise' then scrolls to #professionnels (used by Hero pro link)
    DropdownDark.tsx        'use client' custom select for dark forms (native <select> renders badly on dark bg); used for the pro « type d'établissement »
    CheckboxDark.tsx        Shared custom checkbox (honey box + SVG check) for the dark order form — all order-form checkboxes use it (postal delivery, regular deliveries)
  Header.tsx                Scroll-aware fixed nav, solid = scrolled || open, mobile burger; « Professionnels » nav item switches to entreprise mode (reveals the gated section) then scrolls
  Hero.tsx                  Full-bleed autoplay video (BeeOnLavender), no poster (dark bg-ink while it loads); vertically centered, left-aligned content, BioBadge, three inline CTAs in one wrapping row (Découvrir / Bon de commande / Professionnels-pill via ProSwitchLink); ~100svh
  Catalogue.tsx             Honey card grid; Particulier/Entreprise toggle (ClientTypeBanner) with the Professionnels block rendered just below it (entreprise only); qty = input number + −/+ buttons; TTC price hidden in entreprise mode (devis); duochromie on sold-out
  Professionnels.tsx        'use client' B2B block (id=professionnels): pitch vente en gros, 3 icon tiles (no hover), CTA « Demander un devis » (→ scroll #commander). **Rendered INSIDE Catalogue, right under the switch**, and only when clientType === 'entreprise' (revealed by the toggle / Hero pro link / nav item)
  BonDeCommande.tsx         Order form + cart recap; the Particulier/Entreprise toggle shows only in the CartFab panel (stack) — on the page the StickyToggle covers it (`#commander-end` marks the sticky release point); structured address, SIRET (pro) + pro qualification fields (type établissement via DropdownDark, volume) + opt-in « livraisons régulières » (default off, both modes); particulier = TTC/frais de port/total, entreprise = devis (no price, CTA « Demander un devis »); confetti + Google review CTA on submit success
  CartFab.tsx               Floating cart button, spring animation, order panel overlay
  StickyToggle.tsx          'use client' « caught by scroll » Particulier/Entreprise switch: pins fixed at the SAME x as the catalogue toggle (#catalogue-toggle) once it hits TOP=88px (leaves a margin below the navbar), and hides that in-place toggle (visibility) so it reads as one element sticking — stays pinned through the whole order form, releasing when #commander-end (bottom of the order form) reaches TOP. Scroll-measured, shares clientType via useCart. The order section has NO in-place toggle (this covers it)
  APropos.tsx               Sophie's story, portrait, italic quote, AB logo
  InstagramFeed.tsx         'use client' Behold.so web-component feed (id=instagram); renders null unless BEHOLD_FEED_ID set
  AvisGoogle.tsx            'use client' « Avis » section (id=avis). Primary job = review COLLECTION: always shown (gated on GOOGLE_AVIS_URL) with a CTA + the QR (public/images/qr-avis-google.png) + stars. Bonus: shows the live Featurable reviews (react-google-reviews) above it when FEATURABLE_ID is set
  PointsDeVente.tsx         Leaflet map, store pins (points via props from Sanity/fallback), fly-to on list click
  Faq.tsx                   FAQ section, copy sourced from FAQ_ITEMS in lib/seo.ts (incl. a B2B « vente en gros » Q&A)
  Footer.tsx                Contact, nav links, BioBadge, copyright; Instagram link + « Laisser un avis Google » (both conditional on CONTACT.instagram / GOOGLE_AVIS_URL)
  JsonLd.tsx                Server component injecting LocalBusiness + Product + FAQ JSON-LD
  Loader.tsx                'use client' startup splash (cream + Great Vibes logotype + shimmer bar); fades out on DOM ready, mounted in layout.tsx

lib/
  types.ts                  Miel, Format (prix + prixPro as numbers), ClientType, PointDeVente, Contact, ClientInfo (+ typeEtablissement, volumeEstime, livraisonReguliere), Selection
  data.ts                   Static fallback: MIELS_STATIC (6 miels, prix + prixPro as numbers), POINTS_DE_VENTE, MIELLERIE, CONTACT (+ instagram), GOOGLE_AVIS_URL (Google review link), BEHOLD_FEED_ID + FEATURABLE_ID (from env; gate the Instagram/Avis sections)
  cart.tsx                  CartContext, CartProvider, useCart (clientType, livraison, setQte, resetClient)
  order.ts                  prixToNumber (tolerates string|number), prixValeur, formatPrix, prixFormat, poidsToGrammes, cartonLabel, fraisLivraison, formatEuro, panierTotaux, trouveItem, buildOrderBody; consts TVA_PRO, POTS_PAR_CARTON, FRAIS_PORT
  seo.ts                    SITE_URL, JSON-LD builders, FAQ_ITEMS
  sanity.client.ts          sanityClient (createClient)
  sanity.queries.ts         getMiels()/getPointsDeVente() + normalise*() — Sanity or static fallback, null/shape resilience layer

sanity/
  schemaTypes/miel.ts       Sanity schema for honey documents
  schemaTypes/pointDeVente.ts Sanity schema for retail points de vente (feeds the map)

scripts/
  seed-sanity.ts            Uploads images + creates/replaces all 6 miel documents (derives from MIELS_STATIC)
  seed-points.ts            Creates/replaces the points de vente docs (derives from POINTS_DE_VENTE; `_id: pdv-<id>`); `npm run seed:points`
  local/                    Gitignored Sanity ops tooling (need SANITY_API_TOKEN); dumps land in gitignored sanity-backups/
    sanity-backup.mjs         Full dataset export (docs + assets) → sanity-backups/<dataset>-<stamp>.tar.gz
    sanity-restore.mjs        Restore prod from a backup — DESTRUCTIVE (deletes all miels, re-imports); dry-run unless --yes; `npm run restore`
    sanity-build-archive.mjs  Self-contained archive of the 6 original miels with local public/images embedded (re-uploaded on import)
    sanity-prix-to-number.mjs Migrate formats[].prix/prixPro from string → number in prod; idempotent; dry-run unless --yes

public/images/
  miel-*.jpg                Six honey product photos
  BeeOnLavender.mp4         Hero background video (720×1280, ~7 MB, H.264; compressed from a .mov master that is gitignored)
  pyramide-pots.jpg         OpenGraph/Twitter share image + miel image placeholder fallback (normaliseMiels)
  sophie-ruches.jpg         APropos portrait
  ruches-verte.jpg          APropos thumbnail vignette
  logo-ab.png               AB/BIO certification logo
  logo.png                  Site logo (referenced as JSON-LD logo)
  icon-512.png              PWA manifest icon (app/manifest.ts)
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
| `loader-bar` | Indeterminate honey shimmer bar in the startup `Loader` splash |
| `merci-check`, `merci-item`, `merci-confetti`, `merci-shine` | Post-submit success animation |
| `pin-miel`, `pin-miellerie`, `.is-active` | Leaflet map pin styles |

## Important constraints

- **`next.config.mjs`** not `.ts` — Next.js 14 doesn't support TypeScript config files.
- **Leaflet CSS** is imported in `globals.css` via `@import 'leaflet/dist/leaflet.css'` — never dynamically import it inside a component.
- **`metadata` cannot be exported from a `'use client'` component** — that's why the Sanity studio is split into a server `page.tsx` + client `StudioClient.tsx`.
- **`miels` is never stored in CartContext** — always passed as a prop to `submitOrder(e, miels)` and to the cart components directly, so `page.tsx` stays a server component.
- **Sanity `id` field is a slug type**, stored as `{ _type: 'slug', current: string }`. The GROQ query projects it as `"id": id.current` to match the `Miel` interface.
- **`createOrReplace` in the seed script** uses deterministic `_id` values (`miel-fleurs-luberon`, etc.) so re-running doesn't create duplicates.
- **Deploy code before migrating Sanity data shapes.** The frontend coerces defensively (`prixToNumber`, `normaliseMiels`), but a migration that changes a field's type (e.g. `prix` string → number) must land *after* the new code is live — otherwise the still-deployed old code crashes the server render and ISR freezes prod on the stale page. The `prix` string→number migration was applied this way (2026-06-17).

## Real-world data

- **Sophie Mus** — apicultrice récoltante, 200 ruches
- **Address**: 315 Hameau Petit Palais, 84800 L'Isle-sur-la-Sorgue
- **Email**: chantemiel@wanadoo.fr — **Tel**: 06 34 99 23 99
- **Certification**: Agriculture Biologique, certified by **Ecocert**
- 6 honey varieties in `MIELS_STATIC` / seed: Fleurs du Luberon, Châtaignier, Lavande, Bruyère Blanche, Acacia, Romarin. **Production Sanity also holds 2 more added by Sophie — Fleurs des Maures, Miel de Pin — which have no `prixPro` yet and use poids "1Kg" (vs "1 kg"). `prixPro` is no longer displayed anyway (entreprise = devis), so a missing one is harmless.**
- 18 retail points of sale across Vaucluse, Bouches-du-Rhône
- **Wholesale (entreprise) prices** — HT, from the Biosphère invoice (kept in gitignored `docs/facture-biosphere.md`). **Internal reference only — since the entreprise flow became a quote request (devis), these are no longer shown on the site**, but kept in `prixPro` should Sophie want to reinstate them. Two tiers: low (Fleurs du Luberon, Châtaignier) `5,56 / 9,11 / 17,01 €`; high (Lavande, Bruyère, Acacia) `6,09 / 10,54 / 17,94 €`; Romarin ≈ high +0,02/0,03 € (`6,12 / 10,56 / 17,96 €`). Honey TVA = **5,5 %**. Cartons of 12.
- **Shipping (frais de port, particulier)** — customer's charge, La Poste rates: ≤ 3 kg → 18,00 € · 3–5 kg → 24,50 € · no postal delivery > 5 kg.
