import { 
  Video, 
  PenTool, 
  Code2, 
  Bot, 
  Sparkles, 
  Mic, 
  Layers, 
  SearchCheck, 
  Box, 
  Scale, 
  Landmark, 
  Database, 
  Tag, 
  Radio, 
  Swords, 
  RotateCcw,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { ToolCategory, PricingType } from '../types';

export interface SlashCommandItem {
  id: string;
  command: string; // e.g. "/video"
  keywords: string[];
  label: string;
  description: string;
  icon: any;
  category?: ToolCategory;
  pricing?: PricingType;
  actionType: 'category' | 'pricing' | 'route' | 'reset' | 'compare';
  route?: string;
  badge?: string;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // 1. Categories
  {
    id: 'cmd-video',
    command: '/video',
    keywords: ['video', 'vid', 'editor', 'editing', 'animation', 'render', 'sora', 'runway'],
    label: 'Video Generation & VFX',
    description: 'Filter AI video generators, motion design & video editors',
    icon: Video,
    category: 'Video Generation',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-writing',
    command: '/writing',
    keywords: ['writing', 'write', 'copy', 'copywriting', 'content', 'author', 'essay', 'blog', 'text'],
    label: 'Copywriting & Content',
    description: 'Filter AI writers, long-form content & copywriting assistants',
    icon: PenTool,
    category: 'Copywriting & Content',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-coding',
    command: '/coding',
    keywords: ['coding', 'code', 'dev', 'developer', 'ide', 'git', 'cursor', 'copilot', 'programming', 'software'],
    label: 'Coding & Dev Tools',
    description: 'Filter AI coding assistants, autonomous copilots & IDEs',
    icon: Code2,
    category: 'Coding & Dev',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-chat',
    command: '/chat',
    keywords: ['chat', 'assistant', 'chatbot', 'gpt', 'claude', 'gemini', 'reasoning', 'agent'],
    label: 'Chatbots & Assistants',
    description: 'Filter conversational agents, reasoning models & copilots',
    icon: Bot,
    category: 'Chatbots & Assistants',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-image',
    command: '/image',
    keywords: ['image', 'photo', 'art', 'midjourney', 'flux', 'dalle', 'graphic', 'photorealism'],
    label: 'Image Generation & Art',
    description: 'Filter photorealistic generators, art tools & image creators',
    icon: Sparkles,
    category: 'Image Generation',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-audio',
    command: '/audio',
    keywords: ['audio', 'voice', 'music', 'sound', 'speech', 'tts', 'elevenlabs', 'suno', 'udio'],
    label: 'Audio & Music Synthesis',
    description: 'Filter voice cloning, text-to-speech & AI music composers',
    icon: Mic,
    category: 'Audio & Music',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-notes',
    command: '/notes',
    keywords: ['notes', 'productivity', 'workflow', 'meeting', 'notion', 'task', 'organizer'],
    label: 'Productivity & Notes',
    description: 'Filter AI workspace tools, note organizers & meeting recorders',
    icon: Layers,
    category: 'Productivity & Notes',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-seo',
    command: '/seo',
    keywords: ['seo', 'marketing', 'growth', 'keywords', 'semrush', 'ad', 'social', 'analytics'],
    label: 'SEO & Marketing',
    description: 'Filter search optimization, growth intelligence & ad copy tools',
    icon: SearchCheck,
    category: 'SEO & Marketing',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-design',
    command: '/design',
    keywords: ['design', '3d', 'ui', 'ux', 'vector', 'figma', 'canvas', 'spline'],
    label: 'Design & 3D Assets',
    description: 'Filter generative 3D modeling, UI mockups & spatial tools',
    icon: Box,
    category: 'Design & 3D',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-legal',
    command: '/legal',
    keywords: ['legal', 'law', 'contract', 'compliance', 'clause', 'attorney', 'brief'],
    label: 'Legal AI & Contracts',
    description: 'Filter legal research, contract auditing & regulatory copilots',
    icon: Scale,
    category: 'Legal AI',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-finance',
    command: '/finance',
    keywords: ['finance', 'fintech', 'quant', 'trading', 'crypto', 'stocks', 'equity', 'alpha'],
    label: 'Finance AI & Quant Alpha',
    description: 'Filter financial modeling, market forecasting & quant systems',
    icon: Landmark,
    category: 'Finance AI',
    actionType: 'category',
    badge: 'Category'
  },
  {
    id: 'cmd-research',
    command: '/research',
    keywords: ['research', 'data', 'academic', 'papers', 'citations', 'scite', 'analysis'],
    label: 'Research & Data Science',
    description: 'Filter literature review engines, paper summarizers & data science',
    icon: Database,
    category: 'Research & Data',
    actionType: 'category',
    badge: 'Category'
  },

  // 2. Pricing Filters
  {
    id: 'cmd-free',
    command: '/free',
    keywords: ['free', 'zero', '100% free', 'no cost', 'open'],
    label: 'Filter 100% Free Tools',
    description: 'Display tools that offer completely free tiers without payment',
    icon: CheckCircle2,
    pricing: 'Free',
    actionType: 'pricing',
    badge: 'Filter'
  },
  {
    id: 'cmd-freemium',
    command: '/freemium',
    keywords: ['freemium', 'trial', 'free tier', 'hybrid'],
    label: 'Filter Freemium Tools',
    description: 'Display tools with free access and premium upgrade tiers',
    icon: DollarSign,
    pricing: 'Freemium',
    actionType: 'pricing',
    badge: 'Filter'
  },

  // 3. Quick Actions & Sub-Pages
  {
    id: 'cmd-deals',
    command: '/deals',
    keywords: ['deals', 'discount', 'discounts', 'coupon', 'promo', 'offer', 'sale'],
    label: 'Daily AI Deals (-50%)',
    description: 'Jump to exclusive limited-time coupons & startup discounts',
    icon: Tag,
    actionType: 'route',
    route: 'deals',
    badge: 'Hot Deals'
  },
  {
    id: 'cmd-news',
    command: '/news',
    keywords: ['news', 'radar', 'updates', 'trending', 'headlines', 'launch'],
    label: 'Trending AI News Radar',
    description: 'View breaking AI updates, model launches & industry benchmarks',
    icon: Radio,
    actionType: 'route',
    route: 'news',
    badge: 'Live Feed'
  },
  {
    id: 'cmd-compare',
    command: '/compare',
    keywords: ['compare', 'vs', 'versus', 'versus mode', 'battle', 'showdown'],
    label: 'AI vs AI Comparison Engine',
    description: 'Launch head-to-head comparison tool between any two platforms',
    icon: Swords,
    actionType: 'compare',
    badge: 'Interactive'
  },
  {
    id: 'cmd-reset',
    command: '/reset',
    keywords: ['reset', 'clear', 'all', 'restore', 'default'],
    label: 'Reset All Filters',
    description: 'Restore complete directory of 1,000+ benchmarked AI tools',
    icon: RotateCcw,
    actionType: 'reset',
    badge: 'Action'
  }
];

/**
 * Filter slash commands matching user input (e.g. "/v" -> matches /video first)
 */
export function filterSlashCommands(input: string): SlashCommandItem[] {
  const clean = input.trim().toLowerCase();
  if (!clean.startsWith('/')) return [];

  const sub = clean.slice(1);
  if (!sub) return SLASH_COMMANDS; // Show all when only "/" is typed

  const scored: { item: SlashCommandItem; score: number }[] = [];

  for (const item of SLASH_COMMANDS) {
    const cmdWithoutSlash = item.command.slice(1).toLowerCase();
    let score = 0;

    if (cmdWithoutSlash === sub) {
      score += 1000;
    } else if (cmdWithoutSlash.startsWith(sub)) {
      score += 800;
    } else if (item.label.toLowerCase().startsWith(sub)) {
      score += 500;
    } else if (item.keywords.some((kw) => kw.toLowerCase().startsWith(sub))) {
      score += 400;
    } else if (cmdWithoutSlash.includes(sub)) {
      score += 200;
    } else if (item.label.toLowerCase().includes(sub)) {
      score += 150;
    } else if (item.keywords.some((kw) => kw.toLowerCase().includes(sub))) {
      score += 100;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
