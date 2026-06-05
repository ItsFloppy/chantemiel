import type { Metadata } from 'next'
import { Playfair_Display, EB_Garamond, Great_Vibes } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
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
  title: 'Chantemiel — Miels de Provence certifiés BIO',
  description:
    "Sophie Mus, apicultrice récoltante dans le Vaucluse. Deux cents ruches, six miels du Luberon aux Cévennes, certifiés BIO Ecocert.",
  openGraph: {
    title: 'Chantemiel — Miels de Provence certifiés BIO',
    description: "Six miels d'exception récoltés à la main en Provence, certifiés Agriculture Biologique.",
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
