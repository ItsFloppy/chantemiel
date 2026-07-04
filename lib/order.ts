import type { ClientInfo, ClientType, Format, Miel, Selection } from './types'

/** TVA applicable au miel (produit alimentaire). */
export const TVA_PRO = 0.055
/** Nombre de pots par carton pour les commandes entreprise. */
export const POTS_PAR_CARTON = 12

/** Barème des frais de port (à la charge du client), tarifs La Poste. */
export const FRAIS_PORT = [
  { maxKg: 3, prix: 18 },
  { maxKg: 5, prix: 24.5 },
]

/**
 * Renvoie la valeur numérique d'un prix. Tolère les nombres (nouveau modèle
 * Sanity) comme les chaînes héritées ("6,50 €", "11 €", "7") — ce qui garantit
 * qu'aucune fenêtre de migration (données string ↔ number) ne casse le rendu.
 */
export function prixToNumber(prix: number | string | null | undefined): number {
  if (typeof prix === 'number') return Number.isFinite(prix) ? prix : 0
  if (!prix) return 0
  return parseFloat(prix.replace('€', '').replace(',', '.').trim()) || 0
}

/**
 * Formate un prix unitaire en euros français, « € » inclus : `6,50 €`, `11 €`.
 * Les centimes ne s'affichent que s'ils existent (un prix entier reste « 11 € »).
 */
export function formatPrix(prix: number | string | null | undefined): string {
  const v = prixToNumber(prix)
  const avecCentimes = Math.round(v * 100) % 100 !== 0
  return `${v.toLocaleString('fr-FR', {
    minimumFractionDigits: avecCentimes ? 2 : 0,
    maximumFractionDigits: 2,
  })} €`
}

/** Valeur numérique du prix unitaire selon le type de client (HT pro / TTC particulier). */
export function prixValeur(format: Format, type: ClientType): number {
  const brut = type === 'entreprise' ? format.prixPro ?? format.prix : format.prix
  return prixToNumber(brut)
}

/** Convertit un poids ("250g", "500g", "1 kg") en grammes. */
export function poidsToGrammes(poids: string | null | undefined): number {
  if (!poids) return 0
  const s = poids.toLowerCase().replace(',', '.')
  const n = parseFloat(s) || 0
  return s.includes('kg') ? n * 1000 : n
}

/**
 * Libellé lisible du nombre de cartons (12 pots) pour une commande entreprise.
 * Partagé entre le récap à l'écran et le corps de l'e-mail, pour que le client
 * et Sophie lisent exactement la même formulation. Ex. « 2 cartons de 12 + 3 pots ».
 */
export function cartonLabel(totalArticles: number): string {
  const pleins = Math.floor(totalArticles / POTS_PAR_CARTON)
  const reste = totalArticles % POTS_PAR_CARTON
  if (totalArticles < POTS_PAR_CARTON) return 'moins d’un carton'
  return `${pleins} carton${pleins > 1 ? 's' : ''} de 12${reste ? ` + ${reste} pot${reste > 1 ? 's' : ''}` : ''}`
}

/** Prix unitaire affiché (« € » inclus) selon le type de client (HT pour l'entreprise, TTC pour le particulier). */
export function prixFormat(format: Format, type: ClientType): string {
  return formatPrix(prixValeur(format, type))
}

/**
 * Frais de port selon le poids total.
 * Retourne le prix en €, `0` si panier vide, ou `null` si non expédiable (> poids max).
 */
export function fraisLivraison(grammes: number): number | null {
  if (grammes <= 0) return 0
  const kg = grammes / 1000
  const palier = FRAIS_PORT.find(p => kg <= p.maxKg)
  return palier ? palier.prix : null
}

/** Formate un nombre en euros français ("12,50 €"). */
export function formatEuro(n: number): string {
  return `${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

export function panierTotaux(selection: Selection, miels: Miel[], type: ClientType = 'particulier') {
  const lignes = Object.entries(selection).filter(([, q]) => q > 0)
  const totalArticles = lignes.reduce((s, [, q]) => s + q, 0)
  const totalPrix = lignes.reduce((s, [key, q]) => {
    const item = trouveItem(key, miels)
    return s + (item.format ? prixValeur(item.format, type) * q : 0)
  }, 0)
  const poidsGrammes = lignes.reduce((s, [key, q]) => {
    const item = trouveItem(key, miels)
    return s + (item.format ? poidsToGrammes(item.format.poids) * q : 0)
  }, 0)
  return { lignes, totalArticles, totalPrix, poidsGrammes }
}

export function trouveItem(key: string, miels: Miel[]) {
  const [mielId, poids] = key.split('__')
  const miel = miels.find(m => m.id === mielId) ?? null
  const format = miel?.formats.find(f => f.poids === poids) ?? null
  return { miel, format }
}

export function buildOrderBody(
  selection: Selection,
  miels: Miel[],
  client: ClientInfo,
  type: ClientType = 'particulier',
  livraison = false
) {
  const { lignes, totalArticles, totalPrix, poidsGrammes } = panierTotaux(selection, miels, type)
  const panier = lignes
    .map(([key, q]) => {
      const { miel, format } = trouveItem(key, miels)
      const base = `${miel?.nom ?? key} ${format?.poids ?? ''} × ${q}`
      // En mode entreprise (demande de devis) aucun prix n'est affiché ni transmis.
      if (type === 'entreprise') return base
      const pu = format ? prixFormat(format, type) : '?'
      return `${base} (${pu}/pot)`
    })
    .join('\n')

  const adresse = [
    [client.adresseNumero, client.adresseRue].filter(Boolean).join(' '),
    [client.codePostal, client.ville].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ')

  const poidsKg = poidsGrammes / 1000

  const base = {
    type: type === 'entreprise' ? 'Entreprise — demande de devis' : 'Particulier',
    nom: client.nom,
    email: client.email,
    tel: client.tel,
    adresse,
    message: client.message,
    panier,
    poids: `${poidsKg.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg`,
  }

  if (type === 'entreprise') {
    // Demande de devis : on transmet la sélection (sans prix), Sophie chiffre elle-même.
    return {
      ...base,
      siret: client.siret,
      pots: `${totalArticles} pot${totalArticles > 1 ? 's' : ''} (${cartonLabel(totalArticles)})`,
    }
  }

  const port = livraison ? fraisLivraison(poidsGrammes) : 0
  return {
    ...base,
    livraison: livraison ? 'Oui — frais de port à la charge du client' : 'Non (retrait / à convenir)',
    frais_de_port: livraison ? (port === null ? 'Non expédiable (> 5 kg)' : formatEuro(port)) : '—',
    total: formatEuro(totalPrix + (livraison && port ? port : 0)),
  }
}
