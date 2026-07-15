'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import 'react-google-reviews/dist/index.css'
import { FEATURABLE_ID, GOOGLE_AVIS_URL } from '@/lib/data'
import { SectionLabel } from './ui/SectionLabel'
import { Reveal } from './ui/Reveal'

// Chargé uniquement côté client (le widget lit window) et à la demande.
const ReactGoogleReviews = dynamic(
  () => import('react-google-reviews').then(m => m.ReactGoogleReviews),
  { ssr: false }
)

function Etoiles() {
  return (
    <div className="flex gap-1 text-honey" aria-hidden>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2l2.9 6.26 6.7.94-4.8 4.34 1.28 6.86L12 17.1l-6.08 3.3L7.2 13.54 2.4 9.2l6.7-.94L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * Section « Avis ». Objectif principal : la RÉCOLTE d'avis Google (CTA + QR),
 * visible sans aucun compte tiers dès que GOOGLE_AVIS_URL est renseigné.
 * Bonus : si NEXT_PUBLIC_FEATURABLE_ID est présent, on affiche aussi les vrais
 * avis Google via Featurable (react-google-reviews) au-dessus du bloc de récolte.
 */
export function AvisGoogle() {
  if (!GOOGLE_AVIS_URL) return null

  return (
    <section id="avis" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 max-w-2xl">
          <SectionLabel>Avis</SectionLabel>
          <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
            Votre avis fait la différence
          </h2>
          <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">
            Un mot sur Google aide d&apos;autres gourmands à découvrir mes miels — et me touche
            beaucoup. Deux minutes suffisent, merci du fond du cœur&nbsp;!
          </p>
        </div>

        {FEATURABLE_ID && (
          <div className="mb-12">
            <ReactGoogleReviews layout="carousel" featurableId={FEATURABLE_ID} />
          </div>
        )}

        <Reveal>
          <div className="grid items-center gap-8 rounded-3xl border border-honey/20 bg-cream p-7 shadow-soft md:grid-cols-[1.5fr_auto] md:p-10">
            <div>
              <Etoiles />
              <p className="mt-4 max-w-lg font-body text-lg leading-relaxed text-ink md:text-xl">
                Vous avez goûté mes miels&nbsp;? Partagez votre avis sur Google, c&apos;est le plus
                beau des coups de pouce pour une petite exploitation.
              </p>
              <a
                href={GOOGLE_AVIS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-honey px-7 py-3.5 font-body text-base font-bold text-white shadow-jar transition-colors hover:bg-honey-deep"
              >
                Laisser un avis sur Google
              </a>
            </div>

            <figure className="flex flex-col items-center gap-2.5">
              <div className="rounded-2xl border border-ink/[0.08] bg-paper p-3 shadow-soft">
                <Image
                  src="/images/qr-avis-google.png"
                  alt="QR code pour laisser un avis Google à Chantemiel"
                  width={150}
                  height={150}
                  className="h-[130px] w-[130px] md:h-[150px] md:w-[150px]"
                />
              </div>
              <figcaption className="font-body text-xs font-medium text-ink-soft/80">
                Scannez pour laisser un avis
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
