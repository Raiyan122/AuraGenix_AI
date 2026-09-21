import React, { useState } from 'react';
import { Sparkles, PlusCircle, Menu, X, Search } from 'lucide-react';

interface NavbarProps {
  onSubmitToolClick: () => void;
  onNavigateHome?: (sectionId?: string) => void;
  onSearchClick?: () => void;
  onContactClick?: () => void;
  currentView?: 'home' | 'tool';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSubmitToolClick, 
  onNavigateHome,
  onSearchClick,
  onContactClick,
  currentView = 'home' 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#090d1b] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 group-hover:text-purple-300 transition-all" />
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
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('hero')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-cyan-400'
              }`}
              id="nav-home"
            >
              Directory Home
            </button>
            <button
              onClick={() => handleNavClick('tools-grid')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              id="nav-top-tools"
            >
              Top AI Tools
            </button>
            <button
              onClick={() => handleNavClick('categories-section')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              id="nav-categories"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('pricing-guide')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              id="nav-pricing"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('ai-insights')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              id="nav-blog"
            >
              Blog
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
          <button
            onClick={() => handleNavClick('tools-grid')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Top AI Tools
          </button>
          <button
            onClick={() => handleNavClick('categories-section')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-cyan-400"
          >
            Categories
          </button>
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
