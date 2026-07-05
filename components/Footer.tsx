import { CONTACT, GOOGLE_AVIS_URL } from '@/lib/data'
import { BioBadge } from './ui/BioBadge'

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l2.9 6.26 6.7.94-4.8 4.34 1.28 6.86L12 17.1l-6.08 3.3L7.2 13.54 2.4 9.2l6.7-.94L12 2z" />
    </svg>
  )
}

export function Footer() {
  const c = CONTACT
  return (
    <footer id="contact" className="scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <span className="font-hand text-4xl text-honey">Chantemiel</span>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-cream/60">
              Miels certifiés BIO, récoltés en Provence et mis en pot à la main par
              une apicultrice passionnée.
            </p>
            <BioBadge className="mt-5" />
          </div>

          <div className="font-body text-sm">
            <h4 className="font-display text-lg text-cream">Contact</h4>
            <ul className="mt-4 flex flex-col gap-2 text-cream/70">
              <li>{c.nom}, {c.metier}</li>
              <li>{c.adresse}</li>
              <li>
                <a href={`mailto:${c.email}`} className="text-honey hover:underline">{c.email}</a>
              </li>
              <li>{c.tel}</li>
            </ul>

            {(c.instagram || GOOGLE_AVIS_URL) && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {c.instagram && (
                  <a
                    href={c.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Chantemiel (@chantemiel_apiculture)"
                    className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-3.5 py-2 text-cream/80 transition-colors hover:border-honey hover:text-honey"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    <span className="text-xs font-semibold">@chantemiel_apiculture</span>
                  </a>
                )}
                {GOOGLE_AVIS_URL && (
                  <a
                    href={GOOGLE_AVIS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-3.5 py-2 text-cream/80 transition-colors hover:border-honey hover:text-honey"
                  >
                    <StarIcon className="h-4 w-4 text-honey" />
                    <span className="text-xs font-semibold">Laisser un avis Google</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="font-body text-sm">
            <h4 className="font-display text-lg text-cream">Naviguer</h4>
            <ul className="mt-4 flex flex-col gap-2 text-cream/70">
              <li><a href="#catalogue" className="transition-colors hover:text-honey">Les miels</a></li>
              <li><a href="#commander" className="transition-colors hover:text-honey">Bon de commande</a></li>
              <li><a href="#miellerie" className="transition-colors hover:text-honey">La miellerie</a></li>
              <li><a href="#points-de-vente" className="transition-colors hover:text-honey">Points de vente</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 font-body text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Chantemiel · {c.nom}, L&apos;Isle-sur-la-Sorgue.</span>
          <span>Apiculture biologique · Certifiée Ecocert</span>
        </div>
      </div>
    </footer>
  )
}
