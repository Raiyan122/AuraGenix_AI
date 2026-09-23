import React, { useState, useMemo } from 'react';
import { 
  X, 
  Swords, 
  Star, 
  ExternalLink, 
  Check, 
  XCircle, 
  Sparkles, 
  Zap, 
  Award, 
  DollarSign, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Search,
  Scale
} from 'lucide-react';
import { AITool } from '../types';
import { ToolLogo } from './ToolLogo';
import { AdSenseUnit } from './AdSenseUnit';

interface AIComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTools: AITool[];
  initialToolAId?: string;
  initialToolBId?: string;
  onSelectToolDetail: (toolId: string) => void;
}

// Preset popular rivalry matchups
const POPULAR_MATCHUPS = [
  { name: 'ChatGPT vs Claude 3.5 Sonnet', toolA: 'chatgpt', toolB: 'claude' },
  { name: 'Midjourney vs DALL-E 3', toolA: 'midjourney', toolB: 'dall-e' },
  { name: 'Cursor vs GitHub Copilot', toolA: 'cursor', toolB: 'github-copilot' },
  { name: 'Perplexity AI vs Google Gemini', toolA: 'perplexity', toolB: 'gemini' },
  { name: 'Runway Gen-3 vs Pika Labs', toolA: 'runway', toolB: 'pika' },
  { name: 'ElevenLabs vs Suno AI', toolA: 'elevenlabs', toolB: 'suno' },
];

