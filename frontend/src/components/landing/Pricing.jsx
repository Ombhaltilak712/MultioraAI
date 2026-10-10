import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { SectionHeading, GlassCard, GlowButton, Badge, Reveal } from '../ui';

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    credits: '100 Credits',
    description: 'Perfect for exploring multi-agent capabilities and testing code generation.',
    highlight: false,
    badge: 'Starter Tier',
    cta: 'Get Started Free',
    features: [
      '100 Free credits upon initial sign in',
      'All 7 AI Agents available (Auto-router)',
      'Live Monaco & iframe code execution',
      'Personal Library storage',
      'Standard generation velocity',
      'Community web support'
    ]
  },
  {
    name: 'Starter',
    price: '₹199',
    period: 'one-time top-up',
    credits: '500 Credits added',
    description: 'Designed for individual creators building weekly prototypes, decks, and reports.',
    highlight: false,
    badge: 'Popular',
    cta: 'Choose Starter',
    features: [
      '500 Credits added immediately',
      'Credits valid for a full 30 days',
      'Faster model execution & priority queue',
      'Full coding & live web app synthesis',
      'Extended PDF reports & PPT pitch decks',
      'Public conversation share links',
      'Personal Library unlimited asset storage'
    ]
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'one-time top-up',
    credits: '1,000 Credits added',
    description: 'For power developers and teams demanding heavy computation and deep research.',
    highlight: true,
    badge: 'Most Popular • Ultimate',
    cta: 'Unlock Pro Access',
    features: [
      '1,000 Credits added immediately',
      'Priority routing with highest bandwidth',
      'Ultra high-resolution vision image reasoning',
      'Extended multi-slide presentation generation',
      'Full Monaco source code download & branch editing',
      'Encrypted cloud sessions in Redis',
      'Priority 24/7 dedicated assistance'
    ]
  }
];

export default function Pricing({ onGetStarted }) {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Transparent Value"
          title="Simple, credit-based pricing with zero lock-in"
          gradientWords={['Simple, credit-based', 'zero lock-in']}
          description="Never worry about unexpected recurring charges. Choose only the credits you need, when you need them."
          className="mb-16 md:mb-20"
        />

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, index) => {
            return (
              <Reveal key={plan.name} delay={index * 0.12} direction="up">
                <GlassCard
                  tilt
                  gradientBorder={plan.highlight}
                  glow={plan.highlight ? 'indigo' : 'none'}
                  className={`p-8 h-full flex flex-col justify-between relative ${
                    plan.highlight
                      ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.22)]'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div>
                    {/* Header: Name + Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {plan.name}
                      </h3>
                      {plan.highlight ? (
                        <Badge variant="gradient" dot ping size="sm">
                          <Sparkles size={11} className="mr-1 text-cyan-300" />
                          {plan.badge}
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price & Credits Metric */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-extrabold text-white">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / {plan.period}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-indigo-400 mb-6 flex items-center gap-1.5">
                      <Zap size={14} className="text-indigo-400" />
                      <span>{plan.credits}</span>
                    </div>

                    <div className="h-px bg-white/[0.06] mb-6" />

                    {/* Features list */}
                    <ul className="space-y-3 mb-8 text-xs text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={11} />
                          </div>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-2">
                    <GlowButton
                      variant={plan.highlight ? 'primary' : 'secondary'}
                      size="md"
                      magnetic={plan.highlight}
                      onClick={onGetStarted}
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full text-sm font-semibold"
                    >
                      {plan.cta}
                    </GlowButton>

                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 mt-3 text-center">
                      <ShieldCheck size={12} className="text-slate-400" />
                      <span>Razorpay Secured • Valid for 30 Days</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
