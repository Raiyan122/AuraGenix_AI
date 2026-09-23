import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Star, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CornerDownLeft,
  ChevronRight,
  Zap,
  Terminal,
  Command,
  Sliders
} from 'lucide-react';
import { AITool, ToolCategory, PricingType } from '../types';
import { getLiveSuggestions, POPULAR_SEARCH_TERMS } from '../utils/search';
import { HighlightMatch } from './HighlightMatch';
import { ToolLogo } from './ToolLogo';
import { filterSlashCommands, SlashCommandItem, SLASH_COMMANDS } from '../utils/slashCommands';

interface SearchBarWithSuggestionsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTools: AITool[];
  totalResults: number;
  onSelectTool?: (tool: AITool) => void;
  onViewAllResults?: () => void;
  onSelectCategory?: (category: ToolCategory) => void;
  onSelectPricing?: (pricing: PricingType) => void;
  onOpenCompare?: () => void;
  onNavigateDeals?: () => void;
  onNavigateNews?: () => void;
  onResetFilters?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBarWithSuggestions: React.FC<SearchBarWithSuggestionsProps> = ({
  searchQuery,
  onSearchChange,
  allTools,
  totalResults,
  onSelectTool,
  onViewAllResults,
  onSelectCategory,
  onSelectPricing,
  onOpenCompare,
  onNavigateDeals,
  onNavigateNews,
  onResetFilters,
  placeholder = "Search 1,000+ AI tools... (Type '/' for quick filters & shortcuts)",
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSlashMode = searchQuery.trim().startsWith('/');

  // Filter slash commands when in slash mode
  const matchingSlashCommands = useMemo(() => {
    if (!isSlashMode) return [];
    return filterSlashCommands(searchQuery);
  }, [isSlashMode, searchQuery]);

  // Compute live tool suggestions when not in slash mode
  const { suggestions, totalMatches } = useMemo(() => {
    if (isSlashMode) return { suggestions: [], totalMatches: 0 };
    return getLiveSuggestions(allTools, searchQuery, 7);
  }, [allTools, searchQuery, isSlashMode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Execute a selected slash command
  const handleExecuteSlashCommand = (cmd: SlashCommandItem) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearchChange('');

    if (cmd.actionType === 'category' && cmd.category) {
      if (onSelectCategory) {
        onSelectCategory(cmd.category);
      }
      const grid = document.getElementById('tools-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.actionType === 'pricing' && cmd.pricing) {
      if (onSelectPricing) {
        onSelectPricing(cmd.pricing);
      }
      const grid = document.getElementById('tools-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.actionType === 'route') {
      if (cmd.route === 'deals' && onNavigateDeals) {
        onNavigateDeals();
      } else if (cmd.route === 'news' && onNavigateNews) {
        onNavigateNews();
      }
    } else if (cmd.actionType === 'compare' && onOpenCompare) {
      onOpenCompare();
    } else if (cmd.actionType === 'reset') {
      if (onResetFilters) {
        onResetFilters();
      } else if (onSelectCategory) {
        onSelectCategory('All');
      }
      const grid = document.getElementById('tools-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    const itemsCount = isSlashMode ? matchingSlashCommands.length : suggestions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (itemsCount === 0) return -1;
        return prev < itemsCount - 1 ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (itemsCount === 0) return -1;
        return prev > 0 ? prev - 1 : itemsCount - 1;
      });
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (isSlashMode) {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < matchingSlashCommands.length) {
          handleExecuteSlashCommand(matchingSlashCommands[selectedIndex]);
        } else if (matchingSlashCommands.length > 0) {
          handleExecuteSlashCommand(matchingSlashCommands[0]);
        }
      } else {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex]);
          } else {
            // Submit search & view results in directory
            setIsOpen(false);
            inputRef.current?.blur();
            if (onViewAllResults) {
              onViewAllResults();
            } else {
              const grid = document.getElementById('tools-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSelectSuggestion = (tool: AITool) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSelectTool) {
      onSelectTool(tool);
    } else {
      onSearchChange(tool.name);
    }
  };

  const handleClear = () => {
    onSearchChange('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleQuickTermClick = (term: string) => {
    onSearchChange(term);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleTriggerSlash = () => {
    onSearchChange('/');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full max-w-2xl mx-auto ${className}`}
      id="search-bar-container"
    >
      {/* Dynamic Animated Ambient Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-sm opacity-35 group-hover:opacity-60 transition duration-300 -z-10" />

      {/* Main Search Input Box */}
      <div 
        className={`relative flex items-center bg-[#0d1222] border rounded-2xl px-4 py-3.5 shadow-2xl transition-all duration-200 ${
          isOpen 
            ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-cyan-500/10' 
            : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        {isSlashMode ? (
          <Terminal className="w-5 h-5 mr-3 flex-shrink-0 text-cyan-400 animate-pulse" />
        ) : (
          <Search 
            className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
              isOpen || hasQuery ? 'text-cyan-400' : 'text-slate-400'
            }`} 
          />
        )}

        <input
          ref={inputRef}
          type="text"
          id="ai-tool-search-input"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions-dropdown"
        />

        {/* Clear Search Button */}
        {hasQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mr-2 cursor-pointer"
            title="Clear search (Esc)"
            id="clear-search-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Slash Command Quick Toggle Pill */}
        {!hasQuery && (
          <button
            type="button"
            onClick={handleTriggerSlash}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-850 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-xs font-mono mr-2 transition-all cursor-pointer"
            title="Type / to trigger quick shortcuts and filters"
          >
            <span className="text-cyan-400 font-bold">/</span>
            <span>Commands</span>
          </button>
        )}

        {/* Live Matches Counter Badge */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700 text-[11px] font-mono flex-shrink-0">
          <span className={`px-2 py-1 rounded transition-colors ${
            hasQuery && !isSlashMode
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' 
              : 'bg-slate-800/80 text-slate-400'
          }`}>
            {isSlashMode 
              ? `${matchingSlashCommands.length} commands` 
              : `${totalResults} ${totalResults === 1 ? 'match' : 'matches'}`
            }
          </span>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div 
          id="search-suggestions-dropdown"
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0c1122]/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {isSlashMode ? (
            /* STATE 1: SLASH COMMANDS PALETTE */
            <div id="slash-commands-palette">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-slate-900 to-[#0e162d] border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Slash ( / ) Command Shortcuts</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Instant category filters &amp; quick tools)
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[9px] text-cyan-300">↵</kbd>
                  <span>or</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[9px] text-cyan-300">Tab</kbd>
                </div>
              </div>

              {matchingSlashCommands.length > 0 ? (
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-700 py-1">
                  {matchingSlashCommands.map((cmd, index) => {
                    const isSelected = selectedIndex === index;
                    const IconComp = cmd.icon;
                    return (
                      <div
                        key={cmd.id}
                        onClick={() => handleExecuteSlashCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-gradient-to-r from-cyan-950/60 via-slate-850 to-purple-950/40 border-l-4 border-cyan-400' 
                            : 'hover:bg-slate-850/60 border-l-4 border-transparent'
                        }`}
                        id={`slash-cmd-${cmd.id}`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                              : 'bg-slate-800 text-cyan-400 group-hover:bg-slate-700'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-sm font-bold text-cyan-400 group-hover:text-cyan-300">
                                {cmd.command}
                              </span>
                              <span className="text-sm font-bold text-white group-hover:text-slate-100">
                                {cmd.label}
                              </span>
                              {cmd.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                                  {cmd.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {cmd.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-all ${
                            isSelected 
                              ? 'bg-cyan-500 text-slate-950' 
                              : 'text-slate-400 bg-slate-900 group-hover:text-slate-200'
                          }`}>
                            Select
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No slash command matches "<strong className="text-cyan-400">{searchQuery}</strong>". Try <code className="text-cyan-300 font-mono">/video</code>, <code className="text-cyan-300 font-mono">/writing</code>, <code className="text-cyan-300 font-mono">/coding</code>, or <code className="text-cyan-300 font-mono">/free</code>.
                </div>
              )}

              <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tip: Type <strong>/video</strong> to filter video tools, <strong>/writing</strong> for writing assistants</span>
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  Clear command
                </button>
              </div>
            </div>
          ) : hasQuery ? (
            /* STATE 2: REGULAR LIVE TOOL SUGGESTIONS */
            <div>
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Matching AI Tools: <strong className="text-cyan-300">{totalMatches}</strong> found
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[9px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[9px]">↓</kbd>
                  <span>navigate</span>
                  <kbd className="ml-1 px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[9px]">↵</kbd>
                  <span>select</span>
                </div>
              </div>

              {/* Suggestions List */}
              {suggestions.length > 0 ? (
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-700">
                  {suggestions.map((tool, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleSelectSuggestion(tool)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-gradient-to-r from-cyan-950/50 via-slate-800/80 to-purple-950/40 border-l-4 border-cyan-400' 
                            : 'hover:bg-slate-850/60 border-l-4 border-transparent'
                        }`}
                        id={`suggestion-item-${tool.id}`}
                      >
                        {/* Tool Logo & Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Logo */}
                          <ToolLogo
                            toolName={tool.name}
                            websiteUrl={tool.officialWebsiteUrl || tool.websiteUrl}
                            customLogoUrl={tool.logoUrl}
                            size="sm"
                            className="w-9 h-9 group-hover:border-cyan-500/40"
                          />

                          {/* Name, Category & Tagline */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                <HighlightMatch text={tool.name} query={searchQuery} />
                              </span>

                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                                {tool.category}
                              </span>

                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                tool.pricingModel === 'Free' 
                                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                                  : tool.pricingModel === 'Freemium'
                                  ? 'bg-blue-950/70 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                              }`}>
                                {tool.pricingModel}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 truncate">
                              {tool.shortTagline || tool.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Rating & Action Arrow */}
                        <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{tool.rating.toFixed(1)}</span>
                          </div>

                          <div className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isSelected 
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                              : 'bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700'
                          }`}>
                            <span className="hidden sm:inline text-[11px]">Review</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* STATE B: No Matches Found */
                <div className="px-6 py-8 text-center" id="search-no-results-dropdown">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <AlertCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    No AI tools found for "<span className="text-cyan-400">{searchQuery}</span>"
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
                    We couldn't find matching tools with your exact combination of terms. Try clearing words or select a popular search:
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {POPULAR_SEARCH_TERMS.slice(0, 6).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleQuickTermClick(term)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dropdown Footer */}
              {totalMatches > 0 && (
                <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      if (onViewAllResults) {
                        onViewAllResults();
                      } else {
                        const grid = document.getElementById('tools-grid');
                        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full text-center sm:text-left text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center sm:justify-between cursor-pointer"
                  >
                    <span>View all {totalMatches.toLocaleString()} results in directory</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                      Scroll to grid <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STATE 3: Query is empty but input is focused -> Show Quick Searches + Slash Command Hint */
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trending AI Searches in 2026</span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerSlash}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  <span>Type</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">/</kbd>
                  <span>for commands</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickTermClick(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              {/* Slash Command Quick Banner */}
              <div 
                onClick={handleTriggerSlash}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">
                    Use <strong className="text-cyan-300 font-mono">/video</strong>, <strong className="text-cyan-300 font-mono">/writing</strong>, <strong className="text-cyan-300 font-mono">/coding</strong>, or <strong className="text-cyan-300 font-mono">/free</strong> to filter instantly
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  Try it <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Start typing to see instant tool matches &amp; benchmark scores</span>
                <span className="font-mono text-cyan-400">{allTools.length} tools indexed</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

