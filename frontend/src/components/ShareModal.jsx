import { useState } from 'react';
import { X, Copy, Check, Download, Share2, Globe, Lock, FileText, FileCode } from 'lucide-react';
import { shareConversation } from '../features/shareConversation';

function ShareModal({ conversation, messages, onClose }) {
  const [isShared, setIsShared] = useState(conversation?.isShared || false);
  const [shareToken, setShareToken] = useState(conversation?.shareToken || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!conversation) return null;

  const origin = window.location.origin;
  const shareUrl = shareToken ? `${origin}/share/${shareToken}` : '';

  const handleToggleShare = async () => {
    setLoading(true);
    try {
      const nextState = !isShared;
      const res = await shareConversation(conversation._id, nextState);
      setIsShared(res.isShared);
      setShareToken(res.shareToken);
    } catch (err) {
      console.error('Failed to toggle share:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    let md = `# ${conversation.title || 'Conversation'}\n\n`;
    md += `*Exported from MultioraAI on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    messages.forEach((m) => {
      const role = m.role === 'user' ? '**User:**' : '**MultioraAI:**';
      md += `${role}\n\n${m.content}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(conversation.title || 'chat').replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    let txt = `${conversation.title || 'Conversation'}\n`;
    txt += `Exported from MultioraAI on ${new Date().toLocaleString()}\n`;
    txt += `${'='.repeat(60)}\n\n`;
    messages.forEach((m) => {
      const role = m.role === 'user' ? 'USER' : 'MULTIORAAI';
      txt += `[${role}]:\n${m.content}\n\n${'-'.repeat(40)}\n\n`;
    });
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(conversation.title || 'chat').replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const messagesHtml = messages
      .map(
        (m) => `
      <div style="margin-bottom: 24px; padding: 16px; border-radius: 12px; background: ${
        m.role === 'user' ? '#f0f4ff' : '#ffffff'
      }; border: 1px solid #e2e8f0;">
        <div style="font-weight: 700; font-size: 13px; color: ${
          m.role === 'user' ? '#4338ca' : '#0f172a'
        }; margin-bottom: 8px;">
          ${m.role === 'user' ? 'USER' : 'MULTIORAAI'}
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word;">
          ${m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
      </div>
    `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${conversation.title || 'MultioraAI Conversation'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 40px auto;
            max-width: 800px;
            color: #0f172a;
            background: #ffffff;
          }
          h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #0f172a; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
          @media print {
            body { margin: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${conversation.title || 'Conversation'}</h1>
        <div class="meta">MultioraAI Export • ${new Date().toLocaleDateString()} • ${messages.length} messages</div>
        ${messagesHtml}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Share & Export</h3>
              <p className="text-xs text-slate-400 truncate max-w-[260px]">{conversation.title || 'New Chat'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Public Share Link Section */}
        <div className="flex flex-col gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isShared ? <Globe size={16} className="text-emerald-400" /> : <Lock size={16} className="text-slate-400" />}
              <span className="text-sm font-medium text-slate-200">
                {isShared ? 'Public Link Enabled' : 'Public Link Disabled'}
              </span>
            </div>
            <button
              disabled={loading}
              onClick={handleToggleShare}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                isShared
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {loading ? 'Updating...' : isShared ? 'Disable Link' : 'Create Link'}
            </button>
          </div>

          {isShared && shareUrl && (
            <div className="flex items-center gap-2 mt-1">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition cursor-pointer shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isShared
              ? 'Anyone with this link can view a read-only copy. Your account details and credits are completely hidden.'
              : 'Public link is disabled. Only you have access to this conversation.'}
          </p>
        </div>

        {/* Export Options Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Export Conversation</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={exportPdf}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Download size={18} className="text-red-400" />
              <span className="text-xs font-medium">PDF Document</span>
            </button>

            <button
              onClick={exportMarkdown}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <FileCode size={18} className="text-indigo-400" />
              <span className="text-xs font-medium">Markdown</span>
            </button>

            <button
              onClick={exportText}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <FileText size={18} className="text-amber-400" />
              <span className="text-xs font-medium">Plain Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
