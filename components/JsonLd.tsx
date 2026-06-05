import { buildLocalBusinessLd, buildProductsLd, buildFaqLd } from '@/lib/seo'
import type { Miel } from '@/lib/types'

/**
 * Structured data for the homepage: the business (local pack), each honey as a
 * Product (rich results), and the FAQ. Server component — rendered into the HTML.
 */
export function JsonLd({ miels }: { miels: Miel[] }) {
  const graph = [buildLocalBusinessLd(), ...buildProductsLd(miels), buildFaqLd()]

  return (
    <script
      type="application/ld+json"
      // Schema.org JSON-LD is static, server-generated data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
