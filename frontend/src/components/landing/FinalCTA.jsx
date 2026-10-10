import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GlowButton, GradientText, GlassCard, Badge, Reveal } from '../ui';

export default function FinalCTA({ onGetStarted }) {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Massive Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-linear-to-tr from-indigo-600/20 via-violet-600/20 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={0.1}>
          <GlassCard
            tilt
            gradientBorder
            glow="indigo"
            className="p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-2xl border-indigo-500/30"
          >
            {/* Top Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="gradient" dot ping size="md" className="shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <Sparkles size={12} className="text-cyan-300" />
                Instant Access • 100 Free Credits Included
              </Badge>
            </div>

            {/* Headline */}
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-3xl mx-auto">
              Ready to command your{' '}
              <GradientText animate from="from-indigo-400" via="via-violet-400" to="to-cyan-300">
                multi-agent workspace?
              </GradientText>
            </h2>

            {/* Subline */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              Generate live applications, synthesize slide decks, analyze complex documents, and explore web
              intelligence from a single intelligent chat interface.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
              <GlowButton
                variant="primary"
                size="lg"
                magnetic
                onClick={onGetStarted}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-3.5 shadow-[0_0_35px_rgba(99,102,241,0.5)]"
              >
                Get Started Free Now
              </GlowButton>
            </div>

            {/* Guarantee / Micro indicators */}
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-400 border-t border-white/[0.06] pt-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Instant Google Sign-In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-400" />
                <span>Zero Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Private & Encrypted</span>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
