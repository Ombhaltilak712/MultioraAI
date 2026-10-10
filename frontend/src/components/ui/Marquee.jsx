import { useReducedMotion } from 'motion/react';

export default function Marquee({
  children,
  direction = 'left',
  speed = 35, // duration in seconds
  pauseOnHover = true,
  fadeEdges = true,
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  const animationStyle = shouldReduceMotion
    ? {}
    : {
        animationDuration: `${speed}s`,
        animationDirection: direction === 'right' ? 'reverse' : 'normal'
      };

  return (
    <div
      className={`relative w-full overflow-hidden group select-none ${className}`}
      style={{ maskImage: fadeEdges ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' : 'none' }}
    >
      <div
        className={`flex w-max shrink-0 animate-[marquee_linear_infinite] gap-4 ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={animationStyle}
      >
        <div className="flex shrink-0 items-center gap-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
