'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Menu déroulant custom pour les formulaires sur fond sombre (le <select> natif
 * s'affiche mal : couleurs système, flèche native). Bouton stylé + liste posée
 * en dessous, fermeture au clic extérieur ou Échap.
 */
export function DropdownDark({
  value,
  onChange,
  options,
  placeholder,
  triggerClassName = '',
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerClassName + ' flex cursor-pointer items-center justify-between gap-3 text-left'}
      >
        <span className={value ? 'text-cream' : 'text-cream/40'}>{value || placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={'h-4 w-4 flex-shrink-0 text-cream/50 transition-transform ' + (open ? 'rotate-180' : '')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="scroll-cart absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-cream/15 bg-ink py-1 shadow-jar"
        >
          {options.map(opt => {
            const actif = opt === value
            return (
              <li key={opt} role="option" aria-selected={actif}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={
                    'flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm transition-colors ' +
                    (actif ? 'bg-honey/15 text-honey' : 'text-cream/85 hover:bg-cream/10')
                  }
                >
                  {opt}
                  {actif && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
