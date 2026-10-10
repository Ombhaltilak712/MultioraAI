import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Cpu } from 'lucide-react';

const AGENT_STATUSES = [
  'Analyzing query intent...',
  'Routing to specialized agent...',
  'Executing reasoning & code synthesis...',
  'Compiling artifacts & sandbox output...'
];

export default function LoadingAnimation() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % AGENT_STATUSES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentStatus = AGENT_STATUSES[statusIndex];

  return (
    <div className="flex items-center gap-3.5 max-w-[85%] py-2 px-1 select-none">
      {/* Radiant Agent Neural Orb */}
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        {/* Pulsing Ripple Rings */}
        {[0, 0.5, 1.0].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-indigo-400/30"
            initial={{ scale: 0.4, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              delay,
              ease: 'easeOut'
            }}
          />
        ))}

        {/* Central Glowing Core */}
        <motion.div
          className="w-4 h-4 rounded-full bg-linear-to-tr from-cyan-400 via-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.65)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cpu size={9} className="text-white" />
        </motion.div>
      </div>

      {/* Shimmer Line & Rotating Status */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatus}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="text-[12.5px] font-medium text-slate-300 tracking-wide flex items-center gap-1.5"
            >
              <Sparkles size={11} className="text-cyan-400 animate-spin" />
              <span>{currentStatus}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle Horizontal Shimmer Bar */}
        <div className="w-44 h-1 rounded-full bg-white/[0.06] overflow-hidden relative">
          <motion.div
            className="absolute inset-y-0 w-20 bg-linear-to-r from-transparent via-indigo-500 to-cyan-400"
            animate={{ x: [-80, 200] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}
