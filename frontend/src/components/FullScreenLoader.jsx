import Logo from './Logo';
import { Spinner } from './ui';

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060a] text-white select-none">
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Logo size="lg" glow badge="AI" />
        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono tracking-wide">
          <Spinner size="sm" variant="indigo" />
          <span>Verifying secure workspace session...</span>
        </div>
      </div>
    </div>
  );
}
