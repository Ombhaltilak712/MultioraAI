import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import CapabilityStrip from '../components/landing/CapabilityStrip';
import HowItWorks from '../components/landing/HowItWorks';
import AgentsShowcase from '../components/landing/AgentsShowcase';
import Features from '../components/landing/Features';
import DeviceShowcase from '../components/landing/DeviceShowcase';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import { Spinner } from '../components/ui';

export default function Landing({ onGetStarted, loginLoading = false, loginError = null }) {
  // Scoped smooth scrolling via Lenis, cleanly destroyed on unmount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis;
    let rafId;

    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll failed to initialize:', e);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 selection:bg-indigo-500/40 selection:text-white relative overflow-x-hidden font-['Inter']">
      {/* Loading overlay during auth flow */}
      {loginLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex items-center gap-3 bg-[#0f1118] border border-white/[0.08] px-6 py-3.5 rounded-2xl shadow-2xl">
            <Spinner size="md" variant="indigo" />
            <span className="text-sm font-medium text-slate-200">Connecting to Google Auth...</span>
          </div>
        </div>
      )}

      {/* Optional Top Login Error Banner if auth fails */}
      {loginError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-300 shadow-2xl backdrop-blur-md animate-bounce">
          {loginError}
        </div>
      )}

      {/* 1. Sticky Glass Navbar */}
      <Navbar onGetStarted={onGetStarted} />

      {/* 2. Hero with Interactive 3D Agent Orb */}
      <Hero onGetStarted={onGetStarted} />

      {/* 3. Capability Strip Marquee */}
      <CapabilityStrip />

      {/* 4. How It Works (4 numbered steps with mock cards) */}
      <HowItWorks />

      {/* 5. 7 Agents Showcase (3D tilting cards) */}
      <AgentsShowcase />

      {/* 6. Bento Grid Features */}
      <Features />

      {/* 7. Pure CSS Device Showcase (Laptop + Mobile Phone) */}
      <DeviceShowcase />

      {/* 8. Pricing & Plans (Free, Starter, Pro) */}
      <Pricing onGetStarted={onGetStarted} />

      {/* 9. Animated FAQ Accordion */}
      <FAQ />

      {/* 10. Final CTA Card */}
      <FinalCTA onGetStarted={onGetStarted} />

      {/* 11. Platform Footer */}
      <Footer />
    </div>
  );
}
