import { Reveal } from './ui/Reveal'

const VALEURS = [
  { titre: 'Certifié bio Ecocert', texte: 'Contrôlée par Ecocert selon le cahier des charges de l\'apiculture biologique.' },
  { titre: 'Extraction à froid', texte: 'Miel extrait et conditionné à température ambiante : propriétés préservées.' },
  { titre: '200 ruches, à la main', texte: 'Une petite exploitation familiale, chaque geste mené par Sophie elle-même.' },
  { titre: 'Terroirs de Provence', texte: 'Du Luberon à l\'Isère, des emplacements choisis en pleine nature.' },
]

export function Valeurs() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-4 md:gap-x-0 md:divide-x md:divide-honey/15">
          {VALEURS.map((v, i) => (
            <Reveal key={v.titre} delay={i * 90}>
              <div className="flex flex-col items-center px-4 text-center md:px-8">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-honey/30 bg-paper font-display text-2xl text-honey-deep shadow-soft">
                  0{i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl text-ink">{v.titre}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{v.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
