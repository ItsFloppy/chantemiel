'use client'

import { useCart } from '@/lib/cart'
import { BioBadge } from './ui/BioBadge'

function IconeBio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  )
}
function IconeAppro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  )
}
function IconeCarton() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

const ATOUTS = [
  { Icone: IconeBio, titre: 'Certifié bio Ecocert', texte: 'Production contrôlée par Ecocert : un argument de vente clé pour vos rayons.' },
  { Icone: IconeAppro, titre: 'Appro régulier', texte: '200 ruches, 6 variétés récoltées chaque année et extraites à froid : une qualité constante et traçable.' },
  { Icone: IconeCarton, titre: 'Cartons de 12 pots', texte: 'Pots de 250 g, 500 g et 1 kg par carton de 12. Autres conditionnements sur devis.' },
]

/**
 * Bloc « vente en gros » affiché DANS le catalogue, juste sous le switch
 * Particulier/Entreprise. Il reste monté en permanence et s'ouvre / se ferme en
 * douceur (grid-rows 0fr↔1fr + fondu) selon le mode entreprise, pour animer aussi
 * bien l'apparition que la disparition.
 */
export function Professionnels() {
  const { clientType } = useCart()
  const pro = clientType === 'entreprise'

  function demanderDevis() {
    document.getElementById('commander')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      id="professionnels"
      aria-hidden={!pro}
      style={{ gridTemplateRows: pro ? '1fr' : '0fr' }}
      className={
        'grid scroll-mt-28 transition-[grid-template-rows,opacity] duration-500 ease-out ' +
        (pro ? 'opacity-100' : 'pointer-events-none opacity-0')
      }
    >
      <div className="overflow-hidden">
        <div className="pb-12 md:pb-16">
          <div className="rounded-3xl border border-honey/25 bg-paper p-6 shadow-soft md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-display text-2xl leading-tight text-ink md:text-3xl">
                  Vente en gros aux professionnels
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft md:text-base">
                  Magasins bio, épiceries fines, restaurants, hôtels, chocolateries&nbsp;: un miel bio
                  de Provence récolté à la main, en gros et sur devis, avec la régularité d&apos;une
                  exploitation de 200 ruches. Je privilégie le circuit court et les partenaires locaux
                  du territoire.
                </p>
              </div>
              <BioBadge className="flex-shrink-0" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {ATOUTS.map(a => (
                <div key={a.titre} className="flex flex-col rounded-2xl border border-ink/[0.06] bg-cream p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-honey/10 text-honey-deep">
                    <a.Icone />
                  </span>
                  <h4 className="mt-4 font-display text-lg leading-snug text-ink">{a.titre}</h4>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-soft">{a.texte}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-ink/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl font-body text-sm leading-relaxed text-ink-soft">
                Composez votre sélection ci-dessous, puis demandez un devis&nbsp;: je reviens vers vous
                avec une proposition tarifaire personnalisée. Échantillon possible avant un premier
                référencement.
              </p>
              <button
                onClick={demanderDevis}
                className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-honey px-6 py-3 font-body text-sm font-bold text-white shadow-jar transition-colors hover:bg-honey-deep"
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
