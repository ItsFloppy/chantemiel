// Hero — pleine hauteur, photo des pots devant le Luberon.
function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Photo de fond */}
      <img
        src="../public/images/pyramide-pots.jpg"
        alt="Pots de miel Chantemiel posés sur un tronc, devant le massif du Luberon"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Voiles pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/55"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 to-transparent"></div>

      {/* Contenu */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <div className="max-w-3xl">
          <Reveal>
            <BioBadge />
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-[2.7rem] leading-[1.04] text-cream sm:text-6xl md:text-7xl">
              Le miel comme<br className="hidden sm:block" /> on n'en fait{" "}
              <span className="italic text-honey">presque</span> plus.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-cream/85 sm:text-lg">
              Sophie Mus, apicultrice récoltante dans le Vaucluse. Deux cents ruches
              menées hors des grands axes, sans antibiotique ni répulsif, extraites
              et mises en pot à froid. Six miels du Luberon aux Cévennes.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#catalogue"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-honey px-7 py-3.5 font-body text-base font-bold text-white shadow-jar transition-all hover:bg-honey-deep"
              >
                Découvrir les miels
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#commander"
                className="inline-flex items-center justify-center rounded-full border border-cream/40 bg-cream/5 px-7 py-3.5 font-body text-base font-semibold text-cream backdrop-blur-sm transition-all hover:bg-cream/15"
              >
                Remplir un bon de commande
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bandeau fin signature */}
      <div className="absolute bottom-0 left-0 right-0 z-10 hidden items-center justify-between border-t border-cream/15 px-10 py-4 text-cream/70 md:flex">
        <span className="font-body text-xs uppercase tracking-[0.25em]">L'Isle-sur-la-Sorgue · Vaucluse</span>
        <span className="font-body text-xs uppercase tracking-[0.25em]">Installée en 2004 · 200 ruches</span>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
