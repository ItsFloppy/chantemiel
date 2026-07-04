'use client'

import Image from 'next/image'
import { useCart } from '@/lib/cart'
import { SectionLabel } from './ui/SectionLabel'
import { StatutPastille } from './ui/StatutPastille'
import { ClientTypeToggle } from './ui/ClientTypeToggle'
import { Reveal } from './ui/Reveal'
import { prixFormat } from '@/lib/order'
import type { Miel } from '@/lib/types'

function CarteMiel({ miel }: { miel: Miel }) {
  const { selection, clientType, onAdd, setQte } = useCart()
  const pro = clientType === 'entreprise'
  const tousEpuises = miel.formats.every(f => !f.disponible)

  return (
    <Reveal className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-jar transform-gpu">
        {/* Image zone — extends down over title/desc/notes */}
        <div className="relative flex min-h-[21rem] flex-1 flex-col overflow-hidden rounded-t-2xl">
          <Image
            src={miel.image}
            alt={`Pot de ${miel.nom} bio Chantemiel, terroir ${miel.terroir}`}
            fill
            className={
              'object-cover transition-transform duration-[1.2s] group-hover:scale-105 ' +
              (tousEpuises ? 'grayscale-[0.85]' : '')
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Flou progressif en bas : copie floutée de la photo, masquée pour ne
              flouter que le bas. On utilise filter: blur (et non backdrop-filter)
              car la copie zoome en même temps que la photo nette — le flou reste
              donc collé à l'image pendant l'animation, sans « saut » de calque. */}
          <Image
            src={miel.image}
            alt=""
            aria-hidden
            fill
            className={
              'object-cover transition-transform duration-[1.2s] group-hover:scale-105 ' +
              (tousEpuises ? 'grayscale-[0.85]' : '')
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              filter: 'blur(3px)',
              maskImage: 'linear-gradient(to top, #000 30%, transparent 62%)',
              WebkitMaskImage: 'linear-gradient(to top, #000 30%, transparent 62%)',
            }}
          />

          {/* Duochromie miel (épuisé) */}
          {tousEpuises && (
            <>
              <div className="absolute inset-0 bg-[#5a4327] opacity-[0.2] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#f4ead4] opacity-[0.14] mix-blend-screen" />
            </>
          )}

          {/* Scrim lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/72 to-ink/25" />

          {/* Badge terroir + épuisé */}
          <div className="relative flex items-start justify-between p-4">
            <span
              className={
                'rounded-full px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider ring-1 backdrop-blur ' +
                (tousEpuises
                  ? 'bg-cream/85 text-ink/45 ring-ink/15'
                  : 'bg-cream/95 text-honey-deep ring-honey/25')
              }
            >
              {miel.terroir}
            </span>
            {tousEpuises && (
              <span className="rounded-full bg-ink/80 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest text-cream backdrop-blur">
                Épuisé
              </span>
            )}
          </div>

          {/* Texte posé en bas */}
          <div className="relative mt-auto flex flex-col gap-3 p-5 pt-8">
            <div>
              <h3 className="font-display text-2xl leading-tight text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {miel.nom}
              </h3>
              <p className="mt-1 font-body text-xs font-medium uppercase tracking-[0.18em] text-cream/75">
                Récolte · {miel.saison}
              </p>
            </div>
            <p className="font-body text-sm leading-relaxed text-cream/85">{miel.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {miel.notes.map(n => (
                <span
                  key={n}
                  className={
                    'rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold backdrop-blur-sm ' +
                    (tousEpuises
                      ? 'border-cream/25 bg-cream/10 text-cream/55'
                      : 'border-honey/45 bg-honey/15 text-[#FBE2BC]')
                  }
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fond uni — formats et compteurs */}
        <div className="flex flex-col gap-1 bg-paper p-4">
          {miel.formats.map(f => {
            const key = `${miel.id}__${f.poids}`
            const qte = selection[key] || 0
            const prixAff = prixFormat(f, clientType)
            return (
              <div
                key={f.poids}
                className={
                  'flex items-center justify-between rounded-lg px-3 py-2 transition-colors ' +
                  (f.disponible ? 'hover:bg-cream' : '')
                }
              >
                <div className="flex items-baseline gap-3">
                  <span className={'whitespace-nowrap font-body text-base font-semibold ' + (f.disponible ? 'text-ink' : 'text-ink/35')}>
                    {f.poids}
                  </span>
                  {/* Aucun prix affiché en mode entreprise : la commande passe par un devis. */}
                  {!pro && (
                    <span className={'whitespace-nowrap font-body text-sm font-semibold ' + (f.disponible ? 'text-honey-deep' : 'text-ink/30 line-through')}>
                      {prixAff}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <StatutPastille disponible={f.disponible} />
                  {f.disponible && (
                    qte > 0 ? (
                      <div className="ml-3 flex items-center gap-1">
                        <button
                          onClick={() => setQte(miel, f.poids, qte - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-honey/40 font-body text-base font-bold leading-none text-honey-deep transition-colors hover:bg-honey hover:text-white"
                          aria-label={`Retirer ${miel.nom} ${f.poids}`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={qte}
                          onChange={e => setQte(miel, f.poids, parseInt(e.target.value, 10))}
                          onFocus={e => e.target.select()}
                          className="qte-input h-7 w-11 border-b-2 border-honey/40 bg-transparent text-center font-body text-sm font-bold text-ink outline-none transition-colors hover:border-honey/70 focus:border-honey"
                          aria-label={`Quantité ${miel.nom} ${f.poids}`}
                        />
                        <button
                          onClick={() => setQte(miel, f.poids, qte + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full bg-honey font-body text-base font-bold leading-none text-white transition-all hover:bg-honey-deep"
                          aria-label={`Ajouter ${miel.nom} ${f.poids}`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAdd(miel, f.poids)}
                        className="ml-3 grid h-7 w-7 place-items-center rounded-full bg-honey font-body text-base font-bold leading-none text-white transition-all hover:bg-honey-deep"
                        aria-label={`Ajouter ${miel.nom} ${f.poids}`}
                      >
                        +
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          })}
          {pro && (
            <p className="mt-1 px-3 font-body text-[11px] leading-snug text-ink-soft/70">
              Tarifs professionnels sur devis · à l&apos;unité ou par carton de 12 pots
            </p>
          )}
        </div>
      </article>
    </Reveal>
  )
}

function ClientTypeBanner() {
  const { clientType } = useCart()
  return (
    <div className="mb-10 flex flex-col items-start gap-2.5 md:mb-12">
      <span className="font-body text-sm text-ink-soft">Vous commandez en tant que</span>
      <ClientTypeToggle tone="light" />
      <p className="font-body text-xs text-ink-soft/75">
        {clientType === 'entreprise'
          ? 'Tarifs sur devis : composez votre sélection, je vous recontacte avec une proposition adaptée · par carton de 12'
          : 'Prix TTC · livraison en option (frais de port La Poste à votre charge)'}
      </p>
    </div>
  )
}

export function Catalogue({ miels }: { miels: Miel[] }) {
  return (
    <section id="catalogue" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>La gamme</SectionLabel>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              Nos miels,<br className="hidden md:block" /> au fil des saisons.
            </h2>
          </div>

          <figure className="max-w-sm border-l-2 border-honey/60 pl-5">
            <blockquote className="font-display text-lg italic leading-relaxed text-ink-soft md:text-xl">
              « En apiculture biologique, la récolte suit les saisons : les variétés et
              leur disponibilité varient au fil de l&apos;année. Le statut de chaque format
              est tenu à jour. »
            </blockquote>
            <figcaption className="mt-3 font-body text-sm font-semibold text-honey-deep">
              Sophie, votre apicultrice
            </figcaption>
          </figure>
        </div>

        <ClientTypeBanner />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {miels.map(m => (
            <CarteMiel key={m.id} miel={m} />
          ))}
        </div>
      </div>
    </section>
  )
}
