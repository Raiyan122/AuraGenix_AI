import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenReportIssue?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenReportIssue,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#05070e] border-t border-slate-800/80 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-[#090d1b] rounded-[11px] overflow-hidden flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="AuraGenix AI Logo" 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                AuraGenix <span className="text-cyan-400">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier US directory and benchmark index for artificial intelligence software in 2026. Empowering developers, founders, and marketers to choose with clarity.
            </p>

            <div className="flex items-center gap-2 text-xs text-cyan-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Independent Editorial Reviews</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#/category/coding-dev" className="hover:text-cyan-300 transition-colors">Coding &amp; LLM IDEs</a></li>
              <li><a href="#/category/video-generation" className="hover:text-cyan-300 transition-colors">Generative Video &amp; VFX</a></li>
              <li><a href="#/category/legal-ai" className="hover:text-cyan-300 transition-colors">Legal AI &amp; Contracts</a></li>
              <li><a href="#/category/finance-ai" className="hover:text-cyan-300 transition-colors">Finance AI &amp; Quant Alpha</a></li>
              <li><a href="#/category/image-generation" className="hover:text-cyan-300 transition-colors">Photorealistic Image Gen</a></li>
              <li><a href="#/category/seo-marketing" className="hover:text-cyan-300 transition-colors">SEO &amp; Growth Intelligence</a></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-cyan-300 transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-cyan-300 transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-cyan-300 transition-colors text-left cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenReportIssue || onOpenContact} 
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-amber-400/90 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Report an Issue</span>
                </button>
              </li>
              <li>
                <a href="#tools-grid" className="hover:text-cyan-300 transition-colors">
                  Editorial Guidelines
                </a>
              </li>
              <li>
                <a href="#tools-grid" className="hover:text-cyan-300 transition-colors">
                  Submit Your AI Tool
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Weekly AI Intelligence Drop
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join 42,000+ US tech professionals receiving our Sunday breakdown of breakout AI tools and model updates.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>You're on the VIP list! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-500">No spam. Unsubscribe at any time.</p>
          </div>

        </div>

        {/* Bottom bar: Copyright & Made with care */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 AuraGenix AI. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={onOpenContact} className="hover:text-slate-300 transition-colors cursor-pointer">
              Contact Us
            </button>
            <span>•</span>
            <button onClick={onOpenReportIssue || onOpenContact} className="hover:text-amber-300 transition-colors cursor-pointer">
              Report an Issue
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
