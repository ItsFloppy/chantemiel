'use client'

import Script from 'next/script'
import { BEHOLD_FEED_ID, CONTACT } from '@/lib/data'
import { SectionLabel } from './ui/SectionLabel'

// Behold expose un web component <behold-widget> ; on le déclare pour TypeScript/JSX.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'feed-id'?: string
      }
    }
  }
}

/**
 * Feed Instagram via Behold.so (web component officiel, chargé côté client).
 * Ne s'affiche que si NEXT_PUBLIC_BEHOLD_FEED_ID est renseigné.
 * Prérequis : compte Instagram Business/Creator connecté à Behold.
 */
export function InstagramFeed() {
  if (!BEHOLD_FEED_ID) return null

  return (
    <section id="instagram" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Instagram</SectionLabel>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
              La miellerie au fil des jours
            </h2>
            <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">
              Ruches, récoltes, transhumances&nbsp;: suivez le quotidien de l&apos;exploitation.
            </p>
          </div>
          {CONTACT.instagram && (
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-honey/40 px-5 py-2.5 font-body text-sm font-semibold text-honey-deep transition-colors hover:bg-honey hover:text-white"
            >
              Voir le profil
            </a>
          )}
        </div>

        <behold-widget feed-id={BEHOLD_FEED_ID} />
        <Script src="https://w.behold.so/widget.js" type="module" strategy="afterInteractive" />
      </div>
    </section>
  )
}
