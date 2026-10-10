import {
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
  Terminal
} from 'lucide-react';
import { SectionHeading, GlassCard, Badge, Reveal } from '../ui';

const AGENTS = [
  {
    id: 'coding',
    name: 'Coding Agent',
    icon: Code2,
    badge: 'Live Monaco Artifacts',
    color: 'from-cyan-500 to-blue-600',
    borderGlow: 'cyan',
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    description:
      'Generates complete, reactive single-page applications with HTML, CSS, and JS. Test and inspect directly in the live sandbox.',
    examplePrompt: '“Build a functional Spotify web player clone with working audio player controls and responsive sidebar.”'
  },
  {
    id: 'ppt',
    name: 'PPT Agent',
    icon: Presentation,
    badge: 'Presentation Decks',
    color: 'from-amber-500 to-orange-600',
    borderGlow: 'none',
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    description:
      'Designs slide decks complete with typography hierarchy, executive summaries, bullet frameworks, and slide formatting.',
    examplePrompt: '“Create a 10-slide Seed Pitch Deck for an autonomous AI developer tools startup.”'
  },
  {
    id: 'pdf',
    name: 'PDF Agent',
    icon: FileText,
    badge: 'Document Synthesis',
    color: 'from-rose-500 to-pink-600',
    borderGlow: 'none',
    iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    description:
      'Compiles professional reports, Whitepapers, documentation, and formatted technical specifications saved to your Library.',
    examplePrompt: '“Compile a comprehensive 5-page state-of-AI 2026 security audit report with metrics.”'
  },
  {
    id: 'vision',
    name: 'Vision Agent',
    icon: ImageIcon,
    badge: 'Multimodal Analysis',
    color: 'from-emerald-500 to-teal-600',
    borderGlow: 'none',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    description:
      'Analyzes wireframes, screenshots, error logs, and charts to convert visual inputs into code, structured data, and insights.',
    examplePrompt: '“Inspect this Figma mockup screenshot and generate the exact Tailwind CSS component structure.”'
  },
  {
    id: 'search',
    name: 'Search Agent',
    icon: Globe,
    badge: 'Live Web Intelligence',
    color: 'from-violet-500 to-purple-600',
    borderGlow: 'violet',
    iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
    description:
      'Queries live internet sources to verify facts, fetch contemporary API docs, compare market benchmarks, and deliver source-backed answers.',
    examplePrompt: '“What are the latest updates in Vite 8 and React 19 concurrent features released this month?”'
  },
  {
    id: 'chat',
    name: 'Chat Agent',
    icon: MessageSquare,
    badge: 'Deep Reasoning',
    color: 'from-indigo-500 to-violet-600',
    borderGlow: 'indigo',
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
    description:
      'High-velocity conversational reasoning engine for complex problem solving, philosophical exploration, and architecture planning.',
    examplePrompt: '“Explain the mathematical intuition behind diffusion transformers compared to latent models.”'
  }
];

export default function AgentsShowcase() {
  return (
    <section id="agents" className="py-24 md:py-32 relative bg-[#06080e]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Specialized Agents"
          title="Seven dedicated agents. Zero context lost."
          gradientWords={['Seven dedicated agents', 'Zero context lost']}
          description="Each agent is fine-tuned for high-precision output, automatically orchestrated by the Multiora AI core."
          className="mb-16 md:mb-20"
        />

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <Reveal key={agent.id} delay={index * 0.1} direction="up">
                <GlassCard
                  tilt
                  glow={agent.borderGlow}
                  className="p-6 h-full flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${agent.iconColor}`}
                      >
                        <Icon size={20} />
                      </div>
                      <Badge variant="neutral" size="sm">
                        {agent.badge}
                      </Badge>
                    </div>

                    {/* Agent Name */}
                    <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-2">
                      {agent.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed mb-5">
                      {agent.description}
                    </p>
                  </div>

                  {/* Example Prompt Box */}
                  <div className="mt-auto">
                    <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mb-1.5">
                        <Terminal size={11} className="text-indigo-400" />
                        <span>Example Directive</span>
                      </div>
                      <p className="text-[11.5px] text-slate-300 italic leading-snug font-sans">
                        {agent.examplePrompt}
                      </p>
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
