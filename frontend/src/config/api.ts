// Production domain for consistent branding
export const PRODUCTION_DOMAIN = process.env.REACT_APP_PRODUCTION_DOMAIN || 'https://meetaayush.com';

// Use local development server when available, fallback to production
// For testing: use localhost backend even with production frontend
const useLocalBackend = window.location.search.includes('local-backend=true') || 
                       localStorage.getItem('useLocalBackend') === 'true';

export const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' || useLocalBackend 
    ? 'http://localhost:5002/api' 
    : `${PRODUCTION_DOMAIN}/api`);

// Derive origin dynamically in the browser so preview/download use the active domain by default
const RUNTIME_ORIGIN = typeof window !== 'undefined' ? window.location.origin : PRODUCTION_DOMAIN;

// Custom domain URLs for consistent branding - prefer explicit envs, otherwise use current origin
export const BLOB_BASE_URL = process.env.REACT_APP_BLOB_BASE_URL ||
  (process.env.NODE_ENV === 'development' || useLocalBackend 
    ? 'http://localhost:5002/blob' 
    : `${RUNTIME_ORIGIN}/blob`);

export const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_BASE_URL ||
  (process.env.NODE_ENV === 'development' || useLocalBackend 
    ? 'http://localhost:5002/assets' 
    : `${RUNTIME_ORIGIN}/assets`);