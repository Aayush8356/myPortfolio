interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private persistentKeys = ['projects-list', 'contact-details', 'about-content', 'hero-content'];

  constructor() {
    // Load persistent cache from localStorage on initialization
    this.loadFromStorage();
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const now = Date.now();
    const entry = {
      data,
      timestamp: now,
      expiry: now + (ttlSeconds * 1000)
    };
    
    this.cache.set(key, entry);
    
    // Persist critical data to localStorage
    if (this.persistentKeys.some(pk => key.includes(pk))) {
      this.saveToStorage(key, entry);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      // Try to load from localStorage if not in memory
      const stored = this.loadFromStorage(key);
      if (stored) {
        this.cache.set(key, stored);
        return stored.data;
      }
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      // Don't delete from localStorage immediately - keep as fallback
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
    // Also remove from localStorage
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      // Failed to remove from localStorage
    }
  }

  clear(): void {
    this.cache.clear();
    // Clear localStorage cache
    this.persistentKeys.forEach(key => {
      try {
        localStorage.removeItem(`cache_${key}`);
        localStorage.removeItem(`cache_${key}_stale`);
      } catch (error) {
        // Failed to clear localStorage
      }
    });
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

  private saveToStorage<T>(key: string, entry: CacheEntry<T>): void {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      // Failed to save to localStorage
    }
  }

  private loadFromStorage(key?: string): CacheEntry<any> | null {
    if (key) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const entry = JSON.parse(stored);
          // Check if still valid or if it's a stale cache
          if (Date.now() < entry.expiry || key.includes('_stale')) {
            return entry;
          }
        }
      } catch (error) {
        // Failed to load from localStorage
      }
      return null;
    }

    // Load all persistent keys
    this.persistentKeys.forEach(pk => {
      try {
        const stored = localStorage.getItem(`cache_${pk}`);
        const staleStored = localStorage.getItem(`cache_${pk}_stale`);
        
        if (stored) {
          const entry = JSON.parse(stored);
          this.cache.set(pk, entry);
        }
        
        if (staleStored) {
          const staleEntry = JSON.parse(staleStored);
          this.cache.set(`${pk}_stale`, staleEntry);
        }
      } catch (error) {
        // Failed to load persistent cache
      }
    });
    
    return null;
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

  // Only use stale cache as last resort, not proactively
  const staleCache = apiCache.get<T>(key + '_stale');

  // Extended timeout for cold starts - 30 seconds for production
  const timeout = process.env.NODE_ENV === 'production' ? 30000 : 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

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
    
    // Use very short TTL to ensure admin changes appear quickly
    const shortTTL = process.env.NODE_ENV === 'production' ? 30 : ttlSeconds; // 30 seconds in production for rapid updates
    apiCache.set(key, data, shortTTL);
    
    // Store stale cache with moderate TTL for emergency fallback only
    apiCache.set(key + '_stale', data, shortTTL * 6); // 6x longer (3 minutes in production)
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Return stale cache if available on error
    if (staleCache) {
      // Using stale cache due to error
      return staleCache;
    }
    
    throw error;
  }
};

// Background refresh function for stale-while-revalidate pattern
const refreshInBackground = async (
  url: string,
  options: RequestInit,
  key: string,
  ttlSeconds: number
) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...options.headers,
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const productionTTL = process.env.NODE_ENV === 'production' ? 3600 : ttlSeconds;
      const extendedTTL = url.includes('/projects') || url.includes('/contact-details') ? productionTTL : ttlSeconds;
      
      apiCache.set(key, data, extendedTTL);
      apiCache.set(key + '_stale', data, extendedTTL * 12);
      // Background refresh completed
    }
  } catch (error) {
    // Background refresh failed
  }
};

// Function to pre-cache common data with consistent cache keys and retry logic
export const preCacheData = async (baseUrl: string, retryCount = 3) => {
  const endpoints = [
    { url: `${baseUrl}/projects`, key: 'projects-list', name: 'projects' },
    { url: `${baseUrl}/contact-details`, key: 'contact-details', name: 'contact-details' },
    { url: `${baseUrl}/about`, key: 'about-content', name: 'about' },
    { url: `${baseUrl}/hero`, key: 'hero-content', name: 'hero' }
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const data = await cachedFetch(endpoint.url, {}, endpoint.key, 900);
          return { endpoint: endpoint.name, status: 'success', attempt, data };
        } catch (error) {
          // Pre-cache attempt failed
          
          if (attempt === retryCount) {
            // On final failure, check if we have stale data
            const staleData = apiCache.get(endpoint.key + '_stale');
            if (staleData) {
              // Using existing stale data
              return { endpoint: endpoint.name, status: 'stale', attempt, data: staleData };
            }
            throw error;
          }
          
          // Exponential backoff: wait longer between retries
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    })
  );

  // Pre-cache results processed

  // Schedule a background refresh for any failed endpoints
  const failedEndpoints = results
    .map((r, i) => ({ result: r, endpoint: endpoints[i] }))
    .filter(({ result }) => result.status === 'rejected');

  if (failedEndpoints.length > 0) {
    // Scheduling background refresh for failed endpoints
    setTimeout(() => {
      failedEndpoints.forEach(({ endpoint }) => {
        refreshInBackground(endpoint.url, {}, endpoint.key, 900);
      });
    }, 5000); // Retry failed endpoints after 5 seconds
  }
};

// Cache warming function that runs multiple times to ensure backend is awake
export const warmCache = async (baseUrl: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Starting cache warming for production
  
  // First, try to wake up the backend with a simple health check
  try {
    const healthResponse = await fetch(`${baseUrl}/health`, { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    // Backend health check completed
  } catch (error) {
    // Backend health check failed
  }

  // Run pre-cache multiple times with delays to ensure backend is fully awake
  const warmingAttempts = [0, 2000, 5000, 10000]; // Immediate, 2s, 5s, 10s
  
  warmingAttempts.forEach((delay, index) => {
    setTimeout(async () => {
      // Cache warming attempt in progress
      try {
        await preCacheData(baseUrl, 2); // Reduced retries for warming
      } catch (error) {
        // Cache warming attempt failed
      }
    }, delay);
  });
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
  // Projects cache cleared
};

export const updateProjectsCache = (projects: any[]) => {
  // Update cache with fresh data instead of clearing it
  apiCache.set('projects-list', projects, 300); // 5 minutes for normal cache
  apiCache.set('projects-list_stale', projects, 900); // 15 minutes for stale
  // Projects cache updated with fresh data
};

export const clearAllCache = () => {
  apiCache.clear();
  // All cache cleared
};

export const invalidateCache = (keys: string[]) => {
  keys.forEach(key => {
    apiCache.delete(key);
    apiCache.delete(key + '_stale');
  });
  // Cache invalidated for specified keys
};