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
 * Safe to re-run: existing documents are patched, not duplicated.
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { resolve, basename } from 'path'
import { config } from 'dotenv'

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

const MIELS = [
  {
    id: 'fleurs-luberon',
    nom: 'Miel de Fleurs du Luberon',
    image: 'miel-fleurs-luberon.jpg',
    saison: 'Début d\'été',
    terroir: 'Luberon',
    notes: ['Végétal boisé', 'Caramel', 'Balsamique'],
    description: 'Récolté en tout début d\'été, très parfumé. Composé essentiellement de thym, de chêne et de lavande sauvage.',
    formats: [
      { poids: '250g', prix: '6,50 €', disponible: true },
      { poids: '500g', prix: '11 €', disponible: true },
      { poids: '1 kg', prix: '19 €', disponible: true },
    ],
    ordre: 1,
  },
  {
    id: 'chataignier',
    nom: 'Miel de Châtaignier',
    image: 'miel-chataignier.jpg',
    saison: 'Fin juin',
    terroir: 'Cévennes',
    notes: ['Corsé', 'Amertume franche', 'Boisé'],
    description: 'Récolté fin juin dans les Cévennes. Brun foncé, au goût fort et à l\'amertume prononcée.',
    formats: [
      { poids: '250g', prix: '6,50 €', disponible: true },
      { poids: '500g', prix: '11 €', disponible: true },
      { poids: '1 kg', prix: '19 €', disponible: false },
    ],
    ordre: 2,
  },
  {
    id: 'lavande',
    nom: 'Miel de Lavande',
    image: 'miel-lavande.jpg',
    saison: 'Été',
    terroir: 'Massif du Luberon',
    notes: ['Aromatique', 'Fruit de la passion', 'Floral'],
    description: 'Récolté en été dans le massif du Luberon. Jaune doré à l\'état liquide, goût fortement aromatique aux notes de fruit de la passion.',
    formats: [
      { poids: '250g', prix: '7 €', disponible: true },
      { poids: '500g', prix: '12 €', disponible: true },
      { poids: '1 kg', prix: '21 €', disponible: false },
    ],
    ordre: 3,
  },
  {
    id: 'bruyere-blanche',
    nom: 'Miel de Bruyère Blanche',
    image: 'miel-bruyere.jpg',
    saison: 'Début de printemps',
    terroir: 'Massif des Maures',
    notes: ['Caramel', 'Pain d\'épices', 'Saveur forte'],
    description: 'Récolté au tout début du printemps dans le massif des Maures (Var). Brun clair, saveur forte, notes de caramel et de pain d\'épices.',
    formats: [
      { poids: '250g', prix: '7 €', disponible: true },
      { poids: '500g', prix: '12 €', disponible: true },
      { poids: '1 kg', prix: '21 €', disponible: true },
    ],
    ordre: 4,
  },
  {
    id: 'acacia',
    nom: 'Miel d\'Acacia',
    image: 'miel-acacia.jpg',
    saison: 'Mai',
    terroir: 'Isère',
    notes: ['Floral discret', 'Toujours liquide', 'Très doux'],
    description: 'Récolté au mois de mai en Isère. Jaune très clair, il reste toujours liquide. Goût floral très discret.',
    formats: [
      { poids: '250g', prix: '6,50 €', disponible: false },
      { poids: '500g', prix: '11 €', disponible: false },
      { poids: '1 kg', prix: '19 €', disponible: false },
    ],
    ordre: 5,
  },
  {
    id: 'romarin',
    nom: 'Miel de Romarin',
    image: 'miel-romarin.jpg',
    saison: 'Printemps',
    terroir: 'Monts de Vaucluse',
    notes: ['Aromatique', 'Balsamique', 'Fumée végétale'],
    description: 'Miel de printemps récolté au pied des Monts de Vaucluse. Saveur aromatique, très légèrement balsamique, arôme végétal de fumée.',
    formats: [
      { poids: '250g', prix: '6,50 €', disponible: false },
      { poids: '500g', prix: '11 €', disponible: false },
      { poids: '1 kg', prix: '19 €', disponible: false },
    ],
    ordre: 6,
  },
]

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

  for (const miel of MIELS) {
    console.log(`• ${miel.nom}`)

    const imageAssetId = await uploadImage(miel.image)

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
        disponible: f.disponible,
      })),
      ordre: miel.ordre,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Done\n`)
  }

  console.log(`✅ All ${MIELS.length} miels seeded successfully.`)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
