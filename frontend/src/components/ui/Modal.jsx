import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen = true,
  onClose,
  title,
  description,
  icon: Icon,
  iconVariant = 'indigo', // 'indigo' | 'red' | 'amber' | 'emerald'
  children,
  footer,
  maxWidth = 'md', // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className = ''
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  }[maxWidth] || 'max-w-md';

  const iconVariantStyles = {
    indigo: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
    red: 'bg-red-500/10 border-red-500/25 text-red-400',
    amber: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
  }[iconVariant] || iconVariantStyles.indigo;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidthStyles} bg-[#0e1017]/95 border border-white/[0.09] rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden text-slate-100 z-10 my-8 backdrop-blur-xl ${className}`}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {Icon && (
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconVariantStyles}`}
                    >
                      <Icon size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    {title && (
                      <h3 className="text-base font-semibold text-slate-100 tracking-tight truncate">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>
                    )}
                  </div>
                </div>

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition cursor-pointer shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-5 overflow-y-auto max-h-[75vh] [scrollbar-width:none]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-white/[0.06] bg-white/[0.01]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
