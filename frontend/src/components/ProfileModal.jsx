import { useState } from 'react';
import { User, Mail, Shield, Coins, Calendar, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './ui/Modal';
import { updateProfile } from '../features/profile';
import { setUserdata } from '../redux/userSlice';

function ProfileModal({ onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.name || '');
  const [avatar, setAvatar] = useState(userData?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Display name cannot be empty');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const updatedUser = await updateProfile({
        name: name.trim(),
        avatar: avatar.trim()
      });
      dispatch(setUserdata(updatedUser));
      setMessage('Profile updated successfully!');
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="User Profile"
      description="Manage your account profile and credentials"
      icon={User}
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
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 select-none">
        {/* Alerts */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Avatar Preview & URL */}
        <div className="flex items-center gap-3.5 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/[0.04] border-2 border-indigo-500/30 flex items-center justify-center shrink-0 shadow-md">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <User size={22} className="text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/photo.png"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/60 font-mono"
            />
          </div>
        </div>

        {/* Display Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-300">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition"
          />
        </div>

        {/* Account Metadata Details */}
        <div className="grid grid-cols-2 gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3.5 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1">
              <Mail size={11} /> Email
            </span>
            <span className="text-slate-300 font-medium truncate">{userData?.email || 'N/A'}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1">
              <Shield size={11} /> Plan
            </span>
            <span className="text-indigo-400 font-bold uppercase tracking-wider">
              {userData?.plan || 'Free'}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1">
              <Coins size={11} /> Credits
            </span>
            <span className="text-slate-200 font-medium">{userData?.credits ?? 0} Credits</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1">
              <Calendar size={11} /> Joined
            </span>
            <span className="text-slate-400">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Active Member'}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileModal;

