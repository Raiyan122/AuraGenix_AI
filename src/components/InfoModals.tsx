import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Bug,
  FileCheck2,
  Sparkles,
  HelpCircle,
  MessageSquareQuote
} from 'lucide-react';
import { ContactCategory, ContactFormData } from '../types';
import {
  OFFICIAL_EMAIL,
  sendContactFeedback,
  validateContactForm
} from '../utils/contactService';

export interface InfoModalContext {
  initialCategory?: ContactCategory;
  initialSubject?: string;
  toolContext?: string;
}

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'contact' | null;
  context?: InfoModalContext;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, context, onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: context?.initialCategory || 'General Inquiry',
    subject: context?.initialSubject || '',
    message: '',
    toolContext: context?.toolContext || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [mailtoFallbackUrl, setMailtoFallbackUrl] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (context) {
      setFormData((prev) => ({
        ...prev,
        category: context.initialCategory || prev.category,
        subject: context.initialSubject || prev.subject,
        toolContext: context.toolContext || prev.toolContext,
      }));
    }
    if (type !== 'contact') {
      setSubmissionStatus('idle');
      setStatusMessage('');
      setFieldErrors({});
    }
  }, [context, type]);

  if (!type) return null;

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
      toolContext: '',
    });
    setSubmissionStatus('idle');
    setStatusMessage('');
    setMailtoFallbackUrl('');
    setFieldErrors({});
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#0b0f1f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-left text-slate-200 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-purple-400" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-cyan-400" />}
            <h3 className="text-xl font-bold text-white">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'contact' && (formData.category === 'Report a Bug / Issue' ? 'Report an Issue' : 'Contact AuraGenix AI')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'privacy' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <p className="font-semibold text-white">Effective Date: January 1, 2026</p>
            <p>
              At AuraGenix AI, we are committed to safeguarding your privacy and ensuring transparency regarding our technical benchmarks and tool review process.
            </p>
            <h4 className="font-bold text-white pt-2">1. Information We Collect</h4>
            <p>
              We only collect information you voluntarily provide, such as your email address when subscribing to our intelligence reports or tool metadata when submitting an AI product for review.
            </p>
            <h4 className="font-bold text-white pt-2">2. Editorial Independence</h4>
            <p>
              Our review rankings and performance metrics are independently verified. We do not sell personally identifiable information to third-party data brokers.
            </p>
            <h4 className="font-bold text-white pt-2">3. Cookies &amp; Local Storage</h4>
            <p>
              We utilize minimal client-side preferences (such as your active category filter and theme state) to enhance your browsing experience.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <p className="font-semibold text-white">Last Updated: January 1, 2026</p>
            <p>
              By accessing AuraGenix AI, you agree to comply with and be bound by these Terms of Service.
            </p>
            <h4 className="font-bold text-white pt-2">1. Directory &amp; Benchmark Data</h4>
            <p>
              The ratings, pricing estimates, and benchmark scores provided on AuraGenix AI are compiled for informational and comparative purposes. AI software pricing and feature sets are subject to change by respective vendors.
            </p>
            <h4 className="font-bold text-white pt-2">2. Submissions</h4>
            <p>
              Tool creators submitting products warrant that all provided descriptions and claims are accurate and do not infringe on intellectual property rights.
            </p>
            <h4 className="font-bold text-white pt-2">3. Limitation of Liability</h4>
            <p>
              AuraGenix AI provides tool evaluations "as is" and shall not be liable for any damages resulting from reliance on the information presented.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="relative z-10">
            {/* Quick Header Banner */}
            <div className="mb-4 p-3 rounded-2xl bg-[#070a16] border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Inbox: <strong className="text-cyan-300 font-mono select-all">{OFFICIAL_EMAIL}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {submissionStatus === 'success' ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Thank you! Your message has been sent.</h4>
                  <p className="mt-1 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {statusMessage}
                  </p>
                  <p className="mt-2 text-[11px] text-cyan-400 font-medium">
                    Delivered straight to {OFFICIAL_EMAIL}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Send Another
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ERROR ALERT */}
                {submissionStatus === 'error' && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Failed to deliver message</span>
                        <p className="text-slate-300 mt-0.5">{statusMessage}</p>
                      </div>
                    </div>
                    {mailtoFallbackUrl && (
                      <div className="pt-2 border-t border-rose-900/50 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Direct fallback:</span>
                        <a
                          href={mailtoFallbackUrl}
                          className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded inline-flex items-center gap-1"
                        >
                          <span>Open in Email App</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Topic selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                    Topic / Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Report a Bug / Issue', label: 'Report Bug / Issue', icon: Bug },
                      { id: 'Review Correction / Update', label: 'Review Correction', icon: FileCheck2 },
                      { id: 'Suggest a New AI Tool', label: 'Suggest New Tool', icon: Sparkles },
                      { id: 'Partnership & Sponsorship', label: 'Partnership', icon: MessageSquareQuote },
                      { id: 'General Inquiry', label: 'General Inquiry', icon: HelpCircle },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.category === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: item.id as ContactCategory })}
                          className={`p-2 rounded-xl text-left border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-semibold'
                              : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tool Context notice if prefilled */}
                {formData.toolContext && (
                  <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
                    <span className="truncate">Regarding: <strong>{formData.toolContext}</strong></span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, toolContext: '' })}
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                      Your Name *
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
                      placeholder="Alex Morgan"
                      className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                        fieldErrors.name ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {fieldErrors.name && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">{fieldErrors.name}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                      Your Email *
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
                      className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                        fieldErrors.email ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      }`}
                    />
                    {fieldErrors.email && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">{fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                    Subject <span className="text-slate-500 lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of the feedback or issue"
                    className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase text-slate-300">
                      Message / Details *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formData.message.length} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                    }}
                    placeholder="Describe your issue, bug steps, correction details, or inquiry..."
                    className={`w-full bg-[#080b18] border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none ${
                      fieldErrors.message ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    }`}
                  />
                  {fieldErrors.message && (
                    <span className="text-[10px] text-rose-400 mt-0.5 block">{fieldErrors.message}</span>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl hover:opacity-95 shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending to Inbox...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {type !== 'contact' && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

