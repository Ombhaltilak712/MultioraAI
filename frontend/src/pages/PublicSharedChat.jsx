import { useState, useEffect } from 'react';
import { Calendar, Globe, ArrowLeft } from 'lucide-react';
import { getSharedConversation } from '../features/shareConversation';
import MessageBubble from '../components/MessageBubble';

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

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#11131a] px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 flex items-center justify-center font-bold text-sm">
            M
          </div>
          <div>
            <span className="font-bold text-slate-100 text-sm tracking-tight">MultioraAI</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-2">
              Public Shared Chat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              else window.location.href = '/';
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft size={13} /> Return to App
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
            <span className="animate-pulse text-sm">Loading shared conversation...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Globe size={24} />
            </div>
            <h2 className="text-base font-semibold text-slate-200">Conversation Unavailable</h2>
            <p className="text-xs text-slate-400 max-w-sm">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Conversation Banner */}
            <div className="border-b border-white/[0.06] pb-5">
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">{data.title}</h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {new Date(data.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{data.messages?.length || 0} messages</span>
                <span>•</span>
                <span className="text-slate-500">Read-Only</span>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-5">
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-4 text-center text-xs text-slate-600">
        Shared via MultioraAI — Multi-Modal AI Workspace
      </footer>
    </div>
  );
}

export default PublicSharedChat;
