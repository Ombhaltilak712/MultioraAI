import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './ui/Modal';

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
    <Modal
      isOpen={Boolean(conversation)}
      onClose={onClose}
      title="Delete Conversation"
      description="This conversation will be permanently removed"
      icon={AlertTriangle}
      iconVariant="red"
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/25 transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={13} />
            <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-xs text-red-300 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-white bg-black/40 px-1.5 py-0.5 rounded border border-white/10 font-mono">"{conversation.title || 'New Chat'}"</span>?
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          All messages, code artifacts, attached files, and history associated with this chat will be permanently erased from your workspace.
        </p>
      </div>
    </Modal>
  );
}

export default DeleteModal;

