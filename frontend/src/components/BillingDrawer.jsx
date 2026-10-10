import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { Crown, X, History, Check, Sparkles } from 'lucide-react';
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
      getBillingHistory().then((data) => {
        if (!ignore) setHistory(data || []);
      }).catch(() => {});
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
        name: "MultioraAI",
        description: `${data?.plan?.name} Plan`,
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
          color: "#4F46E5"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Upgrade order error:', error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-full sm:w-[420px] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#12141c]">
              <div>
                <h2 className="text-white text-lg font-semibold tracking-tight">Billing & Plans</h2>
                <p className="text-slate-400 text-xs">Manage your MultioraAI subscription and credits</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <X size={16} className="text-slate-300" />
              </button>
            </div>

            {/* Current Plan Overview Card */}
            <div className="p-5 pb-3">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">Current Plan</span>
                    <h3 className="text-white text-xl font-bold uppercase mt-0.5">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Crown size={20} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Available Credits</span>
                    <span>
                      {userData?.credits ?? 0} / {userData?.totalCredits ?? 100}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Plans vs Billing History) */}
            <div className="flex border-b border-white/10 px-5 gap-4 bg-[#0d0f14]">
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === 'plans'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Available Plans
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <History size={13} />
                Billing History ({history.length})
              </button>
            </div>

            {/* Scrollable Tab Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 [scrollbar-width:none]">
              {activeTab === 'plans' ? (
                <>
                  {/* Starter Plan */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 relative hover:border-indigo-500/30 transition">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-base">Starter Plan</h3>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Popular
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-indigo-400 text-2xl font-bold">₹199</span>
                      <span className="text-xs text-slate-500">/ one-time</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">500 Credits added immediately to your balance</p>

                    <ul className="my-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> Fast AI Chat & Reasoning
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> Full Coding & Code Generation
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> AI PDF & PPT Generation
                      </li>
                    </ul>

                    <button
                      className="w-full rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
                      onClick={() => handleUpgrade("starter")}
                    >
                      Upgrade to Starter
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/[0.04] p-5 relative shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-base">Pro Plan</h3>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Sparkles size={10} /> Ultimate
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-indigo-400 text-2xl font-bold">₹499</span>
                      <span className="text-xs text-slate-500">/ one-time</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">1000 Credits added immediately to your balance</p>

                    <ul className="my-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> Priority Model Execution
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> High-Resolution Image Generation
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> Extended Presentation Slides & PDFs
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" /> Personal Library Cloud Storage
                      </li>
                    </ul>

                    <button
                      className="w-full rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
                      onClick={() => handleUpgrade("pro")}
                    >
                      Upgrade to Pro
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
                        className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between"
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
                          <p className="text-[10.5px] text-slate-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.credits} Credits
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">₹{tx.amount}</span>
                          <p className="text-[10px] text-slate-500">{tx.currency || 'INR'}</p>
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
