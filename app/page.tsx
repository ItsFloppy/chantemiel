import dynamic from 'next/dynamic'
import { getMiels } from '@/lib/sanity.queries'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Valeurs } from '@/components/Valeurs'
import { Catalogue } from '@/components/Catalogue'
import { BonDeCommande } from '@/components/BonDeCommande'
import { APropos } from '@/components/APropos'
import { Footer } from '@/components/Footer'
import { CartFab } from '@/components/CartFab'

export const revalidate = 60

const PointsDeVente = dynamic(
  () => import('@/components/PointsDeVente').then(m => m.PointsDeVente),
  { ssr: false }
)

export default async function Home() {
  const miels = await getMiels()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Valeurs />
        <Catalogue miels={miels} />
        <BonDeCommande miels={miels} />
        <APropos />
        <PointsDeVente />
      </main>
      <Footer />
      <CartFab miels={miels} />
    </>
  )
}
