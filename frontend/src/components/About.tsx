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
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    backgroundTitle: 'BACKGROUND',
    backgroundContent: "I'm Aayush Gupta, a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable applications that provide excellent user experiences. My journey in tech started with curiosity and has evolved into a commitment to continuous learning and building innovative solutions.",
    experienceTitle: 'EXPERIENCE',
    experienceContent: "With experience in both frontend and backend development, I specialize in the MERN stack and modern frameworks. I enjoy working on challenging projects that push the boundaries of what's possible on the web.",
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'Python', 'AWS', 'Docker', 'Git'],
    resumeDescription: "Download or preview my complete resume to learn more about my experience and qualifications."
  });

  useEffect(() => {
    fetchAboutContent();
    checkResumeStatus();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const data = await cachedFetch<AboutContent>(
        `${API_BASE_URL}/about`,
        {},
        'about-content',
        600 // 10 minute cache for about content
      );
      setAboutContent(data);
    } catch (error) {
      console.error('Error fetching about content:', error);
      // Keep default content on error
    }
  };

  const checkResumeStatus = async () => {
    try {
      const data = await cachedFetch<{hasResume: boolean}>(
        `${API_BASE_URL}/resume/current`,
        {},
        'resume-status',
        60 // 1 minute cache for resume status
      );
      setHasUploadedResume(data.hasResume);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error checking resume status:', error);
      }
      setHasUploadedResume(false);
    }
  };

  const openResumePreview = async () => {
    // Always use backend API which handles both uploaded and fallback resumes
    window.open(`${API_BASE_URL}/resume/preview`, '_blank');
  };

  const downloadResume = async () => {
    // Always use backend API which handles both uploaded and fallback resumes
    window.open(`${API_BASE_URL}/resume/download`, '_blank');
  };

  return (
    <section id="about" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">ABOUT ME</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
            <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
              <CardHeader>
                <CardTitle className="text-foreground uppercase-spaced text-sm md:text-base lg:text-lg">{aboutContent.backgroundTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {aboutContent.backgroundContent}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
              <CardHeader>
                <CardTitle className="text-foreground uppercase-spaced text-sm md:text-base lg:text-lg">{aboutContent.experienceTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {aboutContent.experienceContent}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 md:mb-8 bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced text-sm md:text-base lg:text-lg">SKILLS & TECHNOLOGIES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {aboutContent.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 bg-muted text-foreground border border-dark-subtle hover-lift"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced text-sm md:text-base lg:text-lg">RESUME</CardTitle>
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