import { useEffect, useState } from 'react';
import { useSEO, seoConfigs } from './useSEO';

export const useSectionVisibility = () => {
  const [activeSection, setActiveSection] = useState('home');
  
  // Apply SEO based on active section
  useSEO(seoConfigs[activeSection as keyof typeof seoConfigs] || seoConfigs.home);

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'testimonials', 'blog', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Trigger when section is 20% visible
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          // Map section IDs to SEO config keys
          const seoKeyMap: { [key: string]: string } = {
            'hero': 'home',
            'about': 'about',
            'skills': 'skills',
            'experience': 'about',
            'education': 'about',
            'projects': 'projects',
            'testimonials': 'about',
            'blog': 'about',
            'contact': 'contact'
          };
          
          const seoKey = seoKeyMap[sectionId] || 'home';
          setActiveSection(seoKey);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return activeSection;
};