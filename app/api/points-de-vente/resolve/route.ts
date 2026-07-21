import { NextResponse } from 'next/server'

/**
 * Résout un lien Google Maps (partagé par Sophie dans le Studio) en données
 * exploitables pour un point de vente : nom, coordonnées GPS, ville.
 *
 * Pourquoi une route serveur ? Déplier un lien court `maps.app.goo.gl` (suivre
 * la redirection) et interroger Nominatim est bloqué par le CORS depuis le
 * navigateur. Le Studio étant embarqué dans la même app Next (`/studio`), on
 * appelle cette route du même origine.
 *
 * Gratuit, sans clé : le nom + les coordonnées sont extraits de l'URL Google
 * Maps, la ville est déduite par géocodage inverse via Nominatim (OpenStreetMap).
 * Le vrai site web du magasin n'est PAS récupérable sans l'API Google Places
 * (payante) — le champ `url` reçoit donc le lien Maps en repli côté client.
 */

export const runtime = 'nodejs'
// Une route POST n'est jamais mise en cache, mais on l'explicite.
export const dynamic = 'force-dynamic'

/** User-Agent « navigateur » : certains liens Google ne redirigent qu'avec ça. */
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/**
 * Hôtes autorisés (anti-SSRF) : on ne déplie que des liens Google Maps.
 * Couvre les domaines pays (`google.fr`, `google.be`…) via un suffixe.
 */
function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  const exact = ['goo.gl', 'maps.app.goo.gl', 'g.co']
  if (exact.includes(h)) return true
  // google.com, www.google.com, maps.google.com, google.fr, google.co.uk, …
  return /(^|\.)google\.[a-z.]+$/.test(h)
}

interface ResolveResult {
  ok: boolean
  nom?: string
  lat?: number
  lng?: number
  ville?: string
  mapsUrl?: string
  error?: string
}

/** `decodeURIComponent` tolérant (une séquence `%` malformée ne fait pas planter). */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/** Extrait le nom du lieu depuis un chemin `/maps/place/<nom>/…`. */
function parseNom(finalUrl: string): string {
  const m = finalUrl.match(/\/maps\/place\/([^/@]+)/)
  if (!m) return ''
  try {
    return decodeURIComponent(m[1].replace(/\+/g, ' ')).trim()
  } catch {
    return m[1].replace(/\+/g, ' ').trim()
  }
}

/**
 * Extrait lat/lng d'une URL/HTML Google Maps.
 * Priorité au marqueur du lieu `!3d<lat>!4d<lng>` (coordonnée réelle du point),
 * repli sur `@<lat>,<lng>` (centre de la carte, souvent identique).
 */
function parseCoords(haystack: string): { lat: number; lng: number } | null {
  const marker = haystack.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
  if (marker) {
    return { lat: parseFloat(marker[1]), lng: parseFloat(marker[2]) }
  }
  const at = haystack.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (at) {
    return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) }
  }
  return null
}

/** Géocodage inverse Nominatim (OpenStreetMap) : lat/lng → ville. Best-effort. */
async function reverseGeocodeVille(lat: number, lng: number): Promise<string> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&addressdetails=1` +
      `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
    const res = await fetch(url, {
      headers: {
        // Exigé par la politique d'usage Nominatim (identifier l'application).
        'User-Agent': 'Chantemiel/1.0 (chantemiel@wanadoo.fr)',
        'Accept-Language': 'fr',
      },
      cache: 'no-store',
    })
    if (!res.ok) return ''
    const data = (await res.json()) as { address?: Record<string, string> }
    const a = data.address ?? {}
    return a.city || a.town || a.village || a.municipality || a.county || ''
  } catch {
    return ''
  }
}

export async function POST(request: Request): Promise<NextResponse<ResolveResult>> {
  let url = ''
  try {
    const body = (await request.json()) as { url?: unknown }
    url = typeof body.url === 'string' ? body.url.trim() : ''
  } catch {
    return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 })
  }

  if (!url) {
    return NextResponse.json({ ok: false, error: 'Aucun lien fourni.' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ ok: false, error: 'Lien invalide.' }, { status: 400 })
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ ok: false, error: 'Lien invalide.' }, { status: 400 })
  }

  if (!isAllowedHost(parsed.hostname)) {
    return NextResponse.json(
      { ok: false, error: 'Ce n’est pas un lien Google Maps.' },
      { status: 400 }
    )
  }

  // 1. Essayer d'abord sur le lien collé tel quel : une URL longue
  //    (`.../maps/place/…@lat,lng…`) porte déjà tout, inutile de la refetcher —
  //    et un fetch de google.com peut rediriger vers une page de consentement
  //    qui, elle, perd les coordonnées.
  let finalUrl = url
  let nom = parseNom(url)
  let coords = parseCoords(url) ?? parseCoords(safeDecode(url))

  // 2. Sinon (lien court goo.gl / maps.app.goo.gl), suivre la redirection.
  if (!coords) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'fr' },
        cache: 'no-store',
      })
      finalUrl = res.url || url
      // L'URL finale est parfois une page de consentement dont le paramètre
      // `continue=` contient (URL-encodé) la vraie destination Maps → on tente
      // aussi la version décodée avant de télécharger le HTML.
      coords = parseCoords(finalUrl) ?? parseCoords(safeDecode(finalUrl))
      nom = nom || parseNom(finalUrl) || parseNom(safeDecode(finalUrl))

      if (!coords) {
        const html = (await res.text()).slice(0, 300_000)
        coords = parseCoords(html) ?? parseCoords(safeDecode(html))
        nom = nom || parseNom(html)
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Impossible d’ouvrir ce lien Google Maps.' },
        { status: 502 }
      )
    }
  }

  if (!coords) {
    return NextResponse.json({
      ok: false,
      error:
        'Lien non reconnu — collez un lien vers un lieu précis (pas une recherche).',
    })
  }

  // 3. Ville par géocodage inverse (best-effort ; vide = à compléter à la main).
  const ville = await reverseGeocodeVille(coords.lat, coords.lng)

  return NextResponse.json({
    ok: true,
    nom,
    lat: coords.lat,
    lng: coords.lng,
    ville,
    mapsUrl: finalUrl,
  })
}
