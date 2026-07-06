import type { Miel, PointDeVente, Contact } from './types'

export const MIELS_STATIC: Miel[] = [
  {
    id: 'fleurs-luberon',
    nom: 'Miel de Fleurs du Luberon',
    image: '/images/miel-fleurs-luberon.jpg',
    saison: 'Début d\'été',
    terroir: 'Luberon',
    notes: ['Végétal boisé', 'Caramel', 'Balsamique'],
    description: 'Récolté en tout début d\'été, très parfumé. Composé essentiellement de thym, de chêne et de lavande sauvage.',
    formats: [
      { poids: '250g', prix: 6.5, prixPro: 5.56, disponible: true },
      { poids: '500g', prix: 11, prixPro: 9.11, disponible: true },
      { poids: '1 kg', prix: 19, prixPro: 17.01, disponible: true },
    ],
  },
  {
    id: 'chataignier',
    nom: 'Miel de Châtaignier',
    image: '/images/miel-chataignier.jpg',
    saison: 'Fin juin',
    terroir: 'Isère',
    notes: ['Corsé', 'Amertume franche', 'Boisé'],
    description: 'Récolté fin juin en Isère. Brun foncé, au goût fort et à l\'amertume prononcée.',
    formats: [
      { poids: '250g', prix: 6.5, prixPro: 5.56, disponible: true },
      { poids: '500g', prix: 11, prixPro: 9.11, disponible: true },
      { poids: '1 kg', prix: 19, prixPro: 17.01, disponible: false },
    ],
  },
  {
    id: 'lavande',
    nom: 'Miel de Lavande',
    image: '/images/miel-lavande.jpg',
    saison: 'Été',
    terroir: 'Massif du Luberon',
    notes: ['Aromatique', 'Fruit de la passion', 'Floral'],
    description: 'Récolté en été dans le massif du Luberon. Jaune doré à l\'état liquide, goût fortement aromatique aux notes de fruit de la passion.',
    formats: [
      { poids: '250g', prix: 7, prixPro: 6.09, disponible: true },
      { poids: '500g', prix: 12, prixPro: 10.54, disponible: true },
      { poids: '1 kg', prix: 21, prixPro: 17.94, disponible: false },
    ],
  },
  {
    id: 'bruyere-blanche',
    nom: 'Miel de Bruyère Blanche',
    image: '/images/miel-bruyere.jpg',
    saison: 'Début de printemps',
    terroir: 'Massif des Maures',
    notes: ['Caramel', 'Pain d\'épices', 'Saveur forte'],
    description: 'Récolté au tout début du printemps dans le massif des Maures (Var). Brun clair, saveur forte, notes de caramel et de pain d\'épices.',
    formats: [
      { poids: '250g', prix: 7, prixPro: 6.09, disponible: true },
      { poids: '500g', prix: 12, prixPro: 10.54, disponible: true },
      { poids: '1 kg', prix: 21, prixPro: 17.94, disponible: true },
    ],
  },
  {
    id: 'acacia',
    nom: 'Miel d\'Acacia',
    image: '/images/miel-acacia.jpg',
    saison: 'Mai',
    terroir: 'Isère',
    notes: ['Floral discret', 'Toujours liquide', 'Très doux'],
    description: 'Récolté au mois de mai en Isère. Jaune très clair, il reste toujours liquide. Goût floral très discret.',
    formats: [
      { poids: '250g', prix: 6.5, prixPro: 6.09, disponible: false },
      { poids: '500g', prix: 11, prixPro: 10.54, disponible: false },
      { poids: '1 kg', prix: 19, prixPro: 17.94, disponible: false },
    ],
  },
  {
    id: 'romarin',
    nom: 'Miel de Romarin',
    image: '/images/miel-romarin.jpg',
    saison: 'Printemps',
    terroir: 'Monts de Vaucluse',
    notes: ['Aromatique', 'Balsamique', 'Fumée végétale'],
    description: 'Miel de printemps récolté au pied des Monts de Vaucluse. Saveur aromatique, très légèrement balsamique, arôme végétal de fumée.',
    formats: [
      { poids: '250g', prix: 6.5, prixPro: 6.12, disponible: false },
      { poids: '500g', prix: 11, prixPro: 10.56, disponible: false },
      { poids: '1 kg', prix: 19, prixPro: 17.96, disponible: false },
    ],
  },
]

export const MIELLERIE = {
  id: 'miellerie',
  nom: 'La miellerie de Chantemiel',
  ville: 'L\'Isle-sur-la-Sorgue',
  lat: 43.9187,
  lng: 5.0512,
}

