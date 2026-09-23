import React, { useEffect, useRef, useState } from 'react';

/**
 * Global monetization switch for AuraGenix AI.
 * Set to `false` during Google AdSense review/approval phase to hide all empty frames,
 * placeholders, and "SPONSORED" labels.
 * Set to `true` once Google AdSense officially approves your account and ads start serving.
 */
export const ADS_ENABLED = false;

export type AdSlotType = 'in-article' | 'responsive-display' | 'horizontal-banner' | 'sidebar-sticky' | 'sticky-anchor';

interface AdSenseUnitProps {
  /** The AdSense ad unit slot ID from your Google AdSense dashboard */
  slotId?: string;
  /** Format of the ad: auto, fluid, rectangle, horizontal */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  /** Preset styling type for context */
  type?: AdSlotType;
  /** Optional layout key for In-Article and In-Feed ads */
  layoutKey?: string;
  /** Custom wrapper CSS class */
  className?: string;
  /** Whether to show a test placeholder if AdSense script is pending/blocked */
  showPlaceholderFallback?: boolean;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slotId = '1234567890', // Default fallback slot
  format = 'auto',
  type = 'responsive-display',
  layoutKey,
  className = '',
  showPlaceholderFallback = false,
}) => {
  // If ads are disabled (pending review), render nothing to prevent empty/broken ad frames
  if (!ADS_ENABLED) {
    return null;
  }

  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only push once per component mount
    if (pushedRef.current) return;

    try {
      // @ts-ignore
      const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
      adsbygoogle.push({});
      pushedRef.current = true;
      setAdLoaded(true);
    } catch (err) {
      setAdError(true);
      // Suppress adblocker warnings in console
    }
  }, []);

  return (
    <div
      className={`relative my-6 mx-auto w-full max-w-5xl rounded-2xl border border-slate-800/80 bg-[#070b18]/60 p-3 sm:p-4 transition-all text-center ${className}`}
      data-ad-type={type}
    >
      {/* Policy-compliant Ad Label */}
      <div className="flex items-center justify-between px-1 mb-2 text-[10px] font-mono tracking-widest uppercase text-slate-500">
        <span>Sponsored</span>
        <span>Advertisement</span>
      </div>

      {/* Google AdSense container with fixed minimum height to prevent CLS (Cumulative Layout Shift) */}
      <div className="relative min-h-[90px] sm:min-h-[120px] lg:min-h-[160px] flex items-center justify-center overflow-hidden rounded-xl bg-[#050813]">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-4470384705472631"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />

        {/* Development & Fallback preview badge (displays gracefully when AdSense is reviewing domain) */}
        {(!adLoaded || adError || showPlaceholderFallback) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Google AdSense Slot • {type.replace('-', ' ').toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Publisher ID: <code className="text-slate-400">ca-pub-4470384705472631</code> | High-RPM Native Fill
            </p>
          </div>
        )}
      </div>

      <div className="mt-1 text-[9px] text-slate-600 text-right pr-1">
        Google Verified Ad Slot
      </div>
    </div>
  );
};

/**
 * Sticky Mobile & Desktop Anchor Ad Unit (Google AdSense Anchor Ad Compliant)
 */
export const StickyAnchorAd: React.FC<{ slotId?: string }> = ({ slotId = '9876543210' }) => {
  const [closed, setClosed] = useState(false);

  if (!ADS_ENABLED || closed) return null;

  return (
    <aside 
      aria-label="Sponsored Anchor Advertisement"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#070b18]/95 backdrop-blur-xl border-t border-cyan-500/30 px-4 py-2 shadow-2xl transition-all"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 overflow-hidden min-h-[60px] flex items-center justify-center">
          <ins
            className="adsbygoogle block w-full"
            style={{ display: 'inline-block', minHeight: '50px' }}
            data-ad-client="ca-pub-4470384705472631"
            data-ad-slot={slotId}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
          {/* Subtle Dev indicator */}
          <div className="text-center py-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mr-2">[Advertisement]</span>
            <span className="text-xs text-cyan-300 font-medium">AuraGenix Premium Sponsor Space</span>
          </div>
        </div>

        <button
          onClick={() => setClosed(true)}
          className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex-shrink-0 cursor-pointer"
          title="Dismiss ad"
        >
          ✕ Close
        </button>
      </div>
    </aside>
  );
};
