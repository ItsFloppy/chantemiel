'use client'

import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/lib/cart'
import { OrderForm } from './BonDeCommande'
import { panierTotaux } from '@/lib/order'
import type { Miel } from '@/lib/types'

function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2.5 3.5h2.2l2.1 11.4a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.3L20 7.5H5.4" />
    </svg>
  )
}

export function CartFab({ miels }: { miels: Miel[] }) {
  const { selection, cartOpen, setCartOpen } = useCart()
  const { totalArticles } = panierTotaux(selection, miels)

  const [visible, setVisible] = useState(false)
  const [panelRender, setPanelRender] = useState(false)
  const [panelClosing, setPanelClosing] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)
  const prevCount = useRef(0)

  // Visible uniquement tant que la section catalogue occupe l'écran
  useEffect(() => {
    const onScroll = () => {
      const cat = document.getElementById('catalogue')
      if (!cat) return
      const vh = window.innerHeight
      const r = cat.getBoundingClientRect()
      setVisible(r.top < vh * 0.6 && r.bottom > vh * 0.4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Pulse à chaque changement de quantité
  useEffect(() => {
    if (totalArticles !== prevCount.current) {
      prevCount.current = totalArticles
      const el = fabRef.current
      if (el) {
        el.classList.remove('fab-bump')
        void el.offsetWidth
        el.classList.add('fab-bump')
      }
    }
  }, [totalArticles])

  // Ferme le panneau si le FAB disparaît
  useEffect(() => {
    if (!visible && cartOpen) setCartOpen(false)
  }, [visible, cartOpen, setCartOpen])

  // Monte/démonte le panneau avec animation entrée + sortie
  useEffect(() => {
    if (cartOpen) {
      setPanelRender(true)
      setPanelClosing(false)
    } else if (panelRender) {
      setPanelClosing(true)
      const tm = setTimeout(() => { setPanelRender(false); setPanelClosing(false) }, 320)
      return () => clearTimeout(tm)
    }
  }, [cartOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapStyle: React.CSSProperties = {
    transition: 'transform .58s cubic-bezier(.18,1.9,.34,1), opacity .26s ease',
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0)',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60] md:bottom-7 md:right-7" style={wrapStyle}>
        <button
          ref={fabRef}
          onClick={() => setCartOpen(true)}
          aria-label="Voir mon bon de commande"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-honey text-white shadow-jar ring-1 ring-black/5 transition-colors hover:bg-honey-deep md:h-16 md:w-16"
        >
          <CartIcon className="h-6 w-6 md:h-7 md:w-7" />
          {totalArticles > 0 && (
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-cream font-body text-xs font-extrabold text-ink ring-2 ring-honey">
              {totalArticles}
            </span>
          )}
        </button>
      </div>

      {panelRender && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
          <div
            className={(panelClosing ? 'backdrop-out' : 'backdrop-in') + ' absolute inset-0 bg-ink/55 backdrop-blur-sm'}
            onClick={() => setCartOpen(false)}
          />
          <div
            className={
              (panelClosing ? 'cart-collapse' : 'cart-expand') +
              ' absolute inset-x-3 bottom-3 max-h-[86vh] overflow-hidden rounded-3xl shadow-jar ring-1 ring-cream/10 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[440px] md:bottom-7 md:right-7'
            }
          >
            <div className="scroll-cart max-h-[86vh] overflow-y-auto bg-ink p-6 pr-4 text-cream">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-honey/15 text-honey">
                    <CartIcon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl text-cream">Votre bon de commande</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Fermer"
                  className="grid h-9 w-9 place-items-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <OrderForm miels={miels} stack />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
