import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

function DeleteModal({ conversation, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!conversation) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(conversation._id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#13151c] border border-red-500/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle size={20} />
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-100">Delete Conversation</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Are you sure you want to delete <span className="text-slate-200 font-medium font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">"{conversation.title || 'New Chat'}"</span>? All messages in this conversation will be permanently removed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
