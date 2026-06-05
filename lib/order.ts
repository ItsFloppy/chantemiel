import type { Miel, Selection } from './types'

export function prixToNumber(prix: string): number {
  return parseFloat(prix.replace('€', '').replace(',', '.').trim()) || 0
}

export function panierTotaux(selection: Selection, miels: Miel[]) {
  const lignes = Object.entries(selection).filter(([, q]) => q > 0)
  const totalArticles = lignes.reduce((s, [, q]) => s + q, 0)
  const totalPrix = lignes.reduce((s, [key, q]) => {
    const item = trouveItem(key, miels)
    return s + (item.format ? prixToNumber(item.format.prix) * q : 0)
  }, 0)
  return { lignes, totalArticles, totalPrix }
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
  client: { nom: string; email: string; tel: string; adresse: string; message: string }
) {
  const { lignes, totalPrix } = panierTotaux(selection, miels)
  const panier = lignes
    .map(([key, q]) => {
      const { miel, format } = trouveItem(key, miels)
      return `${miel?.nom ?? key} ${format?.poids ?? ''} × ${q} (${format?.prix ?? '?'}/pot)`
    })
    .join('\n')

  return {
    nom: client.nom,
    email: client.email,
    tel: client.tel,
    adresse: client.adresse,
    message: client.message,
    panier,
    total: `${totalPrix.toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace('.', ',')} €`,
  }
}
