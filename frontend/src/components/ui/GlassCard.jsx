import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function GlassCard({
  children,
  className = '',
  tilt = false,
  gradientBorder = false,
  glow = 'none', // 'indigo' | 'violet' | 'cyan' | 'none'
  onClick,
  ...rest
}) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (!tilt || shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotate({ x: rotateX, y: rotateY });
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    if (!tilt || shouldReduceMotion) return;
    setRotate({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowStyles = {
    indigo: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.22)] hover:border-indigo-500/40',
    violet: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.22)] hover:border-violet-500/40',
    cyan: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.22)] hover:border-cyan-500/40',
    none: 'hover:border-white/[0.14]'
  }[glow] || glowStyles.none;

  const gradientBorderClass = gradientBorder
    ? 'p-[1px] bg-linear-to-b from-indigo-500/40 via-violet-500/20 to-white/[0.04] rounded-2xl'
    : '';

  const innerCard = (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={shouldReduceMotion ? {} : { rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative rounded-2xl bg-[#0b0d14]/70 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 overflow-hidden ${glowStyles} ${
        gradientBorder ? 'h-full w-full' : ''
      } ${className}`}
      {...rest}
    >
      {/* Subtle cursor spotlight effect */}
      {tilt && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(450px circle at ${spotlight.x}px ${spotlight.y}px, rgba(99, 102, 241, 0.12), transparent 70%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  if (gradientBorder) {
    return <div className={gradientBorderClass}>{innerCard}</div>;
  }

  return innerCard;
}
