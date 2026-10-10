import { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Download,
  Trash2,
  Moon,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './ui/Modal';
import { deleteAccount } from '../features/profile';
import { setUserdata } from '../redux/userSlice';
import { logOut } from '../features/logOut';

function SettingsModal({ onClose }) {
  const { userData } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('general');
  const [defaultMode, setDefaultMode] = useState('auto');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleExportData = () => {
    const data = {
      user: {
        id: userData?._id,
        name: userData?.name,
        email: userData?.email,
        plan: userData?.plan,
        credits: userData?.credits
      },
      conversations: conversations.map((c) => ({
        id: c._id,
        title: c.title,
        isPinned: c.isPinned,
        createdAt: c.createdAt
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multiora-account-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      await logOut();
      dispatch(setUserdata(null));
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Delete account failed:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const TABS = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Data & Privacy' },
    { id: 'danger', label: 'Danger Zone', isDanger: true }
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Settings"
      description="Manage workspace preferences, security & data"
      icon={Settings}
      iconVariant="indigo"
      maxWidth="xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition cursor-pointer"
        >
          Done
        </button>
      }
    >
      <div className="flex flex-col gap-4 select-none">
        {/* Tab Pills Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-x-auto [scrollbar-width:none]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? tab.isDanger
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : tab.isDanger
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-4 pt-1">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-200">Theme Appearance</span>
                <p className="text-xs text-slate-400">MultioraAI utilizes a high-contrast dark command center optimized for visual clarity.</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/15 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
                    <Moon size={13} /> Dark Mode (Active)
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-200">Default Agent Mode</span>
                <p className="text-xs text-slate-400">Select which specialized agent should be selected when opening new chats.</p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['Auto', 'Chat', 'Coding', 'PDF', 'PPT', 'Vision', 'Search'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setDefaultMode(mode.toLowerCase())}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer text-center ${
                        defaultMode === mode.toLowerCase()
                          ? 'bg-linear-to-r from-indigo-500 to-violet-600 border-white/20 text-white shadow-md'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Authentication</span>
                  </div>
                  <span className="text-[10.5px] font-medium text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 flex items-center gap-1 font-mono">
                    <CheckCircle size={10} /> Google OAuth Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authentication tokens are generated securely via Google Identity Services and verified by our backend gateway.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">Session Storage</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your session is backed by authenticated JWTs stored with strict cross-origin policies.
                </p>
              </div>
            </div>
          )}

          {/* DATA & PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="flex flex-col gap-3.5">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Export Workspace Archive</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Download an export containing your user metadata and conversation history in standard JSON format.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-xs font-semibold text-white transition cursor-pointer shadow-md"
                  >
                    <Download size={13} />
                    <span>Download Archive (.json)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-1.5">
                <h4 className="text-xs font-semibold text-slate-200">Privacy Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Private conversations and files are never used to train global public models without your explicit consent.
                </p>
              </div>
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <div className="flex flex-col gap-3.5 border border-red-500/25 bg-red-500/[0.04] rounded-2xl p-4.5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                <h4 className="text-sm font-bold tracking-tight">Delete MultioraAI Account</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This action is <strong className="text-red-400">permanent and irreversible</strong>. Proceeding will:
              </p>

              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>Permanently purge all conversations, chats, and messages.</li>
                <li>Remove all files and documents in your Personal Library.</li>
                <li>Invalidate all public shared links.</li>
                <li>Forfeit any remaining credit balances.</li>
              </ul>

              {deleteError && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-300">
                  {deleteError}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-1 pt-3 border-t border-red-500/20">
                <label className="text-xs text-slate-300 font-medium">
                  Type <strong className="text-red-400 font-mono">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="bg-black/60 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 font-mono"
                />

                <button
                  type="button"
                  disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition cursor-pointer shadow-lg shadow-red-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;

