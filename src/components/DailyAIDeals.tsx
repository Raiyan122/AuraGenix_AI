import React, { useState } from 'react';
import { 
  Tag, 
  Clock, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface AIDeal {
  id: string;
  toolName: string;
  tagline: string;
  category: string;
  discount: string;
  promoCode?: string;
  originalPrice: string;
  dealPrice: string;
  expiresIn: string;
  verified: boolean;
  officialUrl: string;
  badge: 'Exclusive' | 'Limited Time' | 'Popular' | 'Free Tier Upgrade';
}

const FEATURED_DEALS: AIDeal[] = [
  {
    id: 'deal-cursor',
    toolName: 'Cursor AI IDE',
    tagline: 'AI-first code editor built for lightning speed refactoring & autocomplete.',
    category: 'Coding & Dev',
    discount: '30% OFF',
    promoCode: 'AURAGENIX30',
    originalPrice: '$20/mo',
    dealPrice: '$14/mo',
    expiresIn: '48h 12m',
    verified: true,
    officialUrl: 'https://www.cursor.com',
    badge: 'Popular',
  },
  {
    id: 'deal-elevenlabs',
    toolName: 'ElevenLabs Voice AI',
    tagline: 'Photorealistic AI voice cloning & natural emotional speech synthesis.',
    discount: '50% OFF First 3 Mo',
    category: 'Audio & Music',
    promoCode: 'CREATORVOICE50',
    originalPrice: '$22/mo',
    dealPrice: '$11/mo',
    expiresIn: '3 days left',
    verified: true,
    officialUrl: 'https://elevenlabs.io',
    badge: 'Exclusive',
  },
  {
    id: 'deal-runway',
    toolName: 'Runway Gen-3 Alpha',
    tagline: 'Cinematic generative video production engine for film & advertising.',
    discount: '25% OFF Annual',
    category: 'Video Generation',
    promoCode: 'RUNWAYGEN2026',
    originalPrice: '$35/mo',
    dealPrice: '$26/mo',
    expiresIn: '5 days left',
    verified: true,
    officialUrl: 'https://runwayml.com',
    badge: 'Limited Time',
  },
  {
    id: 'deal-jasper',
    toolName: 'Jasper AI Marketing Suite',
    tagline: 'Autonomous AI campaign writer with built-in brand voice & SEO engine.',
    discount: '7-Day Unlimited Free Trial',
    category: 'Copywriting & Content',
    originalPrice: '$49/mo',
    dealPrice: '$0 Free Trial',
    expiresIn: 'Active Today',
    verified: true,
    officialUrl: 'https://www.jasper.ai',
    badge: 'Free Tier Upgrade',
  },
  {
    id: 'deal-midjourney',
    toolName: 'Midjourney v6.1 Pro',
    tagline: 'Leading hyper-realistic visual concept generator for designers.',
    discount: '20% OFF Yearly',
    category: 'Image Generation',
    promoCode: 'CREATIVE20',
    originalPrice: '$30/mo',
    dealPrice: '$24/mo',
    expiresIn: '6 days left',
    verified: true,
    officialUrl: 'https://www.midjourney.com',
    badge: 'Popular',
  },
  {
    id: 'deal-copyai',
    toolName: 'Copy.ai Workflows',
    tagline: 'End-to-end AI marketing and sales prospecting automation workflows.',
    discount: '40% OFF Team Plan',
    category: 'SEO & Marketing',
    promoCode: 'SCALETEAM40',
    originalPrice: '$49/mo',
    dealPrice: '$29/mo',
    expiresIn: 'Active Today',
    verified: true,
    officialUrl: 'https://www.copy.ai',
    badge: 'Exclusive',
  },
];

export const DailyAIDeals: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2500);
    } catch {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 shadow-sm">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Verified Daily AI Discounts &amp; Promo Codes (Updated Today)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Daily AI Deals &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-purple-400">Exclusive Discounts</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Save up to 50% on top-tier artificial intelligence software, developer credits, and creative suites. Every coupon is tested and verified daily by our editorial staff.
        </p>
      </div>

      {/* Top AdSense Banner to monetize discount shoppers */}
      <AdSenseUnit
        slotId="2233445566"
        type="horizontal-banner"
        format="auto"
        className="mb-8"
      />

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {FEATURED_DEALS.map((deal) => (
          <div
            key={deal.id}
            className="p-6 rounded-3xl bg-[#090e21] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c122b] transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Badge & Expiry row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950">
                  {deal.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                  <Clock className="w-3 h-3" />
                  {deal.expiresIn}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors mb-1">
                {deal.toolName}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {deal.tagline}
              </p>

              {/* Discount Box */}
              <div className="p-3 rounded-2xl bg-[#060a17] border border-cyan-500/30 flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Exclusive Savings</span>
                  <span className="text-lg font-black text-emerald-400">{deal.discount}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 line-through block">{deal.originalPrice}</span>
                  <span className="text-sm font-bold text-white">{deal.dealPrice}</span>
                </div>
              </div>

              {/* Coupon Code Section */}
              {deal.promoCode && (
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>Coupon Code</span>
                    {copiedCodeId === deal.id && <span className="text-emerald-400 font-bold">Copied!</span>}
                  </div>
                  <button
                    onClick={() => handleCopyCode(deal.id, deal.promoCode!)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-dashed border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="font-bold tracking-wider">{deal.promoCode}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* CTA Link */}
            <div className="pt-3 border-t border-slate-800/80">
              <a
                href={deal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 hover:opacity-95 text-center flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Claim Offer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom In-Article Ad Unit */}
      <AdSenseUnit
        slotId="3344556677"
        type="in-article"
        format="auto"
        className="my-8"
      />

      {/* Trust & Guarantee Box */}
      <div className="p-6 rounded-3xl bg-[#090d1f] border border-slate-800 text-center max-w-2xl mx-auto text-xs text-slate-400">
        <ShieldCheck className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
        <p className="leading-relaxed">
          AuraGenix AI verifies coupons directly with official partners. Some promotional links may support our free directory hosting via affiliate arrangements at no extra cost to you.
        </p>
      </div>
    </div>
  );
};
