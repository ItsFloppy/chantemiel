export interface Format {
  poids: string
  /** Prix particulier, TTC, en euros (ex. 6.5). Le « € » est ajouté à l'affichage. */
  prix: number
  /** Prix entreprise par pot, HT, en euros (ex. 5.56). Optionnel : fallback sur `prix`. */
  prixPro?: number
  disponible: boolean
}

/** Type de client : particulier (prix TTC, livraison possible) ou entreprise (prix HT, cartons de 12). */
export type ClientType = 'particulier' | 'entreprise'

export interface Miel {
  id: string
  nom: string
  image: string
  saison: string
  terroir: string
  notes: string[]
  description: string
  formats: Format[]
}

export interface PointDeVente {
  id: string
  nom: string
  ville: string
  lat: number
  lng: number
  url?: string
}

export interface Contact {
  nom: string
  metier: string
  adresse: string
  email: string
  tel: string
  cheptel: string
}

export interface ClientInfo {
  nom: string
  email: string
  tel: string
  // Adresse structurée (standard postal FR)
  adresseNumero: string
  adresseRue: string
  codePostal: string
  ville: string
  // Entreprise uniquement
  siret: string
  message: string
}

export type Selection = Record<string, number>
