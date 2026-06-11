'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Miel, Selection, ClientInfo, ClientType } from './types'
import { buildOrderBody, fraisLivraison, panierTotaux } from './order'

const CLIENT_VIDE: ClientInfo = {
  nom: '',
  email: '',
  tel: '',
  adresseNumero: '',
  adresseRue: '',
  codePostal: '',
  ville: '',
  siret: '',
  message: '',
}

interface CartContextValue {
  selection: Selection
  client: ClientInfo
  clientType: ClientType
  livraison: boolean
  envoye: boolean
  erreur: string
  cartOpen: boolean
  onAdd: (miel: Miel, poids: string) => void
  onRemove: (miel: Miel, poids: string) => void
  setQte: (miel: Miel, poids: string, q: number) => void
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
  setClient: React.Dispatch<React.SetStateAction<ClientInfo>>
  setClientType: React.Dispatch<React.SetStateAction<ClientType>>
  setLivraison: React.Dispatch<React.SetStateAction<boolean>>
  setEnvoye: React.Dispatch<React.SetStateAction<boolean>>
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  resetClient: () => void
  submitOrder: (e: React.FormEvent, miels: Miel[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({})
  const [client, setClient] = useState<ClientInfo>(CLIENT_VIDE)
  const [clientType, setClientType] = useState<ClientType>('particulier')
  const [livraison, setLivraison] = useState(false)
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

  function setQte(miel: Miel, poids: string, q: number) {
    const key = `${miel.id}__${poids}`
    setSelection(prev => {
      const next = { ...prev }
      const n = Number.isFinite(q) ? Math.max(0, Math.floor(q)) : 0
      if (n <= 0) delete next[key]
      else next[key] = n
      return next
    })
  }

  function resetClient() {
    setClient(CLIENT_VIDE)
    setLivraison(false)
  }

  function submitOrder(e: React.FormEvent, miels: Miel[]) {
    e.preventDefault()
    setErreur('')

    const { lignes, poidsGrammes } = panierTotaux(selection, miels, clientType)
    if (lignes.length === 0) {
      setErreur('Sélectionnez au moins un miel dans le catalogue.')
      return
    }
    if (!client.nom.trim() || !client.email.trim()) {
      setErreur("Merci d'indiquer au minimum votre nom et votre e-mail.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim())) {
      setErreur('Cette adresse e-mail ne semble pas valide.')
      return
    }
    if (client.codePostal && client.codePostal.length !== 5) {
      setErreur('Le code postal doit comporter 5 chiffres.')
      return
    }
    if (clientType === 'entreprise') {
      const siret = client.siret.replace(/\D/g, '')
      if (!siret) {
        setErreur("Merci d'indiquer le SIRET de votre entreprise.")
        return
      }
      if (siret.length !== 14) {
        setErreur('Le SIRET doit comporter 14 chiffres.')
        return
      }
    }
    if (clientType === 'particulier' && livraison) {
      if (!client.adresseNumero.trim() || !client.adresseRue.trim() || !client.codePostal.trim() || !client.ville.trim()) {
        setErreur('Pour la livraison, merci de renseigner votre adresse complète (n°, rue, code postal, ville).')
        return
      }
      if (fraisLivraison(poidsGrammes) === null) {
        setErreur('Au-delà de 5 kg, la livraison postale n’est pas possible : contactez-moi pour organiser le transport.')
        return
      }
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
      body: JSON.stringify(buildOrderBody(selection, miels, client, clientType, livraison)),
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
      value={{
        selection,
        client,
        clientType,
        livraison,
        envoye,
        erreur,
        cartOpen,
        onAdd,
        onRemove,
        setQte,
        setSelection,
        setClient,
        setClientType,
        setLivraison,
        setEnvoye,
        setCartOpen,
        resetClient,
        submitOrder,
      }}
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
