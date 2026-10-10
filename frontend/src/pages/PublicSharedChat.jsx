import { useState, useEffect } from 'react';
import { Calendar, Globe, ArrowRight, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { getSharedConversation } from '../features/shareConversation';
import MessageBubble from '../components/MessageBubble';
import Logo from '../components/Logo';

function PublicSharedChat({ token, onGoHome }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSharedConversation(token);
        setData(res);
      } catch (err) {
        console.error('Failed to load shared conversation:', err);
        setError('This shared conversation was not found or sharing has been disabled by the owner.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchShared();
    }
  }, [token]);

  const handleNavigateHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Aurora Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-linear-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl" />
      </div>

      {/* Sticky Glass Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0e17]/85 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold uppercase">
            <ShieldCheck size={11} /> Public Snapshot
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNavigateHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition cursor-pointer active:scale-95"
          >
            <Sparkles size={13} className="text-cyan-200" />
            <span>Try MultioraAI Free</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col relative z-10">
        {loading ? (
          /* Loading State Skeletons */
          <div className="py-12 space-y-5 animate-pulse">
            <div className="h-10 w-2/3 bg-white/[0.05] rounded-xl" />
            <div className="h-4 w-1/3 bg-white/[0.03] rounded-md mb-8" />
            <div className="space-y-4">
              <div className="h-20 bg-white/[0.03] rounded-2xl w-3/4 ml-auto" />
              <div className="h-32 bg-white/[0.02] rounded-2xl w-5/6" />
              <div className="h-24 bg-white/[0.03] rounded-2xl w-2/3 ml-auto" />
            </div>
          </div>
        ) : error ? (
          /* Error Screen */
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 shadow-xl">
              <Globe size={28} />
            </div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
              Shared Conversation Unavailable
            </h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
              {error}
            </p>
            <button
              type="button"
              onClick={handleNavigateHome}
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition cursor-pointer"
            >
              Return to MultioraAI
            </button>
          </div>
        ) : (
          /* Shared Conversation View */
          <div className="flex flex-col gap-6">
            {/* Conversation Header Card */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0c0e17]/80 border border-white/[0.08] backdrop-blur-md shadow-xl flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                  <MessageSquare size={13} /> Shared Thread
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                  Read-Only Mode
                </span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold text-white tracking-tight">
                {data.title || 'Untitled Conversation'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-500" />
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{data.messages?.length || 0} messages total</span>
              </div>
            </div>

            {/* Rendered Messages */}
            <div className="space-y-4">
              {data.messages?.map((msg, i) => (
                <div key={msg._id || i}>
                  <MessageBubble
                    id={msg._id}
                    index={i}
                    role={msg.role}
                    content={msg.content}
                    images={msg.images || []}
                  />
                </div>
              ))}
            </div>

            {/* Bottom "Try MultioraAI" Conversion Banner */}
            <div className="mt-8 p-6 md:p-8 rounded-3xl bg-linear-to-b from-[#111422] to-[#0b0e17] border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="space-y-1.5">
                <h3 className="font-['Space_Grotesk'] text-lg md:text-xl font-bold text-white tracking-tight">
                  One workspace. Every AI agent.
                </h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  Generate code sandboxes, executive slide decks, vector PDFs, and live web research in unified threads.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNavigateHome}
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-700 hover:opacity-95 text-xs font-bold text-white shadow-xl shadow-indigo-500/30 transition cursor-pointer active:scale-95"
              >
                <Sparkles size={14} className="text-cyan-200" />
                <span>Launch Your Own Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#080a10] py-6 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} MultioraAI. Powered by Autonomous Agent Orchestration.</p>
      </footer>
    </div>
  );
}

export default PublicSharedChat;

