import { defineField, defineType } from 'sanity'

export const miel = defineType({
  name: 'miel',
  title: 'Miel',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Identifiant (slug)',
      type: 'slug',
      options: { source: 'nom' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'nom',
      title: 'Nom',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'saison',
      title: 'Saison de récolte',
      type: 'string',
    }),
    defineField({
      name: 'terroir',
      title: 'Terroir',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'notes',
      title: 'Notes de dégustation',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'formats',
      title: 'Formats disponibles',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'format',
          fields: [
            { name: 'poids', title: 'Poids', type: 'string' },
            { name: 'prix', title: 'Prix', type: 'string' },
            {
              name: 'disponible',
              title: 'Disponible',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: { title: 'poids', subtitle: 'prix', disponible: 'disponible' },
            prepare(value: Record<string, any>) {
              const { title, subtitle, disponible } = value as { title: string; subtitle: string; disponible: boolean }
              return {
                title: `${title} · ${subtitle}`,
                subtitle: disponible ? '✓ Disponible' : '✗ Épuisé',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'nom', media: 'image' },
  },
  orderings: [
    { title: 'Ordre d\'affichage', name: 'ordreAsc', by: [{ field: 'ordre', direction: 'asc' }] },
  ],
})
