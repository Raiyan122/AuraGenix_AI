import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Copy,
  Check,
  Loader2,
  Bug,
  FileCheck2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { ContactCategory, ContactFormData } from '../types';
import {
  OFFICIAL_EMAIL,
  sendContactFeedback,
  generateMailtoUrl,
  validateContactForm
} from '../utils/contactService';

interface ContactSectionProps {
  initialCategory?: ContactCategory;
  initialToolContext?: string;
  className?: string;
  id?: string;
}

const CATEGORY_OPTIONS: Array<{
  id: ContactCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'Report a Bug / Issue',
    label: 'Report a Bug / Issue',
    icon: Bug,
    description: 'Broken link, inaccurate benchmark, or UI glitch'
  },
  {
    id: 'Review Correction / Update',
    label: 'Review Correction',
    icon: FileCheck2,
    description: 'Outdated pricing, changed features, or model upgrade'
  },
  {
    id: 'Suggest a New AI Tool',
    label: 'Suggest AI Tool',
    icon: Sparkles,
    description: 'Submit an unlisted tool for editorial benchmarking'
  },
  {
    id: 'Partnership & Sponsorship',
    label: 'Partnership',
    icon: MessageSquareQuote,
    description: 'Sponsorships, data API licensing, and enterprise inquiries'
  },
  {
    id: 'General Inquiry',
    label: 'General Inquiry',
    icon: HelpCircle,
    description: 'Questions regarding our scoring methodology or team'
  }
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialCategory = 'General Inquiry',
  initialToolContext = '',
  className = '',
  id = 'contact-section'
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: initialCategory,
    subject: '',
    message: '',
    toolContext: initialToolContext
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [mailtoFallbackUrl, setMailtoFallbackUrl] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(OFFICIAL_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      if (!formData.name.trim()) setFieldErrors((prev) => ({ ...prev, name: 'Name is required' }));
      if (!formData.email.trim()) setFieldErrors((prev) => ({ ...prev, email: 'Valid email is required' }));
      if (formData.message.trim().length < 10) {
        setFieldErrors((prev) => ({ ...prev, message: 'Message must be at least 10 characters' }));
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    const result = await sendContactFeedback(formData);

    setIsSubmitting(false);
    if (result.success) {
      setSubmissionStatus('success');
      setStatusMessage(result.message);
    } else {
      setSubmissionStatus('error');
      setStatusMessage(result.message);
      if (result.mailtoFallback) {
        setMailtoFallbackUrl(result.mailtoFallback);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      category: 'General Inquiry',
      subject: '',
      message: '',
      toolContext: ''
    });
    setSubmissionStatus('idle');
    setStatusMessage('');
    setMailtoFallbackUrl('');
    setFieldErrors({});
  };

  return (
    <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 ${className}`}>
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span>Editorial &amp; Support Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Contact Us &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Report an Issue</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          Have feedback on a review, discovered an outdated pricing tier, or spotted a platform bug?
          Send a direct report to our review board at <span className="text-cyan-300 font-medium">{OFFICIAL_EMAIL}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#090d1e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/5 blur-[80px] pointer-events-none rounded-full" />

          {/* SUCCESS STATE */}
          {submissionStatus === 'success' ? (
            <div className="py-8 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Message Delivered!</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {statusMessage}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span>Delivered to:</span>
                  <span className="font-mono text-cyan-300">{OFFICIAL_EMAIL}</span>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
                <a
                  href="#tools-grid"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors text-center cursor-pointer"
                >
                  Return to AI Directory
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* ERROR STATE BANNER */}
              {submissionStatus === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-rose-300">Message Dispatch Alert</span>
                      <p className="mt-0.5 text-slate-300 leading-relaxed">{statusMessage}</p>
                    </div>
                  </div>
                  {mailtoFallbackUrl && (
                    <div className="pt-2 border-t border-rose-900/60 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400">Direct fallback ready:</span>
                      <a
                        href={mailtoFallbackUrl}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors"
                      >
                        <span>Open in Email App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 1. Category / Inquiry Type Pill Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                  Select Topic / Issue Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="font-semibold truncate">{cat.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 line-clamp-1 leading-tight">
                          {cat.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sender Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                    }}
                    placeholder="e.g. Alex Rivera"
                    className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                      fieldErrors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{fieldErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="alex@company.com"
                    className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                      fieldErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    }`}
                  />
                  {fieldErrors.email && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              {/* 3. Subject / Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject or Tool Reference <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={
                    formData.category === 'Review Correction / Update'
                      ? 'e.g. Perplexity Pro updated its API pricing'
                      : formData.category === 'Report a Bug / Issue'
                      ? 'e.g. Broken external link in Cursor review'
                      : 'Brief summary of your inquiry'
                  }
                  className="w-full bg-[#080b18] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Tool Context indicator if attached */}
              {formData.toolContext && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
                  <span className="truncate">Active Context: <strong>{formData.toolContext}</strong></span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, toolContext: '' })}
                    className="text-[10px] text-slate-400 hover:text-white underline ml-2 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* 4. Detailed Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Your Message / Issue Details *
                  </label>
                  <span className={`text-[10px] ${formData.message.length >= 10 ? 'text-slate-400' : 'text-amber-400'}`}>
                    {formData.message.length} characters (min 10)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                  }}
                  placeholder="Provide complete context, steps to reproduce, or review details so our technical team can address it immediately..."
                  className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all resize-none ${
                    fieldErrors.message ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                  }`}
                />
                {fieldErrors.message && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{fieldErrors.message}</span>
                )}
              </div>

              {/* Submit & Action Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Average response time: &lt; 24 hours</span>
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="contact-form-submit-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Forwarding to Inbox...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to Official Inbox</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Direct Info & Editorial Guarantee (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Direct Email Card */}
          <div className="p-6 rounded-3xl bg-[#090d1e] border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold block mb-1">
                  Direct Channel
                </span>
                <h3 className="text-base font-bold text-white">Official Email Address</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Direct editorial inbox for urgent corrections, partnership proposals, and press inquiries.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-[#060813] border border-slate-800/90 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-cyan-300 select-all truncate">
                {OFFICIAL_EMAIL}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=[AuraGenix%20AI]%20Direct%20Inquiry`}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Launch Email Client</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-slate-500">Auto-forwarding active</span>
            </div>
          </div>

          {/* Operational Status & Turnaround Card */}
          <div className="p-6 rounded-3xl bg-[#090d1e] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Review Board Status
              </h4>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Desk Active</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white block">24-Hour SLA Commitment</span>
                  <span className="text-slate-400">
                    We evaluate reported broken URLs, API tier changes, and score updates within one business day.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileCheck2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Zero Vendor Influence</span>
                  <span className="text-slate-400">
                    Correction requests are tested by our testing engineers against current model APIs.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Tech Review Headquarters</span>
                  <span className="text-slate-400">
                    Market Street, Financial District, San Francisco, CA.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Common Reports */}
          <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
            <span className="font-bold text-slate-200 block mb-1">Frequently Reported Topics:</span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
              <li>Vendor updated monthly pricing from Free to Paid</li>
              <li>New model release (e.g. Sonnet 3.7 / Claude 4, GPT-5 preview)</li>
              <li>Official domain redirected or changed SSL certificate</li>
              <li>Request for proprietary benchmark inclusion</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
};
