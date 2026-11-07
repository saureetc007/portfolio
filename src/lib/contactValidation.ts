/**
 * Contact form validation rules and types.
 * Shared between client UI validation and server-side verification.
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // Honeypot field
}

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const CONTACT_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MIN: 5,
  EMAIL_MAX: 120,
  SUBJECT_MIN: 3,
  SUBJECT_MAX: 150,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
} as const;

// RFC 5322 compliant email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: ContactValidationErrors;
  sanitized: ContactFormData;
} {
  const errors: ContactValidationErrors = {};

  const trimmedName = (data.name || '').trim();
  const trimmedEmail = (data.email || '').trim().toLowerCase();
  const trimmedSubject = (data.subject || '').trim();
  const trimmedMessage = (data.message || '').trim();

  // 1. Name validation
  if (!trimmedName) {
    errors.name = 'Full name is required.';
  } else if (trimmedName.length < CONTACT_LIMITS.NAME_MIN) {
    errors.name = `Name must be at least ${CONTACT_LIMITS.NAME_MIN} characters.`;
  } else if (trimmedName.length > CONTACT_LIMITS.NAME_MAX) {
    errors.name = `Name cannot exceed ${CONTACT_LIMITS.NAME_MAX} characters.`;
  }

  // 2. Email validation
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (trimmedEmail.length < CONTACT_LIMITS.EMAIL_MIN || trimmedEmail.length > CONTACT_LIMITS.EMAIL_MAX) {
    errors.email = `Email must be between ${CONTACT_LIMITS.EMAIL_MIN} and ${CONTACT_LIMITS.EMAIL_MAX} characters.`;
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please provide a valid email address (e.g., name@domain.com).';
  }

  // 3. Subject validation
  if (!trimmedSubject) {
    errors.subject = 'Subject is required.';
  } else if (trimmedSubject.length < CONTACT_LIMITS.SUBJECT_MIN) {
    errors.subject = `Subject must be at least ${CONTACT_LIMITS.SUBJECT_MIN} characters.`;
  } else if (trimmedSubject.length > CONTACT_LIMITS.SUBJECT_MAX) {
    errors.subject = `Subject cannot exceed ${CONTACT_LIMITS.SUBJECT_MAX} characters.`;
  }

  // 4. Message validation
  if (!trimmedMessage) {
    errors.message = 'Message content is required.';
  } else if (trimmedMessage.length < CONTACT_LIMITS.MESSAGE_MIN) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.MESSAGE_MIN} characters.`;
  } else if (trimmedMessage.length > CONTACT_LIMITS.MESSAGE_MAX) {
    errors.message = `Message cannot exceed ${CONTACT_LIMITS.MESSAGE_MAX} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: sanitizeText(trimmedName),
      email: trimmedEmail,
      subject: sanitizeText(trimmedSubject),
      message: sanitizeText(trimmedMessage),
      website: data.website ? sanitizeText(data.website.trim()) : undefined,
    },
  };
}

