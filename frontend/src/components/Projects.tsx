import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Only use mock projects if database is completely unavailable
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const mockProjects: Project[] = [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with user authentication, payment integration, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      imageUrl: '',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true
    },
    {
      _id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team collaboration features.',
      technologies: ['React', 'TypeScript', 'Express', 'Socket.io'],
      imageUrl: '',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true
    },
    {
      _id: '3',
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts and interactive charts.',
      technologies: ['React', 'Chart.js', 'Weather API', 'Tailwind CSS'],
      imageUrl: '',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false
    }
  ];

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Projects</h2>
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  const displayProjects = projects;

  return (
    <section id="projects" className="py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient uppercase-spaced">PROJECTS</h2>
        
        {displayProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
            <Card key={project._id} className="group hover:shadow-dark-lg transition-all duration-300 bg-dark-card backdrop-blur-sm hover-lift">
              <CardHeader>
                {project.imageUrl && (
                  <div className="w-full h-48 bg-muted rounded-md mb-4 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardTitle className="flex items-center justify-between text-foreground">
                  {project.title}
                  {project.featured && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-dark-subtle">
                      FEATURED
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 bg-muted text-foreground border border-dark-subtle hover-lift"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="border-dark text-foreground hover:bg-muted hover-lift">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
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