// Use local development server when available, fallback to production
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5002/api' : 'https://meetaayush.com/api');

// Custom domain URLs for consistent branding
export const BLOB_BASE_URL = 'https://meetaayush.com/blob';
export const ASSETS_BASE_URL = 'https://meetaayush.com/assets';