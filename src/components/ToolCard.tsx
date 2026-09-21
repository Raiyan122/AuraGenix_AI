import React from 'react';
import { 
  Star, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Code2, 
  PenTool, 
  Sparkles, 
  Video, 
  Mic, 
  Layers, 
  SearchCheck, 
  Box, 
  Database 
} from 'lucide-react';
import { AITool, ToolCategory } from '../types';
import { HighlightMatch } from './HighlightMatch';
import { ToolLogo } from './ToolLogo';

interface ToolCardProps {
  tool: AITool;
  onReadReview: (tool: AITool) => void;
  searchQuery?: string;
}

// Category visual theme mapper
const getCategoryTheme = (category: Exclude<ToolCategory, 'All'>) => {
  switch (category) {
    case 'Chatbots & Assistants':
      return {
        bg: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
        icon: Bot
      };
    case 'Coding & Dev':
      return {
        bg: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-400',
        icon: Code2
      };
    case 'Copywriting & Content':
      return {
        bg: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
        icon: PenTool
      };
    case 'Image Generation':
      return {
        bg: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
        icon: Sparkles
      };
    case 'Video Generation':
      return {
        bg: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        icon: Video
      };
    case 'Audio & Music':
      return {
        bg: 'from-rose-500/20 to-fuchsia-500/20 border-rose-500/30 text-rose-400',
        icon: Mic
      };
    case 'Productivity & Notes':
      return {
        bg: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30 text-sky-400',
        icon: Layers
      };
    case 'SEO & Marketing':
      return {
        bg: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
        icon: SearchCheck
      };
    case 'Design & 3D':
      return {
        bg: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
        icon: Box
      };
    case 'Research & Data':
      return {
        bg: 'from-cyan-600/20 to-teal-600/20 border-cyan-500/30 text-cyan-300',
        icon: Database
      };
    default:
      return {
        bg: 'from-slate-700/30 to-slate-800/30 border-slate-700 text-slate-300',
        icon: Bot
      };
  }
};

// Generates 2-letter initials for tools
const getToolInitials = (name: string) => {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onReadReview, searchQuery }) => {
  const theme = getCategoryTheme(tool.category);
  const IconComponent = theme.icon;
  const initials = getToolInitials(tool.name);

  const isFree = tool.pricing === 'Free';
  const isFreemium = tool.pricing === 'Freemium';

  return (
    <article 
      onClick={() => onReadReview(tool)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0c1122]/90 border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
      id={`tool-card-${tool.id}`}
    >
      {/* Top hover subtle highlight */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card content */}
      <div className="p-6">
        
        {/* Header row: Icon/Initials, Name, Category & Pricing Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Tool Logo with dynamic favicon resolution & fallback */}
            <ToolLogo
              toolName={tool.name}
              websiteUrl={tool.officialWebsiteUrl || tool.websiteUrl}
              customLogoUrl={tool.logoUrl}
              size="md"
            />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {searchQuery ? (
                    <HighlightMatch text={tool.name} query={searchQuery} />
                  ) : (
                    tool.name
                  )}
                </h3>
                {tool.badge && (
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 rounded-full">
                    {tool.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                <span>{tool.category}</span>
              </div>
            </div>
          </div>

          {/* Pricing badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                isFree
                  ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                  : isFreemium
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                  : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
              }`}
            >
              {tool.pricing}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              {tool.pricingStarting}
            </span>
          </div>
        </div>

        {/* Star Rating row */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm font-bold text-white">
            {tool.rating.toFixed(1)}/5
          </span>
          <span className="text-xs text-slate-400">
            ({tool.reviewCount.toLocaleString()})
          </span>
          <span className="ml-auto text-[10px] font-mono text-cyan-400/90 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            Verified {tool.verifiedYear}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {tool.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-slate-900/80 border border-slate-800/80 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Key Pro bullet */}
        {tool.pros.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/70">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{tool.pros[0]}</span>
          </div>
        )}

      </div>

      {/* Card Footer: Action Buttons */}
      <div className="p-6 pt-0 border-t border-slate-800/80 mt-auto flex items-center justify-between gap-3">
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors py-2"
          title={`Visit ${tool.name} official website`}
        >
          <span>Visit site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Read Full Review Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReadReview(tool);
          }}
          id={`read-review-btn-${tool.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800/90 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 border border-slate-700 hover:border-cyan-400/50 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/20 group/btn"
        >
          <span>Read In-Depth Review</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </article>
  );
};
