import { lazy, Suspense } from 'react';
import {
  ArrowRight,
  Code2,
  FileText,
  Presentation,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { GlowButton, GradientText, GlassCard, Badge, Reveal } from '../ui';

// Lazy-load the 3D Canvas
const Hero3D = lazy(() => import('./Hero3D'));

export default function Hero({ onGetStarted }) {
  const handleScrollToAgents = (e) => {
    e.preventDefault();
    const target = document.querySelector('#agents');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[450px] h-[350px] bg-cyan-500/08 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Reveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 mb-6">
                <Badge variant="gradient" dot ping size="md" className="shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                  <Sparkles size={12} className="text-cyan-300" />
                  MultioraAI 2.0 • Autonomous Multi-Modal Command Center
                </Badge>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
                One workspace.{' '}
                <br className="hidden sm:inline" />
                <GradientText animate from="from-indigo-400" via="via-violet-400" to="to-cyan-300">
                  Every AI agent.
                </GradientText>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
                Autonomous multi-agent orchestration in a single chat. Write & preview live web apps,
                generate tailored PDF reports, design executive slide decks, and inspect visuals in real time.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
                <GlowButton
                  variant="primary"
                  size="lg"
                  magnetic
                  onClick={onGetStarted}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto text-base shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                >
                  Start Building Free
                </GlowButton>

                <GlowButton
                  variant="secondary"
                  size="lg"
                  onClick={handleScrollToAgents}
                  className="w-full sm:w-auto text-base"
                >
                  Explore 7 Agents
                </GlowButton>
              </div>
            </Reveal>

            {/* Micro Trust Indicators */}
            <Reveal direction="up" delay={0.5}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>100 Free Credits on Sign In</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Live Monaco & iframe Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>No Setup Required</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Interactive 3D Agent Orb + Floating Mockup Chips */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] lg:min-h-[540px]">
            {/* 3D Orb with Lazy Loading & Suspense */}
            <div className="w-full h-full relative z-10 flex items-center justify-center">
              <Suspense
                fallback={
                  <div className="w-72 h-72 rounded-full bg-linear-to-tr from-indigo-600/30 via-violet-600/20 to-cyan-500/20 blur-2xl flex items-center justify-center border border-white/10 animate-pulse">
                    <Zap className="text-indigo-400 animate-bounce" size={32} />
                  </div>
                }
              >
                <Hero3D />
              </Suspense>
            </div>

            {/* Floating Glass Mockup Chip 1: Code Generation */}
            <div className="absolute -top-2 -left-4 sm:left-2 z-20 animate-[float_5s_ease-in-out_infinite]">
              <GlassCard tilt glow="indigo" className="p-3 shadow-xl backdrop-blur-2xl border-white/[0.12]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Code2 size={15} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-200">React Dashboard.jsx</div>
                    <div className="text-[9.5px] font-mono text-cyan-400">Synthesizing Artifact...</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Floating Glass Mockup Chip 2: Presentation Deck */}
            <div className="absolute bottom-6 -right-2 sm:right-0 z-20 animate-[float_6s_ease-in-out_1s_infinite]">
              <GlassCard tilt glow="violet" className="p-3 shadow-xl backdrop-blur-2xl border-white/[0.12]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Presentation size={15} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-200">AI Pitch Deck.pptx</div>
                    <div className="text-[9.5px] text-amber-400">12 Slides Formatted</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Floating Glass Mockup Chip 3: Document Generation */}
            <div className="absolute -bottom-4 left-6 z-20 animate-[float_5.5s_ease-in-out_2s_infinite]">
              <GlassCard tilt glow="cyan" className="p-3 shadow-xl backdrop-blur-2xl border-white/[0.12]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <FileText size={15} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-200">Executive Summary.pdf</div>
                    <div className="text-[9.5px] text-rose-400">Export Ready • Vectorized</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
