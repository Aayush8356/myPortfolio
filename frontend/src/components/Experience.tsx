import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, MapPin, Building, GraduationCap, Code, Target } from 'lucide-react';

interface ExperienceItem {
  id: string;
  type: 'education' | 'project' | 'learning' | 'goal';
  title: string;
  organization?: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
  current?: boolean;
}

const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      id: 'current-focus',
      type: 'goal',
      title: 'Actively Seeking Full Stack Developer Opportunities',
      period: '2024 - Present',
      description: [
        'Focusing on expanding backend expertise and exploring cloud technologies',
        'Building additional portfolio projects with Next.js and PostgreSQL',
        'Learning DevOps tools and deployment strategies for scalable applications',
        'Seeking full-time opportunities to contribute to impactful software solutions'
      ],
      technologies: ['Next.js', 'PostgreSQL', 'AWS', 'TypeScript', 'DevOps'],
      current: true
    },
    {
      id: 'mern-development',
      type: 'project',
      title: 'MERN Stack Development & Project Building',
      period: '2023 - Present',
      description: [
        'Self-taught MERN stack through hands-on project development and real-world problem solving',
        'Built Wandarlog: Travel planning platform handling 500+ concurrent users with real-time features',
        'Developed Web Food: Food delivery app with payment integration, GPS tracking, and order management',
        'Created Payment UI Component: Reusable React library reducing development time by 40%',
        'Deployed applications using Vercel and Render with optimized performance and caching strategies'
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'JWT', 'RESTful APIs', 'Vercel', 'Render']
    },
    {
      id: 'education',
      type: 'education',
      title: 'Computer Science & Engineering Degree',
      organization: 'Chandigarh University',
      location: 'Punjab, India',
      period: '2020 - 2024',
      description: [
        'Graduated with strong foundation in software engineering and computer science fundamentals',
        'Specialized in web development during final years with focus on modern technologies',
        'Completed capstone projects involving full-stack development and database design',
        'Built solid understanding of algorithms, data structures, and software design patterns'
      ],
      technologies: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems']
    }
  ];

  const getIcon = (type: ExperienceItem['type']) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'project':
        return <Code className="w-5 h-5 text-green-500" />;
      case 'learning':
        return <Building className="w-5 h-5 text-purple-500" />;
      case 'goal':
        return <Target className="w-5 h-5 text-orange-500" />;
      default:
        return <Building className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: ExperienceItem['type']) => {
    switch (type) {
      case 'education':
        return 'Education';
      case 'project':
        return 'Projects';
      case 'learning':
        return 'Learning';
      case 'goal':
        return 'Current Focus';
      default:
        return 'Experience';
    }
  };

  const getTypeColor = (type: ExperienceItem['type']) => {
    switch (type) {
      case 'education':
        return 'border-blue-500/30 shadow-blue-500/10';
      case 'project':
        return 'border-green-500/30 shadow-green-500/10';
      case 'learning':
        return 'border-purple-500/30 shadow-purple-500/10';
      case 'goal':
        return 'border-orange-500/30 shadow-orange-500/10';
      default:
        return 'border-gray-500/30 shadow-gray-500/10';
    }
  };

  return (
    <section id="experience" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">
            EXPERIENCE & JOURNEY
          </h2>
          
          <div className="space-y-6 md:space-y-8">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="relative">
                {/* Timeline Line */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent hidden md:block" />
                )}
                
                <Card 
                  className={`bg-dark-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg border ${getTypeColor(experience.type)} ${experience.current ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 rounded-full bg-muted/30">
                        {getIcon(experience.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <CardTitle className="text-foreground text-lg md:text-xl font-semibold leading-tight">
                            {experience.title}
                            {experience.current && (
                              <span className="ml-2 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{experience.period}</span>
                          </div>
                        </div>
                        
                        {experience.organization && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{experience.organization}</span>
                            </div>
                            {experience.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{experience.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="inline-flex items-center px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded-full">
                          {getTypeLabel(experience.type)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {experience.description.map((item, i) => (
                        <li key={i} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm md:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {experience.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-md hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Experience Summary */}
          <div className="mt-8 md:mt-12 text-center">
            <Card className="bg-dark-card/50 backdrop-blur-sm border border-green-500/30 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Development Journey</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-500">3</div>
                    <div className="text-sm text-muted-foreground">Major Projects Deployed</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-500">1+</div>
                    <div className="text-sm text-muted-foreground">Years MERN Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-500">B.E.</div>
                    <div className="text-sm text-muted-foreground">Computer Science Graduate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;