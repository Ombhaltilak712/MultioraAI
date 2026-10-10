import { useState } from 'react';
import { Copy, Check, Download, Share2, Globe, Lock, FileText, FileCode } from 'lucide-react';
import Modal from './ui/Modal';
import { shareConversation } from '../features/shareConversation';

function ShareModal({ conversation, messages = [], onClose }) {
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
          ${m.content ? m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}
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
    <Modal
      isOpen={Boolean(conversation)}
      onClose={onClose}
      title="Share & Export"
      description={conversation.title || 'Active Conversation'}
      icon={Share2}
      iconVariant="indigo"
      maxWidth="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col gap-5 select-none">
        {/* Public Share Link Card */}
        <div className="flex flex-col gap-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isShared
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-white/[0.04] border-white/10 text-slate-400'
                }`}
              >
                {isShared ? <Globe size={14} /> : <Lock size={14} />}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {isShared ? 'Public Web Link Active' : 'Private Conversation'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isShared
                    ? 'Anyone with this URL can view a read-only snapshot'
                    : 'Only you have access to this conversation'}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleToggleShare}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer border ${
                isShared
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/25'
                  : 'bg-linear-to-r from-indigo-500 to-violet-600 text-white border-white/20 shadow-sm hover:opacity-95'
              }`}
            >
              {loading ? 'Updating...' : isShared ? 'Disable Link' : 'Generate Link'}
            </button>
          </div>

          {/* Copy Link Input Bar */}
          {isShared && shareUrl && (
            <div className="flex items-center gap-2 mt-1">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 border ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed border-t border-white/[0.04] pt-2.5">
            Your user profile, account credits, and private session credentials are kept completely hidden from public viewers.
          </p>
        </div>

        {/* Export Options Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Export Transcript
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={exportPdf}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0c0e17]/80 hover:bg-[#121524] border border-white/[0.07] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer group shadow-sm text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
                <Download size={15} />
              </div>
              <span className="text-xs font-medium">PDF Print</span>
            </button>

            <button
              type="button"
              onClick={exportMarkdown}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0c0e17]/80 hover:bg-[#121524] border border-white/[0.07] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer group shadow-sm text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                <FileCode size={15} />
              </div>
              <span className="text-xs font-medium">Markdown</span>
            </button>

            <button
              type="button"
              onClick={exportText}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#0c0e17]/80 hover:bg-[#121524] border border-white/[0.07] hover:border-indigo-500/30 text-slate-300 hover:text-white transition cursor-pointer group shadow-sm text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                <FileText size={15} />
              </div>
              <span className="text-xs font-medium">Plain Text</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;

