import {
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
  Sparkles,
  Eye,
  Cpu
} from 'lucide-react';
import { Marquee } from '../ui';

const CAPABILITIES = [
  { label: 'Autonomous Code Generation', icon: Code2, color: 'text-cyan-400' },
  { label: 'Live Artifact Execution', icon: Eye, color: 'text-indigo-400' },
  { label: 'Interactive PPT Slide Decks', icon: Presentation, color: 'text-amber-400' },
  { label: 'Vectorized PDF Reports', icon: FileText, color: 'text-rose-400' },
  { label: 'Computer Vision & Image Reasoning', icon: ImageIcon, color: 'text-emerald-400' },
  { label: 'Real-time Grounded Web Search', icon: Globe, color: 'text-violet-400' },
  { label: 'Dynamic Multi-Agent Router', icon: Cpu, color: 'text-blue-400' },
  { label: 'Monaco Multi-File Editing', icon: Sparkles, color: 'text-pink-400' }
];

export default function CapabilityStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#07090f]/60 py-6 backdrop-blur-md relative overflow-hidden">
      <Marquee speed={40} pauseOnHover>
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.label}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.06] hover:border-indigo-500/30 transition shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <Icon size={14} className={cap.color} />
              </div>
              <span className="text-xs font-semibold text-slate-200 tracking-wide whitespace-nowrap">
                {cap.label}
              </span>
            </div>
          );
        })}
      </Marquee>
    </section>
  );
}
