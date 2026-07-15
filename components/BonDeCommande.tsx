'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/cart'
import { GOOGLE_AVIS_URL } from '@/lib/data'
import { SectionLabel } from './ui/SectionLabel'
import { ClientTypeToggle } from './ui/ClientTypeToggle'
import { DropdownDark } from './ui/DropdownDark'
import { CheckboxDark } from './ui/CheckboxDark'
import {
  cartonLabel,
  formatEuro,
  fraisLivraison,
  panierTotaux,
  prixFormat,
  trouveItem,
} from '@/lib/order'
import type { Miel } from '@/lib/types'

const MERCI_PALETTE = ['#E78300', '#C96A00', '#7A7F52', '#E7B36A', '#FAF3E6']
const MERCI_CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const ang = (i / 18) * Math.PI * 2 + (i % 2 ? 0.2 : -0.14)
  const dist = 66 + (i % 5) * 18
  return {
    dx: Math.round(Math.cos(ang) * dist),
    dy: Math.round(Math.sin(ang) * dist),
    rot: (i % 2 ? 1 : -1) * (180 + (i % 4) * 90),
    color: MERCI_PALETTE[i % MERCI_PALETTE.length],
    delay: (i % 6) * 24,
    size: 6 + (i % 3) * 2,
    round: i % 3 === 0,
  }
})

const CHAMP = 'w-full rounded-xl border border-cream/15 bg-cream/[0.06] px-4 py-3 font-body text-sm text-cream placeholder-cream/40 outline-none transition-colors focus:border-honey focus:bg-cream/10 focus:ring-2 focus:ring-honey/20'

/** Message discret (erreur / avertissement) : accent honey à gauche, icône, texte adouci. */
function Alerte({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-lg border-l-2 border-honey bg-honey/[0.07] py-2 pl-3 pr-3 font-body text-[13px] leading-snug text-cream/85">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] h-4 w-4 flex-shrink-0 text-honey">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
      <span>{children}</span>
    </p>
  )
}

