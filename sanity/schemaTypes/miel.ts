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
      name: 'enLigne',
      title: 'Visible sur le site',
      description: 'Décochez pour retirer ce miel du site public. Il reste enregistré ici et peut être remis en ligne à tout moment.',
      type: 'boolean',
      initialValue: true,
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
            defineField({
              name: 'prix',
              title: 'Prix particulier TTC (€)',
              type: 'number',
              description: 'Prix en euros, sans le symbole € (ex. 6.5 pour 6,50 €). Le « € » est ajouté automatiquement sur le site.',
              validation: Rule => Rule.required().positive(),
            }),
            defineField({
              name: 'prixPro',
              title: 'Prix entreprise / pot HT (€)',
              type: 'number',
              description: 'Optionnel. Prix unitaire HT en euros, sans le symbole €.',
              validation: Rule => Rule.positive(),
            }),
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
              const { title, subtitle, disponible } = value as { title: string; subtitle: number | string; disponible: boolean }
              const n = typeof subtitle === 'number'
                ? subtitle
                : parseFloat(String(subtitle ?? '').replace('€', '').replace(',', '.').trim())
              const prix = Number.isFinite(n)
                ? `${n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`
                : '—'
              return {
                title: `${title} · ${prix}`,
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
    select: { title: 'nom', media: 'image', enLigne: 'enLigne' },
    prepare(value: Record<string, any>) {
      const { title, media, enLigne } = value as { title: string; media: any; enLigne?: boolean }
      return {
        title,
        media,
        subtitle: enLigne === false ? '🚫 Masqué du site' : undefined,
      }
    },
  },
  orderings: [
    { title: 'Ordre d\'affichage', name: 'ordreAsc', by: [{ field: 'ordre', direction: 'asc' }] },
  ],
})
