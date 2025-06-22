import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Eye, Download } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { cachedFetch } from '../lib/cache';

interface AboutContent {
  backgroundTitle: string;
  backgroundContent: string;
  experienceTitle: string;
  experienceContent: string;
  skills: string[];
  resumeDescription: string;
}

const About: React.FC = () => {
  // Remove unused variable since resume functionality is handled by API
  // const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    backgroundTitle: 'BACKGROUND',
    backgroundContent: "I'm Aayush Gupta, a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable applications that provide excellent user experiences. My journey in tech started with curiosity and has evolved into a commitment to continuous learning and building innovative solutions.",
    experienceTitle: 'EXPERIENCE',
    experienceContent: "With experience in both frontend and backend development, I specialize in the MERN stack and modern frameworks. I enjoy working on challenging projects that push the boundaries of what's possible on the web.",
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'Python', 'AWS', 'Docker', 'Git'],
    resumeDescription: "Download or preview my complete resume to learn more about my experience and qualifications."
  });

  useEffect(() => {
    // Fetch data immediately - no artificial delay
    fetchAboutContent();
    checkResumeStatus();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const data = await cachedFetch<AboutContent>(
        `${API_BASE_URL}/about`,
        {},
        'about-content', // Consistent with pre-cache
        900 // 15 minute cache for about content (consistent with pre-cache)
      );
      setAboutContent(prev => ({ ...prev, ...data })); // Merge with defaults
    } catch (error) {
      console.error('Error fetching about content:', error);
      // Keep default content on error
    }
  };

  const checkResumeStatus = async () => {
    try {
      await cachedFetch<{hasResume: boolean}>(
        `${API_BASE_URL}/resume/current`,
        {},
        'resume-status',
        60 // 1 minute cache for resume status
      );
      // setHasUploadedResume(data.hasResume);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error checking resume status:', error);
      }
      // setHasUploadedResume(false);
    }
  };

  const openResumePreview = async () => {
    // Always use backend API which handles both uploaded and fallback resumes
    window.open(`${API_BASE_URL}/resume/preview`, '_blank');
  };

  const downloadResume = async () => {
    try {
      // Try backend first
      const response = await fetch(`${API_BASE_URL}/resume/current`);
      if (response.ok) {
        const data = await response.json();
        if (data.hasResume) {
          window.open(`${API_BASE_URL}/resume/download`, '_blank');
          return;
        }
      }
    } catch (error) {
      console.warn('Backend resume check failed, using static fallback');
    }
    
    // Fallback to static resume
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Aayush_Gupta_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">ABOUT ME</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
            <Card className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground uppercase-spaced text-base md:text-lg lg:text-xl font-semibold">
                  {aboutContent.backgroundTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                  {aboutContent.backgroundContent}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground uppercase-spaced text-base md:text-lg lg:text-xl font-semibold">
                  {aboutContent.experienceTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                  {aboutContent.experienceContent}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 md:mb-10 bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'}}>
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground uppercase-spaced text-base md:text-lg lg:text-xl font-semibold">
                SKILLS & TECHNOLOGIES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {aboutContent.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 bg-muted/80 text-foreground border border-border/30 hover:border-accent/50 hover:bg-accent/10 hover-lift"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'}}>
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground uppercase-spaced text-base md:text-lg lg:text-xl font-semibold">
                RESUME
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                {aboutContent.resumeDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button onClick={openResumePreview} variant="outline" className="border-dark text-foreground hover:bg-muted hover-lift text-xs md:text-sm">
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Preview Resume
                </Button>
                <Button onClick={downloadResume} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift text-xs md:text-sm">
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Download Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;