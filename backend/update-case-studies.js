const mongoose = require('mongoose');
require('dotenv').config();

// Define the Project schema with case study fields
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  imageUrl: String,
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false },
  challenge: { type: String, maxlength: 1000, default: '' },
  solution: { type: String, maxlength: 1500, default: '' },
  impact: { type: String, maxlength: 1000, default: '' },
  duration: { type: String, maxlength: 50, default: '' },
  team: { type: String, maxlength: 100, default: '' }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const updateCaseStudies = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');
    
    // Case study data matching the frontend defaults
    const caseStudyUpdates = [
      {
        title: 'Wandarlog',
        updates: {
          description: 'A comprehensive travel planning platform that revolutionizes how travelers organize and share their journeys with real-time collaboration and intelligent itinerary management.',
          challenge: 'Travelers struggle with scattered trip information across multiple platforms, lack of real-time collaboration tools, and inefficient itinerary planning processes that waste valuable time and create confusion among travel groups.',
          solution: 'Built a full-stack platform using React, Node.js, and MongoDB with real-time WebSocket connections for collaborative planning. Implemented JWT authentication, RESTful APIs, interactive maps integration, and responsive design patterns. Created efficient caching strategies and optimized database queries for concurrent user sessions.',
          impact: 'Reduced trip planning time by 60%, supports real-time collaboration for groups up to 10 users, handles 500+ concurrent sessions with 99.5% uptime, and processes over 1,000 itinerary updates daily with sub-200ms response times.',
          duration: '4 months',
          team: 'Solo Developer'
        }
      },
      {
        title: 'Payment UI Component',
        updates: {
          description: 'A reusable React component library providing secure, accessible payment interfaces with seamless integration across multiple projects and payment gateways.',
          challenge: 'Inconsistent payment UI implementations across projects leading to poor user experience, security vulnerabilities, longer development cycles, and maintenance overhead when integrating with different payment providers.',
          solution: 'Developed a modular TypeScript component library with PCI-compliant design patterns, comprehensive form validation, customizable themes, and seamless integration APIs. Implemented automated testing, accessibility features, and documentation for rapid adoption across development teams.',
          impact: 'Reduced payment integration development time by 40%, eliminated UI inconsistencies across 12+ projects, achieved 99.8% transaction success rate, and maintained WCAG AA accessibility compliance with zero security incidents.',
          duration: '3 months',
          team: 'Solo Developer'
        }
      },
      {
        title: 'Web Food',
        updates: {
          description: 'A full-scale food delivery application with real-time order tracking, integrated payment processing, and GPS-based delivery management for seamless customer experience.',
          challenge: 'Complex real-time order management requiring synchronization between customers, restaurants, and delivery drivers, while maintaining system performance under high load and ensuring accurate delivery tracking with minimal latency.',
          solution: 'Architected a scalable Next.js application with MongoDB for data persistence, WebSocket connections for real-time updates, integrated payment APIs, and GPS tracking systems. Implemented efficient state management, API optimization, and responsive design for cross-platform compatibility.',
          impact: 'Successfully handles 100+ concurrent orders with real-time notifications, maintains 99.9% uptime during peak hours, processes 2,000+ daily transactions, and achieved 95% customer satisfaction with average delivery tracking accuracy of 98%.',
          duration: '5 months',
          team: 'Solo Developer'
        }
      }
    ];
    
    console.log('\nUpdating projects with case study details...');
    for (const { title, updates } of caseStudyUpdates) {
      const result = await Project.findOneAndUpdate(
        { title },
        updates,
        { new: true, upsert: false }
      );
      
      if (result) {
        console.log(`✅ Enhanced ${title} with case study details`);
        console.log(`   Challenge: ${updates.challenge.substring(0, 80)}...`);
        console.log(`   Solution: ${updates.solution.substring(0, 80)}...`);
        console.log(`   Impact: ${updates.impact.substring(0, 80)}...`);
        console.log(`   Duration: ${updates.duration} | Team: ${updates.team}\n`);
      } else {
        console.log(`❌ Project not found: ${title}`);
      }
    }
    
    console.log('🎯 Case study updates completed successfully!');
    console.log('\nNew features added:');
    console.log('• Problem/Challenge descriptions');
    console.log('• Technical solution details');
    console.log('• Quantified impact metrics');
    console.log('• Project duration and team size');
    console.log('• Professional case study format');
    
  } catch (error) {
    console.error('❌ Error updating case studies:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

updateCaseStudies();