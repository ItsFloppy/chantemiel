import Image from 'next/image'
import { Reveal } from './ui/Reveal'
import { SectionLabel } from './ui/SectionLabel'

export function APropos() {
  return (
    <section id="miellerie" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-jar">
              <Image
                src="/images/sophie-ruches.jpg"
                alt="Sophie Mus au milieu de ses ruches"
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-40 overflow-hidden rounded-2xl border-4 border-cream shadow-soft sm:block md:-right-8 md:w-52">
              <Image
                src="/images/ruches-verte.jpg"
                alt="Ruches colorées"
                width={200}
                height={200}
                className="aspect-square w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="mt-8 lg:mt-0">
            <Reveal>
              <SectionLabel>La miellerie</SectionLabel>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
                Une petite miellerie<br /> de famille, en Provence
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-6 flex flex-col gap-4 font-body text-base leading-relaxed text-ink-soft">
                <p>
                  J&apos;ai découvert et appris le métier chez un apiculteur passionné qui élaborait
                  son miel selon le cahier des charges de l&apos;apiculture biologique — qui, à mon sens,
                  devrait être la seule façon de produire, dans le respect de l&apos;homme et de l&apos;environnement.
                </p>
                <p>
                  Après trois années, j&apos;ai suivi une formation pour obtenir un{' '}
                  <strong className="font-semibold text-ink">diplôme agricole</strong> qui m&apos;a permis
                  de m&apos;installer comme apicultrice en{' '}
                  <strong className="font-semibold text-ink">juillet 2004</strong>.
                </p>
                <p>
                  Mes ruches sont situées hors des grands axes routiers. Je n&apos;utilise aucun produit
                  répulsif ni antibiotique, j&apos;extrais le miel et le conditionne à température ambiante :
                  je garantis que toutes les propriétés de mes miels sont conservées.
                </p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <figure className="mt-8 border-l-2 border-honey pl-5">
                <blockquote className="font-display text-2xl italic leading-snug text-honey-deep md:text-3xl">
                  « Une petite exploitation dont je gère chaque aspect : soins des ruches,
                  transhumances, récoltes, extractions, mise en pots. »
                </blockquote>
                <figcaption className="mt-2 font-body text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Sophie Mus, apicultrice récoltante
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex items-center gap-4">
                <Image src="/images/logo-ab.png" alt="Logo certification AB / BIO" width={80} height={34} className="h-14 w-auto" />
                <p className="font-body text-sm leading-relaxed text-ink-soft">
                  Mes miels sont certifiés BIO par{' '}
                  <a href="https://www.ecocert.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-honey-deep hover:underline">
                    Ecocert
                  </a>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
