import React from 'react';
import { X, ShieldCheck, FileText, Mail, Send, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({ name: '', email: '', message: '' });

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#0b0f1f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-left text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-purple-400" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-blue-400" />}
            <h3 className="text-xl font-bold text-white">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'contact' && 'Contact AuraGenix AI'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
          <div>
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Sent!</h4>
                <p className="text-xs text-slate-300">
                  Our technical editorial team in San Francisco, CA will respond to your inquiry within 24 hours.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Inquire about editorial partnerships, corrections, or sponsorships..."
                    className="w-full bg-[#080b18] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:opacity-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
