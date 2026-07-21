'use client'

import { useCallback, useState } from 'react'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { SyncIcon } from '@sanity/icons'
import {
  getPublishedId,
  useDocumentOperation,
  useFormValue,
  type StringInputProps,
} from 'sanity'

/**
 * Input custom du champ « Lien Google Maps » d'un point de vente.
 *
 * Rend l'input URL standard + un bouton « Remplir automatiquement ». Au clic,
 * il envoie le lien collé à la route serveur `/api/points-de-vente/resolve`
 * (déplie le lien court, extrait nom + coordonnées, déduit la ville via
 * Nominatim) puis patche les champs voisins du document.
 *
 * Règle de remplissage (prévisible, ne détruit jamais une saisie manuelle) :
 * - `nom`, `ville`, `url` → `setIfMissing` (remplis seulement s'ils sont vides ;
 *   `url` reçoit le lien Maps en repli faute de vrai site web récupérable) ;
 * - `lat`, `lng` → `set` (toujours rafraîchis : c'est le cœur de l'action).
 */

type Status = {
  tone: 'positive' | 'caution' | 'critical'
  message: string
} | null

interface ResolveResponse {
  ok: boolean
  nom?: string
  lat?: number
  lng?: number
  ville?: string
  mapsUrl?: string
  error?: string
}

export function MapsAutofillInput(props: StringInputProps) {
  const value = props.value
  const docId = useFormValue(['_id']) as string | undefined
  const docType = (useFormValue(['_type']) as string | undefined) ?? 'pointDeVente'
  const publishedId = docId ? getPublishedId(docId) : ''
  const { patch } = useDocumentOperation(publishedId, docType)

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const handleFill = useCallback(async () => {
    const link = (value ?? '').trim()
    if (!link) {
      setStatus({ tone: 'caution', message: 'Collez d’abord un lien Google Maps ci-dessus.' })
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/points-de-vente/resolve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: link }),
      })
      const data = (await res.json()) as ResolveResponse

      if (!data.ok) {
        setStatus({ tone: 'critical', message: data.error || 'Lien non reconnu.' })
        return
      }

      // Ne remplit nom/ville/url que s'ils sont vides (préserve la saisie manuelle).
      const setIfMissing: Record<string, unknown> = {}
      if (data.nom) setIfMissing.nom = data.nom
      if (data.ville) setIfMissing.ville = data.ville
      if (data.mapsUrl) setIfMissing.url = data.mapsUrl

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mutations: any[] = []
      if (Object.keys(setIfMissing).length) mutations.push({ setIfMissing })
      // Coordonnées : toujours écrasées.
      mutations.push({ set: { lat: data.lat, lng: data.lng } })
      patch.execute(mutations)

      setStatus(
        data.ville
          ? { tone: 'positive', message: 'Champs remplis ✓ — vérifiez puis publiez.' }
          : {
              tone: 'caution',
              message: 'Coordonnées trouvées ✓ — complétez la ville à la main.',
            }
      )
    } catch {
      setStatus({ tone: 'critical', message: 'Erreur réseau. Réessayez.' })
    } finally {
      setLoading(false)
    }
  }, [value, patch])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        type="button"
        mode="ghost"
        tone="primary"
        icon={SyncIcon}
        text={loading ? 'Recherche…' : 'Remplir automatiquement'}
        onClick={handleFill}
        disabled={loading}
      />
      {status && (
        <Card padding={3} radius={2} tone={status.tone} border>
          <Text size={1}>{status.message}</Text>
        </Card>
      )}
    </Stack>
  )
}
