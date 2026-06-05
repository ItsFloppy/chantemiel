export function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="relative isolate block h-0 w-full select-none" aria-hidden="true">
      <span
        className={
          'pointer-events-none absolute left-0 top-0 block -translate-y-[130%] whitespace-nowrap font-hand leading-[0.7] text-honey-deep/50 ' +
          className
        }
        style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', zIndex: -1 }}
      >
        {children}
      </span>
    </span>
  )
}
