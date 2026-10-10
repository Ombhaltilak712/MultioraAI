import {
  MessageSquare,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Check
} from 'lucide-react';
import { SectionHeading, GlassCard, Reveal } from '../ui';

const STEPS = [
  {
    step: '01',
    title: 'Ask Anything in Any Format',
    description:
      'Type your question, upload a reference PDF, paste an image screenshot, or speak directly using voice input.',
    icon: MessageSquare,
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    renderMock: () => (
      <div className="bg-[#0b0e16] border border-white/[0.08] rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Multimodal Composer</span>
        </div>
        <div className="bg-white/[0.04] p-2.5 rounded-lg text-slate-200 border border-white/[0.06] font-mono text-[11px]">
          &gt; "Build a real-time crypto price tracker with charts"
        </div>
        <div className="flex gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
            + Attachment attached
          </span>
          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px]">
            Voice input ready
          </span>
        </div>
      </div>
    )
  },
  {
    step: '02',
    title: 'Auto-Router Assigns the Right Agent',
    description:
      'The central intelligence engine evaluates your prompt semantics and automatically selects the optimal specialized agent.',
    icon: Cpu,
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    renderMock: () => (
      <div className="bg-[#0b0e16] border border-white/[0.08] rounded-xl p-3.5 space-y-2 text-xs">
        <div className="text-[11px] text-slate-400 font-mono">Routing Analysis:</div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Code2 size={14} className="text-cyan-400" />
            <span className="font-semibold text-cyan-200">Coding Agent</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            99.4% Match
          </span>
        </div>
        <div className="text-[10px] text-slate-500">Also evaluated: PPT (12%), Vision (4%)</div>
      </div>
    )
  },
  {
    step: '03',
    title: 'Autonomous Synthesis & Execution',
    description:
      'The selected agent executes reasoning, writes full HTML/CSS/JS applications, generates multi-slide decks, or parses images.',
    icon: Layers,
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    renderMock: () => (
      <div className="bg-[#0b0e16] border border-white/[0.08] rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-medium">Generating Artifacts</span>
          <span className="text-violet-400 font-mono text-[10.5px]">3 Files Complete</span>
        </div>
        <div className="space-y-1 font-mono text-[10.5px]">
          <div className="flex items-center gap-1.5 text-slate-300 bg-white/[0.03] p-1.5 rounded">
            <Check size={11} className="text-emerald-400" /> index.html
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-white/[0.03] p-1.5 rounded">
            <Check size={11} className="text-emerald-400" /> style.css
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-white/[0.03] p-1.5 rounded">
            <Check size={11} className="text-emerald-400" /> script.js
          </div>
        </div>
      </div>
    )
  },
  {
    step: '04',
    title: 'Preview Live, Download & Share',
    description:
      'Interact with live preview in the sandbox, edit code directly with Monaco, store assets in Personal Library, or generate public links.',
    icon: Sparkles,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    renderMock: () => (
      <div className="bg-[#0b0e16] border border-white/[0.08] rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Live Interactive
          </span>
          <span className="text-slate-500 font-mono text-[10px]">60 FPS Sandbox</span>
        </div>
        <div className="h-14 rounded-lg bg-linear-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 flex items-center justify-center text-slate-300 font-medium">
          [ Live Web App Running ]
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
          <span>Personal Library Sync</span>
          <span className="text-indigo-400 font-medium flex items-center gap-0.5">
            Public Link <ArrowRight size={10} />
          </span>
        </div>
      </div>
    )
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Workflow Intelligence"
          title="From prompt to running software in four steps"
          gradientWords={['running software', 'four steps']}
          description="MultioraAI eliminates context switching by dynamically orchestrating specialized AI agents inside a single unified timeline."
          className="mb-16 md:mb-20"
        />

        {/* 4 Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={idx * 0.12} direction="up">
                <GlassCard
                  tilt
                  glow="indigo"
                  className="p-6 h-full flex flex-col justify-between group hover:border-indigo-500/40 relative"
                >
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.badgeColor}`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-600 group-hover:text-slate-400 transition">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-100 tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Mock UI Showcase */}
                  <div className="mt-auto pt-2">{step.renderMock()}</div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
