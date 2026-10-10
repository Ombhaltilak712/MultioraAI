import { motion, useReducedMotion } from 'motion/react';

export default function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  distance = 24,
  once = true,
  className = '',
  width = 'full'
}) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (shouldReduceMotion) return { opacity: 0 };
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  const getTargetPosition = () => {
    if (shouldReduceMotion) return { opacity: 1 };
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'none':
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getTargetPosition()}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={`${width === 'full' ? 'w-full' : 'w-fit'} ${className}`}
    >
      {children}
    </motion.div>
  );
}
