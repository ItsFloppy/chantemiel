/**
 * Case à cocher stylée pour les formulaires sur fond sombre (case honey custom +
 * coche SVG), avec libellé et sous-texte optionnel. Style unique partagé par
 * toutes les cases du bon de commande (livraison postale, livraisons régulières…).
 */
export function CheckboxDark({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  hint?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <label className={'flex items-start gap-3 ' + (disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
      <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
          className="peer h-5 w-5 appearance-none rounded-md border-2 border-honey/50 bg-transparent transition-colors checked:border-honey checked:bg-honey enabled:cursor-pointer enabled:hover:border-honey/80 disabled:cursor-not-allowed"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="font-body text-sm text-cream/85">
        <span className="font-semibold text-cream">{label}</span>
        {hint && <span className="mt-1 block text-xs leading-relaxed text-cream/55">{hint}</span>}
      </span>
    </label>
  )
}
