import { useState, useEffect } from 'react';
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  User,
  X,
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
  Share2,
  Folder,
  Settings
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import {
  addConversation,
  setConversations,
  setSelectedConversation,
  removeConversation,
  togglePinState,
  setConvTitle
} from '../redux/conversationSlice';
import { setMessages } from '../redux/messageSlice';
import { getConversations } from '../features/getConversations';
import { createConversation } from '../features/createConversation';
import { togglePinConversation } from '../features/togglePinConversation';
import { deleteConversation as apiDeleteConversation } from '../features/deleteConversation';
import { updateConversation } from '../features/updateConversation';
import logOut from '../features/logOut';
import { setUserdata } from '../redux/userSlice';
import BillingDrawer from './BillingDrawer';
import ShareModal from './ShareModal';
import DeleteModal from './DeleteModal';
import RenameModal from './RenameModal';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import Logo from './Logo';
import { Badge } from './ui';

function SideBar({ activeView = 'chat', onSelectView }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const { conversations, selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);

  const [showBilling, setShowBilling] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active Menu / Modals state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [shareTargetConv, setShareTargetConv] = useState(null);
  const [deleteTargetConv, setDeleteTargetConv] = useState(null);
  const [renameTargetConv, setRenameTargetConv] = useState(null);

  useEffect(() => {
    if (!userData?._id) return;
    const fetchConvs = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };
    fetchConvs();
  }, [userData?._id, dispatch]);

  const handleCreateNewChat = async () => {
    try {
      if (onSelectView) onSelectView('chat');
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
      const newConv = await createConversation();
      dispatch(addConversation(newConv));
      dispatch(setSelectedConversation(newConv));
      setMobileOpen(false);
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const handleTogglePin = async (e, conv) => {
    e.stopPropagation();
    setActiveMenuId(null);
    try {
      await togglePinConversation(conv._id);
      dispatch(togglePinState(conv._id));
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await apiDeleteConversation(id);
      dispatch(removeConversation(id));
      if (selectedConversation?._id === id) {
        dispatch(setSelectedConversation(null));
        dispatch(setMessages([]));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleRenameConfirm = async (id, newTitle) => {
    try {
      await updateConversation({ id, title: newTitle });
      dispatch(setConvTitle({ conversationId: id, title: newTitle }));
    } catch (err) {
      console.error('Rename error:', err);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Keyboard close for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const recentConversations = conversations.filter((c) => !c.isPinned);

  const renderChatItem = (conv) => {
    const isActive = selectedConversation?._id === conv?._id && activeView === 'chat';
    const isMenuOpen = activeMenuId === conv?._id;

    return (
      <div
        key={conv?._id}
        onClick={() => {
          if (onSelectView) onSelectView('chat');
          dispatch(setSelectedConversation(conv));
          setMobileOpen(false);
        }}
        className={`group flex items-center justify-between cursor-pointer mb-1 px-3 py-2.5 rounded-xl border transition-all duration-150 relative select-none ${
          isActive
            ? 'bg-indigo-500/[0.12] border-indigo-500/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`}
      >
        {/* Left Glowing Active Indicator */}
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-linear-to-b from-indigo-400 via-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
        )}

        <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-1">
          <div
            className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-white/[0.03] text-slate-500 group-hover:text-slate-400'
            }`}
          >
            {conv.isPinned ? (
              <Pin size={12} className="text-amber-400 rotate-45" />
            ) : (
              <MessageSquare size={12} />
            )}
          </div>
          <span className="text-[13px] font-medium truncate tracking-tight">{conv?.title || 'New Chat'}</span>
        </div>

        {/* 3-Dot Action Menu Button */}
        <div className="relative shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setActiveMenuId(isMenuOpen ? null : conv._id)}
            className={`p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.08] transition cursor-pointer ${
              isMenuOpen ? 'opacity-100 bg-white/[0.08] text-white' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <MoreVertical size={13} />
          </button>

          {/* Polished Glass Action Menu Popover */}
          {isMenuOpen && (
            <div className="absolute right-0 top-7 z-50 w-40 bg-[#12141f]/95 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-2xl p-1 flex flex-col gap-0.5 text-xs text-slate-300 shadow-black/80">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(null);
                  setRenameTargetConv(conv);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition text-left cursor-pointer"
              >
                <Edit2 size={12} className="text-slate-400" /> Rename
              </button>

              <button
                onClick={(e) => handleTogglePin(e, conv)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition text-left cursor-pointer"
              >
                <Pin size={12} className="text-amber-400" /> {conv.isPinned ? 'Unpin Chat' : 'Pin to Top'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(null);
                  setShareTargetConv(conv);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition text-left cursor-pointer"
              >
                <Share2 size={12} className="text-indigo-400" /> Share & Export
              </button>

              <div className="h-px bg-white/[0.06] my-0.5" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(null);
                  setDeleteTargetConv(conv);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-500/15 text-red-400 hover:text-red-300 transition text-left cursor-pointer"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Content renderer used in both desktop expanded and mobile slide-in
  const renderSidebarBody = () => (
    <div className="flex flex-col h-full bg-[#0a0c13]/90 backdrop-blur-2xl">
      {/* Header Branding */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <Logo size="sm" showWordmark />
        </div>

        <div className="flex items-center gap-1">
          <button
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse Sidebar"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={15} />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Primary Action Button: Animated Gradient "New Chat" */}
      <div className="px-3.5 pt-3.5 pb-2">
        <button
          className="w-full relative group flex items-center justify-center gap-2 text-xs font-semibold text-white rounded-xl py-2.5 bg-linear-to-r from-indigo-500 via-violet-600 to-indigo-600 shadow-[0_2px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_2px_22px_rgba(99,102,241,0.55)] transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.98]"
          onClick={handleCreateNewChat}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={15} className="shrink-0" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation Link: Personal Library */}
      <div className="px-3.5 pb-2">
        <button
          onClick={() => {
            if (onSelectView) onSelectView('library');
            setMobileOpen(false);
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
            activeView === 'library'
              ? 'bg-indigo-600/15 border border-indigo-500/30 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          <Folder
            size={15}
            className={activeView === 'library' ? 'text-indigo-400' : 'text-slate-500'}
          />
          <span>Personal Library</span>
        </button>
      </div>

      {/* Scrollable Conversation Lists Area */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="mb-3">
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Pin size={10} className="rotate-45 text-amber-400" />
              <span>Pinned Chats</span>
            </div>
            {pinnedConversations.map(renderChatItem)}
          </div>
        )}

        {/* Recents Section */}
        <div>
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {pinnedConversations.length > 0 ? 'Recent Chats' : 'Recents'}
          </div>
          {recentConversations.length === 0 && pinnedConversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-slate-500 font-mono">
              No conversations yet
            </div>
          ) : (
            recentConversations.map(renderChatItem)
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3.5 h-px bg-white/[0.06]" />

      {/* User Account / Footer Area */}
      <div className="px-3.5 py-3">
        {userData ? (
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.025] border border-white/[0.07] p-2 hover:border-white/15 transition shadow-sm">
            {/* User Avatar */}
            <div
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 rounded-xl overflow-hidden bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 cursor-pointer hover:border-indigo-500/50 transition relative group"
              title="View Profile"
            >
              {userData?.avatar && !imageError ? (
                <img
                  className="w-full h-full object-cover"
                  src={userData.avatar}
                  alt="Avatar"
                  onError={() => setImageError(true)}
                />
              ) : (
                <User size={15} className="text-slate-400" />
              )}
            </div>

            {/* User Details & Credits */}
            <div
              onClick={() => setShowProfile(true)}
              className="flex-1 min-w-0 cursor-pointer"
              title="View Profile"
            >
              <p className="text-xs font-semibold text-slate-100 truncate tracking-tight">
                {userData?.name || 'Multiora User'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="indigo" size="sm" className="px-1.5 py-0 text-[9px] uppercase font-mono">
                  {userData?.plan || 'Free'}
                </Badge>
                {/* Animated Credits Pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBilling(true);
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[9.5px] text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-1.5 py-0.5 rounded-full transition cursor-pointer"
                  title="View Credits & Top-Up"
                >
                  <Coins size={10} className="text-amber-400 animate-pulse" />
                  <span>{userData?.credits ?? 0}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions (Billing, Settings, LogOut) */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
                title="Settings"
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer"
              >
                <Settings size={13} />
              </button>

              <button
                onClick={async () => {
                  await logOut();
                  dispatch(setUserdata(null));
                }}
                aria-label="Log Out"
                title="Log Out"
                className="w-7 h-7 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center transition cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-2.5 transition">
            Login Required
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-30 flex items-center justify-center w-8 h-8 rounded-lg bg-[#090b12] border border-white/[0.12] text-slate-300 hover:text-white transition cursor-pointer shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={16} />
      </button>

      {/* Mobile Slide-in Drawer with Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] h-screen shadow-2xl border-r border-white/[0.08] overflow-hidden"
            >
              {renderSidebarBody()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Responsive Sidebar with Smooth Collapse Animation */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 270 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col h-screen shrink-0 border-r border-white/[0.08] overflow-hidden relative z-30"
      >
        {collapsed ? (
          /* Collapsed Mini Sidebar */
          <div className="flex flex-col items-center justify-between h-full w-full py-4 bg-[#0a0c13]/95 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-3">
              <button
                aria-label="Expand Sidebar"
                title="Expand Sidebar"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                onClick={() => setCollapsed(false)}
              >
                <PanelLeftOpen size={18} />
              </button>

              <button
                aria-label="New Chat"
                title="New Chat"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-white bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 transition cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                onClick={handleCreateNewChat}
              >
                <Plus size={18} />
              </button>

              <button
                aria-label="Personal Library"
                title="Personal Library"
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition cursor-pointer ${
                  activeView === 'library'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                onClick={() => onSelectView && onSelectView('library')}
              >
                <Folder size={17} />
              </button>
            </div>

            {/* Collapsed Footer Profile & Quick Access */}
            <div className="flex flex-col items-center gap-2.5">
              <button
                onClick={() => setShowBilling(true)}
                aria-label="Billing & Plans"
                title="Billing & Plans"
                className="w-8 h-8 rounded-lg text-amber-400 hover:bg-white/[0.08] flex items-center justify-center transition cursor-pointer"
              >
                <Coins size={16} />
              </button>

              <div
                onClick={() => setShowProfile(true)}
                title={userData?.name || 'Profile'}
                className="w-9 h-9 rounded-xl overflow-hidden bg-white/[0.06] border border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500/50 transition"
              >
                {userData?.avatar && !imageError ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User size={16} className="text-slate-400" />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Expanded Sidebar */
          renderSidebarBody()
        )}
      </motion.aside>

      {/* Slide-overs & Modals */}
      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {shareTargetConv && (
        <ShareModal
          conversation={shareTargetConv}
          messages={messages}
          onClose={() => setShareTargetConv(null)}
        />
      )}
      {deleteTargetConv && (
        <DeleteModal
          conversation={deleteTargetConv}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTargetConv(null)}
        />
      )}
      {renameTargetConv && (
        <RenameModal
          conversation={renameTargetConv}
          onConfirm={handleRenameConfirm}
          onClose={() => setRenameTargetConv(null)}
        />
      )}
    </>
  );
}

export default SideBar;
