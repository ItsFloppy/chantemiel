import { CONTACT } from '@/lib/data'
import { BioBadge } from './ui/BioBadge'

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
              <li>{c.nom} — {c.metier}</li>
              <li>{c.adresse}</li>
              <li>
                <a href={`mailto:${c.email}`} className="text-honey hover:underline">{c.email}</a>
              </li>
              <li>{c.tel}</li>
            </ul>
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
          <span>© {new Date().getFullYear()} Chantemiel — {c.nom}, L&apos;Isle-sur-la-Sorgue.</span>
          <span>Apiculture biologique · Certifiée Ecocert</span>
        </div>
      </div>
    </footer>
  )
}
