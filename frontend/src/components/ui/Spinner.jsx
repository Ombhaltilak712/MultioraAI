export default function Spinner({
  size = 'md',
  variant = 'indigo',
  className = ''
}) {
  const sizeStyles = {
    xs: 'w-3.5 h-3.5 border-[2px]',
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-[3.5px]'
  }[size] || 'w-6 h-6 border-[2.5px]';

  const variantStyles = {
    indigo: 'border-indigo-500/20 border-t-indigo-500',
    cyan: 'border-cyan-500/20 border-t-cyan-400',
    violet: 'border-violet-500/20 border-t-violet-500',
    white: 'border-white/20 border-t-white'
  }[variant] || 'border-indigo-500/20 border-t-indigo-500';

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin shrink-0 ${sizeStyles} ${variantStyles} ${className}`}
    />
  );
}
