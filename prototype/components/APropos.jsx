// À propos — l'histoire et le savoir-faire de Sophie.
function APropos() {
  return (
    <section id="miellerie" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-jar">
              <img
                src="../public/images/sophie-ruches.jpg"
                alt="Sophie Mus au milieu de ses ruches"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            {/* Petite vignette ruches */}
            <div className="absolute -bottom-6 -right-4 hidden w-40 overflow-hidden rounded-2xl border-4 border-cream shadow-soft sm:block md:-right-8 md:w-52">
              <img src="../public/images/ruches-verte.jpg" alt="Ruches colorées" className="aspect-square w-full object-cover" />
            </div>
          </Reveal>

          {/* Texte */}
          <div>
            <Reveal>
              <SectionLabel>La miellerie</SectionLabel>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
                De la passion<br /> au savoir-faire
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-6 flex flex-col gap-4 font-body text-base leading-relaxed text-ink-soft">
                <p>
                  J'ai découvert et appris le métier chez un apiculteur passionné qui élaborait
                  son miel selon le cahier des charges de l'apiculture biologique — qui, à mon sens,
                  devrait être la seule façon de produire, dans le respect de l'homme et de l'environnement.
                </p>
                <p>
                  Après trois années, j'ai suivi une formation pour obtenir un{" "}
                  <strong className="font-semibold text-ink">diplôme agricole</strong> qui m'a permis
                  de m'installer comme apicultrice en <strong className="font-semibold text-ink">juillet 2004</strong>.
                </p>
                <p>
                  Mes ruches sont situées hors des grands axes routiers. Je n'utilise aucun produit
                  répulsif ni antibiotique, j'extrais le miel et le conditionne à température ambiante :
                  je garantis que toutes les propriétés de mes miels sont conservées.
                </p>
              </div>
            </Reveal>

            {/* Citation manuscrite */}
            <Reveal delay={240}>
              <figure className="mt-8 border-l-2 border-honey pl-5">
                <blockquote className="font-display italic text-2xl leading-snug text-honey-deep md:text-3xl">
                  « Une petite exploitation dont je gère chaque aspect : soins des ruches,
                  transhumances, récoltes, extractions, mise en pots. »
                </blockquote>
                <figcaption className="mt-2 font-body text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Sophie Mus — Apicultrice récoltante
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex items-center gap-4">
                <img src="../public/images/logo-ab.png" alt="Logo certification AB / BIO" className="h-14 w-auto" />
                <p className="font-body text-sm leading-relaxed text-ink-soft">
                  Mes miels sont certifiés BIO par{" "}
                  <a href="https://www.ecocert.com" target="_blank" rel="noopener" className="font-semibold text-honey-deep hover:underline">Ecocert</a>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { APropos });
