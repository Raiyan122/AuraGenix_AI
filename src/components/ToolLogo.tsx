import React, { useState, useEffect } from 'react';
import { getGoogleFaviconUrl, getDuckDuckGoFaviconUrl, getToolInitials } from '../utils/logoUtils';
import { getOfficialLogoUrl } from '../utils/brandLogos';

interface ToolLogoProps {
  toolName: string;
  websiteUrl: string;
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({
  toolName,
  websiteUrl,
  customLogoUrl,
  size = 'md',
  className = '',
}) => {
  // Ordered sequence of logo source attempts
  const officialUrl = getOfficialLogoUrl(toolName, websiteUrl, customLogoUrl);
  const googleFaviconUrl = getGoogleFaviconUrl(websiteUrl, 128);
  const duckDuckGoUrl = getDuckDuckGoFaviconUrl(websiteUrl);

  // Attempt tiers: 0 = official brand/vector, 1 = domain favicon, 2 = fallback service, 3 = monogram
  const [attemptIndex, setAttemptIndex] = useState<number>(0);

  // Deduplicate candidate URLs to ensure crisp transitions and avoid redundant retries
  const candidateUrls = Array.from(
    new Set([officialUrl, customLogoUrl, googleFaviconUrl, duckDuckGoUrl].filter(Boolean) as string[])
  );

  useEffect(() => {
    setAttemptIndex(0);
  }, [websiteUrl, customLogoUrl, toolName]);

  const currentSrc = candidateUrls[attemptIndex] || null;
  const isFailed = attemptIndex >= candidateUrls.length || !currentSrc;

  const initials = getToolInitials(toolName);

  // Dimension classes mapping
  const sizeStyles = {
    sm: {
      container: 'w-8 h-8 rounded-lg',
      image: 'w-5 h-5 rounded-md',
      text: 'text-xs',
    },
    md: {
      container: 'w-12 h-12 rounded-xl',
      image: 'w-8 h-8 rounded-lg',
      text: 'text-sm font-bold',
    },
    lg: {
      container: 'w-16 h-16 rounded-2xl',
      image: 'w-10 h-10 rounded-xl',
      text: 'text-base font-bold',
    },
    xl: {
      container: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl',
      image: 'w-16 h-16 sm:w-20 sm:h-20 rounded-xl',
      text: 'text-2xl sm:text-3xl font-extrabold',
    },
  }[size];

  const handleError = () => {
    setAttemptIndex((prev) => prev + 1);
  };

  return (
    <div
      className={`relative flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-[#0b1022] border border-slate-700/70 shadow-md overflow-hidden ${sizeStyles.container} ${className}`}
      title={`${toolName} official logo`}
    >
      {!isFailed && currentSrc ? (
        <img
          src={currentSrc}
          alt={`${toolName} logo`}
          className={`${sizeStyles.image} object-contain p-0.5 bg-white/[0.04] transition-transform duration-200 group-hover:scale-105`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        /* Styled fallback monogram badge */
        <span
          className={`tracking-tight font-mono text-cyan-400 select-none ${sizeStyles.text}`}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );
};

