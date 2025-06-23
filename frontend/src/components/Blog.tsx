import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, ArrowRight, BookOpen, Code, Lightbulb, TrendingUp, Users, Globe } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  tags: string[];
  status: 'published' | 'coming-soon';
}

const Blog: React.FC = () => {
  // Planned blog content showcasing technical expertise and thought leadership
  const plannedPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Scalable React Applications: Lessons from Real-World Projects',
      excerpt: 'Insights from developing Wandarlog, a travel planning platform handling 500+ concurrent users. Exploring state management, performance optimization, and architecture decisions that matter.',
      category: 'React Development',
      readTime: '8 min read',
      publishDate: 'Coming Soon',
      tags: ['React', 'Scalability', 'Performance', 'State Management'],
      status: 'coming-soon'
    },
    {
      id: '2',
      title: 'TypeScript Best Practices: From JavaScript Developer to Type-Safe Expert',
      excerpt: 'My journey adopting TypeScript in production applications. Common pitfalls, advanced patterns, and how proper typing prevented bugs in payment processing systems.',
      category: 'TypeScript',
      readTime: '12 min read',
      publishDate: 'Coming Soon',
      tags: ['TypeScript', 'JavaScript', 'Best Practices', 'Type Safety'],
      status: 'coming-soon'
    },
    {
      id: '3',
      title: 'Full-Stack Authentication: JWT Implementation with Node.js and React',
      excerpt: 'Complete guide to secure authentication systems. Implementation details from my travel platform project, including security considerations and user experience optimization.',
      category: 'Backend Development',
      readTime: '15 min read',
      publishDate: 'Coming Soon',
      tags: ['Node.js', 'Authentication', 'Security', 'JWT', 'Express'],
      status: 'coming-soon'
    },
    {
      id: '4',
      title: 'Database Optimization Strategies: MongoDB Performance in Production',
      excerpt: 'How I optimized database queries to achieve sub-200ms response times in food delivery app. Indexing strategies, aggregation pipelines, and monitoring techniques.',
      category: 'Database',
      readTime: '10 min read',
      publishDate: 'Coming Soon',
      tags: ['MongoDB', 'Performance', 'Database', 'Optimization'],
      status: 'coming-soon'
    },
    {
      id: '5',
      title: 'From Student to Full-Stack Developer: My Learning Journey and Tips',
      excerpt: 'Transitioning from computer science theory to practical development. Resources, projects, and mindset shifts that accelerated my growth in the MERN stack ecosystem.',
      category: 'Career Development',
      readTime: '6 min read',
      publishDate: 'Coming Soon',
      tags: ['Career', 'Learning', 'MERN Stack', 'Student Life'],
      status: 'coming-soon'
    },
    {
      id: '6',
      title: 'Component Library Development: Building Reusable UI Systems',
      excerpt: 'Creating a payment UI component library that reduced development time by 40%. Design system principles, TypeScript patterns, and documentation strategies.',
      category: 'Frontend Architecture',
      readTime: '14 min read',
      publishDate: 'Coming Soon',
      tags: ['Component Library', 'Design Systems', 'Reusability', 'Documentation'],
      status: 'coming-soon'
    }
  ];

  const categories = [
    { name: 'React Development', icon: Code, count: 2, color: 'text-blue-400' },
    { name: 'Backend Development', icon: Globe, count: 2, color: 'text-green-400' },
    { name: 'Career Development', icon: TrendingUp, count: 1, color: 'text-purple-400' },
    { name: 'Frontend Architecture', icon: Lightbulb, count: 1, color: 'text-yellow-400' }
  ];

  return (
    <section id="blog" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient uppercase-spaced">
              TECH BLOG & INSIGHTS
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto">
              Sharing knowledge from real-world development experiences. Deep dives into React, Node.js, TypeScript, 
              and the challenges of building scalable web applications.
            </p>
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.name} className="bg-dark-card backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <IconComponent className={`w-6 h-6 mx-auto mb-2 ${category.color}`} />
                    <h3 className="font-medium text-foreground text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} article{category.count !== 1 ? 's' : ''}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-12">
            {plannedPosts.map((post) => (
              <Card 
                key={post.id} 
                className="group bg-dark-card backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <CardTitle className="text-base md:text-lg font-semibold text-foreground leading-tight group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.publishDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-muted/30 text-muted-foreground rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-muted/30 text-muted-foreground rounded-md">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-accent hover:text-accent hover:bg-accent/10 cursor-not-allowed opacity-60"
                    disabled
                  >
                    Coming Soon
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup / Blog Launch Notification */}
          <Card className="bg-dark-card/50 backdrop-blur-sm border border-accent/30 shadow-lg">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent/20 rounded-full">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                Blog Coming Soon!
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl mx-auto">
                I'm planning to share detailed insights from my development journey, including technical tutorials, 
                project case studies, and lessons learned from building scalable applications. 
                Stay tuned for in-depth content on React, Node.js, TypeScript, and full-stack development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>Technical Tutorials</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>Project Insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>Career Tips</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  asChild 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="#contact">
                    Get Notified When Live
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="border-accent/30 hover:border-accent text-foreground hover:text-accent hover:bg-accent/10"
                >
                  <a href="#projects">
                    View My Projects Instead
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Blog;