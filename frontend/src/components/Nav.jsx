import { MessageSquare, Pin, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ShareModal from './ShareModal';
import { Badge, GlowButton } from './ui';

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      {selectedConversation && (
        <header className="h-14 flex items-center justify-between pl-14 pr-4 sm:px-6 lg:px-6 border-b border-white/[0.08] bg-[#090b12]/85 backdrop-blur-xl z-20 shrink-0">
          {/* Conversation Title & Meta */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/25 shrink-0 text-indigo-400">
              <MessageSquare size={13} />
            </div>

            <h2 className="font-['Space_Grotesk'] text-[14px] font-semibold text-slate-100 tracking-tight truncate max-w-xs sm:max-w-md lg:max-w-lg">
              {selectedConversation?.title || 'New Chat'}
            </h2>

            {selectedConversation?.isPinned && (
              <Badge variant="amber" size="sm" className="shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Pin size={9} className="rotate-45" /> Pinned
              </Badge>
            )}

            <div className="hidden sm:inline-flex shrink-0">
              <Badge variant="neutral" size="sm">
                {messages?.length || 0} Messages
              </Badge>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <GlowButton
              variant="secondary"
              size="sm"
              onClick={() => setShowShareModal(true)}
              icon={Share2}
              className="text-xs font-medium shadow-sm hover:border-indigo-500/30"
              title="Share or Export this conversation"
            >
              <span className="hidden sm:inline">Share</span>
            </GlowButton>
          </div>
        </header>
      )}

      {showShareModal && selectedConversation && (
        <ShareModal
          conversation={selectedConversation}
          messages={messages}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}

export default Nav;
