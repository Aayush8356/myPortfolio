import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  years: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Cloud';
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    // Frontend
    { name: 'React', level: 'Intermediate', years: '1+ years', category: 'Frontend' },
    { name: 'TypeScript', level: 'Beginner', years: '6 months', category: 'Frontend' },
    { name: 'JavaScript', level: 'Intermediate', years: '1+ years', category: 'Frontend' },
    { name: 'HTML/CSS', level: 'Advanced', years: '3+ years', category: 'Frontend' },
    { name: 'Tailwind CSS', level: 'Intermediate', years: '1+ years', category: 'Frontend' },
    { name: 'Next.js', level: 'Beginner', years: 'Just started', category: 'Frontend' },
    
    // Backend
    { name: 'Node.js', level: 'Intermediate', years: '1+ years', category: 'Backend' },
    { name: 'Express.js', level: 'Intermediate', years: '1+ years', category: 'Backend' },
    { name: 'Python', level: 'Beginner', years: 'Basic', category: 'Backend' },
    { name: 'REST APIs', level: 'Beginner', years: '6 months', category: 'Backend' },
    
    // Database
    { name: 'MongoDB', level: 'Intermediate', years: '1+ years', category: 'Database' },
    { name: 'PostgreSQL', level: 'Beginner', years: 'Just started', category: 'Database' },
    { name: 'Mongoose', level: 'Intermediate', years: '1+ years', category: 'Database' },
    
    // Tools & Cloud
    { name: 'Git', level: 'Intermediate', years: '2+ years', category: 'Tools' },
    { name: 'Vercel', level: 'Intermediate', years: '1+ years', category: 'Cloud' },
    { name: 'Render', level: 'Intermediate', years: '1+ years', category: 'Cloud' },
    { name: 'AWS', level: 'Beginner', years: 'Just started', category: 'Cloud' },
  ];

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Cloud'] as const;

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-500 text-white';
      case 'Advanced':
        return 'bg-blue-500 text-white';
      case 'Intermediate':
        return 'bg-yellow-500 text-black';
      case 'Beginner':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLevelWidth = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return 'w-full';
      case 'Advanced':
        return 'w-4/5';
      case 'Intermediate':
        return 'w-3/5';
      case 'Beginner':
        return 'w-2/5';
      default:
        return 'w-2/5';
    }
  };

  return (
    <section id="skills" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">
            SKILLS & EXPERTISE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => {
              const categorySkills = skills.filter(skill => skill.category === category);
              
              return (
                <Card 
                  key={category}
                  className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg"
                  style={{
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-foreground uppercase-spaced text-base md:text-lg font-semibold text-center">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base font-medium text-foreground">
                            {skill.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                          <span>{skill.years}</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getLevelWidth(skill.level)}`}
                            style={{
                              background: (() => {
                                switch (skill.level) {
                                  case 'Expert':
                                    return 'linear-gradient(90deg, #10b981, #059669)';
                                  case 'Advanced':
                                    return 'linear-gradient(90deg, #3b82f6, #1d4ed8)';
                                  case 'Intermediate':
                                    return 'linear-gradient(90deg, #f59e0b, #d97706)';
                                  case 'Beginner':
                                    return 'linear-gradient(90deg, #6b7280, #4b5563)';
                                  default:
                                    return 'linear-gradient(90deg, #6b7280, #4b5563)';
                                }
                              })(),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Skills Summary */}
          <div className="mt-8 md:mt-12 text-center">
            <Card className="bg-dark-card/50 backdrop-blur-sm border border-green-500/30 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-500">4+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-500">18+</div>
                    <div className="text-sm text-muted-foreground">Technologies</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-yellow-500">3+</div>
                    <div className="text-sm text-muted-foreground">Live Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-500">Full Stack</div>
                    <div className="text-sm text-muted-foreground">Developer</div>
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

export default Skills;