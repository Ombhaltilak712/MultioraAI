import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Crown, X, History, Check, Sparkles, Zap, Coins } from 'lucide-react';
import { useSelector } from 'react-redux';
import { createOrder } from '../features/createOrder';
import { verifyPayment } from '../features/verifyPayment';
import { getBillingHistory } from '../features/getBillingHistory';

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'history'

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getBillingHistory();
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to fetch billing history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (open) {
      getBillingHistory()
        .then((data) => {
          if (!ignore) setHistory(data || []);
        })
        .catch(() => {});
    }
    return () => {
      ignore = true;
    };
  }, [open]);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: 'MultioraAI',
        description: `${data?.plan?.name || plan} Plan`,
        order_id: data?.order?.id,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            loadHistory();
            window.location.reload();
          } catch (error) {
            console.error('Verification error:', error);
          }
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Upgrade order error:', error);
    }
  };

  const currentPlan = (userData?.plan || 'free').toLowerCase();
  const credits = userData?.credits ?? 0;
  const totalCredits = userData?.totalCredits ?? 100;
  const creditPercent = Math.min(100, Math.round((credits / (totalCredits || 1)) * 100));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Drawer with Spring Animation */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 h-screen w-full sm:w-[440px] bg-[#0c0e17] border-l border-white/[0.09] shadow-2xl flex flex-col text-slate-100 overflow-hidden select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.07] bg-[#10131f]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20">
                  <Crown size={17} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-base font-bold text-white tracking-tight">
                    Billing & Subscription
                  </h2>
                  <p className="text-xs text-slate-400">Scale credits and unlock priority agents</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Current Plan Card & Credit Meter */}
            <div className="p-5 pb-3 shrink-0">
              <div className="rounded-2xl bg-linear-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.09] p-4.5 relative overflow-hidden shadow-xl">
                {/* Ambient glow highlight */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />

                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Current Subscription
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase text-white tracking-tight">
                        {currentPlan}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold uppercase">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-md">
                    <Crown size={19} />
                  </div>
                </div>

                {/* Credit Progress Meter */}
                <div className="mt-4 relative z-10">
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Coins size={12} className="text-indigo-400" /> Available Credits
                    </span>
                    <span className="font-mono text-white font-bold">
                      {credits} <span className="text-slate-500 font-normal">/ {totalCredits}</span>
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${creditPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation Switcher */}
            <div className="flex border-b border-white/[0.06] px-5 gap-4 bg-[#090b11] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className={`py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'plans'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap size={13} />
                <span>Available Plans</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <History size={13} />
                <span>Billing History ({history.length})</span>
              </button>
            </div>

            {/* Scrollable Tab Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 [scrollbar-width:none]">
              {activeTab === 'plans' ? (
                <>
                  {/* Starter Plan Card */}
                  <div
                    className={`rounded-2xl border p-5 relative transition-all duration-200 ${
                      currentPlan === 'starter'
                        ? 'border-indigo-500/60 bg-indigo-500/[0.07] shadow-[0_0_25px_rgba(99,102,241,0.18)]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">Starter Plan</h3>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {currentPlan === 'starter' ? 'Current Plan' : 'Popular'}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="text-white text-2xl font-bold font-['Space_Grotesk']">₹199</span>
                      <span className="text-xs text-slate-400">/ one-time charge</span>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-1">
                      +500 Credits added immediately to your workspace
                    </p>

                    <ul className="my-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Fast AI Chat & Multi-modal Reasoning</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Full Coding Agent with Monaco Live Sandboxing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Automated PDF Synthesis & Slide Decks</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleUpgrade('starter')}
                      className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 py-2.5 text-xs font-semibold text-white transition cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-95"
                    >
                      {currentPlan === 'starter' ? 'Top-Up Starter Credits' : 'Upgrade to Starter'}
                    </button>
                  </div>

                  {/* Pro Plan Card */}
                  <div
                    className={`rounded-2xl border p-5 relative shadow-xl transition-all duration-200 ${
                      currentPlan === 'pro'
                        ? 'border-indigo-500/80 bg-indigo-500/[0.1] shadow-[0_0_30px_rgba(99,102,241,0.25)]'
                        : 'border-indigo-500/40 bg-indigo-500/[0.04] shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">Pro Plan</h3>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-linear-to-r from-indigo-500/20 to-violet-500/20 text-indigo-200 border border-indigo-500/40 flex items-center gap-1">
                        <Sparkles size={10} className="text-cyan-300" />
                        {currentPlan === 'pro' ? 'Current Plan' : 'Ultimate'}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="text-white text-2xl font-bold font-['Space_Grotesk']">₹499</span>
                      <span className="text-xs text-slate-400">/ one-time charge</span>
                    </div>
                    <p className="text-xs text-indigo-300 font-medium mt-1">
                      +1000 Credits added immediately with priority access
                    </p>

                    <ul className="my-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Priority Agent Routing & Lowest Latency</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>High-Resolution Vision & Diagram Synthesis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Extended Multi-Slide Presentations & Large PDFs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Unlimited Personal Library Asset Storage</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleUpgrade('pro')}
                      className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-700 hover:opacity-95 py-2.5 text-xs font-semibold text-white transition cursor-pointer shadow-lg shadow-indigo-500/35 active:scale-95"
                    >
                      {currentPlan === 'pro' ? 'Top-Up Pro Credits' : 'Upgrade to Pro'}
                    </button>
                  </div>
                </>
              ) : (
                /* Billing History Tab */
                <div className="space-y-3">
                  {loadingHistory ? (
                    <div className="p-8 text-center text-xs text-slate-500">Loading payment history...</div>
                  ) : history.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-2">
                      <History size={24} className="text-slate-600" />
                      <p className="text-xs text-slate-400">No payment records found.</p>
                      <p className="text-[11px] text-slate-600">Past upgrades and invoices will appear here.</p>
                    </div>
                  ) : (
                    history.map((tx) => (
                      <div
                        key={tx._id}
                        className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200 uppercase">
                              {tx.plan || 'Top-Up'}
                            </span>
                            <span
                              className={`text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                tx.status === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : tx.status === 'created'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 truncate max-w-[200px]">
                            ID: {tx.orderId || tx._id}
                          </p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5 font-mono">
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.credits} Credits
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white font-mono">₹{tx.amount}</span>
                          <p className="text-[10px] text-slate-500 uppercase">{tx.currency || 'INR'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;

