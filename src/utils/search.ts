import { AITool, ToolCategory, PricingType } from '../types';

export interface SearchMatch {
  tool: AITool;
  score: number;
}

export const POPULAR_SEARCH_TERMS = [
  'ChatGPT',
  'Claude 3.7',
  'Cursor',
  'Midjourney',
  'Runway Gen-3',
  'Perplexity',
  'Coding & Dev',
  'Video Generation',
  'Free AI Tools',
  'DeepSeek'
];

/**
 * Normalizes and splits search string into non-empty lowercase tokens.
 */
export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/[\s,+/]+/)
    .filter((token) => token.length > 0);
}

/**
 * Evaluates whether a tool matches all query tokens and computes a relevance score.
 * Multi-token matching guarantees dynamic reduction (adding words progressively narrows results).
 */
export function scoreToolMatch(tool: AITool, tokens: string[], rawQuery: string): number | null {
  if (tokens.length === 0) return 100;

  const normalizedQuery = rawQuery.toLowerCase().trim();
  const nameLower = tool.name.toLowerCase();
  const catLower = tool.category.toLowerCase();
  const taglineLower = (tool.shortTagline || tool.shortDescription || '').toLowerCase();
  const descLower = (tool.detailedDescription || tool.fullReview || '').toLowerCase();
  const bestForLower = (tool.bestFor || '').toLowerCase();
  const pricingLower = (tool.pricingModel || tool.pricing || '').toLowerCase();
  const tagsLower = tool.tags.map((t) => t.toLowerCase());
  const badgeLower = (tool.badge || '').toLowerCase();

  // Combine full text corpus for token verification
  const fullCorpus = `${nameLower} ${catLower} ${taglineLower} ${descLower} ${bestForLower} ${pricingLower} ${tagsLower.join(' ')} ${badgeLower}`;

  // Every token must match somewhere in the tool
  for (const token of tokens) {
    if (!fullCorpus.includes(token)) {
      return null; // Excluded: token missing
    }
  }

  // Calculate refined relevance score
  let score = 0;

  // 1. Name matches (highest priority)
  if (nameLower === normalizedQuery) {
    score += 2000;
  } else if (nameLower.startsWith(normalizedQuery)) {
    score += 1200;
  } else if (nameLower.includes(normalizedQuery)) {
    score += 800;
  }

  // Score individual tokens in name
  tokens.forEach((token) => {
    if (nameLower.startsWith(token)) {
      score += 250;
    } else if (nameLower.includes(token)) {
      score += 180;
    }
  });

  // 2. Category matches
  if (catLower === normalizedQuery) {
    score += 600;
  } else if (catLower.includes(normalizedQuery)) {
    score += 350;
  }
  tokens.forEach((token) => {
    if (catLower.includes(token)) {
      score += 120;
    }
  });

  // 3. Tags matches
  tagsLower.forEach((tag) => {
    if (tag === normalizedQuery) {
      score += 300;
    } else if (tag.includes(normalizedQuery)) {
      score += 150;
    }
    tokens.forEach((token) => {
      if (tag === token) {
        score += 100;
      } else if (tag.includes(token)) {
        score += 50;
      }
    });
  });

  // 4. Tagline & Best-for matches
  tokens.forEach((token) => {
    if (taglineLower.includes(token)) {
      score += 40;
    }
    if (bestForLower.includes(token)) {
      score += 30;
    }
    if (descLower.includes(token)) {
      score += 10;
    }
  });

  // 5. Tie-breaker bonus for verified benchmarks, high ratings and review volume
  score += Math.round(tool.rating * 15);
  score += Math.min(50, Math.round(Math.log10(tool.reviewCount + 1) * 12));

  return score;
}

/**
 * Filters and ranks the AI tools based on query, category, pricing, and sort option.
 */
export function filterAndRankTools(
  tools: AITool[],
  query: string,
  category: ToolCategory,
  pricing: PricingType,
  sortOption: 'relevance' | 'rating' | 'reviews' | 'name' = 'relevance'
): AITool[] {
  const tokens = tokenizeQuery(query);
  const isSearching = tokens.length > 0;

  const matches: SearchMatch[] = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];

    // Category filter
    if (category !== 'All' && tool.category.toLowerCase() !== category.toLowerCase()) {
      continue;
    }

    // Pricing filter
    if (pricing !== 'All') {
      const toolPricing = (tool.pricingModel || tool.pricing || '').toLowerCase();
      if (toolPricing !== pricing.toLowerCase()) {
        continue;
      }
    }

    // Search query match & scoring
    const score = scoreToolMatch(tool, tokens, query);
    if (score !== null) {
      matches.push({ tool, score });
    }
  }

  // Sort results
  matches.sort((a, b) => {
    if (isSearching && (sortOption === 'relevance' || sortOption === 'rating')) {
      // Prioritize search score when query is active
      if (b.score !== a.score) return b.score - a.score;
      return b.tool.rating - a.tool.rating;
    }

    if (sortOption === 'rating') {
      return b.tool.rating - a.tool.rating;
    }
    if (sortOption === 'reviews') {
      return b.tool.reviewCount - a.tool.reviewCount;
    }
    if (sortOption === 'name') {
      return a.tool.name.localeCompare(b.tool.name);
    }

    // Default relevance fallback
    return b.score - a.score;
  });

  return matches.map((m) => m.tool);
}

/**
 * Retrieves top instant suggestions for the live dropdown.
 */
export function getLiveSuggestions(
  tools: AITool[],
  query: string,
  limit: number = 8
): { suggestions: AITool[]; totalMatches: number } {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return { suggestions: [], totalMatches: 0 };
  }

  const matches: SearchMatch[] = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const score = scoreToolMatch(tool, tokens, query);
    if (score !== null) {
      matches.push({ tool, score });
    }
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.tool.rating - a.tool.rating;
  });

  return {
    suggestions: matches.slice(0, limit).map((m) => m.tool),
    totalMatches: matches.length,
  };
}
