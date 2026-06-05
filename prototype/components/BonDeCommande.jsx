// Bon de commande — formulaire interactif. Envoi via Formspree (placeholder ID).
// OrderForm = contenu réutilisable (section ET panier flottant), état partagé via props.
const { useState: useStateB } = React;

// ⚠️ Remplacer par votre identifiant Formspree (https://formspree.io)
const FORMSPREE_ID = "VOTRE_FORM_ID";

function prixToNumber(prix) {
  return parseFloat(prix.replace("€", "").replace(",", ".").trim()) || 0;
}

function trouveFormat(key) {
  const [mielId, poids] = key.split("__");
  const miel = window.MIELS.find((m) => m.id === mielId);
  const format = miel ? miel.formats.find((f) => f.poids === poids) : null;
  return { miel, format };
}

function panierTotaux(selection) {
  const lignes = Object.entries(selection).filter(([, q]) => q > 0);
  const totalArticles = lignes.reduce((s, [, q]) => s + q, 0);
  const totalPrix = lignes.reduce((s, [key, q]) => {
    const { format } = trouveFormat(key);
    return s + (format ? prixToNumber(format.prix) * q : 0);
  }, 0);
  return { lignes, totalArticles, totalPrix };
}

// Confettis « merci » — petites pièces dans la palette du site qui jaillissent du check.
const MERCI_PALETTE = ["#E78300", "#C96A00", "#7A7F52", "#E7B36A", "#FAF3E6"];
const MERCI_CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const ang = (i / 18) * Math.PI * 2 + (i % 2 ? 0.2 : -0.14);
  const dist = 66 + (i % 5) * 18;
  return {
    dx: Math.round(Math.cos(ang) * dist),
    dy: Math.round(Math.sin(ang) * dist),
    rot: (i % 2 ? 1 : -1) * (180 + (i % 4) * 90),
    color: MERCI_PALETTE[i % MERCI_PALETTE.length],
    delay: (i % 6) * 24,
    size: 6 + (i % 3) * 2,
    round: i % 3 === 0,
  };
});

