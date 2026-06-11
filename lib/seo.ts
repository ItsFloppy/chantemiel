import type { Miel } from './types'
import { CONTACT, MIELLERIE } from './data'
import { prixToNumber } from './order'

/** Canonical production origin — used by metadataBase, sitemap, robots and JSON-LD. */
export const SITE_URL = 'https://chantemiel.fr'

const business = {
  name: 'Chantemiel',
  legalName: 'Chantemiel, Sophie Mus',
  description:
    "Miellerie certifiée Agriculture Biologique de Sophie Mus, apicultrice récoltante à L'Isle-sur-la-Sorgue (Vaucluse). Six miels récoltés en Provence et mis en pot à froid, sans antibiotique ni répulsif.",
  street: '315 Hameau Petit Palais',
  postalCode: '84800',
  city: "L'Isle-sur-la-Sorgue",
  region: 'Provence-Alpes-Côte d’Azur',
  country: 'FR',
}

/**
 * LocalBusiness — drives the Google local pack and the knowledge panel.
 * Deliberately NOT FoodEstablishment: that type expects `servesCuisine`,
 * which is irrelevant for a honey farm (see CLAUDE.md › SEO).
 */
export function buildLocalBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: SITE_URL,
    image: `${SITE_URL}/images/pyramide-pots.jpg`,
    logo: `${SITE_URL}/images/logo.jpg`,
    email: CONTACT.email,
    telephone: '+33634992399',
    founder: {
      '@type': 'Person',
      name: CONTACT.nom,
      jobTitle: CONTACT.metier,
    },
    foundingDate: '2004',
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      postalCode: business.postalCode,
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: MIELLERIE.lat,
      longitude: MIELLERIE.lng,
    },
    areaServed: { '@type': 'AdministrativeArea', name: 'Vaucluse · Bouches-du-Rhône' },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Agriculture Biologique',
      recognizedBy: { '@type': 'Organization', name: 'Ecocert' },
    },
    knowsAbout: ['Miel bio', 'Apiculture biologique', 'Miel de lavande', 'Miel du Luberon'],
  }
}

/** One Product per honey, with an Offer per format — eligible for product rich results. */
export function buildProductsLd(miels: Miel[]) {
  return miels.map(miel => {
    const offers = miel.formats.map(f => ({
      '@type': 'Offer',
      name: `${miel.nom}, ${f.poids}`,
      price: prixToNumber(f.prix).toFixed(2),
      priceCurrency: 'EUR',
      availability: f.disponible
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/#catalogue`,
      seller: { '@id': `${SITE_URL}/#business` },
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${SITE_URL}/#produit-${miel.id}`,
      name: miel.nom,
      description: miel.description,
      image: miel.image.startsWith('http') ? miel.image : `${SITE_URL}${miel.image}`,
      category: 'Miel biologique',
      brand: { '@type': 'Brand', name: business.name },
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Terroir',
        value: miel.terroir,
      },
      offers,
    }
  })
}

export const FAQ_ITEMS = [
  {
    q: 'Où acheter le miel Chantemiel ?',
    a: "Vous trouvez mes miels dans une sélection de magasins bio du Vaucluse et des Bouches-du-Rhône, et en commande directe auprès de moi via le bon de commande du site. La carte des points de vente est juste au-dessus.",
  },
  {
    q: 'Les miels Chantemiel sont-ils vraiment certifiés bio ?',
    a: "Oui. Toute ma production est certifiée Agriculture Biologique et contrôlée par Ecocert. Je mène mes ruches sans antibiotique ni répulsif chimique, et j’extrais puis mets le miel en pot à froid, pour en garder toutes les propriétés.",
  },
  {
    q: 'Où sont récoltés les miels ?',
    a: "Je conduis mes 200 ruches en Provence, du Luberon aux Cévennes : lavande et romarin des Monts de Vaucluse, châtaignier des Cévennes, bruyère blanche du massif des Maures, acacia de l’Isère.",
  },
  {
    q: 'Comment passer commande ?',
    a: "Choisissez vos miels et formats sur le site, remplissez le bon de commande, et je vous recontacte par e-mail pour organiser le règlement et l’envoi ou le retrait. Il n’y a pas de paiement en ligne : tout se fait en direct, entre nous.",
  },
]

/** FAQPage — captures long-tail queries and can earn a FAQ rich snippet. */
export function buildFaqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
