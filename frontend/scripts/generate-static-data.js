#!/usr/bin/env node

/**
 * Static Data Generation Script
 * Fetches data from backend API and generates static JSON files
 * Runs during build process to eliminate runtime API calls
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://meetaayush.com/api';
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const FALLBACK_DIR = path.join(__dirname, '../src/data');

// Ensure output directories exist
[OUTPUT_DIR, FALLBACK_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Utility function to fetch data with timeout
function fetchData(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const request = client.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Invalid JSON response from ${url}: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    });
    
    request.on('error', (error) => {
      reject(new Error(`Network error fetching ${url}: ${error.message}`));
    });
    
    request.setTimeout(timeout, () => {
      request.abort();
      reject(new Error(`Timeout fetching ${url} after ${timeout}ms`));
    });
  });
}

// Data generators
async function generateProjectsData() {
  console.log('📂 Generating projects data...');
  try {
    const projects = await fetchData(`${API_BASE_URL}/projects`);
    
    // Validate projects data
    if (!Array.isArray(projects)) {
      throw new Error('Projects data is not an array');
    }
    
    // Add metadata
    const projectsData = {
      data: projects,
      count: projects.length,
      featured: projects.filter(p => p.featured),
      lastUpdated: new Date().toISOString(),
      source: 'database'
    };
    
    // Write to public directory
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'projects.json'),
      JSON.stringify(projectsData, null, 2)
    );
    
    // Write to src as fallback
    fs.writeFileSync(
      path.join(FALLBACK_DIR, 'projects.json'),
      JSON.stringify(projectsData, null, 2)
    );
    
    console.log(`✅ Generated projects data: ${projects.length} projects`);
    return projectsData;
  } catch (error) {
    console.error('❌ Failed to generate projects data:', error.message);
    return null;
  }
}

async function generateContactData() {
  console.log('📧 Generating contact data...');
  try {
    const contactDetails = await fetchData(`${API_BASE_URL}/contact-details`);
    
    // Validate contact data
    if (!contactDetails || typeof contactDetails !== 'object') {
      throw new Error('Contact details data is invalid');
    }
    
    // Add metadata
    const contactData = {
      data: contactDetails,
      lastUpdated: new Date().toISOString(),
      source: 'database'
    };
    
    // Write to public directory
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'contact-details.json'),
      JSON.stringify(contactData, null, 2)
    );
    
    // Write to src as fallback
    fs.writeFileSync(
      path.join(FALLBACK_DIR, 'contact-details.json'),
      JSON.stringify(contactData, null, 2)
    );
    
    console.log('✅ Generated contact details data');
    return contactData;
  } catch (error) {
    console.error('❌ Failed to generate contact data:', error.message);
    return null;
  }
}

async function generateResumeData() {
  console.log('📄 Generating resume data...');
  try {
    const resumeStatus = await fetchData(`${API_BASE_URL}/resume/current`);
    
    // Add metadata
    const resumeData = {
      data: resumeStatus,
      lastUpdated: new Date().toISOString(),
      source: 'database'
    };
    
    // Write to public directory
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'resume-status.json'),
      JSON.stringify(resumeData, null, 2)
    );
    
    // Write to src as fallback
    fs.writeFileSync(
      path.join(FALLBACK_DIR, 'resume-status.json'),
      JSON.stringify(resumeData, null, 2)
    );
    
    console.log('✅ Generated resume status data');
    return resumeData;
  } catch (error) {
    console.error('❌ Failed to generate resume data:', error.message);
    return null;
  }
}

async function generateExperienceData() {
  console.log('🧠 Generating experience data...');
  try {
    const experiences = await fetchData(`${API_BASE_URL}/experience`);
    if (!Array.isArray(experiences)) {
      throw new Error('Experience data is not an array');
    }
    const experienceData = {
      data: experiences,
      lastUpdated: new Date().toISOString(),
      source: 'database'
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'experience.json'),
      JSON.stringify(experienceData, null, 2)
    );
    fs.writeFileSync(
      path.join(FALLBACK_DIR, 'experience.json'),
      JSON.stringify(experienceData, null, 2)
    );
    console.log(`✅ Generated experience data: ${experiences.length} items`);
    return experienceData;
  } catch (error) {
    console.error('❌ Failed to generate experience data:', error.message);
    return null;
  }
}

async function generateEducationData() {
  console.log('🎓 Generating education data...');
  try {
    const educations = await fetchData(`${API_BASE_URL}/education`);
    if (!Array.isArray(educations)) {
      throw new Error('Education data is not an array');
    }
    const educationData = {
      data: educations,
      lastUpdated: new Date().toISOString(),
      source: 'database'
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'education.json'),
      JSON.stringify(educationData, null, 2)
    );
    fs.writeFileSync(
      path.join(FALLBACK_DIR, 'education.json'),
      JSON.stringify(educationData, null, 2)
    );
    console.log(`✅ Generated education data: ${educations.length} items`);
    return educationData;
  } catch (error) {
    console.error('❌ Failed to generate education data:', error.message);
    return null;
  }
}

async function generateBuildMetadata(projectsData, contactData, resumeData, experienceData, educationData) {
  console.log('🏗️ Generating build metadata...');
  
  const metadata = {
    buildTime: new Date().toISOString(),
    buildId: Date.now().toString(),
    version: '1.0.0',
    dataStatus: {
      projects: projectsData ? 'success' : 'failed',
      contact: contactData ? 'success' : 'failed',
      resume: resumeData ? 'success' : 'failed',
      experience: experienceData ? 'success' : 'failed',
      education: educationData ? 'success' : 'failed'
    },
    counts: {
      projects: projectsData ? projectsData.data.length : 0,
      featuredProjects: projectsData ? projectsData.featured.length : 0
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      apiBaseUrl: API_BASE_URL
    }
  };
  
  // Write to public directory
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'build-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  // Write to src as fallback
  fs.writeFileSync(
    path.join(FALLBACK_DIR, 'build-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('✅ Generated build metadata');
  return metadata;
}

// Main execution
async function main() {
  console.log('🚀 Starting static data generation...');
  console.log(`📍 API Base URL: ${API_BASE_URL}`);
  console.log(`📁 Output Directory: ${OUTPUT_DIR}`);
  console.log('');
  
  const startTime = Date.now();
  
  try {
    const [projectsData, contactData, resumeData, experienceData, educationData] = await Promise.all([
      generateProjectsData(),
      generateContactData(),
      generateResumeData(),
      generateExperienceData(),
      generateEducationData()
    ]);
    
    // Generate build metadata
    const metadata = await generateBuildMetadata(projectsData, contactData, resumeData, experienceData, educationData);
    
    const duration = Date.now() - startTime;
    
    console.log('');
    console.log('✅ Static data generation completed!');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📊 Status: ${metadata.dataStatus.projects}/${metadata.dataStatus.contact}/${metadata.dataStatus.resume}/${metadata.dataStatus.experience}/${metadata.dataStatus.education}`);
    
    if (projectsData && contactData && resumeData && experienceData && educationData) {
      console.log('🎉 All data generated successfully!');
      process.exit(0);
    } else {
      console.log('⚠️  Some data generation failed, but build can continue with fallbacks');
      process.exit(0); // Don't fail build, use fallbacks
    }
    
  } catch (error) {
    console.error('💥 Static data generation failed:', error.message);
    console.log('📋 Build will continue with fallback data');
    process.exit(0); // Don't fail build, use fallbacks
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, generateProjectsData, generateContactData, generateResumeData, generateExperienceData, generateEducationData };