import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GraduationCap, Award, Calendar, MapPin, BookOpen, Trophy } from 'lucide-react';

interface EducationItem {
  id: string;
  type: 'degree' | 'certification' | 'course';
  title: string;
  institution: string;
  location?: string;
  period: string;
  description: string[];
  grade?: string;
  status: 'completed' | 'in-progress';
  highlights?: string[];
}

const Education: React.FC = () => {
  const educationItems: EducationItem[] = [
    {
      id: 'btech-cse',
      type: 'degree',
      title: 'Bachelor of Engineering - Computer Science & Engineering',
      institution: 'Chandigarh University',
      location: 'Punjab, India',
      period: '2020 - 2024',
      status: 'completed',
      description: [
        'Comprehensive 4-year engineering program focusing on computer science fundamentals and practical application',
        'Specialized coursework in software engineering, data structures, algorithms, and full-stack development',
        'Strong foundation in programming languages, database systems, and software design patterns',
        'Capstone projects involving real-world problem solving and modern web technologies'
      ],
      highlights: [
        'Software Engineering',
        'Data Structures & Algorithms',
        'Database Management',
        'Web Development',
        'Software Design Patterns',
        'Computer Networks'
      ]
    },
    {
      id: 'mern-specialization',
      type: 'certification',
      title: 'MERN Stack Development Specialization',
      institution: 'Self-Directed Learning',
      period: '2023 - Present',
      status: 'completed',
      description: [
        'Intensive hands-on training in MongoDB, Express.js, React.js, and Node.js ecosystem',
        'Built multiple full-stack applications with real-world complexity and deployment',
        'Mastered modern development tools, version control, and deployment platforms',
        'Gained expertise in TypeScript, authentication systems, and API development'
      ],
      highlights: [
        'MongoDB & Mongoose',
        'Express.js & RESTful APIs',
        'React.js & State Management',
        'Node.js & Server Architecture',
        'TypeScript',
        'JWT Authentication'
      ]
    },
    {
      id: 'web-dev-bootcamp',
      type: 'course',
      title: 'Advanced Web Development Bootcamp',
      institution: 'Online Learning Platforms',
      period: '2022 - 2023',
      status: 'completed',
      description: [
        'Comprehensive web development program covering frontend and backend technologies',
        'Hands-on projects with modern frameworks and industry best practices',
        'Focus on responsive design, performance optimization, and user experience',
        'Integration with cloud services and deployment strategies'
      ],
      highlights: [
        'HTML5, CSS3, JavaScript ES6+',
        'React.js & Component Architecture',
        'Tailwind CSS & Responsive Design',
        'Git Version Control',
        'Deployment & DevOps Basics'
      ]
    }
  ];

  const getIcon = (type: EducationItem['type']) => {
    switch (type) {
      case 'degree':
        return <GraduationCap className="w-6 h-6 text-blue-500" />;
      case 'certification':
        return <Award className="w-6 h-6 text-green-500" />;
      case 'course':
        return <BookOpen className="w-6 h-6 text-purple-500" />;
      default:
        return <GraduationCap className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type: EducationItem['type']) => {
    switch (type) {
      case 'degree':
        return 'border-blue-500/30 shadow-blue-500/10';
      case 'certification':
        return 'border-green-500/30 shadow-green-500/10';
      case 'course':
        return 'border-purple-500/30 shadow-purple-500/10';
      default:
        return 'border-gray-500/30 shadow-gray-500/10';
    }
  };

  const getTypeLabel = (type: EducationItem['type']) => {
    switch (type) {
      case 'degree':
        return 'Degree';
      case 'certification':
        return 'Certification';
      case 'course':
        return 'Course';
      default:
        return 'Education';
    }
  };

  return (
    <section id="education" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">
            EDUCATION & CERTIFICATIONS
          </h2>
          
          <div className="space-y-6 md:space-y-8">
            {educationItems.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Timeline Line */}
                {index < educationItems.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent hidden md:block" />
                )}
                
                <Card 
                  className={`bg-dark-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg border ${getTypeColor(item.type)}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-full bg-muted/30">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                          <CardTitle className="text-foreground text-lg md:text-xl font-semibold leading-tight">
                            {item.title}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{item.period}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1 text-base font-medium text-primary">
                            <GraduationCap className="w-4 h-4" />
                            <span>{item.institution}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded-full">
                            {getTypeLabel(item.type)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            item.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {item.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        {item.description.map((desc, i) => (
                          <li key={i} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm md:text-base">{desc}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {item.highlights && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Key Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-md hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Education Summary */}
          <div className="mt-8 md:mt-12 text-center">
            <Card className="bg-dark-card/50 backdrop-blur-sm border border-blue-500/30 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Educational Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-500">B.E.</div>
                    <div className="text-sm text-muted-foreground">Computer Science Engineering</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-500">4</div>
                    <div className="text-sm text-muted-foreground">Years Formal Education</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-500">MERN</div>
                    <div className="text-sm text-muted-foreground">Stack Specialization</div>
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

export default Education;