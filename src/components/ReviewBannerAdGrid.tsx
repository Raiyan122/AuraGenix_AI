import React, { useEffect, useRef } from 'react';
import { ADS_ENABLED } from './AdSenseUnit';

export interface BannerAdConfig {
  label: string;
  adName: string;
  slotId: string;
  comment: string;
}

export const VERIFIED_BANNER_ADS: BannerAdConfig[] = [
  {
    label: 'Ad 3',
    adName: 'Display Unit (Ad 3)',
    slotId: '5412644129',
    comment: '<!-- ad 3 -->'
  },
  {
    label: 'Ad 2',
    adName: 'Display Unit (Ad 2)',
    slotId: '8641531988',
    comment: '<!-- ad 2 -->'
  },
  {
    label: 'Ad 4',
    adName: 'Display Unit (Ad 4)',
    slotId: '3005972636',
    comment: '<!-- ad 4 -->'
  },
  {
    label: 'Ad 5',
    adName: 'Display Unit (Ad 5)',
    slotId: '4127482616',
    comment: '<!-- ad 5 -->'
  }
];

interface ReviewBannerAdGridProps {
  className?: string;
}

/**
 * Individual Ad Slot Container that safely initializes Google AdSense once mounted
 */
const SingleBannerAdSlot: React.FC<{ ad: BannerAdConfig; index: number }> = ({ ad, index }) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
        adsbygoogle.push({});
        initializedRef.current = true;
      }
    } catch {
      // Handled silently to avoid breaking execution if an adblocker is active
    }
  }, []);

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl bg-[#080c1b]/80 border border-slate-800/80 hover:border-cyan-500/30 p-3 sm:p-4 transition-all duration-200 shadow-lg min-h-[170px]"
      id={`banner-slot-${ad.slotId}`}
    >
      {/* Top Label with specific Ad Identifier */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-[9px] font-mono tracking-wider uppercase text-slate-500">
        <span className="text-slate-400 font-medium">Sponsored</span>
        <span className="text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
          {ad.label}
        </span>
      </div>

      {/* Google AdSense Responsive Ad Unit Container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-[#050814]/70 border border-slate-800/40 p-1 min-h-[110px]">
        {/* Exact Google AdSense <ins> markup matching requested configuration */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-4470384705472631"
          data-ad-slot={ad.slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Discreet Dark Theme Fallback preview for adblockers / before ads fill */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-2 text-center opacity-40 group-hover:opacity-60 transition-opacity"
          aria-hidden="true"
        >
          <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-mono mb-1">
            AI
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            {ad.adName}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
            Slot ID: {ad.slotId}
          </span>
        </div>
      </div>

      {/* Bottom Publisher Verification & Ad Label */}
      <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        <span>Slot #{index + 1}</span>
        <span>Google AdSense</span>
      </div>
    </div>
  );
};

export const ReviewBannerAdGrid: React.FC<ReviewBannerAdGridProps> = ({ className = '' }) => {
  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 ${className}`}
      aria-label="Sponsored Partner Resources"
    >
      {/* Section Sub-Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Verified Partner Recommendations
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
          Advertisement
        </span>
      </div>

      {/* 4-Banner Responsive Grid: 4 columns on desktop (Ad 3, Ad 2, Ad 4, Ad 5), 2x2 on tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VERIFIED_BANNER_ADS.map((ad, index) => (
          <SingleBannerAdSlot key={ad.slotId} ad={ad} index={index} />
        ))}
      </div>
    </div>
  );
};
