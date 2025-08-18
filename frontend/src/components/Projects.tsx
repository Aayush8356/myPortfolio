import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Users, Target, Lightbulb, TrendingUp, X } from 'lucide-react';
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

// No more static fallback projects - everything loads from API

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Don't show loading on auto-refresh if we already have projects
    if (!forceRefresh || projects.length === 0) {
      setLoading(true);
    }
    setError(null);
    
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
        // Use cached fetch with shorter cache time for admin responsiveness
        data = await cachedFetch<Project[]>(
          `${API_BASE_URL}/projects`,
          {},
          'projects-list',
          30 // 30 seconds cache for better responsiveness to admin changes
        );
      }
      
      // Only update projects if we got valid data
      if (data && Array.isArray(data)) {
        setProjects(data);
      }
      setLoading(false);
      // Update scroll indicators after projects load
      setTimeout(updateScrollIndicators, 100);
    } catch (error) {
      // Only show error if we don't have existing projects (avoid clearing working data)
      if (projects.length === 0) {
        setError('Failed to load projects. Please try again.');
      }
      setLoading(false);
      setTimeout(updateScrollIndicators, 100);
    }
  }, [projects.length]);

  useEffect(() => {
    // Fetch immediately on component mount
    fetchProjects();
    
    // Auto-refresh every 30 seconds to pick up admin changes (less aggressive to avoid interference)
    const autoRefreshInterval = setInterval(() => {
      fetchProjects(true); // Force fresh data to catch admin updates
    }, 30000);
    
    // Refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects(true); // Force fresh data when user returns
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(autoRefreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    // Update indicators after a short delay to account for smooth scrolling
    setTimeout(updateScrollIndicators, 300);
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 408; // max-w-sm (384px) + gap (24px) = 408px  
    scrollContainerRef.current.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
    // Update indicators after a short delay to account for smooth scrolling
    setTimeout(updateScrollIndicators, 300);
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedProject]);

  // Update scroll indicators when projects change
  useEffect(() => {
    updateScrollIndicators();
  }, [projects]);

  // Add keyboard shortcut for force refresh and listen for admin updates
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        clearProjectsCache();
        fetchProjects(true);
      }
    };

    const handleForceRefresh = (e: CustomEvent) => {
      if (e.detail && e.detail.projects) {
        // Use the updated projects data directly from the event
        setProjects(e.detail.projects);
        setTimeout(updateScrollIndicators, 100);
        
        // Also force a fresh fetch to ensure we have the latest data
        setTimeout(() => {
          clearProjectsCache(); // Clear cache before fetching
          fetchProjects(true);
        }, 1000);
      } else {
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
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => fetchProjects(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="relative group/nav overflow-hidden">
            {/* Left Blur Overlay - Only blur the partial overflow content */}
            {projects.length > 3 && canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" 
                     style={{ backdropFilter: 'blur(6px)' }}></div>
              </div>
            )}

            {/* Right Blur Overlay - Only blur the partial overflow content */}
            {projects.length > 3 && canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-l from-background/70 to-transparent" 
                     style={{ backdropFilter: 'blur(6px)' }}></div>
              </div>
            )}

            {/* Left Navigation Arrow */}
            {projects.length > 3 && canScrollLeft && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollLeft}
                  className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group/arrow"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground group-hover/arrow:text-primary transition-colors duration-200" />
                </Button>
              </div>
            )}

            {/* Right Navigation Arrow */}
            {projects.length > 3 && canScrollRight && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollRight}
                  className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group/arrow"
                >
                  <ChevronRight className="w-4 h-4 text-foreground group-hover/arrow:text-primary transition-colors duration-200" />
                </Button>
              </div>
            )}

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
                flex flex-col
                ${projects.length > 3 
                  ? 'flex-shrink-0 w-full max-w-sm h-[600px]' 
                  : 'w-full max-w-sm h-[600px]'
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
                
                <div className="p-6 pr-8 flex-1 flex flex-col">{/* Content will be inside this container with extra right padding and flex layout */}
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <CardTitle className="text-base md:text-lg lg:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    {project.featured && !project.imageUrl && (
                      <span className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/40 font-medium shadow-sm backdrop-blur-sm">
                        ✨ FEATURED
                      </span>
                    )}
                  </div>
                  
                  {/* Project Meta Information */}
                  {(project.duration || project.team) && (
                    <div className="flex flex-wrap gap-4 mb-3 text-xs text-muted-foreground">
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

                  {/* Description Section - Fixed Height */}
                  <div className="mb-4 md:mb-5 h-[100px] flex items-start">
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Technologies Section - Fixed Height */}
                  <div className="mb-5 md:mb-6 min-h-[60px] flex items-start">
                    <div className="flex flex-wrap gap-2 md:gap-3">
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
                  </div>

                  {/* Button Section - Always at bottom */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-center mt-auto">
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
                        onClick={() => openProjectModal(project)}
                        className="group/btn border-accent/30 hover:border-accent text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 text-xs md:text-sm transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 backdrop-blur-sm"
                      >
                        <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                        Case Study
                      </Button>
                    )}
                  </div>
                </div>{/* Close p-6 container */}
              </CardHeader>
            </Card>
              );
            })}
            </div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeProjectModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-background border border-border/20 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/20 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  {selectedProject.imageUrl && (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={selectedProject.imageUrl.startsWith('/projects') ? `${ASSETS_BASE_URL}${selectedProject.imageUrl}` : selectedProject.imageUrl}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight mb-2 break-words">{selectedProject.title}</h2>
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {selectedProject.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{selectedProject.duration}</span>
                        </div>
                      )}
                      {selectedProject.team && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{selectedProject.team}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeProjectModal}
                  className="p-2 hover:bg-muted rounded-full flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              {/* Project Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted/80 text-foreground border border-border/30 hover:border-primary/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Case Study Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Case Study</h3>
                
                {selectedProject.challenge && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <Target className="w-5 h-5" />
                      <h4 className="font-medium">Challenge</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {selectedProject.challenge}
                    </p>
                  </div>
                )}
                
                {selectedProject.solution && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Lightbulb className="w-5 h-5" />
                      <h4 className="font-medium">Solution</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}
                
                {selectedProject.impact && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                      <h4 className="font-medium">Impact & Results</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {selectedProject.impact}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/20">
                {selectedProject.githubUrl && (
                  <Button variant="outline" asChild className="flex-1">
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {selectedProject.liveUrl && (
                  <Button asChild className="flex-1">
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;