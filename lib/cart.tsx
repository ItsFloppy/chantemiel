'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Miel, Selection, ClientInfo } from './types'
import { buildOrderBody } from './order'

interface CartContextValue {
  selection: Selection
  client: ClientInfo
  envoye: boolean
  erreur: string
  cartOpen: boolean
  onAdd: (miel: Miel, poids: string) => void
  onRemove: (miel: Miel, poids: string) => void
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
  setClient: React.Dispatch<React.SetStateAction<ClientInfo>>
  setEnvoye: React.Dispatch<React.SetStateAction<boolean>>
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitOrder: (e: React.FormEvent, miels: Miel[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({})
  const [client, setClient] = useState<ClientInfo>({ nom: '', email: '', tel: '', adresse: '', message: '' })
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  function onAdd(miel: Miel, poids: string) {
    const key = `${miel.id}__${poids}`
    setSelection(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }))
  }

  function onRemove(miel: Miel, poids: string) {
    const key = `${miel.id}__${poids}`
    setSelection(prev => {
      const next = { ...prev }
      const q = (next[key] || 0) - 1
      if (q <= 0) delete next[key]
      else next[key] = q
      return next
    })
  }

  function submitOrder(e: React.FormEvent, miels: Miel[]) {
    e.preventDefault()
    setErreur('')

    const lignes = Object.entries(selection).filter(([, q]) => q > 0)
    if (lignes.length === 0) {
      setErreur('Sélectionnez au moins un miel dans le catalogue.')
      return
    }
    if (!client.nom.trim() || !client.email.trim()) {
      setErreur("Merci d'indiquer au minimum votre nom et votre e-mail.")
      return
    }

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
    if (!formId) {
      // Dev mode: skip real submission
      setEnvoye(true)
      return
    }

    fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildOrderBody(selection, miels, client)),
    })
      .then(r => r.json())
      .then((data: { ok?: boolean }) => {
        if (data.ok) setEnvoye(true)
        else setErreur("Une erreur est survenue. Merci d'envoyer votre commande par e-mail.")
      })
      .catch(() => setErreur("Une erreur est survenue. Merci d'envoyer votre commande par e-mail."))
  }

  return (
    <CartContext.Provider
      value={{ selection, client, envoye, erreur, cartOpen, onAdd, onRemove, setSelection, setClient, setEnvoye, setCartOpen, submitOrder }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