// Contenu partagé : panier + coordonnées + envoi + confirmation.
function OrderForm({ selection, setSelection, client, setClient, envoye, setEnvoye, erreur, onSubmit, stack = false }) {
  const { lignes, totalArticles, totalPrix } = panierTotaux(selection);

  function setQte(key, q) {
    setSelection((prev) => {
      const next = { ...prev };
      if (q <= 0) delete next[key];
      else next[key] = q;
      return next;
    });
  }

  const champ = "w-full rounded-xl border border-cream/15 bg-cream/[0.06] px-4 py-3 font-body text-sm text-cream placeholder-cream/40 outline-none transition-colors focus:border-honey focus:bg-cream/10 focus:ring-2 focus:ring-honey/20";

  if (envoye) {
    return (
      <div className="merci-card relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-honey/30 bg-cream/5 p-8 text-center md:p-12 merci-mode-confetti">
        <div className="relative mx-auto h-14 w-14">
          <div className="merci-check relative z-10 grid h-14 w-14 place-items-center rounded-full bg-honey text-2xl font-bold text-white">✓</div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0">
            {MERCI_CONFETTI.map((p, i) => (
              <span
                key={i}
                className="merci-confetti"
                style={{
                  "--dx": p.dx + "px",
                  "--dy": p.dy + "px",
                  "--rot": p.rot + "deg",
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: p.round ? "9999px" : "1px",
                  animationDelay: p.delay + "ms",
                }}
              ></span>
            ))}
          </div>
        </div>
        <h3 className="merci-item mt-6 font-display text-3xl text-cream" style={{ animationDelay: ".06s" }}>Merci, {(client.nom || "").split(" ")[0] || ""} !</h3>
        <p className="merci-item mt-3 font-body text-cream/70" style={{ animationDelay: ".14s" }}>
          Votre bon de commande a bien été transmis. Je reviens vers vous très vite
          à l'adresse <span className="text-honey">{client.email || "votre e-mail"}</span>.
        </p>
        <button
          onClick={() => { setEnvoye(false); setSelection({}); setClient({ nom: "", email: "", tel: "", adresse: "", message: "" }); }}
          className="merci-item mt-7 rounded-full border border-cream/30 px-6 py-2.5 font-body text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
          style={{ animationDelay: ".22s" }}
        >
          Passer une nouvelle commande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={"grid gap-8 " + (stack ? "" : "lg:grid-cols-[1fr_1.1fr] lg:gap-12")}>
      {/* Récapitulatif */}
      <div className={stack ? "order-1" : "order-2 lg:order-1"}>
        <h3 className="font-display text-xl text-cream">Votre panier</h3>
        <div className="mt-4 rounded-2xl bg-cream/5 p-5">
          {lignes.length === 0 ? (
            <p className="py-6 text-center font-body text-sm text-cream/50">
              Votre panier est vide.<br />
              <a href="#catalogue" className="mt-2 inline-block font-semibold text-honey hover:underline">
                Parcourir les miels →
              </a>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-cream/10">
              {lignes.map(([key, q]) => {
                const { miel, format } = trouveFormat(key);
                return (
                  <li key={key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img src={miel.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-cream">{miel.nom}</p>
                      <p className="font-body text-xs text-cream/55">{format.poids} · {format.prix}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => setQte(key, q - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 font-bold leading-none text-cream hover:bg-cream/10">−</button>
                      <span className="w-5 text-center font-body text-sm font-bold text-cream">{q}</span>
                      <button type="button" onClick={() => setQte(key, q + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 font-bold leading-none text-cream hover:bg-cream/10">+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lignes.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-4">
              <span className="font-body text-sm text-cream/60">{totalArticles} pot{totalArticles > 1 ? "s" : ""}</span>
              <span className="font-body font-semibold text-2xl text-honey">
                {totalPrix.toLocaleString("fr-FR", { minimumFractionDigits: 2 }).replace(".", ",")} €
              </span>
            </div>
          )}
        </div>
        <p className="mt-3 font-body text-xs leading-relaxed text-cream/40">
          Montant indicatif, hors frais d'envoi éventuels. Le règlement se fait après confirmation.
        </p>
      </div>

      {/* Coordonnées */}
      <div className={"flex flex-col gap-4 " + (stack ? "order-2" : "order-1 lg:order-2")}>
        <h3 className="font-display text-xl text-cream">Vos coordonnées</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className={champ} placeholder="Nom et prénom *" value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} />
          <input className={champ} type="email" placeholder="E-mail *" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
        </div>
        <input className={champ} placeholder="Téléphone" value={client.tel} onChange={(e) => setClient({ ...client, tel: e.target.value })} />
        <input className={champ} placeholder="Adresse de livraison" value={client.adresse} onChange={(e) => setClient({ ...client, adresse: e.target.value })} />
        <textarea className={champ + " min-h-[96px] resize-y"} placeholder="Un mot pour Sophie (facultatif)" value={client.message} onChange={(e) => setClient({ ...client, message: e.target.value })}></textarea>

        {erreur && <p className="font-body text-sm font-semibold text-honey">{erreur}</p>}

        <button type="submit" className="mt-1 rounded-full bg-honey px-7 py-3.5 font-body text-base font-bold text-white shadow-jar transition-colors hover:bg-honey-deep">
          Envoyer mon bon de commande
        </button>
        <p className="font-body text-xs text-cream/40">
          Vos informations ne servent qu'à traiter votre commande. Aucun paiement n'est demandé sur ce site.
        </p>
      </div>
    </form>
  );
}

// Section « Bon de commande » de la page.
function BonDeCommande(props) {
  return (
    <section id="commander" className="scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 max-w-2xl">
          <SectionLabel className="!text-honey/50">Bon de commande</SectionLabel>
          <h2 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
            Composez votre commande
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-cream/70">
            Pas de paiement en ligne : vous composez votre panier, je reçois votre demande par
            e-mail et je vous recontacte pour le règlement et l'envoi. Simple et direct.
          </p>
        </div>
        <OrderForm {...props} />
      </div>
    </section>
  );
}

Object.assign(window, { BonDeCommande, OrderForm, panierTotaux });
