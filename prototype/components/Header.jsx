// En-tête — transparent sur le hero, devient crème au scroll.
const { useState: useStateH, useEffect: useEffectH } = React;

const NAV = [
  { label: "Les miels", href: "#catalogue" },
  { label: "Commander", href: "#commander" },
  { label: "La miellerie", href: "#miellerie" },
  { label: "Points de vente", href: "#points-de-vente" },
];

function Header() {
  const [scrolled, setScrolled] = useStateH(false);
  const [open, setOpen] = useStateH(false);

  useEffectH(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
        (scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(42,28,14,0.08)]"
          : "bg-gradient-to-b from-black/45 to-transparent")
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        {/* Logotype */}
        <a href="#top" className="flex items-baseline gap-2 leading-none">
          <span className={"font-hand text-3xl md:text-4xl transition-colors " + (scrolled ? "text-honey-deep" : "text-cream")}>
            Chantemiel
          </span>
          <span className={"hidden font-body text-[10px] font-semibold uppercase tracking-[0.22em] lg:inline " + (scrolled ? "text-ink/50" : "text-cream/70")}>
            Apiculture BIO
          </span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={
                "group relative font-body text-sm font-semibold tracking-wide transition-colors " +
                (scrolled ? "text-ink/80 hover:text-honey-deep" : "text-cream/90 hover:text-cream")
              }
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-honey transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="#commander"
            className="rounded-full bg-honey px-5 py-2 font-body text-sm font-bold text-white shadow-soft transition-all hover:bg-honey-deep hover:shadow-jar"
          >
            Bon de commande
          </a>
        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className={"flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden " + (scrolled ? "text-ink" : "text-cream")}
        >
          <span className={"h-0.5 w-6 bg-current transition-all " + (open ? "translate-y-2 rotate-45" : "")}></span>
          <span className={"h-0.5 w-6 bg-current transition-all " + (open ? "opacity-0" : "")}></span>
          <span className={"h-0.5 w-6 bg-current transition-all " + (open ? "-translate-y-2 -rotate-45" : "")}></span>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      <div
        className={
          "overflow-hidden bg-cream/98 backdrop-blur-md transition-all duration-400 md:hidden " +
          (open ? "max-h-96 border-t border-ink/10" : "max-h-0")
        }
      >
        <nav className="flex flex-col px-5 py-2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-ink/5 py-3 font-body text-base font-semibold text-ink/80"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#commander"
            onClick={() => setOpen(false)}
            className="mt-3 mb-2 rounded-full bg-honey px-5 py-3 text-center font-body text-base font-bold text-white"
          >
            Bon de commande
          </a>
        </nav>
      </div>
    </header>
  );
}

Object.assign(window, { Header });
