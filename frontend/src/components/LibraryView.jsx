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
  HardDrive
} from 'lucide-react';
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
    }).then((data) => {
      if (!ignore) {
        setFiles(data || []);
        setLoading(false);
      }
    }).catch(() => {
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

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-400" />;
      case 'ppt':
        return <Presentation size={20} className="text-orange-400" />;
      case 'image':
        return <ImageIcon size={20} className="text-emerald-400" />;
      case 'code':
        return <FileCode size={20} className="text-cyan-400" />;
      default:
        return <FileText size={20} className="text-indigo-400" />;
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

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0d0f14] overflow-hidden text-white">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white shadow-lg">
            <Folder size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">Personal Library</h1>
            <p className="text-xs text-slate-500">Your AI-generated PDFs, presentations, images, and documents</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToChat && (
            <button
              onClick={onBackToChat}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
            >
              Back to Chat
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3.5 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-[#11131a]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'pdf', label: 'PDFs' },
            { id: 'ppt', label: 'Presentations' },
            { id: 'image', label: 'Images' },
            { id: 'document', label: 'Documents' }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Layout Toggles */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 md:w-64 bg-white/[0.03] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </form>

          <button
            onClick={() => fetchFiles()}
            title="Refresh"
            className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display Area */}
      <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none]">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-500">
            <RefreshCw size={24} className="animate-spin text-indigo-500" />
            <span className="text-xs">Loading library assets...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-600">
              <Folder size={28} />
            </div>
            <h3 className="text-base font-semibold text-slate-300">No files found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Any PDFs, PPT presentations, or images you generate with MultioraAI will automatically be saved and organized here.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className="group flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-indigo-500/30 rounded-2xl p-4 transition-all duration-150 relative overflow-hidden"
              >
                {/* Visual Preview / Thumbnail */}
                <div className="w-full h-36 rounded-xl bg-black/40 border border-white/[0.04] flex items-center justify-center mb-3 relative overflow-hidden group/img">
                  {file.fileType === 'image' ? (
                    <img
                      src={file.fileUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition duration-300 cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      {getFileIcon(file.fileType)}
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {file.fileType}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewFile(file)}
                      title="Preview"
                      className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      title="Download"
                      className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                </div>

                {/* File Details */}
                <div className="flex-1 min-w-0">
                  {editingFile?._id === file._id ? (
                    <div className="flex items-center gap-1.5 my-1">
                      <input
                        type="text"
                        value={renameInput}
                        onChange={(e) => setRenameInput(e.target.value)}
                        className="flex-1 bg-black/50 border border-indigo-500/50 rounded px-2 py-1 text-xs text-white outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(file._id)}
                        className="px-2 py-1 bg-indigo-600 rounded text-[10px] text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingFile(null)}
                        className="px-2 py-1 bg-white/10 rounded text-[10px] text-slate-300"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white" title={file.name}>
                      {file.name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HardDrive size={11} />
                      {formatSize(file.size)}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-2.5 mt-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400">
                    {file.fileType}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFile(file);
                        setRenameInput(file.name);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition"
                      title="Rename"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-semibold uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      {getFileIcon(file.fileType)}
                      <span className="font-medium text-slate-200 truncate max-w-xs">{file.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono uppercase">{file.fileType}</td>
                    <td className="py-3 px-4 text-slate-400">{formatSize(file.size)}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </button>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                          title="Download"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingFile(file);
                            setRenameInput(file.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                          title="Rename"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(file._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="w-full max-w-4xl bg-[#13151c] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile.fileType)}
                <span className="text-sm font-semibold text-slate-200">{previewFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white flex items-center gap-1"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40">
              {previewFile.fileType === 'image' ? (
                <img
                  src={previewFile.fileUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
                />
              ) : previewFile.fileType === 'pdf' ? (
                <iframe
                  src={previewFile.fileUrl}
                  title={previewFile.name}
                  className="w-full h-[70vh] rounded-xl border border-white/10"
                />
              ) : (
                <div className="text-center p-8 flex flex-col items-center gap-3">
                  {getFileIcon(previewFile.fileType)}
                  <p className="text-sm text-slate-300">Preview not directly available for this format.</p>
                  <a
                    href={previewFile.fileUrl}
                    download
                    className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white"
                  >
                    Download to Open
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibraryView;
