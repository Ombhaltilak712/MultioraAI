import {
  Code2,
  Send,
  Sparkles,
  Zap
} from 'lucide-react';
import { SectionHeading, Reveal } from '../ui';

export default function DeviceShowcase() {
  return (
    <section id="showcase" className="py-24 md:py-32 relative overflow-hidden bg-[#06080e]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Multi-Device Command Center"
          title="Adaptive elegance across desktop and mobile"
          gradientWords={['Adaptive elegance', 'desktop and mobile']}
          description="Engineered to adapt seamlessly whether you're architecting large codebases on a 4K monitor or directing agents on mobile."
          className="mb-16 md:mb-20"
        />

        {/* Device Stage with Ambient Glow */}
        <div className="relative mx-auto max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Ambient Glow behind Laptop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

          {/* 1. Pure CSS Laptop Frame */}
          <Reveal direction="up" delay={0.1} className="w-full lg:w-[740px] shrink-0">
            <div className="relative mx-auto rounded-t-2xl border border-white/[0.15] bg-[#12151f] shadow-2xl p-2.5 pb-0 shadow-black/90">
              {/* Laptop Screen Bezel */}
              <div className="relative rounded-t-xl bg-[#090b12] border border-white/[0.08] overflow-hidden">
                {/* Laptop Camera dot */}
                <div className="h-5 bg-[#0e111a] border-b border-white/[0.06] flex items-center justify-between px-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mx-auto" />
                  <div className="text-[9px] font-mono text-slate-500">MultioraAI Workspace v2.0</div>
                </div>

                {/* Mini Workspace UI */}
                <div className="h-[280px] sm:h-[340px] flex text-xs select-none bg-[#090b12]">
                  {/* Mini Sidebar */}
                  <div className="w-36 hidden sm:flex flex-col justify-between border-r border-white/[0.06] p-2 bg-[#0c0e17]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-bold text-[11px] px-1 py-1">
                        <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-[9px]">M</div>
                        <span>MultioraAI</span>
                      </div>
                      <div className="mt-2 text-[9.5px] uppercase text-slate-500 font-semibold px-1">Chats</div>
                      <div className="p-1.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] truncate border border-indigo-500/20">
                        Interactive Dashboard
                      </div>
                      <div className="p-1.5 text-slate-400 text-[10px] truncate hover:text-white">
                        Q3 Pitch Deck
                      </div>
                      <div className="p-1.5 text-slate-400 text-[10px] truncate hover:text-white">
                        AI Safety PDF
                      </div>
                    </div>
                    <div className="text-[9.5px] text-slate-500 border-t border-white/[0.06] pt-1.5">
                      Pro • 850 cr
                    </div>
                  </div>

                  {/* Mini Chat Area */}
                  <div className="flex-1 flex flex-col justify-between p-3 border-r border-white/[0.06] bg-[#090b12]">
                    <div className="space-y-2.5 overflow-hidden">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-linear-to-r from-indigo-500 to-violet-600 text-white rounded-xl rounded-tr-xs px-3 py-1.5 text-[10.5px] max-w-[85%]">
                          Generate a clean real-time crypto price tracker artifact in React.
                        </div>
                      </div>

                      {/* Assistant message */}
                      <div className="flex justify-start">
                        <div className="bg-white/[0.04] border border-white/[0.06] text-slate-200 rounded-xl rounded-tl-xs p-2.5 text-[10px] max-w-[90%] space-y-1">
                          <div className="flex items-center gap-1 text-indigo-400 font-semibold text-[9.5px]">
                            <Sparkles size={10} /> Auto-Router: Coding Agent Active
                          </div>
                          <p className="text-slate-300">
                            I've compiled a responsive single-page crypto tracker with live sparkline charts.
                          </p>
                          <div className="flex gap-1 pt-1">
                            <span className="text-[9px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              3 Files Generated
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini Composer */}
                    <div className="rounded-lg bg-white/[0.04] border border-white/[0.08] p-1.5 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Ask MultioraAI anything...</span>
                      <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center">
                        <Send size={9} />
                      </div>
                    </div>
                  </div>

                  {/* Mini Artifact Panel */}
                  <div className="w-48 hidden md:flex flex-col justify-between border-l border-white/[0.06] bg-[#0c0e17] p-2">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold">
                        <Code2 size={11} />
                        <span>CryptoApp.html</span>
                      </div>
                      <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">Preview</span>
                    </div>
                    {/* Mock iframe sandbox */}
                    <div className="my-1 flex-1 rounded bg-[#07090e] border border-white/[0.04] p-2 flex flex-col justify-center items-center gap-1 text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Zap size={14} />
                      </div>
                      <div className="text-[10px] font-bold text-white">BTC: $98,420</div>
                      <div className="text-[8.5px] text-emerald-400">+5.4% 24h</div>
                    </div>
                    <div className="text-[8.5px] text-slate-500 text-center font-mono">Live Monaco Execution</div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base */}
              <div className="relative mx-auto -mb-2.5 h-3.5 w-[105%] -left-[2.5%] rounded-b-xl bg-linear-to-b from-[#222736] to-[#12151f] border-t border-white/20 shadow-xl flex justify-center items-center">
                <div className="w-16 h-1 rounded-full bg-white/20" />
              </div>
            </div>
          </Reveal>

          {/* 2. Pure CSS Mobile Phone Frame */}
          <Reveal direction="up" delay={0.25} className="w-[230px] sm:w-[260px] shrink-0">
            <div className="relative mx-auto rounded-[36px] border-[5px] border-[#202534] bg-[#0c0e17] p-2 shadow-2xl shadow-indigo-500/10">
              {/* Dynamic Island Pill */}
              <div className="h-4 flex justify-center items-center mb-1">
                <div className="w-14 h-3 bg-black rounded-full" />
              </div>

              {/* Mobile Screen UI */}
              <div className="h-[360px] rounded-[24px] bg-[#090b12] p-2.5 flex flex-col justify-between text-xs overflow-hidden border border-white/[0.04]">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">M</div>
                    <span className="text-[10px] font-bold text-white">MultioraAI</span>
                  </div>
                  <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full font-mono">Mobile v2</span>
                </div>

                {/* Mobile Messages */}
                <div className="space-y-2 py-1">
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white rounded-xl rounded-tr-xs px-2.5 py-1 text-[10px] max-w-[90%]">
                      Design a clean landing page hero.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/[0.06] text-slate-200 rounded-xl rounded-tl-xs p-2 text-[9.5px] max-w-[95%]">
                      <p className="text-slate-300">Generated hero with 3D orb and responsive navbar.</p>
                      <button className="mt-1.5 w-full flex items-center justify-center gap-1 py-1 rounded bg-indigo-600 text-white text-[9px] font-medium shadow">
                        <Code2 size={10} /> View Code Artifact
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Input */}
                <div className="rounded-lg bg-white/[0.05] border border-white/[0.08] p-1.5 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Type a message...</span>
                  <div className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center">
                    <Send size={8} />
                  </div>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="h-3 flex justify-center items-center mt-1">
                <div className="w-16 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
