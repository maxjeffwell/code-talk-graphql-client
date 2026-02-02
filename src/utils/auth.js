/**
 * Authentication Utilities
 *
 * IMPORTANT: Authentication is now handled via httpOnly cookies.
 * - Tokens are set/cleared by the server, not the client
 * - JavaScript cannot read httpOnly cookies (this is a security feature)
 * - Authentication status should be determined via the `me` GraphQL query
 *
 * This file is kept for backwards compatibility but most functions
 * are no longer needed.
 */

import logger from './logger';

// ============================================================================
// DEPRECATED - These functions are kept for backwards compatibility only
// With httpOnly cookies, the client cannot access tokens
// ============================================================================

const TOKEN_KEY = 'auth_token';

/**
 * @deprecated Tokens are now stored in httpOnly cookies
 */
export const getToken = () => {
  logger.warn('getToken() is deprecated - auth now uses httpOnly cookies');
  return null;
};

/**
 * @deprecated Tokens are now set by the server via httpOnly cookies
 */
export const setToken = (token) => {
  logger.warn('setToken() is deprecated - auth now uses httpOnly cookies');
  // Clean up any legacy tokens
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // Ignore errors
  }
};

/**
 * @deprecated Tokens are now cleared by the server via signOut mutation
 */
export const removeToken = () => {
  logger.warn('removeToken() is deprecated - use signOut mutation instead');
  // Clean up any legacy tokens
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // Ignore errors
  }
};

/**
 * @deprecated Cannot check token existence with httpOnly cookies
 * Use the `me` query to check authentication status
 */
export const hasToken = () => {
  logger.warn('hasToken() is deprecated - use session.me to check auth status');
  return false;
};

/**
 * @deprecated Cannot decode httpOnly cookie tokens client-side
 */
export const decodeTokenPayload = (token) => {
  logger.warn('decodeTokenPayload() is deprecated - tokens are in httpOnly cookies');
  return null;
};

/**
 * @deprecated Cannot check expiration of httpOnly cookie tokens
 */
export const isTokenExpired = (token = null) => {
  logger.warn('isTokenExpired() is deprecated - server handles token expiration');
  return false;
};

/**
 * @deprecated Cannot get expiry of httpOnly cookie tokens
 */
export const getTokenTimeToExpiry = (token = null) => {
  logger.warn('getTokenTimeToExpiry() is deprecated - tokens are in httpOnly cookies');
  return 0;
};
