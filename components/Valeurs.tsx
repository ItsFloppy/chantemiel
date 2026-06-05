import { Reveal } from './ui/Reveal'

const VALEURS = [
  { titre: 'Certifié BIO', texte: 'Contrôlée par Ecocert selon le cahier des charges de l\'apiculture biologique.' },
  { titre: 'Extraction à froid', texte: 'Miel extrait et conditionné à température ambiante : propriétés préservées.' },
  { titre: '200 ruches', texte: 'Une petite exploitation familiale, chaque geste mené par Sophie elle-même.' },
  { titre: 'Terroirs de Provence', texte: 'Du Luberon aux Maures, des emplacements choisis loin des grands axes.' },
]

export function Valeurs() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {VALEURS.map((v, i) => (
            <Reveal key={v.titre} delay={i * 90}>
              <div className="flex flex-col">
                <span className="font-body text-3xl font-semibold text-honey-deep md:text-4xl">
                  0{i + 1}
                </span>
                <div className="my-3 h-px w-10 bg-honey/40" />
                <h3 className="font-display text-lg text-ink md:text-xl">{v.titre}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{v.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
