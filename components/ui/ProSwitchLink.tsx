'use client'

import { useCart } from '@/lib/cart'

/**
 * Lien qui bascule le panier en mode « Entreprise » (ce qui fait apparaître la
 * section Professionnels, masquée en mode particulier) puis scrolle jusqu'à elle.
 * Le petit délai laisse la section se monter après le changement d'état.
 */
export function ProSwitchLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const { setClientType } = useCart()

  function handle(e: React.MouseEvent) {
    e.preventDefault()
    setClientType('entreprise')
    setTimeout(() => {
      document.getElementById('professionnels')?.scrollIntoView({ behavior: 'smooth' })
    }, 60)
  }

  return (
    <a href="#professionnels" onClick={handle} className={className}>
      {children}
    </a>
  )
}
