// Atomes UI partagés — exportés sur window pour les autres scripts Babel.
const { useState, useEffect, useRef } = React;

// Contexte des réglages (Tweaks) — partagé entre tous les scripts Babel.
window.TweakCtx = window.TweakCtx || React.createContext({});

// Petite feuille — icône maison pour la pastille BIO « minimaliste ».
function LeafIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-8.5 16-9 .5 8-3.5 13.5-9 14a6.9 6.9 0 0 1-2-.3"></path>
      <path d="M5 19c3-6 7-8.5 13-9.5"></path>
    </svg>
  );
}

// Titre de section — filigrane manuscrit (Great Vibes), opacité ~50 %. Le titre
// se fond dans le fond de la section (derrière le contenu, sans impacter la mise
// en page — wrapper de hauteur nulle). Sur fond sombre, passer "!text-honey/50".
function SectionLabel({ children, className = "" }) {
  return (
    <span className="relative isolate block h-0 w-full select-none" aria-hidden="true">
      <span
        className={"pointer-events-none absolute left-0 top-0 block -translate-y-[130%] whitespace-nowrap font-hand leading-[0.7] text-honey-deep/50 " + className}
        style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", zIndex: -1 }}
      >
        {children}
      </span>
    </span>
  );
}

// Pastille de certification BIO — minimaliste : une ligne, vert bio marqué,
// petite feuille en guise de logo.
function BioBadge({ className = "" }) {
  return (
    <span className={"inline-flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-3 pr-4 shadow-[0_10px_28px_-14px_rgba(42,28,14,0.55)] ring-1 ring-[#2f7d3f]/35 backdrop-blur-sm " + className}>
      <LeafIcon className="h-4 w-4 text-[#2f7d3f]" />
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f7d3f]">
        Certifié BIO · Ecocert
      </span>
    </span>
  );
}

// Statut de disponibilité d'un format
function StatutPastille({ disponible }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={"h-2 w-2 rounded-full " + (disponible ? "bg-sage" : "bg-ink/25")}></span>
      <span className={"font-body text-[11px] font-semibold uppercase tracking-wider " + (disponible ? "text-sage-deep" : "text-ink/40")}>
        {disponible ? "Dispo" : "Épuisé"}
      </span>
    </span>
  );
}

// Révèle ses enfants au scroll
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition: `opacity .8s ease ${delay}ms, transform .8s cubic-bezier(.16,.84,.44,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

Object.assign(window, { SectionLabel, BioBadge, StatutPastille, Reveal, LeafIcon });
