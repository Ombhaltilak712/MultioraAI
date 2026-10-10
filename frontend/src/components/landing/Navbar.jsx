import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import Logo from '../Logo';
import { GlowButton, Badge } from '../ui';

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Agents', href: '#agents' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05060a]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & New Pill */}
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#hero" onClick={(e) => handleScrollTo(e, '#hero')} className="cursor-pointer">
            <Logo size="md" glow />
          </a>

          <a
            href="#agents"
            onClick={(e) => handleScrollTo(e, '#agents')}
            className="hidden sm:inline-flex"
          >
            <Badge
              variant="gradient"
              dot
              ping
              size="sm"
              className="hover:border-indigo-400/50 transition cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Sparkles size={10} className="text-cyan-300 mr-1" />
              New: Auto Agent Routing
            </Badge>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <GlowButton
            variant="ghost"
            size="sm"
            onClick={onGetStarted}
            className="text-slate-300 hover:text-white"
          >
            Sign In
          </GlowButton>
          <GlowButton
            variant="primary"
            size="sm"
            magnetic
            onClick={onGetStarted}
            icon={ArrowRight}
            iconPosition="right"
          >
            Get Started
          </GlowButton>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 flex items-center justify-center transition hover:text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b12]/95 backdrop-blur-2xl px-5 pt-4 pb-6 mt-3 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-medium text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.05] transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="h-px bg-white/[0.06] my-1" />

          <div className="flex flex-col gap-2 pt-1">
            <GlowButton
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Get Started Free
            </GlowButton>
            <GlowButton
              variant="secondary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
              className="w-full"
            >
              Sign In with Google
            </GlowButton>
          </div>
        </div>
      )}
    </header>
  );
}
