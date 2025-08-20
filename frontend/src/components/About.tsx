import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Eye, Download } from 'lucide-react';
import { API_BASE_URL, BLOB_BASE_URL } from '../config/api';
import { cachedFetch } from '../lib/cache';

interface AboutContent {
  backgroundTitle: string;
  backgroundContent: string;
  experienceTitle: string;
  experienceContent: string;
  resumeDescription: string;
}

const About: React.FC = () => {
  const [hasResume, setHasResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    backgroundTitle: 'BACKGROUND',
    backgroundContent: "I'm Aayush Gupta, a Full Stack Developer with 1+ year of hands-on experience building web applications using the MERN stack (MongoDB, Express.js, React.js, and Node.js). I hold a Bachelor's degree in Computer Science and Engineering from Chandigarh University (2020–2024), and my journey as a developer has been shaped through self-driven learning, building solo projects, and solving real-world problems through software.",
    experienceTitle: 'PHILOSOPHY & FOCUS',
    experienceContent: "My core motivation lies in identifying real-world challenges and crafting scalable, user-focused solutions through web applications. I continuously push myself to learn emerging technologies, improve system design skills, and deepen my understanding of full-stack development. I'm currently focused on expanding my backend expertise, exploring DevOps tools, and contributing to impactful software solutions.",
    resumeDescription: "Download or preview my complete resume to learn more about my experience, education, and technical qualifications."
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
      // Keep default content on error
    }
  };

  const checkResumeStatus = async () => {
    try {
      const res = await fetch('/data/resume-status.json');
      const data = await res.json();
      if (data && data.data) {
        setHasResume(data.data.hasResume || false);
        setResumeUrl(data.data.resumeUrl || '');
      }
    } catch (error) {
      setHasResume(false);
      setResumeUrl('');
    }
  };

  

  return (
    <section id="about" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced animate-fade-in-up">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
              ABOUT ME
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
            <Card className="bg-dark-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl border border-border/20 hover:border-primary/40 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                  {aboutContent.backgroundTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                  {aboutContent.backgroundContent}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl border border-border/20 hover:border-primary/40 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground text-lg font-semibold group-hover:text-primary transition-colors duration-300">
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
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-dark text-foreground hover:bg-muted hover-lift text-xs md:text-sm" disabled={!hasResume}>
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Preview Resume
                  </Button>
                </a>
                <a href={resumeUrl} download="Aayush_Gupta_Resume.pdf">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift text-xs md:text-sm" disabled={!hasResume}>
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Download Resume
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;