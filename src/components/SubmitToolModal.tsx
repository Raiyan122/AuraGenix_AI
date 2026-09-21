import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ToolCategory } from '../types';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ToolCategory[];
}

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [formData, setFormData] = useState({
    toolName: '',
    websiteUrl: '',
    category: 'Coding',
    pricing: 'Freemium',
    description: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toolName.trim() || !formData.websiteUrl.trim() || !formData.description.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    setFormData({
      toolName: '',
      websiteUrl: '',
      category: 'Coding',
      pricing: 'Freemium',
      description: '',
      email: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0c1021] border border-slate-700/80 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
        id="submit-tool-modal"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Submit AI Tool</h2>
              <p className="text-xs text-slate-400">Get listed on AuraGenix AI 2026 Directory</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Submission Received!</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Thank you for submitting <strong className="text-cyan-300">{formData.toolName}</strong>. Our editorial team will review your application and benchmark results within 48 hours.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:opacity-95 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tool Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Synthetix AI"
                value={formData.toolName}
                onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Official Website URL <span className="text-cyan-400">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://example.ai"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Primary Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Pricing Model
                </label>
                <select
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Freemium" className="bg-slate-900 text-white">Freemium</option>
                  <option value="Paid" className="bg-slate-900 text-white">Paid</option>
                  <option value="Free" className="bg-slate-900 text-white">100% Free</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Short Description &amp; Key Features <span className="text-cyan-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="What does your AI tool do? What makes it unique?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Creator / Submitter Work Email
              </label>
              <input
                type="email"
                placeholder="founder@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit for Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
