import { sanityClient } from './sanity.client'
import { MIELS_STATIC, POINTS_DE_VENTE } from './data'
import { prixToNumber } from './order'
import type { Miel, PointDeVente } from './types'

/**
 * Image de repli quand un miel n'a pas (encore) de photo dans Sanity.
 * `image.asset->url` renvoie `null` dans ce cas, et un `null` ferait planter
 * le rendu (next/image et `miel.image.startsWith` dans lib/seo.ts) — ce qui,
 * en ISR, bloque la régénération et fige l'ancienne page en prod.
 */
const PLACEHOLDER_IMAGE = '/images/pyramide-pots.jpg'

/**
 * Normalise chaque miel issu de Sanity pour honorer le contrat non-nullable du
 * type `Miel` côté composants. Dans le schéma, seuls `id` et `nom` sont requis :
 * tout autre champ laissé vide arrive à `null` via GROQ et ferait planter un
 * consommateur (`.map`, `.every`, `.replace`, `.startsWith`…). Un crash au rendu
 * fige la prod en ISR (la régénération échoue, l'ancienne page reste en cache).
 *
 * On garantit donc des valeurs sûres :
 * - `image` → placeholder si absente ;
 * - chaînes (`nom`, `saison`, `terroir`, `description`, `poids`) → `''` ;
 * - `prix`/`prixPro` → nombres via `prixToNumber` (tolère le format hérité
 *   "6,50 €" comme le nouveau champ numérique, sans fenêtre de migration cassée) ;
 * - `notes`/`formats` → tableaux ;
 * - `disponible` → booléen (absent = épuisé) ;
 * - `prixPro` → backfill depuis les données statiques si Sanity ne le fournit pas.
 */
function normaliseMiels(miels: Miel[]): Miel[] {
  return miels.map(miel => {
    const ref = MIELS_STATIC.find(m => m.id === miel.id)
    return {
      ...miel,
      nom: miel.nom ?? '',
      image: miel.image || PLACEHOLDER_IMAGE,
      saison: miel.saison ?? '',
      terroir: miel.terroir ?? '',
      description: miel.description ?? '',
      notes: miel.notes ?? [],
      formats: (miel.formats ?? []).map(f => {
        const refFormat = ref?.formats.find(rf => rf.poids === f.poids)
        const prixProBrut = f.prixPro ?? refFormat?.prixPro
        return {
          ...f,
          poids: f.poids ?? '',
          prix: prixToNumber(f.prix),
          prixPro: prixProBrut != null ? prixToNumber(prixProBrut) : undefined,
          disponible: f.disponible ?? false,
        }
      }),
    }
  })
}

export async function getMiels(): Promise<Miel[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return MIELS_STATIC
  }

  try {
    const miels = await sanityClient.fetch<Miel[]>(
      `*[_type == "miel" && enLigne != false] | order(ordre asc) {
        "id": id.current,
        nom,
        "image": image.asset->url,
        saison,
        terroir,
        description,
        notes,
        formats
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    return miels?.length ? normaliseMiels(miels) : MIELS_STATIC
  } catch {
    return MIELS_STATIC
  }
}

/**
 * Normalise chaque point de vente issu de Sanity : le schéma requiert `nom`,
 * `ville`, `lat`, `lng`, mais on se protège contre un document incomplet (un
 * `null` sur `lat`/`lng` casserait `L.marker([lat, lng])` et donc le rendu de la
 * carte). `id` vient de `_id` (identifiant stable pour la clé React et le fly-to).
 */
function normalisePointsDeVente(points: PointDeVente[]): PointDeVente[] {
  return points.map(p => ({
    id: p.id,
    nom: p.nom ?? '',
    ville: p.ville ?? '',
    lat: typeof p.lat === 'number' ? p.lat : 0,
    lng: typeof p.lng === 'number' ? p.lng : 0,
    url: p.url || undefined,
  }))
}

export async function getPointsDeVente(): Promise<PointDeVente[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return POINTS_DE_VENTE
  }

  try {
    const points = await sanityClient.fetch<PointDeVente[]>(
      `*[_type == "pointDeVente" && enLigne != false] | order(ordre asc) {
        "id": _id,
        nom,
        ville,
        lat,
        lng,
        url
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    return points?.length ? normalisePointsDeVente(points) : POINTS_DE_VENTE
  } catch {
    return POINTS_DE_VENTE
  }
}
