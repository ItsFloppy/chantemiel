export interface Format {
  poids: string
  prix: string
  disponible: boolean
}

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
  adresse: string
  message: string
}

export type Selection = Record<string, number>
