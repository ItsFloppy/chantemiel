// App — assemble le site et porte l'état du panier + de la commande (partagé
// entre la section Bon de commande et le panier flottant).
const { useState: useStateApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showValeurs": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [selection, setSelection] = useStateApp({});
  const [client, setClient] = useStateApp({ nom: "", email: "", tel: "", adresse: "", message: "" });
  const [envoye, setEnvoye] = useStateApp(false);
  const [erreur, setErreur] = useStateApp("");
  const [cartOpen, setCartOpen] = useStateApp(false);

  function onAdd(miel, poids) {
    const key = miel.id + "__" + poids;
    setSelection((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }

  function onRemove(miel, poids) {
    const key = miel.id + "__" + poids;
    setSelection((prev) => {
      const next = { ...prev };
      const q = (next[key] || 0) - 1;
      if (q <= 0) delete next[key];
      else next[key] = q;
      return next;
    });
  }

  function submitOrder(e) {
    e.preventDefault();
    setErreur("");
    const lignes = Object.entries(selection).filter(([, q]) => q > 0);
    if (lignes.length === 0) { setErreur("Sélectionnez au moins un miel dans le catalogue."); return; }
    if (!client.nom.trim() || !client.email.trim()) { setErreur("Merci d'indiquer au minimum votre nom et votre e-mail."); return; }
    // En production : POST vers https://formspree.io/f/FORMSPREE_ID
    setEnvoye(true);
  }

  const orderProps = { selection, setSelection, client, setClient, envoye, setEnvoye, erreur, onSubmit: submitOrder };

  return (
    <window.TweakCtx.Provider value={t}>
      <Header />
      <main>
        <Hero />
        {t.showValeurs && <Valeurs />}
        <Catalogue onAdd={onAdd} onRemove={onRemove} selection={selection} />
        <BonDeCommande {...orderProps} />
        <APropos />
        <PointsDeVente />
      </main>
      <Footer />
      <CartFab {...orderProps} cartOpen={cartOpen} setCartOpen={setCartOpen} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Page" />
        <TweakToggle
          label="Bandeau repères (01–04)"
          value={t.showValeurs}
          onChange={(v) => setTweak("showValeurs", v)}
        />

        <TweakSection label="Message de confirmation" />
        <TweakButton
          label={envoye ? "Réinitialiser le formulaire" : "Aperçu du message merci"}
          secondary={envoye}
          onClick={() => setEnvoye(!envoye)}
        />
      </TweaksPanel>
    </window.TweakCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
