'use client'

import { useCart } from '@/lib/cart'
import type { ClientType } from '@/lib/types'

const OPTIONS: { value: ClientType; label: string }[] = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'entreprise', label: 'Entreprise' },
]

/** Largeur (px) d'un onglet — sert aussi de pas de translation pour la pastille animée. */
const TAB_W = 124

/**
 * Bascule Particulier / Entreprise. Pilote `clientType` dans le panier (source unique).
 * Une pastille honey glisse sous l'onglet actif (animation au changement).
 * `tone="light"` pour fond clair (catalogue), `tone="dark"` pour fond sombre (bon de commande).
 */
export function ClientTypeToggle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { clientType, setClientType } = useCart()
  const idx = Math.max(0, OPTIONS.findIndex(o => o.value === clientType))

  const wrap =
    tone === 'dark'
      ? 'border-cream/15 bg-cream/[0.06]'
      : 'border-honey/25 bg-paper shadow-soft'
  const inactif = tone === 'dark' ? 'text-cream/70 hover:text-cream' : 'text-ink-soft hover:text-ink'

  return (
    <div role="tablist" aria-label="Type de client" className={'relative inline-flex rounded-full border p-1 ' + wrap}>
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-full bg-honey shadow-soft transition-transform duration-300 ease-[cubic-bezier(.34,1.4,.5,1)]"
        style={{ width: TAB_W, transform: `translateX(${idx * TAB_W}px)` }}
      />
      {OPTIONS.map(opt => {
        const actif = clientType === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={actif}
            onClick={() => setClientType(opt.value)}
            style={{ width: TAB_W }}
            className={
              'relative z-10 rounded-full py-2 text-center font-body text-sm font-semibold transition-colors ' +
              (actif ? 'text-white' : inactif)
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
