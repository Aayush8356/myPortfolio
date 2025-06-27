import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  years: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Cloud';
}

const Skills: React.FC = () => {
  const [animatedBars, setAnimatedBars] = useState<Set<string>>(new Set());
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const skills: Skill[] = useMemo(() => [
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
  ], []);

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Cloud'] as const;

  // Clear state on mount to ensure fresh start
  useEffect(() => {
    setAnimatedBars(new Set());
    setHasTriggered(false);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          console.log('Skills section visible, starting animation');
          setHasTriggered(true);
          
          // Animate skill bars with staggered delay
          skills.forEach((skill, index) => {
            setTimeout(() => {
              setAnimatedBars(prev => {
                const newSet = new Set(prev);
                newSet.add(skill.name);
                console.log(`Added ${skill.name} (${skill.level}) to animated bars. Should be ${getLevelPercentage(skill.level)}%. Total: ${newSet.size}`);
                return newSet;
              });
            }, index * (window.innerWidth < 768 ? 100 : 150)); // Faster on mobile
          });
        }
      },
      { 
        threshold: window.innerWidth < 768 ? 0.2 : 0.4,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []); // Only run once on mount

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Expert':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'Beginner':
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/30 dark:text-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/30 dark:text-slate-300 dark:border-slate-700';
    }
  };


  const getLevelPercentage = (level: Skill['level']) => {
    switch (level) {
      case 'Expert': return 95;
      case 'Advanced': return 80;
      case 'Intermediate': return 65;
      case 'Beginner': return 40;
      default: return 20;
    }
  };

  return (
    <section ref={sectionRef} id="skills" className="py-12 md:py-20 bg-background relative page-transition">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">
            SKILLS & EXPERTISE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categorySkills = skills.filter(skill => skill.category === category);
              
              return (
                <Card key={category}
                  className="bg-card/50 backdrop-blur-sm border border-border/20 hover:border-primary/30 transition-all duration-300 rounded-xl h-full"
                  style={{
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <CardHeader className="pb-4 border-b border-border/10">
                    <CardTitle className="text-foreground text-lg font-bold text-center tracking-wide">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name} className="space-y-3 p-3 rounded-lg bg-background/30 border border-border/10 hover:bg-background/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-foreground">{skill.name}</h4>
                            <span className="text-xs text-muted-foreground">{skill.years}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)} shadow-sm`}>
                            {skill.level}
                          </span>
                        </div>
                        <div className="skill-bar-container">
                          <div 
                            className="skill-bar-fill"
                            style={{
                              width: animatedBars.has(skill.name) ? `${getLevelPercentage(skill.level)}%` : '0%',
                              minHeight: '8px' // Ensure bars are visible
                            }}
                            data-skill={skill.name}
                            data-animated={animatedBars.has(skill.name) ? 'true' : 'false'}
                            title={`${skill.name}: ${animatedBars.has(skill.name) ? getLevelPercentage(skill.level) : 0}%`}
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
          <div className="mt-6 md:mt-8 text-center">
            <Card className="bg-card/30 backdrop-blur-sm border border-border/20 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-center mb-6 text-foreground">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">4+</div>
                    <div className="text-sm text-muted-foreground font-medium">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-500">18+</div>
                    <div className="text-sm text-muted-foreground font-medium">Technologies</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-500">3+</div>
                    <div className="text-sm text-muted-foreground font-medium">Live Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-500">Full Stack</div>
                    <div className="text-sm text-muted-foreground font-medium">Developer</div>
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