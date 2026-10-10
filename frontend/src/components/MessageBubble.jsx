import { Check, Copy, Edit2, ExternalLink, X, Cpu, User } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageBubble({ id, index, role, content, images = [], onEdit }) {
  const isUser = role === 'user';
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content || '');

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode('');
    }, 2000);
  };

  const copyFullMessage = async () => {
    await navigator.clipboard.writeText(content);
    setCopiedMessage(true);
    setTimeout(() => {
      setCopiedMessage(false);
    }, 2000);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    if (onEdit) {
      onEdit(id, index, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(content || '');
    setIsEditing(false);
  };

  return (
    <div className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} relative my-3`}>
      {/* Assistant Avatar for Assistant Messages */}
      {!isUser && !isEditing && (
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(99,102,241,0.35)] text-white mt-1">
          <Cpu size={15} />
        </div>
      )}

      {isEditing ? (
        /* Edit Mode Bubble */
        <div className="w-full max-w-[92vw] md:max-w-[78%] bg-[#12141f]/95 border border-indigo-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Edit2 size={12} /> Edit message & regenerate downstream response
            </span>
            <button
              onClick={handleCancelEdit}
              aria-label="Cancel editing"
              className="text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <textarea
            autoFocus
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-slate-100 outline-none focus:border-indigo-500/60 resize-none font-sans"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 shadow-md transition cursor-pointer"
            >
              Save & Submit
            </button>
          </div>
        </div>
      ) : (
        /* Rendered Message Bubble */
        <div
          className={`relative w-fit max-w-[92vw] md:max-w-[78%] px-4 py-3 rounded-2xl break-words leading-relaxed transition ${
            isUser
              ? 'bg-linear-to-br from-indigo-600/90 via-indigo-600 to-violet-700/90 text-white rounded-tr-xs shadow-[0_2px_12px_rgba(99,102,241,0.25)] border border-white/15'
              : 'text-slate-200 bg-[#0c0e17]/85 border border-white/[0.08] rounded-tl-xs backdrop-blur-xl shadow-lg'
          }`}
        >
          {/* Attached Images Grid */}
          {images && images.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setLightBox(img)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="w-44 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 hover:scale-[1.02] transition shadow-md"
                  alt="attachment"
                />
              ))}
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none text-[13.5px] leading-relaxed select-text">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="font-['Space_Grotesk'] text-xl font-bold text-white mt-4 mb-2 tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-slate-100 mt-3 mb-2 tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-['Space_Grotesk'] text-base font-semibold text-slate-200 mt-2.5 mb-1 tracking-tight">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2.5 whitespace-pre-wrap break-words text-slate-200 leading-relaxed font-sans">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1 my-2 text-slate-300">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1 my-2 text-slate-300">{children}</ol>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-black/30">
                    <table className="min-w-full divide-y divide-white/10 text-xs">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-white/[0.04] px-3.5 py-2 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3.5 py-2 text-xs text-slate-300 border-t border-white/[0.04]">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1 font-medium"
                  >
                    {children}
                    <ExternalLink size={11} />
                  </a>
                ),
                code: ({ className, children }) => {
                  const value = String(children).trim();
                  if (!className) {
                    return (
                      <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-indigo-300 text-xs font-mono font-medium">
                        {value}
                      </code>
                    );
                  }
                  const language = className.replace('language-', '');
                  return (
                    <div className="my-3 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0c0f17] shadow-xl">
                      {/* Code Header Bar */}
                      <div className="flex items-center justify-between bg-[#131622] border-b border-white/[0.08] px-3.5 py-1.5">
                        <span className="uppercase text-[11px] font-mono font-semibold text-slate-400 tracking-wider">
                          {language}
                        </span>
                        <button
                          type="button"
                          aria-label="Copy code block"
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition cursor-pointer"
                          onClick={() => copyCode(value)}
                        >
                          {copiedCode === value ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        wrapLongLines
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: '14px',
                          background: '#090c12',
                          fontSize: '12.5px',
                          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)'
                        }}
                      >
                        {value}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                img: ({ src }) => {
                  if (!src) return null;
                  return (
                    <img
                      src={src}
                      onClick={() => setLightBox(src)}
                      loading="lazy"
                      onError={(e) => e.currentTarget.remove()}
                      className="max-h-72 rounded-xl object-contain border border-white/10 cursor-zoom-in hover:opacity-95 transition my-2 shadow-lg"
                      alt="generated visual"
                    />
                  );
                }
              }}
            >
              {content}
            </Markdown>
          </div>

          {/* Micro Action Buttons (Edit for user, Copy for both) */}
          <div
            className={`flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity select-none ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {isUser && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit message"
                title="Edit message"
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
              >
                <Edit2 size={12} />
              </button>
            )}

            <button
              type="button"
              onClick={copyFullMessage}
              aria-label="Copy message text"
              title="Copy message text"
              className={`p-1 rounded-lg transition cursor-pointer ${
                isUser
                  ? 'text-white/70 hover:text-white hover:bg-white/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
              }`}
            >
              {copiedMessage ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* User Avatar for User Messages */}
      {isUser && !isEditing && (
        <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 text-slate-300 mt-1">
          <User size={15} />
        </div>
      )}

      {/* Lightbox Modal for Images */}
      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <button
            aria-label="Close image preview"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition cursor-pointer"
            onClick={() => setLightBox(null)}
          >
            <X size={18} />
          </button>
          <img
            src={lightBox}
            alt="zoom view"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
