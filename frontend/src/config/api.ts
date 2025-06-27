// Production domain for consistent branding
export const PRODUCTION_DOMAIN = process.env.REACT_APP_PRODUCTION_DOMAIN || 'https://meetaayush.com';

// Use local development server when available, fallback to production
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5002/api' : `${PRODUCTION_DOMAIN}/api`);

// Custom domain URLs for consistent branding - always use your domain
export const BLOB_BASE_URL = `${PRODUCTION_DOMAIN}/blob`;
export const ASSETS_BASE_URL = `${PRODUCTION_DOMAIN}/assets`;