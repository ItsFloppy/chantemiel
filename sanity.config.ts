import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { StudioNavbar } from './sanity/components/StudioNavbar'

export default defineConfig({
  name: 'chantemiel',
  title: 'Chantemiel',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Contenu')
          .items([S.documentTypeListItem('miel').title('Miels')]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  studio: {
    components: {
      navbar: StudioNavbar,
    },
  },
})
