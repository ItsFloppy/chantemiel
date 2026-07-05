import { defineField, defineType } from 'sanity'

export const pointDeVente = defineType({
  name: 'pointDeVente',
  title: 'Point de vente',
  type: 'document',
  fields: [
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
      description: 'Coordonnée GPS. Astuce : sur Google Maps, clic droit sur le lieu → cliquez sur les chiffres pour les copier (le 1ᵉʳ nombre = latitude, ex. 43.9620).',
      validation: Rule => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'Coordonnée GPS (2ᵉ nombre du clic droit Google Maps, ex. 4.8120).',
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
