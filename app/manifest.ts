import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chantemiel, miel bio du Luberon',
    short_name: 'Chantemiel',
    description:
      'Miels certifiés BIO Ecocert, récoltés en Provence par Sophie Mus, dans le Vaucluse.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF3E6',
    theme_color: '#E78300',
    lang: 'fr',
    icons: [
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
