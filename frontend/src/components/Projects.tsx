import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { API_BASE_URL, ASSETS_BASE_URL } from '../config/api';
import { cachedFetch } from '../lib/cache';
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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start fetching immediately, no delay
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setError(null);
      
      // Use more aggressive caching (15 minutes) since projects don't change often
      const data = await cachedFetch<Project[]>(
        `${API_BASE_URL}/projects`,
        {},
        'projects-list',
        900 // 15 minute cache
      );
      
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Connection timeout. Check your internet and try again.');
        } else if (error.message.includes('500')) {
          setError('Server error. Please try again in a moment.');
        } else if (error.message.includes('404')) {
          setError('Projects not found. The server may be updating.');
        } else {
          setError('Failed to load projects. Check your connection.');
        }
      } else {
        setError('Network error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
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

  if (error) {
    return (
      <section id="projects" className="py-12 md:py-20 bg-background relative">
        <div className="absolute inset-0 dark-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">PROJECTS</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">{error}</p>
            <Button onClick={fetchProjects} variant="outline" className="border-dark text-foreground hover:bg-muted">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section id="projects" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">PROJECTS</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects available yet. Check back soon!</p>
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 lg:gap-8 ${
            projects.length === 1 
              ? 'grid-cols-1 justify-items-center' 
              : projects.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 justify-items-center' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {projects.map((project) => (
            <Card key={project._id} className={`group hover:shadow-dark-lg transition-all duration-300 bg-dark-card backdrop-blur-sm hover-lift ${
              projects.length <= 2 ? 'max-w-md w-full' : ''
            }`}>
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
                  <span className="text-sm md:text-base lg:text-lg">{project.title}</span>
                  {project.featured && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-dark-subtle self-start sm:self-auto">
                      FEATURED
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">{project.description}</p>
                
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 bg-muted text-foreground border border-dark-subtle hover-lift"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="border-dark text-foreground hover:bg-muted hover-lift text-xs md:text-sm">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift text-xs md:text-sm">
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