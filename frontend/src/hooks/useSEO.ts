import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = config.title;
    }

    // Update meta description
    if (config.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description);
      }
    }

    // Update Open Graph title
    if (config.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', config.ogTitle);
      }
    }

    // Update Open Graph description
    if (config.ogDescription) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', config.ogDescription);
      }
    }

    // Update Open Graph image
    if (config.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', config.ogImage);
      }
    }

    // Update Twitter title
    if (config.twitterTitle) {
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', config.twitterTitle);
      }
    }

    // Update Twitter description
    if (config.twitterDescription) {
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', config.twitterDescription);
      }
    }

    // Update canonical URL
    if (config.canonicalUrl) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', config.canonicalUrl);
      }
    }
  }, [config]);
};

// Predefined SEO configurations for different sections
export const seoConfigs = {
  home: {
    title: 'Aayush Gupta | Full Stack Developer - React, Node.js, TypeScript Expert',
    description: 'Computer Science Engineer building scalable web applications with MERN stack. 1+ year experience with React, Node.js, MongoDB. Available for full-time opportunities.',
    ogTitle: 'Aayush Gupta | Full Stack Developer - React, Node.js, TypeScript Expert',
    ogDescription: 'Computer Science Engineer building scalable web applications with MERN stack. Built travel planning platform handling 500+ concurrent users, payment systems with 99.8% success rate.',
    canonicalUrl: 'https://meetaayush.com'
  },
  about: {
    title: 'About Aayush Gupta | Full Stack Developer Experience & Background',
    description: 'Learn about Aayush Gupta\'s journey as a Full Stack Developer. Computer Science Engineer from Chandigarh University with 1+ year experience in React, Node.js, and MongoDB development.',
    ogTitle: 'About Aayush Gupta | Full Stack Developer Experience & Background',
    ogDescription: 'Computer Science Engineer with passion for building efficient, scalable solutions. Self-taught MERN stack developer with 1+ year hands-on experience.'
  },
  skills: {
    title: 'Technical Skills | Aayush Gupta - React, Node.js, TypeScript Expert',
    description: 'Explore Aayush Gupta\'s technical expertise: React.js, Node.js, TypeScript, MongoDB, Express.js, TailwindCSS, Git, and more. Proficiency levels and years of experience included.',
    ogTitle: 'Technical Skills | Aayush Gupta - React, Node.js, TypeScript Expert',
    ogDescription: 'Frontend: React.js, TypeScript, TailwindCSS. Backend: Node.js, Express.js, MongoDB. Tools: Git, Docker, AWS, Vercel.'
  },
  projects: {
    title: 'Projects Portfolio | Aayush Gupta - Full Stack Developer Case Studies',
    description: 'Explore Aayush Gupta\'s project portfolio: Travel planning platform (500+ users), Payment UI library (99.8% success rate), Food delivery app (2000+ daily orders).',
    ogTitle: 'Projects Portfolio | Aayush Gupta - Full Stack Developer Case Studies',
    ogDescription: 'Real-world projects: Wandarlog travel platform, Payment UI component library, Web Food delivery application. Built with React, Node.js, TypeScript, MongoDB.'
  },
  contact: {
    title: 'Contact Aayush Gupta | Full Stack Developer - Hire for React, Node.js Projects',
    description: 'Get in touch with Aayush Gupta for full-time opportunities, freelance projects, or collaboration. Available for React, Node.js, TypeScript, and MongoDB development.',
    ogTitle: 'Contact Aayush Gupta | Full Stack Developer - Hire for React, Node.js Projects',
    ogDescription: 'Ready for full-time opportunities. Available for React, Node.js, TypeScript development. Email: guptaaayush537@gmail.com'
  }
};