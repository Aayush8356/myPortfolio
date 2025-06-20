interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + (ttlSeconds * 1000)
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    });
  }
}

export const apiCache = new SimpleCache();

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

export const cachedFetch = async <T>(
  url: string, 
  options: RequestInit = {}, 
  cacheKey?: string,
  ttlSeconds: number = 300
): Promise<T> => {
  const key = cacheKey || url;
  
  // Try to get from cache first
  const cached = apiCache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Add timeout to fetch - 10 seconds for better balance of speed and reliability
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=300',
        ...options.headers,
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the successful response with longer TTL for static content
    const extendedTTL = url.includes('/projects') || url.includes('/contact-details') ? 900 : ttlSeconds; // 15 minutes for projects/contact
    apiCache.set(key, data, extendedTTL);
    
    // Also store as stale cache for future fallback
    apiCache.set(key + '_stale', data, extendedTTL * 3); // Keep stale cache 3x longer
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Return stale cache if available on error
    const staleCache = apiCache.get<T>(key + '_stale');
    if (staleCache) {
      console.warn('Using stale cache due to error:', error);
      return staleCache;
    }
    
    throw error;
  }
};

// Function to pre-cache common data with consistent cache keys
export const preCacheData = async (baseUrl: string) => {
  try {
    // Pre-cache projects and contact details simultaneously with consistent cache keys
    const results = await Promise.allSettled([
      cachedFetch(`${baseUrl}/projects`, {}, 'projects-list', 300), // 5 minutes for projects
      cachedFetch(`${baseUrl}/contact-details`, {}, 'contact-details', 300), // 5 minutes for contact
      cachedFetch(`${baseUrl}/about`, {}, 'about-content', 300), // 5 minutes for about
      cachedFetch(`${baseUrl}/hero`, {}, 'hero-content', 300) // 5 minutes for hero
    ]);
    
    console.log('Pre-cache results:', results.map((r, i) => ({
      endpoint: ['projects', 'contact-details', 'about', 'hero'][i],
      status: r.status,
      reason: r.status === 'rejected' ? r.reason?.message : 'success'
    })));
  } catch (error) {
    console.warn('Pre-caching failed:', error);
  }
};

// Helper function to get consistent cache keys
export const getCacheKey = (endpoint: string): string => {
  const keyMap: Record<string, string> = {
    'projects': 'projects-list',
    'contact-details': 'contact-details',
    'about': 'about-content',
    'hero': 'hero-content'
  };
  return keyMap[endpoint] || endpoint;
};

// Cache invalidation functions
export const clearProjectsCache = () => {
  apiCache.delete('projects-list');
  apiCache.delete('projects-list_stale');
  console.log('Cleared projects cache');
};

export const updateProjectsCache = (projects: any[]) => {
  // Update cache with fresh data instead of clearing it
  console.log('Cache: updateProjectsCache called with projects:', projects);
  apiCache.set('projects-list', projects, 300); // 5 minutes for normal cache
  apiCache.set('projects-list_stale', projects, 900); // 15 minutes for stale
  console.log('Cache: Updated projects cache with fresh data');
};

export const clearAllCache = () => {
  apiCache.clear();
  console.log('Cleared all cache');
};

export const invalidateCache = (keys: string[]) => {
  keys.forEach(key => {
    apiCache.delete(key);
    apiCache.delete(key + '_stale');
  });
  console.log('Invalidated cache for keys:', keys);
};