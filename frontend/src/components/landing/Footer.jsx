import Logo from '../Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#040508] py-14 relative text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Col 1 & 2: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" glow />
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Autonomous multi-agent AI workspace designed for building web applications, compiling
              executive presentations, generating technical reports, and synthesizing multimodal intelligence.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Engineered with React 19 • Tailwind CSS v4 • Three.js • Motion
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Agents', href: '#agents' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Features', href: '#features' },
                { label: 'Device Showcase', href: '#showcase' },
                { label: 'Pricing & Plans', href: '#pricing' },
                { label: 'FAQ', href: '#faq' }
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: AI Agents */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Specialized Agents
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition">Auto-Router Engine</li>
              <li className="hover:text-white transition">Coding & Artifact Agent</li>
              <li className="hover:text-white transition">Presentation Deck (PPT) Agent</li>
              <li className="hover:text-white transition">PDF Document Authoring</li>
              <li className="hover:text-white transition">Computer Vision Analysis</li>
              <li className="hover:text-white transition">Grounded Live Search</li>
            </ul>
          </div>

          {/* Col 5: Security & Platform */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Security & Privacy
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition">Google OAuth 2.0</li>
              <li className="hover:text-white transition">Razorpay Encrypted Payments</li>
              <li className="hover:text-white transition">Redis Session Vault</li>
              <li className="hover:text-white transition">Ephemeral Monaco Sandbox</li>
              <li className="hover:text-white transition">Signed Public Share URLs</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {currentYear} MultioraAI. All rights reserved.</p>
          <p className="text-[11px]">
            Dark Command Center UI • Designed for high-velocity workflows
          </p>
        </div>
      </div>
    </footer>
  );
}