export function OrderForm({ miels, stack = false }: { miels: Miel[]; stack?: boolean }) {
  const {
    selection,
    setSelection,
    client,
    setClient,
    clientType,
    livraison,
    setLivraison,
    envoye,
    setEnvoye,
    envoiEnCours,
    resetClient,
    erreur,
    submitOrder,
  } = useCart()
  const pro = clientType === 'entreprise'
  const { lignes, totalArticles, totalPrix, poidsGrammes } = panierTotaux(selection, miels, clientType)

  const poidsKg = poidsGrammes / 1000
  const cartonTexte = cartonLabel(totalArticles)

  // Livraison impossible dès que le panier dépasse le poids max (indépendant de la case cochée).
  const livraisonImpossible = !pro && fraisLivraison(poidsGrammes) === null
  // Mode entreprise = demande de devis : aucun montant n'est calculé ni affiché.
  const port = !pro && livraison ? fraisLivraison(poidsGrammes) : 0
  const totalFinal = totalPrix + (port && port > 0 ? port : 0)

  // Si le panier passe au-dessus de 5 kg alors que la livraison est cochée, on la décoche.
  useEffect(() => {
    if (livraisonImpossible && livraison) setLivraison(false)
  }, [livraisonImpossible, livraison, setLivraison])

  function setQte(key: string, q: number) {
    setSelection(prev => {
      const next = { ...prev }
      const n = Number.isFinite(q) ? Math.max(0, Math.floor(q)) : 0
      if (n <= 0) delete next[key]
      else next[key] = n
      return next
    })
  }

  if (envoye) {
    return (
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-honey/30 bg-cream/5 p-8 text-center md:p-12">
        <div className="relative mx-auto h-14 w-14">
          <div className="merci-check relative z-10 grid h-14 w-14 place-items-center rounded-full bg-honey text-2xl font-bold text-white">
            ✓
          </div>
          <div className="merci-shine" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0">
            {MERCI_CONFETTI.map((p, i) => (
              <span
                key={i}
                className="merci-confetti"
                style={{
                  '--dx': `${p.dx}px`,
                  '--dy': `${p.dy}px`,
                  '--rot': `${p.rot}deg`,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: p.round ? '9999px' : '1px',
                  animationDelay: `${p.delay}ms`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        <h3 className="merci-item mt-6 font-display text-3xl text-cream" style={{ animationDelay: '.06s' }}>
          Merci, {(client.nom || '').split(' ')[0] || ''}&nbsp;!
        </h3>
        <p className="merci-item mt-3 font-body text-cream/70" style={{ animationDelay: '.14s' }}>
          {pro ? 'Votre demande de devis a bien été transmise' : 'Votre bon de commande a bien été transmis'}. Je reviens vers vous très vite
          à l&apos;adresse <span className="text-honey">{client.email || 'votre e-mail'}</span>.
        </p>
        {GOOGLE_AVIS_URL && (
          <a
            href={GOOGLE_AVIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="merci-item mt-6 inline-flex items-center gap-2 rounded-full border border-honey/50 bg-honey/10 px-5 py-2.5 font-body text-sm font-semibold text-cream transition-colors hover:bg-honey/20"
            style={{ animationDelay: '.18s' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-honey">
              <path d="M12 2l2.9 6.26 6.7.94-4.8 4.34 1.28 6.86L12 17.1l-6.08 3.3L7.2 13.54 2.4 9.2l6.7-.94L12 2z" />
            </svg>
            Déjà client·e&nbsp;? Laissez-moi un avis Google
          </a>
        )}
        <button
          onClick={() => { setEnvoye(false); setSelection({}); resetClient() }}
          className="merci-item mt-7 rounded-full border border-cream/30 px-6 py-2.5 font-body text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
          style={{ animationDelay: '.22s' }}
        >
          Passer une nouvelle commande
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={e => submitOrder(e, miels)} className="flex flex-col gap-8">
      {/* Type de client — affiché dans le panneau flottant du panier uniquement ;
          sur la page, c'est le switch collant (StickyToggle) qui fait le travail. */}
      {(stack || pro) && (
        <div className="flex flex-col items-start gap-2.5">
          {stack && (
            <>
              <span className="font-body text-sm text-cream/60">Je commande en tant que</span>
              <ClientTypeToggle tone="dark" />
            </>
          )}
          {pro && (
            <p className="max-w-xl font-body text-xs leading-relaxed text-cream/55">
              En tant qu&apos;entreprise, vous ne réglez pas en ligne : composez votre sélection
              et demandez un devis. Je reviens vers vous avec une proposition tarifaire adaptée.
            </p>
          )}
        </div>
      )}

      <div className={'grid gap-8 ' + (stack ? '' : 'lg:grid-cols-[1fr_1.1fr] lg:gap-12')}>
      {/* Récapitulatif panier */}
      <div className={stack ? 'order-1' : 'order-2 lg:order-1'}>
        <h3 className="font-display text-xl text-cream">{pro ? 'Votre sélection' : 'Votre panier'}</h3>
        <div className="mt-4 rounded-2xl bg-cream/5 p-5">
          {lignes.length === 0 ? (
            <p className="py-6 text-center font-body text-sm text-cream/50">
              Votre panier est vide.<br />
              <a href="#catalogue" className="mt-2 inline-block font-semibold text-honey hover:underline">
                Parcourir les miels
              </a>
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-cream/10">
              {lignes.map(([key, q]) => {
                const { miel, format } = trouveItem(key, miels)
                if (!miel || !format) return null
                return (
                  <li key={key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Image src={miel.image} alt="" width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-cream">{miel.nom}</p>
                      <p className="font-body text-xs text-cream/55">
                        {pro ? format.poids : `${format.poids} · ${prixFormat(format, clientType)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setQte(key, q - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 font-bold leading-none text-cream hover:bg-cream/10">−</button>
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={q}
                        onChange={e => setQte(key, parseInt(e.target.value, 10))}
                        onFocus={e => e.target.select()}
                        className="qte-input h-7 w-11 border-b-2 border-honey/40 bg-transparent text-center font-body text-sm font-bold text-cream outline-none transition-colors hover:border-honey/70 focus:border-honey"
                        aria-label="Quantité"
                      />
                      <button type="button" onClick={() => setQte(key, q + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 font-bold leading-none text-cream hover:bg-cream/10">+</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {lignes.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-cream/10 pt-4">
              <div className="flex items-center justify-between font-body text-sm text-cream/60">
                <span>{totalArticles} pot{totalArticles > 1 ? 's' : ''} · ≈ {poidsKg.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg</span>
                {pro && <span className="text-cream/50">{cartonTexte}</span>}
              </div>

              {!pro && livraison && (
                <div className="flex items-center justify-between font-body text-sm text-cream/70">
                  <span>Frais de port</span>
                  <span>{formatEuro(port || 0)}</span>
                </div>
              )}

              {!pro && (
                <div className="flex items-center justify-between border-t border-cream/10 pt-3">
                  <span className="font-body text-sm font-semibold text-cream">
                    {livraison ? 'Total à régler' : 'Total'}
                  </span>
                  <span className="font-body text-2xl font-semibold text-honey">
                    {formatEuro(totalFinal)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 font-body text-xs leading-relaxed text-cream/40">
          {pro
            ? 'Aucun montant n’est calculé ici : je vous réponds avec une proposition tarifaire personnalisée (commande par carton de 12), puis nous convenons du transport.'
            : 'Montant indicatif. Le règlement se fait après confirmation de la commande.'}
        </p>
      </div>

      {/* Coordonnées */}
      <div className={'flex flex-col gap-4 ' + (stack ? 'order-2' : 'order-1 lg:order-2')}>
        <h3 className="font-display text-xl text-cream">Vos coordonnées</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className={CHAMP} placeholder={pro ? 'Contact / raison sociale *' : 'Nom et prénom *'} value={client.nom} onChange={e => setClient({ ...client, nom: e.target.value })} />
          <input className={CHAMP} type="email" placeholder="E-mail *" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
        </div>
        <input className={CHAMP} type="tel" inputMode="tel" placeholder="Téléphone" value={client.tel} onChange={e => setClient({ ...client, tel: e.target.value.replace(/[^\d+()\s.-]/g, '').slice(0, 20) })} />
        {pro && (
          <input
            className={CHAMP}
            inputMode="numeric"
            maxLength={14}
            placeholder="SIRET de l’entreprise (14 chiffres) *"
            value={client.siret}
            onChange={e => setClient({ ...client, siret: e.target.value.replace(/\D/g, '').slice(0, 14) })}
          />
        )}
        {pro && (
          <>
            <DropdownDark
              value={client.typeEtablissement}
              onChange={v => setClient({ ...client, typeEtablissement: v })}
              placeholder="Type d'établissement…"
              triggerClassName={CHAMP}
              options={['Magasin bio', 'Épicerie fine', 'Restaurant', 'Hôtel', 'Chocolaterie / pâtisserie', 'Grossiste / distributeur', 'Autre']}
            />
            <input
              className={CHAMP}
              placeholder="Volume / fréquence estimés (ex. 2 cartons par mois)"
              value={client.volumeEstime}
              onChange={e => setClient({ ...client, volumeEstime: e.target.value })}
            />
          </>
        )}

        {/* Adresse structurée */}
        <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
          <input className={CHAMP} maxLength={8} placeholder="N° de voie" value={client.adresseNumero} onChange={e => setClient({ ...client, adresseNumero: e.target.value.slice(0, 8) })} />
          <input className={CHAMP} placeholder="Nom de la rue" value={client.adresseRue} onChange={e => setClient({ ...client, adresseRue: e.target.value })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
          <input className={CHAMP} inputMode="numeric" maxLength={5} placeholder="Code postal" value={client.codePostal} onChange={e => setClient({ ...client, codePostal: e.target.value.replace(/\D/g, '').slice(0, 5) })} />
          <input className={CHAMP} placeholder="Ville" value={client.ville} onChange={e => setClient({ ...client, ville: e.target.value })} />
        </div>

        {/* Livraison — particulier uniquement */}
        {!pro && (
          <CheckboxDark
            checked={livraison}
            disabled={livraisonImpossible}
            onChange={setLivraison}
            label="Je souhaite être livré·e par voie postale"
            hint="Frais de port à votre charge (tarifs La Poste) : jusqu’à 3 kg : 18,00 € · de 3 à 5 kg : 24,50 €. Pas d’envoi postal au-delà de 5 kg."
          />
        )}
        {livraisonImpossible && (
          <Alerte>Votre panier dépasse 5 kg : la livraison postale n’est pas disponible. Contactez-moi pour organiser le transport.</Alerte>
        )}

        <CheckboxDark
          checked={client.livraisonReguliere}
          onChange={v => setClient({ ...client, livraisonReguliere: v })}
          label="Je souhaite des livraisons régulières"
          hint="Cochez pour un réapprovisionnement récurrent. Par défaut, votre commande est ponctuelle."
        />

        <textarea className={CHAMP + ' min-h-[96px] resize-y'} placeholder="Un mot pour Sophie (facultatif)" value={client.message} onChange={e => setClient({ ...client, message: e.target.value })} />
        {erreur && <Alerte>{erreur}</Alerte>}
        <button
          type="submit"
          disabled={envoiEnCours}
          className="mt-1 rounded-full bg-honey px-7 py-3.5 font-body text-base font-bold text-white shadow-jar transition-colors hover:bg-honey-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-honey"
        >
          {envoiEnCours ? 'Envoi en cours…' : pro ? 'Demander un devis' : 'Envoyer mon bon de commande'}
        </button>
        <p className="font-body text-xs text-cream/40">
          Vos informations ne servent qu&apos;à traiter votre commande. Aucun paiement n&apos;est demandé sur ce site.
        </p>
      </div>
      </div>
    </form>
  )
}

export function BonDeCommande({ miels }: { miels: Miel[] }) {
  return (
    <section id="commander" className="scroll-mt-20 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-28">
        <div className="mb-12 max-w-2xl">
          <SectionLabel className="!text-honey">Bon de commande</SectionLabel>
          <h2 className="mt-4 font-display text-4xl leading-tight text-cream md:text-5xl">
            Commandez en direct
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-cream/70">
            Pas de paiement en ligne : vous composez votre panier, je reçois votre demande par
            e-mail et je vous recontacte pour le règlement et l&apos;envoi. Je privilégie la vente
            locale et le circuit court&nbsp;: simple, direct, au plus près de chez vous.
          </p>
        </div>
        <OrderForm miels={miels} />
        {/* Ancre de fin : le switch collant se détache une fois le formulaire passé. */}
        <div id="commander-end" aria-hidden className="h-0" />
      </div>
    </section>
  )
}
