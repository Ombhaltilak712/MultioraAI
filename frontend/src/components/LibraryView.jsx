import { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  FileText,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Download,
  Trash2,
  Edit2,
  Eye,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  X,
  Calendar,
  HardDrive,
  ArrowLeft,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLibraryFiles, renameLibraryFile, deleteLibraryFile } from '../features/library';

function LibraryView({ onBackToChat }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [previewFile, setPreviewFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLibraryFiles({
        type: activeTab !== 'all' ? activeTab : undefined,
        search: search.trim() || undefined
      });
      setFiles(data || []);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    let ignore = false;
    getLibraryFiles({
      type: activeTab !== 'all' ? activeTab : undefined
    })
      .then((data) => {
        if (!ignore) {
          setFiles(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFiles();
  };

  const handleRename = async (id) => {
    if (!renameInput.trim()) return;
    try {
      const updated = await renameLibraryFile(id, renameInput.trim());
      setFiles((prev) => prev.map((f) => (f._id === id ? updated : f)));
      setEditingFile(null);
    } catch (err) {
      console.error('Failed to rename file:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file from your Library?')) return;
    try {
      await deleteLibraryFile(id);
      setFiles((prev) => prev.filter((f) => f._id !== id));
      if (previewFile?._id === id) setPreviewFile(null);
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'pdf':
        return {
          icon: FileText,
          label: 'PDF Document',
          textColor: 'text-rose-400',
          badgeClass: 'bg-rose-500/10 border-rose-500/25 text-rose-300',
          previewBg: 'from-rose-500/15 via-black/40 to-black/60'
        };
      case 'ppt':
        return {
          icon: Presentation,
          label: 'Presentation',
          textColor: 'text-amber-400',
          badgeClass: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
          previewBg: 'from-amber-500/15 via-black/40 to-black/60'
        };
      case 'image':
        return {
          icon: ImageIcon,
          label: 'Image Asset',
          textColor: 'text-emerald-400',
          badgeClass: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
          previewBg: 'from-emerald-500/15 via-black/40 to-black/60'
        };
      case 'code':
        return {
          icon: FileCode,
          label: 'Code / Script',
          textColor: 'text-cyan-400',
          badgeClass: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
          previewBg: 'from-cyan-500/15 via-black/40 to-black/60'
        };
      default:
        return {
          icon: FileText,
          label: 'Document',
          textColor: 'text-indigo-400',
          badgeClass: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300',
          previewBg: 'from-indigo-500/15 via-black/40 to-black/60'
        };
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter((f) =>
    search ? f.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const CATEGORIES = [
    { id: 'all', label: 'All Assets' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'ppt', label: 'Presentations' },
    { id: 'image', label: 'Images' },
    { id: 'document', label: 'Documents' }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#07090e] overflow-hidden text-slate-100 select-none">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between bg-[#0b0e17]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20">
            <Folder size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                Personal Library
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous storage for AI-generated slide decks, PDFs, vector diagrams, and source code.
            </p>
          </div>
        </div>

        {onBackToChat && (
          <button
            type="button"
            onClick={onBackToChat}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/[0.08] transition cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Chat</span>
          </button>
        )}
      </div>

      {/* Filter, Search & View Bar */}
      <div className="px-6 py-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-[#0c0f18]/80 backdrop-blur-sm shrink-0">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {CATEGORIES.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap border select-none ${
                  active
                    ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white border-white/20 shadow-md shadow-indigo-500/20'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input & Controls */}
        <div className="flex items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search library assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-60 bg-white/[0.03] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] transition"
            />
          </form>

          <button
            type="button"
            onClick={() => fetchFiles()}
            title="Refresh assets"
            className="w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-indigo-400' : ''} />
          </button>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none]">
        {loading ? (
          /* High-End Skeleton Loaders */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse flex flex-col gap-3"
                >
                  <div className="w-full h-36 rounded-xl bg-white/[0.04]" />
                  <div className="h-4 w-3/4 rounded-md bg-white/[0.05]" />
                  <div className="h-3 w-1/2 rounded-md bg-white/[0.03]" />
                  <div className="h-6 w-full rounded-lg bg-white/[0.02] mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-white/[0.04]" />
              ))}
            </div>
          )
        ) : filteredFiles.length === 0 ? (
          /* Empty State Screen */
          <div className="h-96 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            {/* Holographic Glowing Folder Graphic */}
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500/20 via-violet-500/20 to-cyan-400/15 blur-xl animate-pulse" />
              <div className="absolute -inset-2 rounded-full border border-dashed border-indigo-500/25 animate-[spin_20s_linear_infinite]" />
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-slate-500 shadow-xl">
                <Folder size={28} className="text-indigo-400" />
              </div>
            </div>

            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-1.5">
              No files located
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              When you prompt MultioraAI to generate slides, compile PDF briefs, or render images, they will automatically be catalogued in this vault.
            </p>

            {onBackToChat && (
              <button
                type="button"
                onClick={onBackToChat}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 cursor-pointer transition"
              >
                <Sparkles size={13} />
                <span>Start Creating in Chat</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Glass Cards Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const cfg = getTypeConfig(file.fileType);
              const Icon = cfg.icon;
              return (
                <div
                  key={file._id}
                  className="group flex flex-col bg-[#0b0e17]/80 hover:bg-[#111422]/90 border border-white/[0.07] hover:border-indigo-500/40 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden backdrop-blur-md justify-between select-none"
                >
                  {/* Card Thumbnail / Preview Frame */}
                  <div className="w-full h-36 rounded-xl bg-black/50 border border-white/[0.06] flex items-center justify-center mb-3 relative overflow-hidden group/img">
                    {file.fileType === 'image' ? (
                      <img
                        src={file.fileUrl}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-linear-to-b ${cfg.previewBg} flex flex-col items-center justify-center gap-2`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shadow-lg">
                          <Icon size={24} className={cfg.textColor} />
                        </div>
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                          {file.fileType}
                        </span>
                      </div>
                    )}

                    {/* Quick Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        title="Preview Asset"
                        className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
                      >
                        <Eye size={14} />
                      </button>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        title="Download Asset"
                        className="w-8 h-8 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Title & Renaming Flow */}
                  <div className="flex-1 min-w-0">
                    {editingFile?._id === file._id ? (
                      <div className="flex items-center gap-1.5 my-1">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          className="flex-1 bg-black/70 border border-indigo-500/70 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-sans"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleRename(file._id)}
                          className="px-2 py-1 bg-indigo-600 rounded-md text-[10.5px] font-semibold text-white hover:bg-indigo-500 cursor-pointer"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFile(null)}
                          className="px-2 py-1 bg-white/10 rounded-md text-[10.5px] text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <p
                        className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                    )}

                    {/* Metadata: Date & Size */}
                    <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-slate-500" />
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HardDrive size={11} className="text-slate-500" />
                        {formatSize(file.size)}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 mt-3">
                    <span
                      className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-md border font-semibold ${cfg.badgeClass}`}
                    >
                      {file.fileType}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFile(file);
                          setRenameInput(file.name);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(file._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Sleek Table List View */
          <div className="bg-[#0b0e17]/80 border border-white/[0.07] rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.07] text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] font-mono">
                <tr>
                  <th className="py-3.5 px-4">Asset</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredFiles.map((file) => {
                  const cfg = getTypeConfig(file.fileType);
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={file._id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${cfg.badgeClass}`}
                        >
                          <Icon size={14} />
                        </div>
                        <span className="font-medium text-slate-200 group-hover:text-white truncate max-w-xs">
                          {file.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] uppercase text-slate-400">
                        {file.fileType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {formatSize(file.size)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                            title="Preview"
                          >
                            <Eye size={13} />
                          </button>
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                            title="Download"
                          >
                            <Download size={13} />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFile(file);
                              setRenameInput(file.name);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(file._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-[#0e111a] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#121522]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {previewFile.fileType === 'pdf' ? (
                    <FileText size={16} className="text-rose-400 shrink-0" />
                  ) : previewFile.fileType === 'ppt' ? (
                    <Presentation size={16} className="text-amber-400 shrink-0" />
                  ) : previewFile.fileType === 'image' ? (
                    <ImageIcon size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <FileCode size={16} className="text-indigo-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate font-['Space_Grotesk']">
                    {previewFile.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewFile.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Content Preview */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50">
                {previewFile.fileType === 'image' ? (
                  <img
                    src={previewFile.fileUrl}
                    alt={previewFile.name}
                    className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10"
                  />
                ) : previewFile.fileType === 'pdf' ? (
                  <iframe
                    src={previewFile.fileUrl}
                    title={previewFile.name}
                    className="w-full h-[72vh] rounded-xl border border-white/10 bg-white"
                  />
                ) : (
                  <div className="text-center p-8 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-indigo-400">
                      <ExternalLink size={24} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      In-browser preview is not directly supported for this format.
                    </p>
                    <a
                      href={previewFile.fileUrl}
                      download
                      className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white cursor-pointer shadow-md"
                    >
                      Download to View Locally
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LibraryView;
