import GradientText from './ui/GradientText';

export default function Logo({
  size = 'md',
  showWordmark = true,
  glow = false,
  badge = null,
  className = ''
}) {
  const markDimensions = {
    xs: 'w-5 h-5 rounded-md text-[10px]',
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-8 h-8 rounded-xl text-sm',
    lg: 'w-10 h-10 rounded-2xl text-base',
    xl: 'w-12 h-12 rounded-2xl text-lg'
  }[size] || markDimensions.md;

  const textDimensions = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-[15px]',
    lg: 'text-lg',
    xl: 'text-xl'
  }[size] || textDimensions.md;

  const glowStyle = glow
    ? 'shadow-[0_0_20px_rgba(99,102,241,0.45)]'
    : 'shadow-[0_2px_10px_rgba(99,102,241,0.25)]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`relative shrink-0 flex items-center justify-center bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white font-black border border-white/20 overflow-hidden ${markDimensions} ${glowStyle}`}
      >
        {/* Subtle geometric neural highlight lines */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-1/2 h-1/2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
        >
          <path d="M4 19V5l8 7 8-7v14" />
        </svg>
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-['Space_Grotesk'] font-bold text-slate-100 tracking-tight ${textDimensions}`}>
            Multiora
          </span>
          <GradientText
            from="from-indigo-400"
            via="from-violet-400"
            to="to-cyan-300"
            className={`font-['Space_Grotesk'] font-extrabold tracking-tight ${textDimensions}`}
          >
            AI
          </GradientText>

          {badge && (
            <span className="ml-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
