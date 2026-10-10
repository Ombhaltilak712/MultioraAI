import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...rest
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (!magnetic || shouldReduceMotion || disabled) return;
    const { clientX, clientY } = e;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (clientX - (rect.left + rect.width / 2)) * 0.18;
    const y = (clientY - (rect.top + rect.height / 2)) * 0.18;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    if (!magnetic || shouldReduceMotion) return;
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none overflow-hidden';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs md:text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-sm md:text-base px-6 py-3 gap-2.5 rounded-2xl'
  }[size] || sizeStyles.md;

  const variantStyles = {
    primary:
      'bg-linear-to-r from-indigo-500 via-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_32px_rgba(99,102,241,0.55)] border border-white/20 active:scale-[0.98]',
    secondary:
      'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/20 backdrop-blur-md active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-white active:scale-[0.98]',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 active:scale-[0.98]'
  }[variant] || variantStyles.primary;

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={shouldReduceMotion ? {} : { x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 13 : 16} className="shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 13 : 16} className="shrink-0" />}
    </motion.button>
  );
}