export const AIComparisonModal: React.FC<AIComparisonModalProps> = ({
  isOpen,
  onClose,
  allTools,
  initialToolAId,
  initialToolBId,
  onSelectToolDetail,
}) => {
  // Select initial tools safely
  const defaultA = useMemo(() => {
    return allTools.find((t) => t.id === initialToolAId) || allTools[0];
  }, [allTools, initialToolAId]);

  const defaultB = useMemo(() => {
    return (
      allTools.find((t) => t.id === initialToolBId) ||
      allTools.find((t) => t.id !== defaultA?.id && t.category === defaultA?.category) ||
      allTools[1]
    );
  }, [allTools, initialToolBId, defaultA]);

  const [selectedToolAId, setSelectedToolAId] = useState<string>(defaultA?.id || '');
  const [selectedToolBId, setSelectedToolBId] = useState<string>(defaultB?.id || '');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  // Update when props change
  React.useEffect(() => {
    if (initialToolAId && allTools.some((t) => t.id === initialToolAId)) {
      setSelectedToolAId(initialToolAId);
    }
    if (initialToolBId && allTools.some((t) => t.id === initialToolBId)) {
      setSelectedToolBId(initialToolBId);
    }
  }, [initialToolAId, initialToolBId, allTools]);

  const toolA = useMemo(() => allTools.find((t) => t.id === selectedToolAId) || allTools[0], [allTools, selectedToolAId]);
  const toolB = useMemo(() => allTools.find((t) => t.id === selectedToolBId) || allTools[1], [allTools, selectedToolBId]);

  // Filter tools for searchable select
  const filteredToolsA = useMemo(() => {
    if (!searchA.trim()) return allTools.slice(0, 30);
    const q = searchA.toLowerCase();
    return allTools.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 30);
  }, [allTools, searchA]);

  const filteredToolsB = useMemo(() => {
    if (!searchB.trim()) return allTools.slice(0, 30);
    const q = searchB.toLowerCase();
    return allTools.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 30);
  }, [allTools, searchB]);

  if (!isOpen || !toolA || !toolB) return null;

  // Compute dynamic verdict
  const verdictWinner = toolA.rating > toolB.rating ? toolA : toolB.rating > toolA.rating ? toolB : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-6xl my-auto rounded-3xl bg-[#080d1e] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-6 py-5 bg-[#0b1228] border-b border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Swords className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>AI vs AI</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Versus Mode</span>
              </h2>
              <p className="text-xs text-slate-400">
                Objective side-by-side benchmark comparison: Features, Pricing, Pros/Cons &amp; Verdict
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            aria-label="Close Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comparison Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">

          {/* Quick Matchup Presets */}
          <div className="p-4 rounded-2xl bg-[#060a17] border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Head-to-Head Matchups:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_MATCHUPS.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const foundA = allTools.find((t) => t.id === m.toolA || t.name.toLowerCase().includes(m.toolA));
                    const foundB = allTools.find((t) => t.id === m.toolB || t.name.toLowerCase().includes(m.toolB));
                    if (foundA) setSelectedToolAId(foundA.id);
                    if (foundB) setSelectedToolBId(foundB.id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selector Bars (Tool A vs Tool B) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 items-center justify-center font-black text-slate-950 text-xs shadow-lg shadow-cyan-500/30">
              VS
            </div>

            {/* Select Tool A */}
            <div className="p-5 rounded-2xl bg-[#0a1024] border border-cyan-500/30 shadow-lg">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-2 font-bold">
                Contender #1
              </span>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search tool 1 (e.g. ChatGPT, Claude, Midjourney)..."
                    value={searchA}
                    onChange={(e) => setSearchA(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <select
                  value={toolA.id}
                  onChange={(e) => setSelectedToolAId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {filteredToolsA.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white py-1">
                      {t.name} ({t.category}) — ★ {t.rating.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contender A Profile Card */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ToolLogo
                    toolName={toolA.name}
                    websiteUrl={toolA.officialWebsiteUrl || toolA.websiteUrl}
                    customLogoUrl={toolA.logoUrl}
                    size="md"
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{toolA.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                      <span className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {toolA.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500">({toolA.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectToolDetail(toolA.id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                >
                  Full Review →
                </button>
              </div>
            </div>

            {/* Select Tool B */}
            <div className="p-5 rounded-2xl bg-[#100d24] border border-purple-500/30 shadow-lg">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest block mb-2 font-bold">
                Contender #2
              </span>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search tool 2 (e.g. Gemini, Perplexity, Cursor)..."
                    value={searchB}
                    onChange={(e) => setSearchB(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <select
                  value={toolB.id}
                  onChange={(e) => setSelectedToolBId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  {filteredToolsB.map((t) => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white py-1">
                      {t.name} ({t.category}) — ★ {t.rating.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contender B Profile Card */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ToolLogo
                    toolName={toolB.name}
                    websiteUrl={toolB.officialWebsiteUrl || toolB.websiteUrl}
                    customLogoUrl={toolB.logoUrl}
                    size="md"
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{toolB.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                      <span className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {toolB.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500">({toolB.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectToolDetail(toolB.id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/40 hover:bg-purple-500/20 transition-colors cursor-pointer"
                >
                  Full Review →
                </button>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="rounded-2xl bg-[#090e21] border border-slate-800 overflow-hidden">
            <div className="p-4 bg-[#0c132c] border-b border-slate-800 flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>Head-to-Head Capability Matrix</span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              
              {/* Row 1: Category & Primary Niche */}
              <div className="grid grid-cols-3 p-4 items-center">
                <div className="font-semibold text-slate-400">Category &amp; Niche</div>
                <div className="text-cyan-300 font-bold">{toolA.category}</div>
                <div className="text-purple-300 font-bold">{toolB.category}</div>
              </div>

              {/* Row 2: Pricing & Free Tier */}
              <div className="grid grid-cols-3 p-4 items-center">
                <div className="font-semibold text-slate-400">Pricing Model</div>
                <div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    {toolA.pricing} ({toolA.pricingStarting})
                  </span>
                </div>
                <div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {toolB.pricing} ({toolB.pricingStarting})
                  </span>
                </div>
              </div>

              {/* Row 3: Ideal Use Case */}
              <div className="grid grid-cols-3 p-4 items-center">
                <div className="font-semibold text-slate-400">Best Suited For</div>
                <div className="text-slate-200 leading-relaxed pr-2">{toolA.bestFor}</div>
                <div className="text-slate-200 leading-relaxed pl-2">{toolB.bestFor}</div>
              </div>

              {/* Row 4: Key Advantages (Pros) */}
              <div className="grid grid-cols-3 p-4 items-start">
                <div className="font-semibold text-slate-400">Top Strengths</div>
                <div className="space-y-2 pr-2">
                  {toolA.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pl-2">
                  {toolB.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Trade-offs & Limitations (Cons) */}
              <div className="grid grid-cols-3 p-4 items-start">
                <div className="font-semibold text-slate-400">Key Trade-offs</div>
                <div className="space-y-2 pr-2">
                  {toolA.cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[9px] mt-0.5 flex-shrink-0">✕</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pl-2">
                  {toolB.cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[9px] mt-0.5 flex-shrink-0">✕</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* AdSense Unit in Comparison View to monetize high-intent comparison traffic */}
          <AdSenseUnit
            slotId="5566778899"
            type="in-article"
            format="auto"
            className="my-4"
          />

          {/* Editorial Verdict Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1633] via-[#101030] to-[#180e2d] border border-cyan-500/40 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>AuraGenix AI Editorial Verdict (2026)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
              {verdictWinner ? (
                <>
                  Recommended Winner: <span className="text-cyan-300">{verdictWinner.name}</span>
                </>
              ) : (
                'Equally Matched Benchmark — Depends on Your Workflow'
              )}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              When evaluating raw performance and feature depth, <strong>{toolA.name}</strong> shines best for users prioritizing <em>{toolA.bestFor.toLowerCase()}</em>. Conversely, <strong>{toolB.name}</strong> provides a decisive advantage when your primary requirement is <em>{toolB.bestFor.toLowerCase()}</em>. Both platforms maintain enterprise-grade security protocols and verified 2026 stability.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={toolA.officialWebsiteUrl.startsWith('http') ? toolA.officialWebsiteUrl : `https://${toolA.officialWebsiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/25 transition-all cursor-pointer"
              >
                <span>Try {toolA.name} Official</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={toolB.officialWebsiteUrl.startsWith('http') ? toolB.officialWebsiteUrl : `https://${toolB.officialWebsiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
              >
                <span>Try {toolB.name} Official</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
