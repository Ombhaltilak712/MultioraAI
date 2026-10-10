export default function GradientText({
  children,
  className = '',
  from = 'from-indigo-400',
  via = 'via-violet-400',
  to = 'to-cyan-300',
  animate = false,
  as: Component = 'span'
}) {
  const animateClass = animate ? 'bg-[length:200%_auto] animate-[gradient-shift_6s_ease_infinite]' : '';

  return (
    <Component
      className={`bg-clip-text text-transparent bg-linear-to-r ${from} ${via} ${to} ${animateClass} ${className}`}
    >
      {children}
    </Component>
  );
}
