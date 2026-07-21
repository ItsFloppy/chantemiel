import dynamic from 'next/dynamic'
import { getMiels, getPointsDeVente } from '@/lib/sanity.queries'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Catalogue } from '@/components/Catalogue'
import { BonDeCommande } from '@/components/BonDeCommande'
import { APropos } from '@/components/APropos'
import { InstagramFeed } from '@/components/InstagramFeed'
import { AvisGoogle } from '@/components/AvisGoogle'
import { Faq } from '@/components/Faq'
import { Footer } from '@/components/Footer'
import { CartFab } from '@/components/CartFab'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 60

const PointsDeVente = dynamic(
  () => import('@/components/PointsDeVente').then(m => m.PointsDeVente),
  { ssr: false }
)

export default async function Home() {
  const [miels, points] = await Promise.all([getMiels(), getPointsDeVente()])

  return (
    <>
      <JsonLd miels={miels} />
      <Header />
      <main>
        <Hero />
        <Catalogue miels={miels} />
        <BonDeCommande miels={miels} />
        <AvisGoogle />
        <APropos />
        <InstagramFeed />
        <PointsDeVente points={points} />
        <Faq />
      </main>
      <Footer />
      <CartFab miels={miels} />
    </>
  )
}
