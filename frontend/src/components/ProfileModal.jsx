import { useState } from 'react';
import { User, Mail, Shield, Coins, Calendar, Check, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">User Profile</h3>
              <p className="text-xs text-slate-400">View and update your personal account details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-1.5">
            <Check size={14} />
            {message}
          </div>
        )}
        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Preview & URL */}
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/[0.06] border-2 border-indigo-500/30 flex items-center justify-center shrink-0">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Read-Only Account Details */}
          <div className="grid grid-cols-2 gap-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Mail size={11} /> Email
              </span>
              <span className="text-slate-300 font-medium truncate">{userData?.email || 'N/A'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Shield size={11} /> Plan
              </span>
              <span className="text-indigo-400 font-semibold uppercase">{userData?.plan || 'Free'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Coins size={11} /> Credits
              </span>
              <span className="text-slate-200 font-medium">{userData?.credits ?? 0} Available</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={11} /> Joined
              </span>
              <span className="text-slate-400">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
