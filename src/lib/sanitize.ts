/**
 * Basic XSS protection and input sanitization helpers
 */

export function sanitizeText(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip direct angle brackets
    .trim();
}

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const phoneClean = phone.replace(/[\s\-\+\(\)]/g, '');
  return phoneClean.length >= 7 && phoneClean.length <= 15;
}
