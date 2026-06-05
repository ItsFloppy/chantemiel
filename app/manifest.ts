import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chantemiel — Miel bio de Provence',
    short_name: 'Chantemiel',
    description:
      'Miels de Provence certifiés BIO Ecocert, récoltés par Sophie Mus dans le Vaucluse.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF3E6',
    theme_color: '#E78300',
    lang: 'fr',
    icons: [
      {
        src: '/images/logo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  }
}
