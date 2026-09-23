import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, PlusCircle, Menu, X, Search, Swords, Tag, Radio, ChevronDown, Layers } from 'lucide-react';
import { ToolCategory } from '../types';
import { categoryToSlug } from '../utils/categoryUtils';

interface NavbarProps {
  onSubmitToolClick: () => void;
  onNavigateHome?: (sectionId?: string) => void;
  onSearchClick?: () => void;
  onContactClick?: () => void;
  onCompareClick?: () => void;
  onDealsClick?: () => void;
  onNewsClick?: () => void;
  onCategoryClick?: (category: ToolCategory) => void;
  currentView?: 'home' | 'tool' | 'deals' | 'news' | 'compare' | 'category';
}

const NAV_CATEGORIES: ToolCategory[] = [
  'Chatbots & Assistants',
  'Coding & Dev',
  'Copywriting & Content',
  'Image Generation',
  'Video Generation',
  'Audio & Music',
  'Productivity & Notes',
  'SEO & Marketing',
  'Design & 3D',
  'Research & Data',
  'Legal AI',
  'Finance AI'
];

export const Navbar: React.FC<NavbarProps> = ({ 
  onSubmitToolClick, 
  onNavigateHome,
  onSearchClick,
  onContactClick,
  onCompareClick,
  onDealsClick,
  onNewsClick,
  onCategoryClick,
  currentView = 'home' 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070913]/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on the left */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 group focus:outline-none text-left cursor-pointer"
            id="logo-link"
            aria-label="AuraGenix AI Home"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-[#090d1b] rounded-[11px] overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="AuraGenix AI Logo" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback gracefully if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 group-hover:text-purple-300 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                AuraGenix <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 -mt-1">
                Verified Tech Reviews 2026
              </span>
            </div>
          </button>

          {/* Desktop Navigation links on the right */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('hero');
              }}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-400'
              }`}
              id="nav-home"
            >
              Directory
            </a>

            {/* AI vs AI Comparison Mode */}
            {onCompareClick && (
              <a
                href="#/compare"
                onClick={(e) => {
                  e.preventDefault();
                  onCompareClick();
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer"
                id="nav-compare-btn"
              >
                <Swords className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI vs AI</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Versus
                </span>
              </a>
            )}

            {/* Daily Deals & Discounts */}
            {onDealsClick && (
              <a
                href="#/deals"
                onClick={(e) => {
                  e.preventDefault();
                  onDealsClick();
                }}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'deals' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-amber-300'
                }`}
                id="nav-deals-btn"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Deals</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  -50%
                </span>
              </a>
            )}

            {/* Trending AI News Feed */}
            {onNewsClick && (
              <a
                href="#/news"
                onClick={(e) => {
                  e.preventDefault();
                  onNewsClick();
                }}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'news' ? 'text-cyan-400 font-bold' : 'text-slate-300 hover:text-cyan-400'
                }`}
                id="nav-news-btn"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>News Radar</span>
              </a>
            )}

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'category' || categoriesOpen ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-400'
                }`}
                id="nav-categories"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 p-2 bg-[#090d1f] border border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/80 mb-1">
                    Explore Dedicated Categories
                  </div>
                  <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 py-1 space-y-0.5">
                    {NAV_CATEGORIES.map((cat) => (
                      <a
                        key={cat}
                        href={`#/category/${categoryToSlug(cat)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoriesOpen(false);
                          if (onCategoryClick) {
                            onCategoryClick(cat);
                          } else {
                            window.location.hash = `#/category/${categoryToSlug(cat)}`;
                          }
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate">{cat}</span>
                        <ChevronDown className="w-3 h-3 text-slate-600 -rotate-90 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('pricing-guide')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              id="nav-pricing"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                if (onContactClick) {
                  onContactClick();
                } else {
                  handleNavClick('contact-section');
                }
              }}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
              id="nav-contact"
            >
              <span>Contact</span>
            </button>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {onSearchClick && (
              <button
                type="button"
                onClick={onSearchClick}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer"
                id="nav-quick-search-btn"
                title="Search AI tools (/)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700 rounded">
                  /
                </kbd>
              </button>
            )}

            <button
              onClick={onSubmitToolClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              id="nav-submit-tool-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Tool</span>
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onSubmitToolClick}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg"
            >
              Submit
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070913]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('hero')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Directory Home
          </button>

          {onCompareClick && (
            <a
              href="#/compare"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onCompareClick();
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-cyan-300 hover:text-white cursor-pointer"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>AI vs AI Comparison (Versus Mode)</span>
            </a>
          )}

          {onDealsClick && (
            <a
              href="#/deals"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onDealsClick();
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-amber-300 hover:text-white cursor-pointer"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Daily AI Deals &amp; Discounts (-50%)</span>
            </a>
          )}

          {onNewsClick && (
            <a
              href="#/news"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNewsClick();
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-cyan-300 hover:text-white cursor-pointer"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Trending AI News Radar</span>
            </a>
          )}

          <a
            href="#/tools-grid"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('tools-grid');
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 cursor-pointer"
          >
            Top AI Tools
          </a>
          <div className="py-2 border-y border-slate-800/80 my-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
              AI Categories
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`#/category/${categoryToSlug(cat)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    if (onCategoryClick) {
                      onCategoryClick(cat);
                    } else {
                      window.location.hash = `#/category/${categoryToSlug(cat)}`;
                    }
                  }}
                  className="text-left text-xs py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 truncate cursor-pointer"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleNavClick('pricing-guide')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('ai-insights')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Blog
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onContactClick) {
                onContactClick();
              } else {
                handleNavClick('contact-section');
              }
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Contact &amp; Report Issue
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSubmitToolClick();
              }}
              className="w-full py-2.5 text-center font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-sm"
            >
              + Submit AI Tool
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
