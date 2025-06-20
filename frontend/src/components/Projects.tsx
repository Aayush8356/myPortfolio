import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL, ASSETS_BASE_URL } from '../config/api';
import { cachedFetch, clearProjectsCache, updateProjectsCache } from '../lib/cache';
import { ProjectSkeleton } from './ui/skeleton';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

// Default/fallback projects for better UX
const defaultProjects: Project[] = [
  {
    _id: '1',
    title: 'Full Stack Portfolio',
    description: 'A modern, responsive portfolio website built with React, TypeScript, and Node.js. Features include dark/light mode, admin panel, and contact management.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Aayush8356/myPortfolio',
    liveUrl: 'https://meetaayush.com',
    imageUrl: '',
    featured: true
  },
  {
    _id: '2',
    title: 'Tech Innovation Project',
    description: 'Innovative project showcasing modern web development techniques and best practices.',
    technologies: ['JavaScript', 'React', 'API Integration'],
    githubUrl: '#',
    liveUrl: '#',
    imageUrl: '',
    featured: false
  },
  {
    _id: '3',
    title: 'Web Development Solution',
    description: 'Comprehensive web solution demonstrating full-stack development capabilities.',
    technologies: ['Full Stack', 'Database', 'UI/UX'],
    githubUrl: '#',
    liveUrl: '#',
    imageUrl: '',
    featured: false
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Start empty, fetch immediately
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Remove unused loading states since we show defaults immediately
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch immediately on component mount
    fetchProjects();
  }, []);

  const fetchProjects = async (forceRefresh = false) => {
    try {
      let data: Project[];
      
      if (forceRefresh) {
        // For force refresh, bypass cache completely
        clearProjectsCache();
        const response = await fetch(`${API_BASE_URL}/projects`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        data = await response.json();
        // Update cache with fresh data
        updateProjectsCache(data);
      } else {
        // Use cached fetch with very short cache time for immediate updates
        data = await cachedFetch<Project[]>(
          `${API_BASE_URL}/projects`,
          {},
          'projects-list',
          1 // 1 second cache for immediate updates
        );
      }
      
      setProjects(data);
      // Update scroll indicators after projects load
      setTimeout(updateScrollIndicators, 100);
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Only use defaults if no projects are currently loaded
      if (projects.length === 0) {
        setProjects(defaultProjects);
      }
      setTimeout(updateScrollIndicators, 100);
    }
  };

  const updateScrollIndicators = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 408; // max-w-sm (384px) + gap (24px) = 408px
    scrollContainerRef.current.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 408; // max-w-sm (384px) + gap (24px) = 408px  
    scrollContainerRef.current.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  };

  // Update scroll indicators when projects change
  useEffect(() => {
    updateScrollIndicators();
  }, [projects]);

  // Add keyboard shortcut for force refresh and listen for admin updates
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        console.log('Force refreshing projects...');
        fetchProjects(true);
      }
    };

    const handleForceRefresh = (e: CustomEvent) => {
      console.log('Projects: Received forceProjectRefresh event');
      console.log('Projects: Event detail:', e.detail);
      console.log('Projects: Current projects state:', projects);
      
      if (e.detail && e.detail.projects) {
        console.log('Projects: Using projects data from event:', e.detail.projects);
        // Use the updated projects data directly from the event
        setProjects(e.detail.projects);
        setTimeout(updateScrollIndicators, 100);
      } else {
        console.log('Projects: No projects data in event, fetching...');
        // Fallback to fetching if no data in event
        fetchProjects(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('forceProjectRefresh', handleForceRefresh as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('forceProjectRefresh', handleForceRefresh as EventListener);
    };
  }, []);


  // Only show skeleton for initial load when no projects available (currently disabled)
  if (false && projects.length === 0) {
    return (
      <section id="projects" className="py-12 md:py-20 bg-background relative">
        <div className="absolute inset-0 dark-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">PROJECTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Remove error display - we use graceful fallbacks instead


  return (
    <section id="projects" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="relative">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">PROJECTS</h2>
          
          {/* Navigation arrows - positioned in top right */}
          <div className="absolute top-0 right-0 flex gap-2 z-20">
            {projects.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className="p-2 bg-background/80 backdrop-blur-sm border-accent/30 hover:border-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="p-2 bg-background/80 backdrop-blur-sm border-accent/30 hover:border-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            {/* Temporary debug button - remove after testing */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Force refresh - bypassing all cache');
                fetchProjects(true);
              }}
              className="p-2 bg-blue-500/20 backdrop-blur-sm border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10"
              title="Force Refresh (bypasses cache)"
            >
              🔄
            </Button>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects available yet. Check back soon!</p>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            onScroll={updateScrollIndicators}
            className={`
              ${projects.length > 3 
                ? 'flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 projects-scroll' 
                : 'flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8'
              }
            `}
            style={{
              scrollSnapType: projects.length > 3 ? 'x-mandatory' : undefined
            }}
          >
            {projects.map((project) => (
            <Card 
              key={project._id} 
              className={`
                group bg-dark-card backdrop-blur-sm hover:transform hover:scale-[1.02] 
                ${projects.length > 3 
                  ? 'flex-shrink-0 w-full max-w-sm' 
                  : 'w-full max-w-sm'
                }
              `}
              style={{
                scrollSnapAlign: projects.length > 3 ? 'start' : undefined,
                border: '1px solid rgba(34, 197, 94, 0.3)', 
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
              }}
            >
              <CardHeader>
                {project.imageUrl && (
                  <div className="w-full h-32 md:h-40 lg:h-48 bg-muted rounded-md mb-4 overflow-hidden">
                    <img
                      src={project.imageUrl.startsWith('/projects') ? `${ASSETS_BASE_URL}${project.imageUrl}` : project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-foreground gap-2">
                  <span className="text-base md:text-lg lg:text-xl font-semibold text-foreground">{project.title}</span>
                  {project.featured && (
                    <span className="text-xs bg-accent/20 text-accent px-3 py-1.5 rounded-full border border-accent/40 font-medium shadow-sm self-start sm:self-auto">
                      FEATURED
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 md:mb-5 text-sm md:text-base leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 bg-muted/80 text-foreground border border-border/30 hover:border-accent/50 hover:bg-accent/10 hover-lift"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="border-secondary/30 hover:border-secondary text-foreground hover:text-secondary hover:bg-secondary/10 dark:border-glow dark:hover:glow-secondary transition-all duration-300 text-xs md:text-sm">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg dark:glow-primary dark:hover:glow-accent transition-all duration-300 text-xs md:text-sm">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;