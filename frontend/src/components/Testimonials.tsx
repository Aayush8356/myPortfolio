import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Quote, Star, Linkedin, Github, Building } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  companyUrl?: string;
  relationship: string;
  projectContext?: string;
}

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Toggle this to show/hide placeholder testimonials
  // Set to false when you have real testimonials to replace them
  const showPlaceholderTestimonials = false;

  // PLACEHOLDER testimonials - realistic examples for portfolio demonstration
  // TODO: Replace with real testimonials when available
  const placeholderTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      role: 'Senior Faculty',
      company: 'Chandigarh University',
      content: 'Aayush demonstrated exceptional technical skills and dedication during his academic journey. His final year project showcased advanced full-stack development capabilities with React and Node.js. He consistently delivered high-quality code and showed strong problem-solving abilities. His passion for learning new technologies and implementing best practices made him stand out among his peers.',
      rating: 5,
      relationship: 'Academic Supervisor',
      projectContext: 'Final Year Project - Web Application Development',
      linkedinUrl: 'https://linkedin.com/in/dr-rajesh-kumar-cu'
    },
    {
      id: '2',
      name: 'Priya Singh',
      role: 'Project Lead',
      company: 'Tech Solutions Inc',
      content: 'Working with Aayush on the travel planning platform was an excellent experience. He delivered a robust React application with real-time features that handled concurrent users efficiently. His attention to detail, code quality, and ability to meet tight deadlines impressed the entire team. The MongoDB optimization he implemented improved our query performance by 60%.',
      rating: 5,
      relationship: 'Project Collaborator',
      projectContext: 'Wandarlog - Travel Planning Platform',
      linkedinUrl: 'https://linkedin.com/in/priya-singh-dev'
    },
    {
      id: '3',
      name: 'Arjun Mehta',
      role: 'Full Stack Developer',
      company: 'StartupHub',
      content: 'Aayush\'s payment UI component library saved our development team weeks of work. The TypeScript implementation was clean, well-documented, and highly reusable. His understanding of security best practices and PCI compliance requirements was impressive for someone early in their career. The component integration was seamless across multiple projects.',
      rating: 5,
      relationship: 'Fellow Developer',
      projectContext: 'Payment UI Component Library',
      githubUrl: 'https://github.com/arjunmehta-dev',
      linkedinUrl: 'https://linkedin.com/in/arjun-mehta-fullstack'
    },
    {
      id: '4',
      name: 'Sneha Patel',
      role: 'Senior Software Engineer',
      company: 'WebTech Solutions',
      content: 'I mentored Aayush during his work on the food delivery application. His approach to handling real-time order tracking and state management was sophisticated. He quickly grasped complex concepts like WebSocket implementation and database optimization. His code reviews were thorough, and he actively contributed to improving our development processes.',
      rating: 5,
      relationship: 'Technical Mentor',
      projectContext: 'Web Food - Delivery Application',
      linkedinUrl: 'https://linkedin.com/in/sneha-patel-senior-dev'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      role: 'CS Student',
      company: 'Chandigarh University',
      content: 'Aayush was an excellent study partner and team member during our computer science coursework. He has a natural ability to break down complex programming problems and explain solutions clearly. His MERN stack projects were always well-structured and innovative. He helped our entire group improve our coding standards and best practices.',
      rating: 5,
      relationship: 'Academic Peer',
      projectContext: 'University Group Projects & Study Sessions',
      githubUrl: 'https://github.com/vikram-cs-student',
      linkedinUrl: 'https://linkedin.com/in/vikram-singh-cs'
    }
  ];

  // REAL testimonials - Add actual testimonials here when you receive them
  const realTestimonials: Testimonial[] = [
    // Example format for when you get real testimonials:
    // {
    //   id: 'real-1',
    //   name: 'John Smith',
    //   role: 'Senior Developer',
    //   company: 'Real Company',
    //   content: 'Actual testimonial content here...',
    //   rating: 5,
    //   relationship: 'Colleague',
    //   projectContext: 'Actual project name',
    //   linkedinUrl: 'https://linkedin.com/in/real-person'
    // }
  ];

  // Use real testimonials if available, otherwise show placeholder or empty
  const testimonials = realTestimonials.length > 0 
    ? realTestimonials 
    : (showPlaceholderTestimonials ? placeholderTestimonials : []);

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
    const cardWidth = 400; // Approximate card width + gap
    scrollContainerRef.current.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 400; // Approximate card width + gap
    scrollContainerRef.current.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth = 400;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    updateScrollIndicators();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient uppercase-spaced">
              TESTIMONIALS & RECOMMENDATIONS
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              What colleagues, mentors, and collaborators say about my work and technical abilities
            </p>
          </div>

          {/* Show content only if testimonials exist */}
          {testimonials.length > 0 ? (
            <>
              {/* Navigation arrows */}
              <div className="flex justify-center gap-2 mb-6">
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
              </div>

              {/* Testimonials container */}
          <div 
            ref={scrollContainerRef}
            onScroll={updateScrollIndicators}
            className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollSnapType: 'x-mandatory' }}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="flex-shrink-0 w-full max-w-sm bg-dark-card backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all duration-300"
                style={{ scrollSnapAlign: 'start' }}
              >
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <div className="flex justify-between items-start mb-4">
                    <Quote className="w-8 h-8 text-accent/60 flex-shrink-0" />
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Testimonial content */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-6">
                    "{testimonial.content}"
                  </p>

                  {/* Author info */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <p className="text-xs text-accent font-medium">
                        {testimonial.relationship}
                      </p>
                    </div>

                    {/* Project context */}
                    {testimonial.projectContext && (
                      <div className="p-3 bg-muted/20 rounded-md border border-border/20">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Project:</span> {testimonial.projectContext}
                        </p>
                      </div>
                    )}

                    {/* Social links */}
                    <div className="flex gap-2">
                      {testimonial.linkedinUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-2 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <a
                            href={testimonial.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${testimonial.name}'s LinkedIn profile`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {testimonial.githubUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-2 hover:bg-gray-500/10 hover:text-gray-400"
                        >
                          <a
                            href={testimonial.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${testimonial.name}'s GitHub profile`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {testimonial.companyUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-2 hover:bg-accent/10 hover:text-accent"
                        >
                          <a
                            href={testimonial.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${testimonial.company}'s website`}
                          >
                            <Building className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
            </>
          ) : (
            /* No testimonials available - show coming soon message */
            <div className="text-center">
              <Card className="bg-dark-card/50 backdrop-blur-sm border border-accent/30 shadow-lg max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Testimonials Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    I'm building relationships and delivering quality work. Real testimonials from colleagues and clients will be added here as I receive them.
                  </p>
                  <Button 
                    asChild 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <a href="#contact">
                      Work With Me
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Call to action - only show when testimonials exist */}
          {testimonials.length > 0 && (
          <div className="text-center mt-8 md:mt-12">
            <Card className="bg-dark-card/50 backdrop-blur-sm border border-accent/30 shadow-lg max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Want to add your testimonial?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have you worked with me on a project? I'd love to hear your feedback and showcase our collaboration.
                </p>
                <Button 
                  asChild 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="#contact">
                    Share Your Experience
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;