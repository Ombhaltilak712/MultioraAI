import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import Modal from './ui/Modal';

function RenameModal({ conversation, onConfirm, onClose }) {
  const [title, setTitle] = useState(conversation?.title || '');
  const [loading, setLoading] = useState(false);

  if (!conversation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onConfirm(conversation._id, title.trim());
      onClose();
    } catch (err) {
      console.error('Rename failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(conversation)}
      onClose={onClose}
      title="Rename Conversation"
      description="Update the title for this chat thread"
      icon={Edit2}
      iconVariant="indigo"
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
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-50"
          >
            <Check size={13} />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-xs font-medium text-slate-300">Conversation Title</label>
        <input
          type="text"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chat title..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition font-sans"
        />
      </form>
    </Modal>
  );
}

export default RenameModal;

