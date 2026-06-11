/**
 * Seed script — pushes the 6 static miels into Sanity.
 *
 * Usage:
 *   npm run seed
 *
 * Requirements:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   - NEXT_PUBLIC_SANITY_DATASET in .env.local
 *   - SANITY_API_TOKEN in .env.local (Editor token)
 *
 * Source de vérité : ce script DÉRIVE ses données de lib/data.ts (MIELS_STATIC),
 * pour éviter toute duplication des prix. L'ordre d'affichage suit l'ordre du
 * tableau, l'image est résolue depuis le chemin `image` de chaque miel.
 *
 * ⚠️  En production, c'est Sanity (édité dans le Studio) qui fait foi. Les _id sont
 *     déterministes (`miel-<id>`), donc pas de doublons — mais `createOrReplace`
 *     remplace le document entier : RÉ-EXÉCUTER CE SEED ÉCRASE les prix et
 *     disponibilités édités dans le Studio par les valeurs de data.ts.
 *     À n'utiliser que pour (ré)initialiser le dataset.
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { resolve, basename } from 'path'
import { config } from 'dotenv'
import { MIELS_STATIC } from '../lib/data'

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

console.log(`Project ID : ${projectId}`)
console.log(`Dataset    : ${dataset}`)
console.log(`Token      : ${token.slice(0, 10)}… (${token.length} chars)`)

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const IMAGES_DIR = resolve(process.cwd(), 'public/images')

async function uploadImage(filename: string): Promise<string> {
  const filePath = resolve(IMAGES_DIR, filename)
  console.log(`  ↑ Uploading ${filename}…`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
  })
  return asset._id
}

async function seed() {
  console.log(`\n🍯 Seeding Sanity — project: ${projectId}, dataset: ${dataset}\n`)

  for (let index = 0; index < MIELS_STATIC.length; index++) {
    const miel = MIELS_STATIC[index]
    console.log(`• ${miel.nom}`)

    const imageAssetId = await uploadImage(basename(miel.image))

    const doc = {
      _id: `miel-${miel.id}`,
      _type: 'miel',
      id: { _type: 'slug', current: miel.id },
      nom: miel.nom,
      image: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } },
      saison: miel.saison,
      terroir: miel.terroir,
      description: miel.description,
      notes: miel.notes,
      formats: miel.formats.map((f, i) => ({
        _key: `${miel.id}-fmt-${i}`,
        _type: 'format',
        poids: f.poids,
        prix: f.prix,
        prixPro: f.prixPro,
        disponible: f.disponible,
      })),
      ordre: index + 1,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Done\n`)
  }

  console.log(`✅ All ${MIELS_STATIC.length} miels seeded successfully.`)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
