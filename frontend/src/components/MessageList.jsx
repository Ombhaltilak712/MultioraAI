import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Code2,
  FileText,
  Presentation,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingAnimation from './LoadingAnimation';
import { editMessage as apiEditMessage } from '../features/editMessage';
import sendMessage from '../features/sendMessage';
import { addMessage, setArtifacts, setIsLoading, truncateMessagesFrom } from '../redux/messageSlice';

const SUGGESTIONS = [
  {
    title: 'Write a Netflix clone in React',
    desc: 'Interactive SPA with video player controls and responsive catalog',
    agent: 'Coding Agent',
    icon: Code2,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
  },
  {
    title: 'Generate a presentation on Quantum Computing',
    desc: '10 structured executive slides with hardware benchmarks',
    agent: 'PPT Agent',
    icon: Presentation,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/25'
  },
  {
    title: 'Create a summary PDF of AI advances',
    desc: 'Vectorized whitepaper on modern model breakthroughs',
    agent: 'PDF Agent',
    icon: FileText,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/25'
  },
  {
    title: 'Explain Redis pub/sub with live code',
    desc: 'Deep architecture breakdown with messaging examples',
    agent: 'Search Agent',
    icon: Globe,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/25'
  }
];

function MessageList({ onSelectPrompt }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);
  const bottemRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    requestAnimationFrame(() => {
      bottemRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    });
  }, [messages?.length, isLoading]);

  const handleEditMessage = async (messageId, index, newContent) => {
    if (!newContent.trim() || isLoading) return;
    dispatch(setIsLoading(true));

    try {
      // 1. Truncate frontend messages up to this index with new content
      dispatch(truncateMessagesFrom({ index, newContent }));

      // 2. Call backend edit message API to prune downstream messages from DB
      if (messageId) {
        await apiEditMessage(messageId, newContent);
      }

      // 3. Trigger new assistant response generation with the edited context
      const formData = new FormData();
      formData.append('prompt', newContent);
      formData.append('conversationId', selectedConversation?._id);
      formData.append('agent', 'auto');

      const data = await sendMessage(formData);
      if (data) {
        dispatch(setArtifacts(data.artifacts || []));
        dispatch(addMessage({ role: 'assistant', content: data?.answer, images: data?.images }));
      }
    } catch (err) {
      console.error('Failed to regenerate edited response:', err);
      dispatch(
        addMessage({
          role: 'assistant',
          content: 'Failed to regenerate response. Please try sending your query again.'
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 || !selectedConversation ? (
        /* Empty State Screen */
        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8 select-none">
          {/* Centered Animated 2D Lightweight Agent Orb */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* Ambient Pulse Glows */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500/25 via-violet-500/25 to-cyan-400/20 blur-xl animate-pulse" />
            <div className="absolute -inset-1 rounded-full border border-indigo-400/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute -inset-3 rounded-full border border-violet-400/10 animate-[spin_16s_linear_infinite_reverse]" />

            {/* Central Core Emblem */}
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 border border-white/20">
              <Sparkles size={22} className="text-cyan-200 animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
              MultioraAI Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Autonomous multi-agent workspace. Write code, synthesize live web artifacts, generate presentations, and inspect documents.
            </p>
          </div>

          {/* 4 Suggestion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {SUGGESTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onSelectPrompt && onSelectPrompt(item.title)}
                  className="group p-3.5 rounded-2xl bg-[#0c0e17]/80 hover:bg-[#121522] border border-white/[0.07] hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-indigo-500/10 text-left select-none"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon size={15} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider group-hover:text-indigo-400 transition flex items-center gap-0.5">
                      <span>{item.agent}</span>
                      <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 group-hover:text-white transition tracking-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Chat Messages List */
        <div className="space-y-4 max-w-4xl mx-auto w-full">
          {messages?.map((msg, i) => (
            <div key={msg?._id || msg?.id || i}>
              <MessageBubble
                id={msg?._id || msg?.id}
                index={i}
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
                onEdit={handleEditMessage}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}
      <div ref={bottemRef} />
    </div>
  );
}

export default MessageList;
