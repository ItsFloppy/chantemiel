import { sanityClient } from './sanity.client'
import { MIELS_STATIC } from './data'
import type { Miel } from './types'

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
    return miels?.length ? miels : MIELS_STATIC
  } catch {
    return MIELS_STATIC
  }
}
