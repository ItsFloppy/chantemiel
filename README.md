# Chantemiel

Site vitrine de la miellerie Chantemiel — Sophie Mus, apicultrice récoltante BIO à L'Isle-sur-la-Sorgue (Vaucluse).

Le site permet de consulter la gamme de miels, de trouver les points de vente sur une carte interactive, et de passer une commande par e-mail via un bon de commande.

## Stack

- **Next.js 14** (App Router) — framework React
- **Tailwind CSS 3** — styles utilitaires
- **Sanity v3** — CMS headless (optionnel, voir ci-dessous)
- **Leaflet** — carte interactive des points de vente
- **Formspree** — envoi du bon de commande par e-mail

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd chantemiel-v2

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# Puis remplir .env.local (voir section Variables d'environnement)

# 4. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Copier `.env.local.example` en `.env.local` et renseigner les valeurs :

| Variable | Description | Requis |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID du projet Sanity | Non |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset Sanity (ex. `production`) | Non |
| `SANITY_API_TOKEN` | Token en écriture Sanity (script seed uniquement) | Non |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | ID du formulaire Formspree | Non |

**Sans Sanity**, le site fonctionne avec les données statiques définies dans `lib/data.ts` — aucune configuration n'est nécessaire pour démarrer.

**Sans Formspree**, le formulaire de commande affiche les données dans la console (mode développement).

## Sanity (CMS)

Le studio Sanity est embarqué dans l'application à l'adresse [http://localhost:3000/studio](http://localhost:3000/studio).

Pour l'activer :

1. Créer un projet sur [sanity.io/manage](https://sanity.io/manage)
2. Renseigner `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET` dans `.env.local`
3. (Optionnel) Peupler le dataset avec les données de départ :
   ```bash
   npm run seed
   ```

## Commandes

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production (après build)
npm run lint     # Vérification ESLint
npm run seed     # Seed Sanity (nécessite SANITY_API_TOKEN)
```

## Structure du projet

```
app/
  globals.css         # Styles globaux, animations, classes Leaflet
  layout.tsx          # Layout racine, fonts, CartProvider
  page.tsx            # Page d'accueil (server component)
  studio/             # Studio Sanity embarqué
components/
  ui/                 # Composants atomiques (Reveal, SectionLabel…)
  Header.tsx          # Navigation fixe scroll-aware
  Hero.tsx            # Section hero
  Catalogue.tsx       # Grille de miels avec panier
  BonDeCommande.tsx   # Formulaire de commande
  CartFab.tsx         # Bouton panier flottant
  APropos.tsx         # Présentation de la miellerie
  PointsDeVente.tsx   # Carte Leaflet des points de vente
  Footer.tsx          # Pied de page
lib/
  types.ts            # Types TypeScript partagés
  data.ts             # Données statiques de fallback
  cart.tsx            # Contexte React du panier
  order.ts            # Logique de calcul et envoi de commande
  sanity.client.ts    # Client Sanity
  sanity.queries.ts   # Requêtes GROQ
sanity/
  schemaTypes/        # Schémas Sanity (miel)
public/
  images/             # Photos des miels et de la miellerie
```
