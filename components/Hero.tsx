import { Reveal } from './ui/Reveal'
import { BioBadge } from './ui/BioBadge'
import { ProSwitchLink } from './ui/ProSwitchLink'

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-label="Abeille butinant un brin de lavande"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/images/BeeOnLavender.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-24 md:px-10 md:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <BioBadge />
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.04] text-cream sm:text-6xl md:text-7xl">
              Du miel bio,<br className="hidden sm:block" /> récolté à la main{' '}
              <span className="whitespace-nowrap">en <span className="italic text-honey">Provence</span></span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-cream/85 sm:text-lg">
              Sophie Mus, apicultrice récoltante dans le Vaucluse. Deux cents ruches en pleine nature, sans antibiotiques ni répulsifs.
              Des miels récoltés et conditionnés à température ambiante, vendus en circuit court, du Luberon à l&apos;Isère.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#catalogue"
                className="inline-flex items-center justify-center rounded-full bg-honey px-7 py-3.5 font-body text-base font-bold text-white shadow-jar transition-all hover:bg-honey-deep"
              >
                Découvrir les miels
              </a>
              <a
                href="#commander"
                className="inline-flex items-center justify-center rounded-full border border-cream/40 bg-cream/5 px-7 py-3.5 font-body text-base font-semibold text-cream backdrop-blur-sm transition-all hover:bg-cream/15"
              >
                Remplir un bon de commande
              </a>
              <ProSwitchLink className="group inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-honey/50 bg-honey/[0.08] px-6 py-3.5 backdrop-blur-sm transition-colors hover:border-honey hover:bg-honey/15">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0 text-honey">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span className="font-body text-sm font-semibold text-cream/90 group-hover:text-cream">
                  Professionnels&nbsp;: vente en gros sur devis
                </span>
              </ProSwitchLink>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 hidden items-center justify-between border-t border-cream/15 px-10 py-4 text-cream/70 md:flex">
        <span className="font-body text-xs uppercase tracking-[0.25em]">L&apos;Isle-sur-la-Sorgue · Vaucluse</span>
        <span className="font-body text-xs uppercase tracking-[0.25em]">Depuis 2004 · 200 ruches</span>
      </div>
    </section>
  )
}