export const POINTS_DE_VENTE: PointDeVente[] = [
  { id: 'vieenbieau', nom: 'Biocoop La vie en Bieau', ville: 'Avignon', lat: 43.9620, lng: 4.8120, url: 'http://www.lechequiervert.fr/produits/detailspointvente/1193-la-vie-en-bieau-biocoop' },
  { id: 'biotope', nom: 'Biocoop Biotope', ville: 'Avignon', lat: 43.9360, lng: 4.8260, url: 'https://www.biocoop.fr/magasins-bio/Trouver-mon-magasin-Biocoop/Provence-Alpes-Cote-d-Azur/Vaucluse/BIOTOPE' },
  { id: 'orange', nom: 'Biocoop Orange', ville: 'Orange', lat: 44.1380, lng: 4.8087, url: 'https://orange.biocoop.net/' },
  { id: 'cultures', nom: 'Biocoop Cultures bio', ville: 'Coustellet', lat: 43.8585, lng: 5.1360, url: 'https://www.biocoop.fr/magasins-bio/Trouver-mon-magasin-Biocoop/Provence-Alpes-Cote-d-Azur/Vaucluse/CULTURES-BIO' },
  { id: 'epicurien', nom: 'Biocoop l\'Épicurien Bio', ville: 'Cheval Blanc', lat: 43.8210, lng: 5.0050, url: 'https://alternativi.fr/annuaire/biocoop/cheval-blanc-84460' },
  { id: 'auquotidien', nom: 'Biocoop Au Quotidien', ville: 'Le Thor', lat: 43.9290, lng: 4.9970, url: 'https://www.biocooplethor.com/' },
  { id: 'auzonne', nom: 'Biocoop l\'Auzonne', ville: 'Carpentras', lat: 44.0556, lng: 5.0489, url: 'https://www.biocoopcarpentras.com/' },
  { id: 'collines', nom: 'Biocoop des Collines', ville: 'Marseille 11e', lat: 43.2960, lng: 5.4700, url: 'https://www.biocoopdescollines.com/' },
  { id: 'coopcinelle', nom: 'Coopcinelle', ville: 'Marseille 12e', lat: 43.3050, lng: 5.4230, url: 'http://www.coopcinelle.fr/' },
  { id: 'bookinbar', nom: 'Book\'in bar', ville: 'Aix-en-Provence', lat: 43.5297, lng: 5.4474, url: 'https://www.bookinbar.com/' },
  { id: 'sarment', nom: 'Le Sarment bio', ville: 'Cavaillon', lat: 43.8370, lng: 5.0380, url: 'https://www.lesarmentbio.com/' },
  { id: 'mybioshop-c', nom: 'My Bio Shop', ville: 'Coustellet', lat: 43.8560, lng: 5.1410, url: 'http://mybioshop.fr/coustellet' },
  { id: 'mybioshop-carp', nom: 'My Bio Shop', ville: 'Carpentras', lat: 44.0610, lng: 5.0530, url: 'http://mybioshop.fr/carpentras' },
  { id: 'marcel-carp', nom: 'Marcel & Fils', ville: 'Carpentras', lat: 44.0500, lng: 5.0420, url: 'https://marceletfils.com/pages/carpentras' },
  { id: 'marcel-sorgues', nom: 'Marcel & Fils', ville: 'Sorgues', lat: 44.0090, lng: 4.8720, url: 'https://marceletfils.com/' },
  { id: 'marcel-istres', nom: 'Marcel & Fils', ville: 'Istres', lat: 43.5130, lng: 4.9870, url: 'https://marceletfils.com' },
  { id: 'vieclaire', nom: 'La Vie Claire', ville: 'L\'Isle-sur-la-Sorgue', lat: 43.9230, lng: 5.0480, url: 'https://magasins.lavieclaire.com/' },
  { id: 'luberonbio', nom: 'Luberon Bio', ville: 'Apt', lat: 43.8760, lng: 5.3960, url: 'https://luberonbio.fr/' },
]

export const CONTACT: Contact = {
  nom: 'Sophie Mus',
  metier: 'apicultrice récoltante',
  adresse: '315 Hameau Petit Palais, 84800 L\'Isle-sur-la-Sorgue',
  email: 'chantemiel@wanadoo.fr',
  tel: '06 34 99 23 99',
  cheptel: '200 ruches',
  instagram: 'https://www.instagram.com/chantemiel_apiculture/',
}

/**
 * Lien de dépôt d'avis Google (Google Business Profile).
 * Laissé vide pour l'instant : le bouton « Laisser un avis Google » ne s'affiche
 * QUE si cette URL est renseignée. À compléter avec le lien du type
 * `https://search.google.com/local/writereview?placeid=…` ou `https://g.page/r/…`.
 */
export const GOOGLE_AVIS_URL: string = 'https://g.page/r/Cd_8iykufJw_EAE/review'
