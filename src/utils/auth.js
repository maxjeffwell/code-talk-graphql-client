// Secure token management utilities
import logger from './logger';

const TOKEN_KEY = 'auth_token';

// Check if we're in a secure context (HTTPS or localhost)
const isSecureContext = () => {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Get token from secure storage
export const getToken = () => {
  try {
    // In production with HTTPS, prefer sessionStorage for better security
    if (isSecureContext() && process.env.NODE_ENV === 'production') {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    // Fallback to localStorage for development
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    logger.warn('Failed to retrieve token:', error);
    return null;
  }
};

// Set token in secure storage
export const setToken = (token) => {
  try {
    if (!token) {
      removeToken();
      return;
    }
    
    // In production with HTTPS, prefer sessionStorage
    if (isSecureContext() && process.env.NODE_ENV === 'production') {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    logger.warn('Failed to store token:', error);
  }
};

// Remove token from storage
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    logger.warn('Failed to remove token:', error);
  }
};

// Check if token exists
export const hasToken = () => {
  return !!getToken();
};

// Decode JWT payload (without verification - for client-side info only)
export const decodeTokenPayload = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    logger.warn('Failed to decode token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token = null) => {
  try {
    const tokenToCheck = token || getToken();
    if (!tokenToCheck) return true;
    
    const payload = decodeTokenPayload(tokenToCheck);
    if (!payload || !payload.exp) return true;
    
    // Check if token expires within the next 30 seconds
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= (now + 30);
  } catch (error) {
    logger.warn('Failed to check token expiration:', error);
    return true;
  }
};

// Get time until token expiration (in seconds)
export const getTokenTimeToExpiry = (token = null) => {
  try {
    const tokenToCheck = token || getToken();
    if (!tokenToCheck) return 0;
    
    const payload = decodeTokenPayload(tokenToCheck);
    if (!payload || !payload.exp) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  } catch (error) {
    logger.warn('Failed to get token expiry time:', error);
    return 0;
  }
};