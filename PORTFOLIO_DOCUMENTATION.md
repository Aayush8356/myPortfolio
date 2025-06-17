# Portfolio Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Theme System](#theme-system)
4. [Color Palette](#color-palette)
5. [Component Library](#component-library)
6. [API & Backend Integration](#api--backend-integration)
7. [Authentication & Admin](#authentication--admin)
8. [Performance & Optimization](#performance--optimization)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)

---

## Project Overview

**Portfolio Application - Full Stack Developer Showcase**

A modern, responsive portfolio website built for showcasing full-stack development skills. Features include dark/light mode, admin panel, contact management, interactive games, and dynamic content management.

### Tech Stack
- **Frontend**: React 19.1.0 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based system
- **Deployment**: Vercel (Frontend) + Backend hosting
- **UI Components**: ShadcnUI with custom modifications

---

## Architecture & Structure

### Directory Structure
```
portfolio-aayush/
├── frontend/                 # React TypeScript SPA
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── admin/       # Admin panel components
│   │   │   └── *.tsx        # Page sections
│   │   ├── config/          # API configuration
│   │   ├── lib/             # Utilities and helpers
│   │   └── index.css        # Global styles & theme
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Custom middleware
│   │   └── server.ts        # Express server
│   └── package.json
├── start.sh                 # Development startup script
└── CLAUDE.md               # Development instructions
```

### Key Components

#### Core Sections
- **Hero**: Main landing with animated tech elements
- **About**: Background, experience, skills, resume
- **Projects**: Dynamic project showcase with admin management
- **Contact**: Contact form with real-time messaging
- **Fun Centre**: Interactive games (Tic Tac Toe, Memory Game)

#### Admin System
- **AdminPanel**: Full CRUD operations for projects and contacts
- **Authentication**: JWT-based admin login
- **File Management**: Resume upload and management

---

## Theme System

### Design Philosophy
**"Fullstack Developer Theme"** - A tech-forward design emphasizing:
- Modern green primary color scheme
- Dark/light mode compatibility
- Subtle animations and hover effects
- Tech-inspired background elements
- Professional typography with accent gradients

### CSS Architecture

#### Custom Properties (CSS Variables)
```css
:root {
  /* Light Mode Colors */
  --primary: 142 76% 36%;          /* Modern green */
  --secondary: 47 96% 48%;         /* Golden yellow */
  --accent: 158 64% 48%;           /* Mint green */
  --background: 0 0% 98%;          /* Off-white */
  --foreground: 220 26% 14%;       /* Deep slate */
  --muted: 220 14% 94%;            /* Light gray */
  --border: 220 13% 88%;           /* Border gray */
  --ring: 142 76% 36%;             /* Focus ring green */
  
  /* Glow Effects */
  --glow-primary: 142, 76%, 36%;   /* Green glow */
  --glow-secondary: 47, 96%, 48%;  /* Golden glow */
  --glow-accent: 158, 64%, 48%;    /* Mint glow */
}

.dark {
  /* Dark Mode Colors */
  --primary: 142 76% 50%;          /* Brighter green */
  --background: 220 26% 8%;        /* Deep dark blue-gray */
  --foreground: 220 14% 96%;       /* Almost white */
  --card: 220 26% 10%;             /* Dark cards */
  --muted: 220 26% 15%;            /* Dark muted */
  --border: 220 26% 18%;           /* Dark border */
  
  /* Enhanced Glow Effects */
  --glow-primary: 142, 76%, 50%;   /* Brighter green glow */
}
```

#### Special Effects
- **Glow System**: Multi-layer glow effects for buttons, tech elements
- **Text Gradients**: Green-to-ring gradient for section headings
- **Tech Patterns**: Animated grid, circuit, and code patterns
- **Particles**: Floating animated elements with green glow
- **Hover Animations**: Scale, glow, and shadow transitions

---

## Color Palette

### Primary Colors
```css
/* Modern Green Theme */
Primary: hsl(142, 76%, 36%)     /* #22C55E - Main green */
Primary Dark: hsl(142, 76%, 50%) /* #10B981 - Brighter for dark mode */

/* Supporting Colors */
Secondary: hsl(47, 96%, 48%)     /* #F59E0B - Golden yellow */
Accent: hsl(158, 64%, 48%)       /* #10B981 - Mint green */

/* Neutrals */
Background Light: hsl(0, 0%, 98%)      /* #FAFAFA */
Background Dark: hsl(220, 26%, 8%)     /* #0F172A */
Foreground Light: hsl(220, 26%, 14%)   /* #1E293B */
Foreground Dark: hsl(220, 14%, 96%)    /* #F1F5F9 */
```

### Usage Guidelines
- **Primary Green**: Main actions, titles, focus states
- **Golden Yellow**: Secondary actions, highlights
- **Mint Green**: Accent elements, success states
- **Neutrals**: Text, backgrounds, borders

### Accessibility
- All color combinations meet WCAG 2.1 AA standards
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text

---

## Component Library

### Core UI Components (ShadcnUI Based)

#### Cards
```typescript
<Card className="bg-dark-card backdrop-blur-sm" 
      style={{border: '1px solid rgba(34, 197, 94, 0.3)', 
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'}}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

#### Buttons
```typescript
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Primary Action
</Button>
```

#### Skeletons
- **HeroSkeleton**: Hero section loading state
- **AboutSkeleton**: About cards loading state
- **ProjectSkeleton**: Project cards loading state
- **ContactSkeleton**: Contact info loading state
- **FormSkeleton**: Form elements loading state

### Custom Components

#### Tech Elements
- **Terminal Window**: Animated terminal with green glow
- **API Connection**: Vertical connection lines with pulse
- **Particles**: Floating animated particles
- **Grid Patterns**: Tech-inspired background grids

#### Interactive Games
- **TicTacToe**: Classic game with green theme
- **MemoryGame**: Card matching with emoji icons

---

## API & Backend Integration

### Endpoints

#### Authentication
```typescript
POST /api/auth/login     // Admin login
POST /api/auth/logout    // Admin logout
GET  /api/auth/verify    // Token verification
```

#### Projects
```typescript
GET    /api/projects           // Public: Get all projects
POST   /api/projects           // Admin: Create project
PUT    /api/projects/:id       // Admin: Update project
DELETE /api/projects/:id       // Admin: Delete project
```

#### Contact
```typescript
POST /api/contact              // Public: Send message
GET  /api/contact              // Admin: Get messages
PUT  /api/contact/:id/read     // Admin: Mark as read
DELETE /api/contact/:id        // Admin: Delete message
GET  /api/contact-details      // Public: Get contact info
```

#### Content Management
```typescript
GET  /api/about               // Get about content
PUT  /api/about               // Admin: Update about
GET  /api/fun-centre          // Get games settings
PUT  /api/fun-centre          // Admin: Update games
```

#### File Management
```typescript
POST /api/resume/upload       // Admin: Upload resume
GET  /api/resume/download     // Public: Download resume
GET  /api/resume/preview      // Public: Preview resume
GET  /api/resume/current      // Check resume status
```

### Data Models

#### Project
```typescript
interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Contact Message
```typescript
interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

### Caching Strategy
- **Frontend Caching**: 10-15 minute cache for static content
- **Graceful Fallbacks**: Default content when API unavailable
- **Progressive Enhancement**: Core content loads immediately

---

## Authentication & Admin

### JWT System
- **Token Storage**: localStorage
- **Expiration**: Configurable (default: 24 hours)
- **Auto-refresh**: Token verification on protected routes
- **Logout**: Automatic on token expiration

### Admin Panel Access
- **Keyboard Shortcut**: Ctrl+Alt+A
- **Footer Button**: Admin panel link
- **Protected Routes**: Middleware-based protection

### Default Credentials
```
Email: admin@example.com
Password: admin123
```

### Admin Features
- Project CRUD operations
- Contact message management
- Resume file management
- Content editing (About, Fun Centre)
- Real-time message notifications

---

## Performance & Optimization

### Frontend Optimizations
- **Code Splitting**: React.lazy for admin components
- **Image Optimization**: WebP format, lazy loading
- **CSS Optimization**: Tailwind purging, minimal custom CSS
- **Bundle Analysis**: Webpack bundle analyzer integration

### Loading Strategies
- **Skeleton Loading**: Immediate visual feedback
- **Progressive Enhancement**: Core content first
- **Graceful Fallbacks**: Default data when API fails
- **Caching**: Aggressive caching for static content

### Mobile Performance
- **Responsive Images**: Multiple breakpoints
- **Touch Optimization**: 44px minimum touch targets
- **Reduced Animations**: Respect prefers-reduced-motion
- **Efficient Renders**: React.memo for expensive components

---

## Development Workflow

### Environment Setup
```bash
# Start both servers
./start.sh

# Individual development
cd frontend && npm start     # localhost:3000
cd backend && npm run dev    # localhost:5002
```

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: Individual feature development
- **Commit Format**: Conventional commits with Claude Code attribution

### Testing Strategy
- **React Testing Library**: Component testing
- **Manual Testing**: Cross-browser compatibility
- **Responsive Testing**: Multiple device sizes
- **Accessibility Testing**: WCAG compliance

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: React recommended rules
- **Prettier**: Code formatting
- **File Naming**: PascalCase for components, camelCase for utilities

---

## Deployment

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**: API endpoints
- **Auto-deployment**: GitHub integration

### Backend
- **Build Process**: TypeScript compilation
- **Environment Variables**: Required .env setup
- **Database**: MongoDB Atlas recommended
- **File Storage**: Local or cloud storage for resume

### Environment Variables

#### Frontend
```env
REACT_APP_API_BASE_URL=http://localhost:5002/api
REACT_APP_BLOB_BASE_URL=http://localhost:5002
```

#### Backend
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] CORS settings updated
- [ ] SSL certificates installed
- [ ] Admin user seeded
- [ ] File upload directories configured

---

## Future Development

### Planned Features
- **Analytics Integration**: Google Analytics or similar
- **Blog Section**: Dynamic blog with markdown support
- **Testimonials**: Client testimonial management
- **Multi-language**: i18n support
- **Advanced Games**: More interactive games
- **Performance Dashboard**: Real-time metrics

### Technical Improvements
- **GraphQL**: Replace REST API
- **PWA**: Progressive Web App features
- **Image CDN**: Cloudinary integration
- **Real-time**: WebSocket for live updates
- **Testing**: Comprehensive test suite
- **CI/CD**: Automated deployment pipeline

### Maintenance
- **Dependencies**: Monthly security updates
- **Performance**: Quarterly performance audits
- **Backup**: Database backup strategy
- **Monitoring**: Error tracking and performance monitoring

---

## Contact & Support

**Developer**: Aayush Gupta
**Email**: aayush@meetaayush.com
**GitHub**: https://github.com/Aayush8356/myPortfolio
**Live Site**: https://meetaayush.com

For technical questions or contributions, please refer to this documentation and the CLAUDE.md file for specific development guidelines.

---

*Last Updated: December 2024*
*Documentation Version: 1.0*