'use client'

import { useEffect, useState } from 'react'

/**
 * Petit écran de chargement affiché au tout début du site, le temps que la page
 * (et la vidéo de fond du Hero) se mette en place. Évite de voir un fond vide ou
 * la vidéo se charger « à nu ». Se masque dès que le DOM est prêt, avec un délai
 * de sécurité pour ne jamais rester bloqué, puis se démonte après le fondu.
 */
export function Loader() {
  const [parti, setParti] = useState(false) // déclenche le fondu de sortie
  const [retire, setRetire] = useState(false) // démonte après le fondu

  useEffect(() => {
    const masquer = () => setParti(true)

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', masquer, { once: true })
    } else {
      // À l'hydratation le DOM est déjà prêt : court délai pour laisser respirer l'animation.
      const t = setTimeout(masquer, 500)
      return () => clearTimeout(t)
    }

    const secours = setTimeout(masquer, 3000) // garde-fou
    return () => {
      document.removeEventListener('DOMContentLoaded', masquer)
      clearTimeout(secours)
    }
  }, [])

  useEffect(() => {
    if (!parti) return
    const t = setTimeout(() => setRetire(true), 600) // > durée du fondu
    return () => clearTimeout(t)
  }, [parti])

  if (retire) return null

  return (
    <div
      aria-hidden
      className={
        'fixed inset-0 z-[200] grid place-items-center bg-cream transition-opacity duration-500 ' +
        (parti ? 'pointer-events-none opacity-0' : 'opacity-100')
      }
    >
      <div className="flex flex-col items-center gap-5">
        <span className="font-hand text-5xl text-honey-deep md:text-6xl">Chantemiel</span>
        <span className="loader-bar" />
      </div>
    </div>
  )
}
