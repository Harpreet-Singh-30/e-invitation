// Slug validation and reserved words

const RESERVED_SLUGS = new Set([
  'www', 'admin', 'api', 'app', 'mail', 'static', 'assets', 'cdn',
  'login', 'pay', 'help', 'support', 'status', 'blog', 'contact',
  'about', 'demo', 'test', 'staging', 'dev', 'prod', 'ftp', 'smtp',
  'webmail', 'cpanel', 'whm', 'portal', 'dashboard', 'console',
  // Add profanity blocking here
]);

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

export interface SlugValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSlug(slug: string): SlugValidationResult {
  // Normalize
  const normalized = slug.toLowerCase().trim();
  
  // Length check
  if (normalized.length < MIN_LENGTH) {
    return { valid: false, error: `Slug must be at least ${MIN_LENGTH} characters` };
  }
  
  if (normalized.length > MAX_LENGTH) {
    return { valid: false, error: `Slug must be at most ${MAX_LENGTH} characters` };
  }
  
  // Format check
  if (!SLUG_REGEX.test(normalized)) {
    return { 
      valid: false, 
      error: 'Slug can only contain lowercase letters, numbers, and hyphens (not at start or end)' 
    };
  }
  
  // Reserved words
  if (RESERVED_SLUGS.has(normalized)) {
    return { valid: false, error: 'This slug is reserved and cannot be used' };
  }
  
  // Check for consecutive hyphens
  if (normalized.includes('--')) {
    return { valid: false, error: 'Slug cannot contain consecutive hyphens' };
  }
  
  return { valid: true };
}

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphen
    .replace(/--+/g, '-') // Remove consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function suggestSlug(groom: string, bride: string): string {
  const combined = `${groom}-${bride}`;
  return normalizeSlug(combined);
}
