function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-8.5 16-9 .5 8-3.5 13.5-9 14a6.9 6.9 0 0 1-2-.3" />
      <path d="M5 19c3-6 7-8.5 13-9.5" />
    </svg>
  )
}

export function BioBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={
        'inline-flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-3 pr-4 shadow-[0_10px_28px_-14px_rgba(42,28,14,0.55)] ring-1 ring-[#2f7d3f]/35 backdrop-blur-sm ' +
        className
      }
    >
      <LeafIcon className="h-4 w-4 text-[#2f7d3f]" />
      <span className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f7d3f]">
        Certifié BIO · Ecocert
      </span>
    </span>
  )
}
