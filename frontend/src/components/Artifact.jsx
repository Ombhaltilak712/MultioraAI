import { useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';

const Editor = lazy(() => import('@monaco-editor/react'));
import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
  RotateCw,
  Lock,
  Globe,
  FileCode,
  FileText,
  Braces,
  Terminal
} from 'lucide-react';

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  const [tab, setTab] = useState('code');
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  if (!artifacts || artifacts.length === 0) return null;

  const file = artifacts[0]?.files?.[activeFile];
  const htmlFile = artifacts[0]?.files?.find((f) => f.name === 'index.html');
  const cssFile = artifacts[0]?.files?.find((f) => f.name === 'style.css');
  const jsFile = artifacts[0]?.files?.find((f) => f.name === 'script.js');

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
     ${cssFile?.content || ''}
    </style>
</head>
<body>
 ${htmlFile?.content || ''} 
<script>
    ${jsFile?.content || ''}
</script>    
</body>
</html>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || '');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const detectLanguage = (fileName = '') => {
    const name = fileName.toLowerCase();
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.jsx')) return 'javascript';
    if (name.endsWith('.ts')) return 'typescript';
    if (name.endsWith('.tsx')) return 'typescript';
    if (name.endsWith('.json')) return 'json';
    if (name.endsWith('.py')) return 'python';
    if (name.endsWith('.java')) return 'java';
    if (name.endsWith('.cpp')) return 'cpp';
    if (name.endsWith('.c')) return 'c';
    return 'plaintext';
  };

  const getFileTabIcon = (fileName = '') => {
    const name = fileName.toLowerCase();
    if (name.endsWith('.html')) return <Globe size={13} className="text-orange-400" />;
    if (name.endsWith('.css')) return <Code2 size={13} className="text-sky-400" />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode size={13} className="text-amber-400" />;
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={13} className="text-blue-400" />;
    if (name.endsWith('.json')) return <Braces size={13} className="text-emerald-400" />;
    if (name.endsWith('.py')) return <Terminal size={13} className="text-yellow-400" />;
    return <FileText size={13} className="text-indigo-400" />;
  };

  const lineCount = (file?.content || '').split('\n').length;
  const charCount = (file?.content || '').length;

  const renderPanelContent = (onClose) => {
    return (
      <div className="flex flex-col h-full bg-[#0a0c13] select-none text-slate-200">
        {/* Panel Header */}
        <div className="h-14 px-4 border-b border-white/[0.07] flex items-center justify-between gap-3 shrink-0 bg-[#0c0e17]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
              onClick={onClose ?? (() => setCollapsed(true))}
              aria-label={onClose ? 'Close panel' : 'Collapse panel'}
              title={onClose ? 'Close' : 'Collapse panel'}
            >
              {onClose ? <X size={15} /> : <PanelRightClose size={16} />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Code2 size={13} />
              </div>
              <div className="truncate font-['Space_Grotesk'] text-xs font-semibold text-slate-100">
                {artifacts[0]?.title || 'Artifact Sandbox'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Copy Button with Glowing Success State */}
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy active file"
              title={copied ? 'Copied to clipboard!' : 'Copy active file'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.07]'
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-[11px] font-mono text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="text-[11px] font-mono hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Code / Preview Animated Tab Switcher */}
            {canPreview && (
              <div className="flex items-center bg-white/[0.04] border border-white/[0.08] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTab('code')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    tab === 'code'
                      ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Code2 size={12} />
                  <span>Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('preview')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    tab === 'preview'
                      ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File Tabs Bar (when in Code tab) */}
        {tab === 'code' && (
          <div className="flex h-10 border-b border-white/[0.07] bg-[#080a10] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
            {artifacts[0]?.files?.map((f, index) => {
              const isActive = activeFile === index;
              return (
                <button
                  key={f?.name || index}
                  type="button"
                  onClick={() => setActiveFile(index)}
                  className={`flex items-center gap-2 px-3.5 text-xs font-medium whitespace-nowrap transition-all border-r border-white/[0.05] relative cursor-pointer ${
                    isActive
                      ? 'bg-[#0e111a] text-indigo-300 font-semibold'
                      : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                  }`}
                >
                  {getFileTabIcon(f?.name)}
                  <span className="font-mono text-[11.5px]">{f?.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFileTabGlow"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content: Monaco Editor or Browser-Framed Preview */}
        <div className="flex-1 overflow-hidden relative">
          {tab === 'preview' && canPreview ? (
            /* Browser-Style Frame around Live Preview */
            <motion.div
              key="preview-panel"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col bg-[#0d1017] p-2.5 sm:p-3.5"
            >
              <div className="w-full h-full rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col bg-white shadow-2xl">
                {/* Traffic-Light Dots + Fake Browser Address Bar */}
                <div className="h-10 bg-[#121520] border-b border-white/[0.08] px-3.5 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/20" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/20" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/20" />
                  </div>

                  {/* Browser Address Bar */}
                  <div className="flex-1 max-w-sm mx-auto h-6 rounded-lg bg-black/40 border border-white/[0.06] px-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Lock size={10} className="text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-300">sandbox://preview/index.html</span>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold shrink-0">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => setPreviewKey((k) => k + 1)}
                      aria-label="Reload sandbox preview"
                      title="Reload sandbox preview"
                      className="p-1 rounded-md hover:text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>
                </div>

                {/* Live Sandbox Iframe */}
                <div className="flex-1 relative bg-white">
                  <iframe
                    key={previewKey}
                    title="sandbox preview"
                    srcDoc={previewDoc}
                    sandbox="allow-scripts"
                    className="w-full h-full border-none"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            /* Monaco Editor View */
            <motion.div
              key="editor-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full text-xs font-mono text-slate-500">
                      Loading code editor...
                    </div>
                  }
                >
                  <Editor
                    theme="vs-dark"
                    language={detectLanguage(file?.name)}
                    value={file?.content || ''}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 },
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                      fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)'
                    }}
                  />
                </Suspense>
              </div>

              {/* IDE Status Bar */}
              <div className="h-6 px-3 bg-[#08090f] border-t border-white/[0.06] flex items-center justify-between text-[10.5px] font-mono text-slate-500 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 uppercase font-semibold">
                    {detectLanguage(file?.name)}
                  </span>
                  <span>{lineCount} lines</span>
                  <span>{charCount} chars</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400">UTF-8</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-medium">Ready</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Floating Trigger Button */}
      <button
        type="button"
        aria-label="View Code Artifact"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-white text-xs font-semibold shadow-xl shadow-indigo-500/25 border border-white/20 cursor-pointer transition active:scale-95"
      >
        <Code2 size={14} />
        <span>View Code</span>
      </button>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[92vw] max-w-[460px] border-l border-white/[0.08] shadow-2xl overflow-hidden"
            >
              {renderPanelContent(() => setMobileOpen(false))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Resizable/Collapsible Panel */}
      <motion.div
        initial={{ width: 440 }}
        animate={{ width: collapsed ? 52 : 440 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex h-full border-l border-white/[0.08] flex-col overflow-hidden shrink-0 shadow-2xl relative"
      >
        {!collapsed ? (
          renderPanelContent()
        ) : (
          /* Collapsed Mini Rail */
          <div className="h-full bg-[#090b11] flex flex-col items-center py-4 gap-4 shrink-0 select-none">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer border border-white/[0.06]"
              onClick={() => setCollapsed(false)}
              aria-label="Expand artifact panel"
              title="Expand artifact panel"
            >
              <PanelRightOpen size={16} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center min-w-0">
              <div
                className="text-[11px] font-['Space_Grotesk'] font-semibold text-slate-500 hover:text-indigo-300 tracking-wider uppercase whitespace-nowrap cursor-pointer transition"
                style={{
                  writingMode: 'vertical-lr',
                  transform: 'rotate(180deg)'
                }}
                onClick={() => setCollapsed(false)}
              >
                {artifacts[0]?.title || 'Artifact'}
              </div>
            </div>

            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        )}
      </motion.div>
    </>
  );
}

export default Artifact;
