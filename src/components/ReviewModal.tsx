import React, { useEffect } from 'react';
import { X, Star, CheckCircle2, XCircle, ExternalLink, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { AITool } from '../types';
import { ToolLogo } from './ToolLogo';

interface ReviewModalProps {
  tool: AITool | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ tool, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0b0f1f] border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="review-modal-container"
      >
        {/* Top gradient glow bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                {tool.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-500/30 text-purple-300">
                {tool.pricing} ({tool.pricingStarting})
              </span>
              {tool.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/30 text-amber-300">
                  {tool.badge}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <ToolLogo
                toolName={tool.name}
                websiteUrl={tool.officialWebsiteUrl || tool.websiteUrl}
                customLogoUrl={tool.logoUrl}
                size="md"
              />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {tool.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-white">
                {tool.rating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-slate-400">
                Based on {tool.reviewCount.toLocaleString()} verified ratings
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            id="close-review-modal-btn"
            aria-label="Close review modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Editor's In-Depth Review */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive 2026 Editorial Review</span>
            </h3>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {tool.fullReview}
            </p>
          </div>

          {/* Pros & Cons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pros */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Strengths &amp; Pros</span>
              </h4>
              <ul className="space-y-2">
                {tool.pros.map((pro, index) => (
                  <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-1 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-3">
                <XCircle className="w-4 h-4" />
                <span>Limitations &amp; Cons</span>
              </h4>
              <ul className="space-y-2">
                {tool.cons.map((con, index) => (
                  <li key={index} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 mt-1 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Best For Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Who Should Use This Tool?</span>
            </h4>
            <p className="text-sm font-medium text-slate-200">
              {tool.bestFor}
            </p>
          </div>

          {/* Pricing breakdown summary */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Pricing Model</p>
              <p className="text-sm font-bold text-white">{tool.pricingStarting}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verified for US billing &amp; subscriptions</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 sm:p-8 pt-4 border-t border-slate-800 bg-[#080c18] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close Review
          </button>

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <span>Visit Official Site</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
