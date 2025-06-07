import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Eye, Download } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const About: React.FC = () => {
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  
  const skills = [
    'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
    'Tailwind CSS', 'Next.js', 'Python', 'AWS', 'Docker', 'Git'
  ];

  useEffect(() => {
    checkResumeStatus();
    // Check resume status every 30 seconds to ensure it's current
    const interval = setInterval(checkResumeStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkResumeStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/current`);
      if (response.ok) {
        const data = await response.json();
        setHasUploadedResume(data.hasResume);
      } else {
        // If API fails, assume no uploaded resume to avoid confusion
        console.warn('Resume status check failed, falling back to static resume');
        setHasUploadedResume(false);
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
      // If API is unreachable, fall back to static resume
      setHasUploadedResume(false);
    }
  };

  const openResumePreview = async () => {
    // Recheck status before opening to ensure we have the latest state
    await checkResumeStatus();
    
    if (hasUploadedResume) {
      // Use API route for preview
      window.open('/api/resume/preview', '_blank');
    } else {
      // Fallback to static resume in public folder
      window.open('/resume.pdf', '_blank');
    }
  };

  const downloadResume = async () => {
    // Recheck status before downloading to ensure we have the latest state
    await checkResumeStatus();
    
    if (hasUploadedResume) {
      // Use API route for download
      window.open('/api/resume/download', '_blank');
    } else {
      // Fallback to static resume in public folder
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Aayush_Gupta_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section id="about" className="py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient uppercase-spaced">ABOUT ME</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
              <CardHeader>
                <CardTitle className="text-foreground uppercase-spaced">BACKGROUND</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  I'm <span className="text-foreground font-semibold">Aayush Gupta</span>, a passionate full-stack developer with expertise in modern web technologies.
                  I love creating efficient, scalable applications that provide excellent user experiences.
                  My journey in tech started with <span className="text-accent font-semibold">curiosity</span> and has evolved into a commitment to continuous learning
                  and building <span className="text-primary font-semibold">innovative solutions</span>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
              <CardHeader>
                <CardTitle className="text-foreground uppercase-spaced">EXPERIENCE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  With experience in both <span className="text-foreground font-semibold">frontend</span> and <span className="text-accent font-semibold">backend</span> development, I specialize in the MERN stack
                  and modern frameworks. I enjoy working on <span className="text-primary font-semibold">challenging projects</span> that push the boundaries
                  of what's possible on the web.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced">SKILLS & TECHNOLOGIES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 bg-muted text-foreground border border-dark-subtle hover-lift"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced">RESUME</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download or preview my complete <span className="text-foreground font-semibold">resume</span> to learn more about my experience and qualifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={openResumePreview} variant="outline" className="border-dark text-foreground hover:bg-muted hover-lift">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Resume
                </Button>
                <Button onClick={downloadResume} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift">
                  <Download className="w-4 h-4 mr-2" />
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