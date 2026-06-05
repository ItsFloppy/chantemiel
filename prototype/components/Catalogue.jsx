// Catalogue — grille des miels. Statut disponible/épuisé visible par format.
function CarteMiel({ miel, onAdd, onRemove, selection }) {
  const tousEpuises = miel.formats.every((f) => !f.disponible);

  // Épuisé : duochromie chaude — quasi N&B mais on laisse passer un tout petit
  // peu de couleur d'origine (~15 %) pour garder de la vie dans la photo.
  const imgFilter = tousEpuises ? "grayscale-[0.85]" : "";

  return (
    <Reveal className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-jar">
        {/* Visuel — l'image descend jusqu'aux notes, le texte se pose dessus */}
        <div className="relative flex min-h-[21rem] flex-1 flex-col overflow-hidden">
          <img
            src={miel.image}
            alt={"Pot de " + miel.nom}
            className={
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 " +
              imgFilter
            }
          />
          {/* Duochromie miel (épuisé) — N&B mat, légèrement teinté crème + brun/orange */}
          {tousEpuises && (
            <>
              <div className="absolute inset-0 bg-[#5a4327] opacity-[0.2] mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-[#f4ead4] opacity-[0.14] mix-blend-screen"></div>
            </>
          )}
          {/* Voile sombre pour la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/72 to-ink/25"></div>
          {/* Flou progressif (renforce la lisibilité du texte en bas) */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              maskImage: "linear-gradient(to top, #000 42%, transparent)",
              WebkitMaskImage: "linear-gradient(to top, #000 42%, transparent)",
            }}
          ></div>

          {/* Badges en haut */}
          <div className="relative flex items-start justify-between p-4">
            <span className={
              "rounded-full px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider ring-1 backdrop-blur " +
              (tousEpuises
                ? "bg-cream/85 text-ink/45 ring-ink/15"
                : "bg-cream/95 text-honey-deep ring-honey/25")
            }>
              {miel.terroir}
            </span>
            {tousEpuises && (
              <span className="rounded-full bg-ink/80 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-widest text-cream backdrop-blur">
                Épuisé
              </span>
            )}
          </div>

          {/* Texte posé en bas de l'image */}
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
              {miel.notes.map((n) => (
                <span key={n} className={
                  "rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold backdrop-blur-sm " +
                  (tousEpuises
                    ? "border-cream/25 bg-cream/10 text-cream/55"
                    : "border-honey/45 bg-honey/15 text-[#FBE2BC]")
                }>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fond uni — uniquement les formats et les choix de quantité */}
        <div className="flex flex-col gap-1 bg-paper p-4">
          {miel.formats.map((f) => {
            const key = miel.id + "__" + f.poids;
            const qte = selection[key] || 0;
            return (
              <div
                key={f.poids}
                className={
                  "flex items-center justify-between rounded-lg px-3 py-2 transition-colors " +
                  (f.disponible ? "hover:bg-cream" : "")
                }
              >
                <div className="flex items-baseline gap-3">
                  <span className={"whitespace-nowrap font-body text-base font-semibold " + (f.disponible ? "text-ink" : "text-ink/35")}>
                    {f.poids}
                  </span>
                  <span className={"whitespace-nowrap font-body text-sm font-semibold " + (f.disponible ? "text-honey-deep" : "text-ink/30 line-through")}>
                    {f.prix}
                  </span>
                </div>

                <div className="flex items-center">
                  <StatutPastille disponible={f.disponible} />
                  {f.disponible && (
                    <div className="ml-3 flex items-center">
                      <button
                        onClick={() => onRemove(miel, f.poids)}
                        className={"grid h-7 w-7 place-items-center rounded-full border border-honey/40 font-body text-base font-bold leading-none text-honey-deep transition-colors hover:bg-honey hover:text-white stepper-collapse" + (qte > 0 ? " open" : "")}
                        aria-label={"Retirer " + miel.nom + " " + f.poids}
                        tabIndex={qte > 0 ? 0 : -1}
                      >
                        −
                      </button>
                      <span className={"font-body text-sm font-bold text-ink stepper-num" + (qte > 0 ? " open" : "")}>{qte}</span>
                      <button
                        onClick={() => onAdd(miel, f.poids)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-honey font-body text-base font-bold leading-none text-white transition-all hover:bg-honey-deep"
                        aria-label={"Ajouter " + miel.nom + " " + f.poids}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </Reveal>
  );
}

function Catalogue({ onAdd, onRemove, selection }) {
  return (
    <section id="catalogue" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>La gamme</SectionLabel>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              Six miels, six terroirs,<br className="hidden md:block" /> une seule main.
            </h2>
          </div>
          {/* Petit mot de l'apicultrice */}
          <figure className="max-w-sm border-l-2 border-honey/60 pl-5">
            <blockquote className="font-display text-lg italic leading-relaxed text-ink-soft md:text-xl">
              « En apiculture biologique, la récolte suit les saisons : les variétés et
              leur disponibilité varient au fil de l'année. Le statut de chaque format
              est tenu à jour. »
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2 font-body text-sm font-semibold text-honey-deep">
              <span className="h-px w-6 bg-honey-deep/50"></span> Sophie, votre apicultrice
            </figcaption>
          </figure>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {window.MIELS.map((m) => (
            <CarteMiel key={m.id} miel={m} onAdd={onAdd} onRemove={onRemove} selection={selection} />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Catalogue, CarteMiel });
