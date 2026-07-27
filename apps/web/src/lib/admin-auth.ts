/**
 * Server-only helpers for admin URL token authentication.
 * This module MUST NOT be imported by client components.
 */

/**
 * Compare two strings in constant time to mitigate timing attacks.
 * Assumes both inputs have the same length; if they differ, the length
 * difference is leaked. For fixed-length tokens (e.g. UUIDs) this is acceptable.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate a hash against the configured ADMIN_ACCESS_TOKEN.
 * Returns false when the token is not configured, the hash is missing,
 * or the hash does not match.
 */
export function isValidAdminToken(hash: string | null | undefined): boolean {
  const adminToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!adminToken || !hash) {
    return false;
  }

  return timingSafeEqual(hash, adminToken);
}
