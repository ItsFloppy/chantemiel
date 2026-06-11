import { sanityClient } from './sanity.client'
import { MIELS_STATIC } from './data'
import type { Miel } from './types'

/**
 * Backfill du prix entreprise (`prixPro`) depuis les données statiques quand Sanity
 * ne le fournit pas (documents créés avant l'ajout du champ, seed non relancé).
 * Si Sanity contient un `prixPro`, il a la priorité.
 */
function withPrixProFallback(miels: Miel[]): Miel[] {
  return miels.map(miel => {
    const ref = MIELS_STATIC.find(m => m.id === miel.id)
    return {
      ...miel,
      formats: (miel.formats ?? []).map(f => {
        if (f.prixPro) return f
        const refFormat = ref?.formats.find(rf => rf.poids === f.poids)
        return refFormat?.prixPro ? { ...f, prixPro: refFormat.prixPro } : f
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
      `*[_type == "miel"] | order(ordre asc) {
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
    return miels?.length ? withPrixProFallback(miels) : MIELS_STATIC
  } catch {
    return MIELS_STATIC
  }
}
