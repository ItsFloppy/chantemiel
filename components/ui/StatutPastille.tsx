export function StatutPastille({ disponible }: { disponible: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={'h-2 w-2 rounded-full ' + (disponible ? 'bg-sage' : 'bg-ink/25')} />
      <span
        className={
          'font-body text-[11px] font-semibold uppercase tracking-wider ' +
          (disponible ? 'text-sage-deep' : 'text-ink/40')
        }
      >
        {disponible ? 'Dispo' : 'Épuisé'}
      </span>
    </span>
  )
}
