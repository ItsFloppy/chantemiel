import type { Metadata } from 'next'
import { Playfair_Display, EB_Garamond, Great_Vibes } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Chantemiel — Miel bio du Luberon | Apicultrice à L’Isle-sur-la-Sorgue, en Provence',
    template: '%s · Chantemiel',
  },
  description:
    "Sophie Mus, apicultrice récoltante certifiée BIO Ecocert dans le Vaucluse. Six miels — lavande, romarin, châtaignier, acacia — récoltés en Provence et mis en pot à froid. Vente directe et points de vente en Vaucluse et Bouches-du-Rhône.",
  keywords: [
    'miel bio',
    'miel bio Vaucluse',
    'miel bio Luberon',
    'apiculteur bio',
    "apicultrice L'Isle-sur-la-Sorgue",
    'miel de lavande bio',
    'miel de romarin',
    'miel Luberon',
    'Chantemiel',
    'Sophie Mus',
  ],
  authors: [{ name: 'Sophie Mus' }],
  creator: 'Chantemiel',
  applicationName: 'Chantemiel',
  alternates: {
    canonical: '/',
  },
  category: 'food',
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Chantemiel',
    title: 'Chantemiel — Miel bio du Luberon, récolté à L’Isle-sur-la-Sorgue',
    description:
      "Six miels d'exception récoltés à la main en Provence par Sophie Mus, certifiés Agriculture Biologique (Ecocert).",
    images: [
      {
        url: '/images/pyramide-pots.jpg',
        width: 1200,
        height: 630,
        alt: 'Pots de miel Chantemiel devant le massif du Luberon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chantemiel — Miel bio du Luberon',
    description:
      'Six miels certifiés BIO Ecocert, récoltés en Provence par Sophie Mus, dans le Vaucluse.',
    images: ['/images/pyramide-pots.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfairDisplay.variable} ${ebGaramond.variable} ${greatVibes.variable}`}
    >
      <body className="font-body text-ink antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
