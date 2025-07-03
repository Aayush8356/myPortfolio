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
  const [showFallbackButton, setShowFallbackButton] = useState(false);
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

  // Animation trigger with proper dependencies and fallback
  useEffect(() => {
    const startAnimation = () => {
      if (hasTriggered) return;
      
      setHasTriggered(true);
      
      // Animate skill bars with staggered delay
      skills.forEach((skill, index) => {
        setTimeout(() => {
          setAnimatedBars(prev => {
            const newSet = new Set(prev);
            newSet.add(skill.name);
            return newSet;
          });
        }, index * (window.innerWidth < 768 ? 100 : 150));
      });
    };

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
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

    // Fallback: Auto-trigger animation after 3 seconds if not triggered
    const fallbackTimeout = setTimeout(() => {
      if (!hasTriggered) {
        startAnimation();
      }
    }, 3000);

    // Show manual trigger button after 5 seconds if still not animated
    const buttonTimeout = setTimeout(() => {
      if (!hasTriggered) {
        setShowFallbackButton(true);
      }
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
      clearTimeout(buttonTimeout);
    };
  }, [hasTriggered, skills]); // Include dependencies

  // Reset animation state when component mounts
  useEffect(() => {
    setAnimatedBars(new Set());
    setHasTriggered(false);
  }, []);

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


  const getLevelPercentage = (level: Skill['level'], years?: string) => {
    // More accurate percentages based on actual proficiency
    switch (level) {
      case 'Expert': return 90;
      case 'Advanced': return 75;
      case 'Intermediate': return 55;
      case 'Beginner': 
        // Further adjust beginner based on experience description
        if (years === 'Just started') return 15;
        if (years === 'Basic') return 20;
        return 30;
      default: return 10;
    }
  };

  const manualTrigger = () => {
    if (hasTriggered) return;
    
    setHasTriggered(true);
    setShowFallbackButton(false);
    
    // Animate skill bars with staggered delay
    skills.forEach((skill, index) => {
      setTimeout(() => {
        setAnimatedBars(prev => {
          const newSet = new Set(prev);
          newSet.add(skill.name);
          return newSet;
        });
      }, index * 80); // Faster animation for manual trigger
    });
  };

  return (
    <section ref={sectionRef} id="skills" className="py-12 md:py-20 bg-background relative page-transition">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced animate-fade-in-up">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
              SKILLS & EXPERTISE
            </span>
          </h2>
          
          {/* Manual trigger button for users experiencing issues */}
          {showFallbackButton && (
            <div className="text-center mb-6">
              <button
                onClick={manualTrigger}
                className="px-6 py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 rounded-lg transition-all duration-300 text-sm font-medium"
              >
                Click to Show Skill Levels
              </button>
            </div>
          )}
          
          {/* Single Unified Skills Container */}
          <Card className="bg-card/30 backdrop-blur-sm border border-primary/20 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 md:p-8">
              {/* Skills Grid by Category */}
              <div className="space-y-8">
                {categories.map((category) => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  
                  return (
                    <div key={category} className="space-y-4 animate-fade-in-up" style={{animationDelay: `${0.4 + categories.indexOf(category) * 0.1}s`}}>
                      {/* Category Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-border/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <h3 className="text-lg font-bold text-foreground tracking-wide uppercase">
                          {category}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
                      </div>
                      
                      {/* Skills in this category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {categorySkills.map((skill, skillIndex) => (
                          <div 
                            key={skill.name} 
                            className="group p-3 sm:p-4 rounded-lg bg-background/20 border border-border/10 hover:border-primary/30 hover:bg-background/30 transition-all duration-300 animate-fade-in-up"
                            style={{animationDelay: `${0.6 + skillIndex * 0.1}s`}}
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1 sm:gap-0">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-responsive-sm group-hover:text-primary transition-colors">
                                  {skill.name}
                                </h4>
                                <span className="text-responsive-xs text-muted-foreground">{skill.years}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-responsive-xs font-medium ${getLevelColor(skill.level)} shadow-sm sm:ml-2 flex-shrink-0 self-start`}>
                                {skill.level}
                              </span>
                            </div>
                            
                            {/* Skill Bar */}
                            <div className="skill-bar-container">
                              <div 
                                className="skill-bar-fill"
                                style={{
                                  width: animatedBars.has(skill.name) ? `${getLevelPercentage(skill.level, skill.years)}%` : '0%',
                                  minHeight: '6px'
                                }}
                                data-skill={skill.name}
                                data-animated={animatedBars.has(skill.name) ? 'true' : 'false'}
                                title={`${skill.name}: ${getLevelPercentage(skill.level, skill.years)}%`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
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