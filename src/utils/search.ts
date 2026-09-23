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
  'Video Editing',
  'Writing Assistants',
  'Audio & Voice',
  'SEO & Business',
  'Coding & Dev',
  'DeepSeek'
];

/**
 * Natural language category alias & synonym map
 * Allows users to search "Video Editing", "Writing Assistants", "Audio & Voice", etc.
 * and instantly match the official category.
 */
export const CATEGORY_SYNONYMS: Record<string, ToolCategory> = {
  // Video Editing & Video Generation
  'video': 'Video Generation',
  'video editing': 'Video Generation',
  'video editor': 'Video Generation',
  'video generation': 'Video Generation',
  'video generator': 'Video Generation',
  'video maker': 'Video Generation',
  'animation': 'Video Generation',
  'avatar video': 'Video Generation',

  // Writing Assistants & Copywriting
  'writing': 'Copywriting & Content',
  'writing assistant': 'Copywriting & Content',
  'writing assistants': 'Copywriting & Content',
  'copywriting': 'Copywriting & Content',
  'content writer': 'Copywriting & Content',
  'essay': 'Copywriting & Content',
  'article writer': 'Copywriting & Content',
  'summarizer': 'Copywriting & Content',

  // Audio & Voice
  'audio': 'Audio & Music',
  'voice': 'Audio & Music',
  'audio & voice': 'Audio & Music',
  'voice cloning': 'Audio & Music',
  'voice generator': 'Audio & Music',
  'text to speech': 'Audio & Music',
  'tts': 'Audio & Music',
  'music': 'Audio & Music',
  'sound': 'Audio & Music',
  'song': 'Audio & Music',

  // Marketing & SEO & Business
  'seo': 'SEO & Marketing',
  'marketing': 'SEO & Marketing',
  'seo & business': 'SEO & Marketing',
  'business': 'SEO & Marketing',
  'digital marketing': 'SEO & Marketing',
  'ad copy': 'SEO & Marketing',
  'keyword research': 'SEO & Marketing',

  // Coding & Dev
  'coding': 'Coding & Dev',
  'coding & dev': 'Coding & Dev',
  'code': 'Coding & Dev',
  'developer': 'Coding & Dev',
  'programming': 'Coding & Dev',
  'ide': 'Coding & Dev',
  'software engineering': 'Coding & Dev',
  'debugging': 'Coding & Dev',

  // Image Generation
  'image': 'Image Generation',
  'image generation': 'Image Generation',
  'ai art': 'Image Generation',
  'photo': 'Image Generation',
  'illustration': 'Image Generation',

  // Productivity & Notes
  'productivity': 'Productivity & Notes',
  'productivity & notes': 'Productivity & Notes',
  'notes': 'Productivity & Notes',
  'workflow': 'Productivity & Notes',
  'transcription': 'Productivity & Notes',
  'meeting assistant': 'Productivity & Notes',

  // Chatbots & Assistants
  'chatbots': 'Chatbots & Assistants',
  'chatbots & assistants': 'Chatbots & Assistants',
  'chatbot': 'Chatbots & Assistants',
  'assistant': 'Chatbots & Assistants',
  'conversational': 'Chatbots & Assistants',
  'reasoning': 'Chatbots & Assistants',
  'agent': 'Chatbots & Assistants',

  // Design & 3D
  'design': 'Design & 3D',
  'design & 3d': 'Design & 3D',
  '3d': 'Design & 3D',
  'ui design': 'Design & 3D',

  // Research & Data
  'research': 'Research & Data',
  'research & data': 'Research & Data',
  'data': 'Research & Data',
  'academic': 'Research & Data',
  'scientific': 'Research & Data',
  'papers': 'Research & Data'
};

/**
 * Common acronyms and aliases for top AI software platforms
 */
export const TOOL_ALIASES: Record<string, string[]> = {
  'chatgpt': ['gpt', 'gpt-4', 'gpt4', 'gpt-4o', 'o1', 'o3', 'openai', 'chat gpt', 'chatgpt plus'],
  'claude': ['anthropic', 'sonnet', 'opus', 'haiku', 'claude 3', 'claude 3.7', 'claude3'],
  'gemini': ['google', 'bard', 'gemini advanced', 'gemini 2.0', 'gemini pro'],
  'perplexity': ['sonar', 'ai search', 'perplexity pro', 'citations'],
  'deepseek': ['deep seek', 'r1', 'v3', 'deepseek r1', 'deepseek v3'],
  'midjourney': ['mj', 'mjv6', 'mid journey', 'midjourney v6'],
  'flux': ['black forest labs', 'bfl', 'flux 1', 'flux.1', 'flux pro'],
  'cursor': ['cursor ai', 'cursor ide', 'anysphere'],
  'copilot': ['github copilot', 'ms copilot', 'microsoft copilot'],
  'elevenlabs': ['11labs', 'eleven labs', 'voice clone', 'tts'],
  'runway': ['gen-3', 'gen3', 'runwayml', 'gen 3 alpha'],
  'suno': ['suno ai', 'suno music', 'song generator'],
  'notion': ['notion ai', 'notion notes']
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'with',
  'ai', 'tool', 'tools', 'software', 'app', 'online', 'best', 'top', 'new'
]);

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
 * Evaluates whether a tool matches a search query and computes an accurate relevance score.
 * Never unnecessarily hides tools if primary keywords or name match.
 */
