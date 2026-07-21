import { defineField, defineType } from 'sanity'
import { MapsAutofillInput } from '../components/MapsAutofillInput'

export const pointDeVente = defineType({
  name: 'pointDeVente',
  title: 'Point de vente',
  type: 'document',
  fields: [
    defineField({
      name: 'lienMaps',
      title: 'Lien Google Maps',
      description: 'Le plus simple pour commencer : collez ici un lien Google Maps du magasin, puis cliquez sur « Remplir automatiquement » pour renseigner le nom, les coordonnées et la ville ci-dessous.',
      type: 'url',
      validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
      components: { input: MapsAutofillInput },
    }),
    defineField({
      name: 'nom',
      title: 'Nom du magasin',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ville',
      title: 'Ville',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'enLigne',
      title: 'Visible sur la carte',
      description: 'Décochez pour retirer ce point de vente de la carte. Il reste enregistré ici.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'Rempli automatiquement par le lien Google Maps ci-dessus (modifiable à la main si besoin). Manuellement : clic droit sur le lieu dans Google Maps → cliquez sur les chiffres pour les copier (le 1ᵉʳ nombre = latitude, ex. 43.9620).',
      validation: Rule => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'Rempli automatiquement par le lien Google Maps ci-dessus (2ᵉ nombre du clic droit Google Maps, ex. 4.8120).',
      validation: Rule => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: 'url',
      title: 'Site / page du magasin',
      description: 'Optionnel. Lien affiché dans la bulle de la carte.',
      type: 'url',
      validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'nom', ville: 'ville', enLigne: 'enLigne' },
    prepare(value: Record<string, any>) {
      const { title, ville, enLigne } = value as { title: string; ville?: string; enLigne?: boolean }
      return {
        title,
        subtitle: enLigne === false ? '🚫 Masqué de la carte' : ville,
      }
    },
  },
  orderings: [
    { title: 'Ordre d\'affichage', name: 'ordreAsc', by: [{ field: 'ordre', direction: 'asc' }] },
  ],
})
