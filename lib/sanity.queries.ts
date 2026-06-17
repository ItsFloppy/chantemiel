import { sanityClient } from './sanity.client'
import { MIELS_STATIC } from './data'
import type { Miel } from './types'

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
 * - chaînes (`nom`, `saison`, `terroir`, `description`, `poids`, `prix`) → `''` ;
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
        return {
          ...f,
          poids: f.poids ?? '',
          prix: f.prix ?? '',
          prixPro: f.prixPro ?? refFormat?.prixPro,
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
