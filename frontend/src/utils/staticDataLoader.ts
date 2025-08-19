/**
 * Static Data Loader
 * Loads pre-generated static data instead of API calls
 * Provides fallbacks for development and error scenarios
 */

import React from 'react';

interface StaticDataWrapper<T> {
  data: T;
  lastUpdated: string;
  source: 'database' | 'fallback' | 'default';
  count?: number;
  featured?: any[];
}

interface BuildMetadata {
  buildTime: string;
  buildId: string;
  version: string;
  dataStatus: {
    projects: 'success' | 'failed';
    contact: 'success' | 'failed';
    resume: 'success' | 'failed';
  };
  counts: {
    projects: number;
    featuredProjects: number;
  };
  environment: {
    nodeEnv: string;
    apiBaseUrl: string;
  };
}

// Default fallback data - minimal but functional
const DEFAULT_PROJECTS = [
  {
    _id: 'default-1',
    title: 'Vendora',
    description: 'Transform your business with this stunning eCommerce template. Designed for brands that value quality, elegance, and customer experience.',
    technologies: ['NextJs', 'NodeJS', 'MongoDb', 'Typescript', 'TailwindCSS'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format',
    githubUrl: 'https://github.com/Aayush8356/vendora',
    liveUrl: 'https://vendora.meetaayush.com',
    featured: true,
    challenge: 'Modern businesses struggle with creating compelling eCommerce experiences.',
    solution: 'Developed a premium eCommerce template using Next.js 14 with TypeScript.',
    impact: 'Achieved 40% faster page load times with Next.js optimization.',
    duration: '3 months',
    team: 'Solo Developer'
  }
];

const DEFAULT_CONTACT = {
  _id: 'default-contact',
  email: 'guptaaayush537@gmail.com',
  phone: '+91 9878154202',
  location: 'India',
  linkedin: 'https://linkedin.com/in/aayushgupta23',
  github: 'https://github.com/aayush8356',
  twitter: 'https://twitter.com/meetaayushgupta',
  resume: ''
};

const DEFAULT_RESUME = {
  hasResume: false,
  resumeUrl: null
};

/**
 * Load static data with multiple fallback strategies
 */
async function loadStaticData<T>(
  filename: string,
  defaultData: T
): Promise<StaticDataWrapper<T>> {
  try {
    // Strategy 1: Try to load from public/data (build-time generated)
    try {
      const response = await fetch(`/data/${filename}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const staticData = await response.json() as StaticDataWrapper<T>;
        console.log(`✅ Loaded ${filename} from static data (build-time)`);
        return staticData;
      }
    } catch (error) {
      console.log(`⚠️ Failed to load ${filename} from public/data`);
    }
    
    // Strategy 2: Try to load from src/data (fallback)
    try {
      const fallbackData = await import(`../data/${filename.replace('.json', '')}`);
      console.log(`✅ Loaded ${filename} from fallback data (src)`);
      return fallbackData.default as StaticDataWrapper<T>;
    } catch (error) {
      console.log(`⚠️ Failed to load ${filename} from src/data fallback`);
    }
    
    // Strategy 3: Use default data
    console.log(`📋 Using default data for ${filename}`);
    return {
      data: defaultData,
      lastUpdated: new Date().toISOString(),
      source: 'default'
    };
    
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error);
    return {
      data: defaultData,
      lastUpdated: new Date().toISOString(),
      source: 'default'
    };
  }
}

/**
 * Load projects data
 */
export async function loadProjectsData(): Promise<StaticDataWrapper<any[]>> {
  return loadStaticData('projects.json', DEFAULT_PROJECTS);
}

/**
 * Load contact details data
 */
export async function loadContactData(): Promise<StaticDataWrapper<any>> {
  return loadStaticData('contact-details.json', DEFAULT_CONTACT);
}

/**
 * Load resume status data
 */
export async function loadResumeData(): Promise<StaticDataWrapper<any>> {
  return loadStaticData('resume-status.json', DEFAULT_RESUME);
}

/**
 * Load build metadata
 */
export async function loadBuildMetadata(): Promise<BuildMetadata | null> {
  try {
    const response = await fetch('/data/build-metadata.json', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (response.ok) {
      const metadata = await response.json() as BuildMetadata;
      console.log(`🏗️ Build metadata loaded: ${metadata.buildId}`);
      return metadata;
    }
  } catch (error) {
    console.log('⚠️ Build metadata not available');
  }
  
  return null;
}

/**
 * Preload all static data - call this in App.tsx
 */
export async function preloadAllStaticData() {
  console.log('🚀 Preloading all static data...');
  
  const startTime = Date.now();
  
  try {
    const [projects, contact, resume, metadata] = await Promise.all([
      loadProjectsData(),
      loadContactData(), 
      loadResumeData(),
      loadBuildMetadata()
    ]);
    
    const duration = Date.now() - startTime;
    
    console.log('✅ Static data preload completed');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📊 Projects: ${projects.data.length}, Contact: ${contact.source}, Resume: ${resume.source}`);
    
    if (metadata) {
      console.log(`🏗️ Build: ${metadata.buildId} (${metadata.buildTime})`);
    }
    
    return {
      projects,
      contact,
      resume,
      metadata,
      loadTime: duration
    };
    
  } catch (error) {
    console.error('❌ Static data preload failed:', error);
    return null;
  }
}

/**
 * Hook for components to use static data
 */
export function useStaticData<T>(
  loader: () => Promise<StaticDataWrapper<T>>,
  deps: any[] = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [source, setSource] = React.useState<string>('loading');
  
  React.useEffect(() => {
    let mounted = true;
    
    loader().then((result) => {
      if (mounted) {
        setData(result.data);
        setSource(result.source);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Static data loading error:', error);
      if (mounted) {
        setLoading(false);
      }
    });
    
    return () => {
      mounted = false;
    };
  }, deps);
  
  return { data, loading, source };
}