import { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Download,
  Trash2,
  X,
  Moon,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#13151c] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Settings</h3>
              <p className="text-xs text-slate-400">Manage application preferences and account security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.06] bg-[#11131a] px-5">
          {[
            { id: 'general', label: 'General' },
            { id: 'security', label: 'Security' },
            { id: 'privacy', label: 'Data & Privacy' },
            { id: 'danger', label: 'Danger Zone', isDanger: true }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-medium border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? tab.isDanger
                    ? 'border-red-500 text-red-400'
                    : 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none]">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-200">Theme Appearance</span>
                <p className="text-xs text-slate-400">MultioraAI utilizes an ultra-sleek dark interface designed for focus.</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                    <Moon size={14} /> Dark Mode (Default)
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-200">Default AI Capability Mode</span>
                <p className="text-xs text-slate-400">Select which capability should be activated when starting new conversations.</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Auto', 'Chat', 'Coding', 'PDF', 'PPT', 'Vision', 'Search'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDefaultMode(mode.toLowerCase())}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer text-left ${
                        defaultMode === mode.toLowerCase()
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
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
            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Authentication Provider</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle size={10} /> Google OAuth Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Your account is secured via Google Authentication. Passwords and credentials are managed directly by Google.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">Active Sessions</span>
                </div>
                <p className="text-xs text-slate-400">
                  You are currently logged in with a cryptographically verified server-side session stored in Redis.
                </p>
              </div>
            </div>
          )}

          {/* DATA & PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Export Your Data</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Download an archive containing your profile, conversation history, and asset references in JSON format.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition cursor-pointer"
                  >
                    <Download size={14} /> Download Account Data (.json)
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-slate-200">Conversation Privacy</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Conversations and assets are private to your user account by default. Only conversations you explicitly share generate a public, read-only token.
                </p>
              </div>
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <div className="flex flex-col gap-4 border border-red-500/20 bg-red-500/[0.03] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={20} />
                <h4 className="text-sm font-bold tracking-tight">Delete MultioraAI Account</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This action is <strong className="text-red-400">permanent and irreversible</strong>. Proceeding will:
              </p>

              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>Permanently wipe all conversations and messages from the database.</li>
                <li>Remove all generated PDFs, presentations, and images from your Personal Library.</li>
                <li>Revoke all public shared links.</li>
                <li>Forfeit any remaining credits and cancel active subscriptions.</li>
                <li>Invalidate all active sessions and log you out immediately.</li>
              </ul>

              {deleteError && (
                <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs text-red-300">
                  {deleteError}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-red-500/20">
                <label className="text-xs text-slate-300 font-medium">
                  Type <strong className="text-red-400 font-mono">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="bg-black/50 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500"
                />

                <button
                  disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                  {isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
