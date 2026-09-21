import React from 'react';
import { tokenizeQuery } from '../utils/search';

interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Highlights matching tokens in text with vibrant cyan accent styling.
 */
export const HighlightMatch: React.FC<HighlightMatchProps> = ({
  text,
  query,
  className = '',
  highlightClassName = 'text-cyan-300 font-bold bg-cyan-950/60 px-0.5 rounded',
}) => {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create regex pattern to match any token (escaped)
  const escapedTokens = tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean);

  if (escapedTokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = tokens.some(
          (token) => token.toLowerCase() === part.toLowerCase()
        );
        return isMatch ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </span>
  );
};