export function scoreToolMatch(tool: AITool, tokens: string[], rawQuery: string): number | null {
  if (tokens.length === 0) return 100;

  const normalizedQuery = rawQuery.toLowerCase().trim();
  const cleanQuery = normalizedQuery.replace(/[^a-z0-9]/g, '');
  const nameLower = tool.name.toLowerCase();
  const cleanName = nameLower.replace(/[^a-z0-9]/g, '');
  const catLower = tool.category.toLowerCase();
  const taglineLower = (tool.shortTagline || tool.shortDescription || '').toLowerCase();
  const descLower = (tool.detailedDescription || tool.fullReview || '').toLowerCase();
  const bestForLower = (tool.bestFor || '').toLowerCase();
  const pricingLower = (tool.pricingModel || tool.pricing || '').toLowerCase();
  const tagsLower = tool.tags.map((t) => t.toLowerCase());

  // 1. Check for Category Synonym / Natural Language Category Search
  // (e.g. user typed "video editing", "writing assistants", "audio & voice", "marketing")
  let matchedCategoryAlias = false;
  for (const [alias, targetCategory] of Object.entries(CATEGORY_SYNONYMS)) {
    if (normalizedQuery === alias || normalizedQuery.includes(alias)) {
      if (tool.category.toLowerCase() === targetCategory.toLowerCase()) {
        matchedCategoryAlias = true;
        break;
      }
    }
  }

  // 2. Check for Tool Acronym / Alias
  let matchedToolAlias = false;
  for (const [canonicalKey, aliases] of Object.entries(TOOL_ALIASES)) {
    if (nameLower.includes(canonicalKey) || tool.id.includes(canonicalKey)) {
      if (aliases.some((alias) => normalizedQuery === alias || normalizedQuery.includes(alias))) {
        matchedToolAlias = true;
        break;
      }
    }
  }

  // Meaningful tokens (filtered of pure noise if more than 1 token)
  const meaningfulTokens = tokens.length > 1 
    ? tokens.filter((t) => !STOP_WORDS.has(t))
    : tokens;
  const tokensToCheck = meaningfulTokens.length > 0 ? meaningfulTokens : tokens;

  // Verify how many tokens match anywhere in tool corpus
  const fullCorpus = `${nameLower} ${cleanName} ${catLower} ${taglineLower} ${descLower} ${bestForLower} ${pricingLower} ${tagsLower.join(' ')}`;
  
  let matchedTokensCount = 0;
  for (const token of tokensToCheck) {
    if (fullCorpus.includes(token)) {
      matchedTokensCount++;
    }
  }

  // If no tokens match, and neither category alias nor tool alias matched, exclude tool
  if (matchedTokensCount === 0 && !matchedCategoryAlias && !matchedToolAlias) {
    return null;
  }

  // Calculate refined relevance score
  let score = 0;

  // Exact full name match (highest possible relevance)
  if (nameLower === normalizedQuery || cleanName === cleanQuery) {
    score += 5000;
  } else if (nameLower.startsWith(normalizedQuery)) {
    score += 2500;
  } else if (nameLower.includes(normalizedQuery)) {
    score += 1500;
  }

  // Acronym & Alias boost
  if (matchedToolAlias) {
    score += 3500;
  }

  // Category Synonym boost
  if (matchedCategoryAlias) {
    score += 1200;
  }

  // Category direct match
  if (catLower === normalizedQuery) {
    score += 800;
  } else if (catLower.includes(normalizedQuery)) {
    score += 400;
  }

  // Individual tokens scoring in name
  tokensToCheck.forEach((token) => {
    if (nameLower === token) {
      score += 1000;
    } else if (nameLower.startsWith(token)) {
      score += 500;
    } else if (nameLower.includes(token)) {
      score += 300;
    }
  });

  // Tag matches
  tagsLower.forEach((tag) => {
    if (tag === normalizedQuery) {
      score += 600;
    } else if (tag.includes(normalizedQuery)) {
      score += 250;
    }
    tokensToCheck.forEach((token) => {
      if (tag === token) {
        score += 150;
      } else if (tag.includes(token)) {
        score += 60;
      }
    });
  });

  // Tagline, description, and bestFor matches
  tokensToCheck.forEach((token) => {
    if (taglineLower.includes(token)) score += 60;
    if (bestForLower.includes(token)) score += 40;
    if (descLower.includes(token)) score += 20;
  });

  // Full token match bonus
  if (matchedTokensCount === tokensToCheck.length) {
    score += 400;
  }

  // Quality & Volume tie-breaker bonus
  score += Math.round(tool.rating * 20);
  score += Math.min(80, Math.round(Math.log10(tool.reviewCount + 1) * 15));

  return score;
}

/**
 * Clean, production-ready search and filter engine for AuraGenix AI.
 * Filters and ranks AI tools based on query, category, pricing, and sort option.
 * Guarantees zero tools are unintentionally hidden.
 */
export function filterAndRankTools(
  tools: AITool[],
  query: string,
  category: ToolCategory,
  pricing: PricingType,
  sortOption: 'relevance' | 'rating' | 'reviews' | 'name' = 'relevance'
): AITool[] {
  const trimmedQuery = (query || '').trim();
  const tokens = tokenizeQuery(trimmedQuery);
  const isSearching = tokens.length > 0;

  const matches: SearchMatch[] = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];

    // Category filter: ensure exact match or 'All'
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
    const score = scoreToolMatch(tool, tokens, trimmedQuery);
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
 * Retrieves top instant suggestions for the live dropdown search bar.
 */
export function getLiveSuggestions(
  tools: AITool[],
  query: string,
  limit: number = 8
): { suggestions: AITool[]; totalMatches: number } {
  const trimmedQuery = (query || '').trim();
  const tokens = tokenizeQuery(trimmedQuery);
  if (tokens.length === 0) {
    return { suggestions: [], totalMatches: 0 };
  }

  const matches: SearchMatch[] = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const score = scoreToolMatch(tool, tokens, trimmedQuery);
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
