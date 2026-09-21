import { ContactFormData } from '../types';

export const OFFICIAL_EMAIL = 'auragenixai.official@gmail.com';

export interface SendFeedbackResult {
  success: boolean;
  message: string;
  mailtoFallback?: string;
}

/**
 * Validates the contact form fields before submission
 */
export function validateContactForm(data: ContactFormData): { isValid: boolean; error?: string } {
  if (!data.name || data.name.trim().length < 2) {
    return { isValid: false, error: 'Please enter your full name (at least 2 characters).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (!data.message || data.message.trim().length < 10) {
    return { isValid: false, error: 'Please provide a descriptive message (at least 10 characters).' };
  }

  return { isValid: true };
}

/**
 * Generates an instant mailto link as a direct fallback
 */
export function generateMailtoUrl(data: ContactFormData): string {
  const subject = encodeURIComponent(
    `[AuraGenix AI] ${data.category}${data.subject ? `: ${data.subject}` : ''}`
  );
  
  const bodyText = `Sender Name: ${data.name}
Sender Email: ${data.email}
Category: ${data.category}
${data.toolContext ? `Tool Context: ${data.toolContext}\n` : ''}
Timestamp: ${new Date().toISOString()}

Message:
${data.message}

---
Sent from AuraGenix AI (auragenixai.official@gmail.com)`;

  const body = encodeURIComponent(bodyText);
  return `mailto:${OFFICIAL_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Sends feedback and issue reports directly and automatically to auragenixai.official@gmail.com
 * using FormSubmit AJAX API with automated mailto fallback on network disruption.
 */
export async function sendContactFeedback(data: ContactFormData): Promise<SendFeedbackResult> {
  // 1. Client-side validation
  const validation = validateContactForm(data);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.error || 'Please fill in all required fields properly.',
      mailtoFallback: generateMailtoUrl(data),
    };
  }

  // 2. Prepare payload for instant delivery to auragenixai.official@gmail.com
  const emailSubject = `[AuraGenix AI] ${data.category}: ${data.subject?.trim() || data.name}`;
  
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    _replyto: data.email.trim(),
    category: data.category,
    subject: data.subject?.trim() || 'No specific subject provided',
    tool_context: data.toolContext || 'General Platform',
    message: data.message.trim(),
    submission_time: new Date().toLocaleString(),
    _subject: emailSubject,
    _template: 'table',
    _captcha: 'false',
  };

  try {
    // Attempt 1: Direct FormSubmit endpoint for auragenixai.official@gmail.com
    const response = await fetch(`https://formsubmit.co/ajax/${OFFICIAL_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json().catch(() => ({ success: 'true' }));
      if (result.success === 'true' || result.success === true || response.status === 200) {
        return {
          success: true,
          message: 'Thank you! Your message has been sent successfully to auragenixai.official@gmail.com. Our editorial desk will review it shortly.',
        };
      }
    }

    // Attempt 2: Fallback to Formspree public gateway if available or response was not ok
    const fallbackResponse = await fetch(`https://formspree.io/f/mqkrvkpv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        recipient: OFFICIAL_EMAIL,
      }),
    });

    if (fallbackResponse.ok) {
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully to our official inbox. We will get back to you within 24 hours.',
      };
    }

    // In case both services encounter network errors (e.g., adblocker or strict firewall)
    return {
      success: false,
      message: 'Could not connect to the mail forwarding server. You can still deliver your message directly using our 1-click email client link below.',
      mailtoFallback: generateMailtoUrl(data),
    };
  } catch (error) {
    console.warn('Network issue delivering contact form:', error);
    return {
      success: false,
      message: 'Network connection issue. Please use our instant direct email link to send your message to auragenixai.official@gmail.com.',
      mailtoFallback: generateMailtoUrl(data),
    };
  }
}
