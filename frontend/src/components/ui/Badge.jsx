export default function Badge({
  children,
  variant = 'indigo',
  size = 'sm',
  dot = false,
  ping = false,
  icon: Icon,
  className = ''
}) {
  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    red: 'bg-red-500/10 text-red-300 border-red-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    neutral: 'bg-white/[0.05] text-slate-300 border-white/[0.08]',
    gradient: 'bg-linear-to-r from-indigo-500/15 via-violet-500/15 to-cyan-500/15 text-indigo-200 border-indigo-500/30'
  }[variant] || variantStyles.indigo;

  const dotColors = {
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    cyan: 'bg-cyan-400',
    neutral: 'bg-slate-400',
    gradient: 'bg-indigo-400'
  }[variant] || 'bg-indigo-400';

  const sizeStyles = {
    sm: 'text-[10.5px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2'
  }[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {ping && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors}`} />
        </span>
      )}
      {Icon && <Icon size={size === 'sm' ? 11 : 13} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
