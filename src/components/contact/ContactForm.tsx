import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import {
  validateContactForm,
  CONTACT_LIMITS,
  type ContactFormData,
  type ContactValidationErrors,
} from '@/lib/contactValidation';

function SendIcon() {
  return (
    <svg className="contact-submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '', // Honeypot
};

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // If field was already touched, validate dynamically to clear resolved errors
    if (touched[name]) {
      const { errors: newErrors } = validateContactForm(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof ContactValidationErrors],
      }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: newErrors } = validateContactForm(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field as keyof ContactValidationErrors],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, email: true, subject: true, message: true });

    const { isValid, errors: validationErrors } = validateContactForm(formData);
    setErrors(validationErrors);

    if (!isValid) {
      // Focus the first invalid field
      if (validationErrors.name) nameInputRef.current?.focus();
      else if (validationErrors.email) emailInputRef.current?.focus();
      else if (validationErrors.subject) subjectInputRef.current?.focus();
      else if (validationErrors.message) messageInputRef.current?.focus();
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(
          data?.error ||
            'Unable to transmit message via server. Please try again or reach out directly at saureetc007@gmail.com.'
        );
        if (data?.errors) {
          setErrors(data.errors);
        }
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'A network error occurred while communicating with the server. Please check your connection or email saureetc007@gmail.com directly.'
      );
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({});
    setStatus('idle');
    setErrorMessage(null);
  };

  // SUCCESS STATE VIEW
  if (status === 'success') {
    return (
      <div className="contact-form-panel">
        <div className="contact-form-panel__top-accent" aria-hidden="true" />
        <div className="contact-success-state" role="status" aria-live="polite">
          <div className="contact-success-icon-wrap" aria-hidden="true">
            <CheckCircleIcon />
          </div>
          <h3 className="contact-success-title">Message Transmitted</h3>
          <p className="contact-success-desc">
            Message received. Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
          <button type="button" className="contact-reset-btn" onClick={handleReset}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="contact-form-panel">
      <div className="contact-form-panel__top-accent" aria-hidden="true" />

      <div className="contact-form-header">
        <h3 className="contact-form-title">Send a Message</h3>
        <p className="contact-form-subtitle">
          Direct inquiry to Saureet Chakrabarti via secure transactional dispatch.
        </p>
      </div>

      {status === 'error' && errorMessage && (
        <div className="contact-feedback-banner contact-feedback-banner--error" role="alert">
          <div className="contact-feedback-icon--error" aria-hidden="true">
            <AlertCircleIcon />
          </div>
          <div>
            <strong>Transmission Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot field for bot spam trap */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className="contact-form__honeypot"
          aria-hidden="true"
        />

        {/* 1. Full Name */}
        <div className="contact-form-group">
          <div className="contact-form-label-row">
            <label htmlFor="contact-name" className="contact-form-label">
              Full Name
              <span className="contact-form-required" aria-hidden="true">
                *
              </span>
            </label>
            <span className="contact-char-counter">
              {formData.name.length}/{CONTACT_LIMITS.NAME_MAX}
            </span>
          </div>
          <input
            ref={nameInputRef}
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            maxLength={CONTACT_LIMITS.NAME_MAX}
            placeholder="e.g. Alex Morgan"
            autoComplete="name"
            required
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`contact-form-input ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && (
            <div id="contact-name-error" className="contact-form-error-msg" role="alert">
              <AlertCircleIcon />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* 2. Email Address */}
        <div className="contact-form-group">
          <div className="contact-form-label-row">
            <label htmlFor="contact-email" className="contact-form-label">
              Email Address
              <span className="contact-form-required" aria-hidden="true">
                *
              </span>
            </label>
            <span className="contact-char-counter">
              {formData.email.length}/{CONTACT_LIMITS.EMAIL_MAX}
            </span>
          </div>
          <input
            ref={emailInputRef}
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            maxLength={CONTACT_LIMITS.EMAIL_MAX}
            placeholder="alex@example.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`contact-form-input ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && (
            <div id="contact-email-error" className="contact-form-error-msg" role="alert">
              <AlertCircleIcon />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* 3. Subject */}
        <div className="contact-form-group">
          <div className="contact-form-label-row">
            <label htmlFor="contact-subject" className="contact-form-label">
              Subject
              <span className="contact-form-required" aria-hidden="true">
                *
              </span>
            </label>
            <span
              className={`contact-char-counter ${
                formData.subject.length > 130 ? 'is-near-limit' : ''
              }`}
            >
              {formData.subject.length}/{CONTACT_LIMITS.SUBJECT_MAX}
            </span>
          </div>
          <input
            ref={subjectInputRef}
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={() => handleBlur('subject')}
            maxLength={CONTACT_LIMITS.SUBJECT_MAX}
            placeholder="Project inquiry, applied AI, or collaboration"
            required
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            className={`contact-form-input ${errors.subject ? 'is-invalid' : ''}`}
          />
          {errors.subject && (
            <div id="contact-subject-error" className="contact-form-error-msg" role="alert">
              <AlertCircleIcon />
              <span>{errors.subject}</span>
            </div>
          )}
        </div>

        {/* 4. Message */}
        <div className="contact-form-group">
          <div className="contact-form-label-row">
            <label htmlFor="contact-message" className="contact-form-label">
              Message
              <span className="contact-form-required" aria-hidden="true">
                *
              </span>
            </label>
            <span
              className={`contact-char-counter ${
                formData.message.length > 1800 ? 'is-near-limit' : ''
              }`}
            >
              {formData.message.length}/{CONTACT_LIMITS.MESSAGE_MAX}
            </span>
          </div>
          <textarea
            ref={messageInputRef}
            id="contact-message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur('message')}
            maxLength={CONTACT_LIMITS.MESSAGE_MAX}
            placeholder="Tell me about what you're building, the timeline, or what you'd like to collaborate on..."
            required
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`contact-form-textarea ${errors.message ? 'is-invalid' : ''}`}
          />
          {errors.message && (
            <div id="contact-message-error" className="contact-form-error-msg" role="alert">
              <AlertCircleIcon />
              <span>{errors.message}</span>
            </div>
          )}
        </div>

        {/* 5. Submit Action */}
        <div className="contact-form-actions">
          <button
            type="submit"
            className="contact-submit-btn"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="contact-spinner" aria-hidden="true" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <SendIcon />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

