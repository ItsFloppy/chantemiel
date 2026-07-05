/**
 * Seed script — pushes the static points de vente into Sanity.
 *
 * Usage:
 *   npm run seed:points
 *
 * Requirements:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   - NEXT_PUBLIC_SANITY_DATASET in .env.local
 *   - SANITY_API_TOKEN in .env.local (Editor token)
 *
 * Source de vérité : ce script DÉRIVE ses données de lib/data.ts (POINTS_DE_VENTE).
 * L'ordre d'affichage suit l'ordre du tableau.
 *
 * ⚠️  Les _id sont déterministes (`pdv-<id>`), donc pas de doublons — mais
 *     `createOrReplace` remplace le document entier : RÉ-EXÉCUTER CE SEED ÉCRASE
 *     les points de vente édités dans le Studio par les valeurs de data.ts.
 *     À n'utiliser que pour (ré)initialiser le dataset.
 */

import { createClient } from '@sanity/client'
import { resolve } from 'path'
import { config } from 'dotenv'
import { POINTS_DE_VENTE } from '../lib/data'

config({ path: resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local')
  process.exit(1)
}
if (!token) {
  console.error('❌  SANITY_API_TOKEN is not set in .env.local')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

async function seed() {
  console.log(`\n📍 Seeding points de vente — project: ${projectId}, dataset: ${dataset}\n`)

  for (let index = 0; index < POINTS_DE_VENTE.length; index++) {
    const p = POINTS_DE_VENTE[index]
    console.log(`• ${p.nom} (${p.ville})`)

    const doc = {
      _id: `pdv-${p.id}`,
      _type: 'pointDeVente',
      nom: p.nom,
      ville: p.ville,
      enLigne: true,
      lat: p.lat,
      lng: p.lng,
      ...(p.url ? { url: p.url } : {}),
      ordre: index + 1,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Done`)
  }

  console.log(`\n✅ All ${POINTS_DE_VENTE.length} points de vente seeded successfully.`)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
