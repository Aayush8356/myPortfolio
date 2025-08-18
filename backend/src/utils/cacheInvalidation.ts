/**
 * Cache Invalidation Utilities
 * Handles cache invalidation for admin actions to ensure real-time updates
 */

interface CacheInvalidationConfig {
  vercelToken?: string;
  vercelProjectId?: string;
  frontendDomain: string;
}

const config: CacheInvalidationConfig = {
  vercelToken: process.env.VERCEL_TOKEN,
  vercelProjectId: process.env.VERCEL_PROJECT_ID,
  frontendDomain: process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com'
};

/**
 * Invalidate Vercel edge cache for specific paths
 */
export async function invalidateVercelCache(paths: string[]): Promise<void> {
  if (!config.vercelToken || !config.vercelProjectId) {
    console.warn('Vercel cache invalidation skipped: Missing VERCEL_TOKEN or VERCEL_PROJECT_ID');
    return;
  }

  try {
    const response = await fetch(`https://api.vercel.com/v1/projects/${config.vercelProjectId}/purge`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paths })
    });

    if (response.ok) {
      console.log(`Vercel cache invalidated for paths: ${paths.join(', ')}`);
    } else {
      console.warn(`Vercel cache invalidation failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Vercel cache invalidation error:', error);
  }
}

/**
 * Invalidate browser cache by setting no-cache headers on next request
 */
export async function triggerBrowserCacheInvalidation(paths: string[]): Promise<void> {
  try {
    // Ping the frontend paths to warm cache with no-cache headers
    const promises = paths.map(async (path) => {
      try {
        await fetch(`${config.frontendDomain}${path}`, {
          method: 'HEAD',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
      } catch (error) {
        // Ignore individual path errors
      }
    });

    await Promise.allSettled(promises);
    console.log(`Browser cache invalidation triggered for paths: ${paths.join(', ')}`);
  } catch (error) {
    console.warn('Browser cache invalidation error:', error);
  }
}

/**
 * Comprehensive cache invalidation for projects
 */
export async function invalidateProjectsCache(): Promise<void> {
  const paths = [
    '/api/projects',
    '/api/projects/featured',
    '/' // Home page cache
  ];

  await Promise.all([
    invalidateVercelCache(paths),
    triggerBrowserCacheInvalidation(paths)
  ]);
}

/**
 * Comprehensive cache invalidation for contact details
 */
export async function invalidateContactCache(): Promise<void> {
  const paths = [
    '/api/contact-details',
    '/' // Home page cache
  ];

  await Promise.all([
    invalidateVercelCache(paths),
    triggerBrowserCacheInvalidation(paths)
  ]);
}

/**
 * Comprehensive cache invalidation for resume
 */
export async function invalidateResumeCache(): Promise<void> {
  const paths = [
    '/api/resume/current',
    '/blob/resume',
    '/' // Home page cache
  ];

  await Promise.all([
    invalidateVercelCache(paths),
    triggerBrowserCacheInvalidation(paths)
  ]);
}

/**
 * Invalidate all caches - use sparingly
 */
export async function invalidateAllCache(): Promise<void> {
  const paths = [
    '/api/projects',
    '/api/projects/featured', 
    '/api/contact-details',
    '/api/resume/current',
    '/blob/resume',
    '/'
  ];

  await Promise.all([
    invalidateVercelCache(paths),
    triggerBrowserCacheInvalidation(paths)
  ]);
}