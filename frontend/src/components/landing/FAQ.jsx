import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading, Reveal, GlassCard } from '../ui';

const FAQS = [
  {
    q: 'What are specialized AI agents and how does Auto-router work?',
    a: 'Rather than forcing a single general LLM to handle diverse requests, MultioraAI orchestrates 7 fine-tuned agents (Coding, PDF, PPT, Vision, Search, Chat, and Auto-router). The Auto-router reads your prompt semantics and automatically selects the optimal agent to generate running software, multi-slide decks, documents, or research.'
  },
  {
    q: 'How do credits work and what happens when I need more?',
    a: 'Every new account receives 100 free credits upon sign in. Each generation request consumes credits according to the complexity of the agent and payload (such as vision analysis or presentation synthesis). When you run low, you can top up instantly via Razorpay for ₹199 (500 credits) or ₹499 (1000 credits), valid for a full 30 days.'
  },
  {
    q: 'Is my data, uploaded files, and conversation history private?',
    a: 'Yes, absolutely. All conversations, uploaded PDFs/images, and generated code artifacts are private to your authenticated user account. Sessions are cryptographically verified in Redis. Only when you explicitly toggle the "Public Share Link" option in a chat will a read-only token be generated for others.'
  },
  {
    q: 'What file formats are supported for uploads and generation?',
    a: 'You can upload PDF documents and image formats (PNG, JPG, WebP) directly through the chat composer or drag-and-drop. For generation, MultioraAI creates runnable HTML/CSS/JS artifacts with live preview, vectorized PDF documents, editable presentation slide structures, and high-fidelity vision summaries.'
  },
  {
    q: 'How does live code execution and Monaco integration work?',
    a: 'When the Coding Agent generates an artifact, MultioraAI parses the multi-file bundle (index.html, style.css, script.js) directly into an integrated Monaco editor (the same engine powering VS Code) and mounts an isolated, secure iframe sandbox with instant 60 FPS live preview.'
  },
  {
    q: 'Can I branch or edit my past queries without starting from scratch?',
    a: 'Yes! Hovering over any user message reveals an edit icon. When you edit and resubmit a message, MultioraAI prunes all downstream context from both the database and client memory, regenerating the subsequent response with your updated requirements.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 relative bg-[#06080e]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently asked questions about MultioraAI"
          gradientWords={['Frequently asked questions', 'MultioraAI']}
          description="Everything you need to know about agents, credit balances, artifact sandboxes, and data security."
          className="mb-14 md:mb-18"
        />

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={index} delay={index * 0.08} direction="up">
                <GlassCard
                  onClick={() => toggleFAQ(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFAQ(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  className={`p-5 sm:p-6 cursor-pointer transition-all duration-200 border focus-visible:outline-indigo-500 ${
                    isOpen
                      ? 'border-indigo-500/40 bg-indigo-500/[0.04]'
                      : 'border-white/[0.07] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm sm:text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2.5">
                      <HelpCircle
                        size={17}
                        className={isOpen ? 'text-indigo-400' : 'text-slate-500'}
                      />
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-4 border-t border-white/[0.06] mt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
