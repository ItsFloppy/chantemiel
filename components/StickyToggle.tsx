'use client'

import { useEffect, useState } from 'react'
import { ClientTypeToggle } from './ui/ClientTypeToggle'

/**
 * Effet « attrapé par le scroll » : le switch Particulier/Entreprise reste à sa
 * place dans le catalogue (« Mes miels »), puis se fige au même endroit (même x)
 * dès qu'il atteint le haut, jusqu'à ce que celui du bon de commande arrive à ce
 * bas du formulaire (#commander-end). Pas de saut ni de doublon : quand la version
 * fixe est active, on masque le toggle en place (#catalogue-toggle) et on cale la
 * version fixe sur exactement sa position horizontale. Une marge sous l'en-tête est
 * conservée via TOP.
 */
const TOP = 88 // hauteur (px) sous l'en-tête où le switch se fige (garde une marge sous la navbar)

export function StickyToggle() {
  const [pinned, setPinned] = useState(false)
  const [left, setLeft] = useState(0)

  useEffect(() => {
    const start = () => document.getElementById('catalogue-toggle')
    const end = () => document.getElementById('commander-end')

    function onScroll() {
      const s = start()
      const e = end()
      if (!s || !e) return
      const sr = s.getBoundingClientRect()
      const er = e.getBoundingClientRect()
      const active = sr.top < TOP && er.top > TOP + 12
      // Masque le toggle en place tant que la version fixe le remplace (mêmes x/aspect).
      s.style.visibility = active ? 'hidden' : ''
      setPinned(prev => (prev !== active ? active : prev))
      setLeft(prev => (prev !== sr.left ? sr.left : prev))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      const s = start()
      if (s) s.style.visibility = ''
    }
  }, [])

  return (
    <div
      aria-hidden={!pinned}
      style={{ left, top: TOP }}
      className={'fixed z-40 ' + (pinned ? '' : 'pointer-events-none opacity-0')}
    >
      <ClientTypeToggle tone="light" />
    </div>
  )
}
