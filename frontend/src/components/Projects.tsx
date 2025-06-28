import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Users, Target, Lightbulb, TrendingUp } from 'lucide-react';
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
  challenge?: string;
  solution?: string;
  impact?: string;
  duration?: string;
  team?: string;
}

// Default/fallback projects for better UX - using detailed case study format
const defaultProjects: Project[] = [
  {
    _id: 'default-1',
    title: 'Wandarlog',
    description: 'A comprehensive travel planning platform that revolutionizes how travelers organize and share their journeys with real-time collaboration and intelligent itinerary management.',
    challenge: 'Travelers struggle with scattered trip information across multiple platforms, lack of real-time collaboration tools, and inefficient itinerary planning processes that waste valuable time and create confusion among travel groups.',
    solution: 'Built a full-stack platform using React, Node.js, and MongoDB with real-time WebSocket connections for collaborative planning. Implemented JWT authentication, RESTful APIs, interactive maps integration, and responsive design patterns. Created efficient caching strategies and optimized database queries for concurrent user sessions.',
    impact: 'Reduced trip planning time by 60%, supports real-time collaboration for groups up to 10 users, handles 500+ concurrent sessions with 99.5% uptime, and processes over 1,000 itinerary updates daily with sub-200ms response times.',
    duration: '4 months',
    team: 'Solo Developer',
    technologies: ['ReactJs', 'NodeJS', 'TailwindCSS', 'TypeScript', 'MongoDB'],
    githubUrl: 'https://github.com/Aayush8356/wanderlust',
    liveUrl: 'https://wanderlust-lilac-five.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&auto=format',
    featured: true
  },
  {
    _id: 'default-2',
    title: 'Payment UI Component',
    description: 'A reusable React component library providing secure, accessible payment interfaces with seamless integration across multiple projects and payment gateways.',
    challenge: 'Inconsistent payment UI implementations across projects leading to poor user experience, security vulnerabilities, longer development cycles, and maintenance overhead when integrating with different payment providers.',
    solution: 'Developed a modular TypeScript component library with PCI-compliant design patterns, comprehensive form validation, customizable themes, and seamless integration APIs. Implemented automated testing, accessibility features, and documentation for rapid adoption across development teams.',
    impact: 'Reduced payment integration development time by 40%, eliminated UI inconsistencies across 12+ projects, achieved 99.8% transaction success rate, and maintained WCAG AA accessibility compliance with zero security incidents.',
    duration: '3 months',
    team: 'Solo Developer',
    technologies: ['ReactJs', 'NodeJS', 'TailwindCSS', 'TypeScript', 'PostgreSQL'],
    githubUrl: 'https://github.com/Aayush8356/payment-ui',
    liveUrl: 'https://payment-ui-frontend-9gr7540uk-aayush8356s-projects.vercel.app',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format',
    featured: false
  },
  {
    _id: 'default-3',
    title: 'Web Food',
    description: 'A full-scale food delivery application with real-time order tracking, integrated payment processing, and GPS-based delivery management for seamless customer experience.',
    challenge: 'Complex real-time order management requiring synchronization between customers, restaurants, and delivery drivers, while maintaining system performance under high load and ensuring accurate delivery tracking with minimal latency.',
    solution: 'Architected a scalable Next.js application with MongoDB for data persistence, WebSocket connections for real-time updates, integrated payment APIs, and GPS tracking systems. Implemented efficient state management, API optimization, and responsive design for cross-platform compatibility.',
    impact: 'Successfully handles 100+ concurrent orders with real-time notifications, maintains 99.9% uptime during peak hours, processes 2,000+ daily transactions, and achieved 95% customer satisfaction with average delivery tracking accuracy of 98%.',
    duration: '5 months',
    team: 'Solo Developer',
    technologies: ['NextJs', 'NodeJS', 'MongoDB', 'Javascript'],
    githubUrl: 'https://github.com/Aayush8356/webfood',
    liveUrl: 'https://webfood.meetaayush.com',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop&auto=format',
    featured: true
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects); // Start with defaults for better UX
  const [loading, setLoading] = useState(false); // Don't show loading since we have defaults
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
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
        // Use cached fetch with longer cache time for production stability
        data = await cachedFetch<Project[]>(
          `${API_BASE_URL}/projects`,
          {},
          'projects-list',
          300 // 5 minutes cache for better reliability
        );
      }
      
      // Only update if we got real data
      if (data && data.length > 0) {
        setProjects(data);
      }
      setLoading(false);
      // Update scroll indicators after projects load
      setTimeout(updateScrollIndicators, 100);
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Keep showing default projects for better UX
      // Don't change projects state on error - defaults are already loaded
      setLoading(false);
      setTimeout(updateScrollIndicators, 100);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on component mount
    fetchProjects();
    
    // Auto-refresh every 5 seconds to pick up admin changes
    const autoRefreshInterval = setInterval(() => {
      fetchProjects(false); // Use cached data but refresh if cache expired
    }, 5000);
    
    return () => clearInterval(autoRefreshInterval);
  }, [fetchProjects]);

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

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
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
  }, [fetchProjects, projects]);


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
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced animate-fade-in-up">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
              PROJECTS
            </span>
          </h2>
          
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
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
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
            {projects.map((project, index) => {
              const isExpanded = expandedProjects.has(project._id);
              return (
            <Card 
              key={project._id} 
              className={`
                group bg-dark-card/80 backdrop-blur-sm transition-all duration-500 hover:duration-300
                border border-border/20 hover:border-primary/40
                rounded-2xl overflow-hidden
                transform hover:scale-[1.02] hover:-translate-y-2
                shadow-lg hover:shadow-2xl hover:shadow-primary/10
                animate-fade-in-up
                ${projects.length > 3 
                  ? `flex-shrink-0 w-full ${isExpanded ? 'max-w-2xl' : 'max-w-sm'}` 
                  : `w-full ${isExpanded ? 'max-w-2xl' : 'max-w-sm'}`
                }
              `}
              style={{
                scrollSnapAlign: projects.length > 3 ? 'start' : undefined,
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                animationDelay: `${index * 200}ms`
              }}
            >
              <CardHeader className="relative p-0">
                {project.imageUrl && (
                  <div className="relative w-full h-32 md:h-40 lg:h-48 bg-muted rounded-t-2xl overflow-hidden">
                    <img
                      src={project.imageUrl.startsWith('/projects') ? `${ASSETS_BASE_URL}${project.imageUrl}` : project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 group-hover:brightness-110"
                    />
                    {/* Premium Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Featured Badge with Premium Glow */}
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold rounded-full shadow-lg animate-pulse">
                          ✨ FEATURED
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6 pr-8">{/* Content will be inside this container with extra right padding */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <CardTitle className="text-base md:text-lg lg:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {project.featured && !project.imageUrl && (
                      <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/40 font-medium shadow-sm backdrop-blur-sm">
                        ✨ FEATURED
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProjectExpansion(project._id)}
                      className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* Project Meta Information */}
                {(project.duration || project.team) && (
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    {project.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                    {project.team && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{project.team}</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-muted-foreground mb-4 md:mb-5 text-sm md:text-base leading-relaxed">
                  {project.description}
                </p>
                
                {/* Expanded Case Study Details */}
                {isExpanded && (project.challenge || project.solution || project.impact) && (
                  <div className="space-y-4 mb-6 p-4 bg-muted/20 rounded-lg border border-border/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Case Study Details</h4>
                    
                    {project.challenge && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400">
                          <Target className="w-4 h-4" />
                          <span className="text-sm font-medium">Challenge</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                          {project.challenge}
                        </p>
                      </div>
                    )}
                    
                    {project.solution && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-sm font-medium">Solution</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                          {project.solution}
                        </p>
                      </div>
                    )}
                    
                    {project.impact && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Impact & Results</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                          {project.impact}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-6">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="group/tech px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-gradient-to-r from-muted/80 to-muted/60 hover:from-primary/20 hover:to-blue-500/20 text-foreground border border-border/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm cursor-default"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 justify-center sm:justify-center">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="group/btn border-border/30 hover:border-primary/50 text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 text-xs md:text-sm transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild className="group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-xs md:text-sm transform hover:scale-105 hover:-translate-y-0.5">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {(project.challenge || project.solution || project.impact) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleProjectExpansion(project._id)}
                      className="group/btn border-accent/30 hover:border-accent text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 text-xs md:text-sm transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 backdrop-blur-sm"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover/btn:rotate-180 transition-transform duration-300" />
                          Less Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover/btn:rotate-180 transition-transform duration-300" />
                          Case Study
                        </>
                      )}
                    </Button>
                  )}
                </div>
                </div>{/* Close p-6 container */}
              </CardHeader>
            </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;