import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import PasswordInput from '../ui/password-input';
import { Plus, Edit, Trash2, Eye, LogOut, Mail, Settings, User, Upload, Download, FileText, Home, Info, Key, Gamepad2 } from 'lucide-react';
import ProjectEditor from './ProjectEditor';
import { API_BASE_URL, BLOB_BASE_URL } from '../../config/api';
import { useToast, ToastContainer } from '../ui/toast';
import { clearProjectsCache, updateProjectsCache, invalidateCache } from '../../lib/cache';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ContactDetails {
  _id?: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resume?: string;
}

interface HeroContent {
  _id?: string;
  greeting: string;
  name: string;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  resumeButtonText: string;
}

interface AboutContent {
  _id?: string;
  backgroundTitle: string;
  backgroundContent: string;
  experienceTitle: string;
  experienceContent: string;
  skills: string[];
  resumeDescription: string;
}

interface FunCentreSettings {
  _id?: string;
  enabled: boolean;
  title: string;
  description: string;
  games: {
    ticTacToe: {
      enabled: boolean;
      title: string;
      description: string;
    };
    memoryGame: {
      enabled: boolean;
      title: string;
      description: string;
    };
  };
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ token, onLogout }) => {
  const { toasts, toast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    twitter: '',
    resume: ''
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectEditor, setShowProjectEditor] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState<{hasResume: boolean, resumeUrl: string | null}>({
    hasResume: false,
    resumeUrl: null
  });
  const [heroContent, setHeroContent] = useState<HeroContent>({
    greeting: "Hi, I'm",
    name: 'AAYUSH GUPTA',
    title: 'FULL STACK DEVELOPER',
    description: "Creating modern web applications with cutting-edge technologies. Passionate about clean code, user experience, and innovative solutions.",
    primaryButtonText: 'View My Work',
    secondaryButtonText: 'Get In Touch',
    resumeButtonText: 'Resume'
  });
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    backgroundTitle: 'BACKGROUND',
    backgroundContent: "I'm Aayush Gupta, a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable applications that provide excellent user experiences. My journey in tech started with curiosity and has evolved into a commitment to continuous learning and building innovative solutions.",
    experienceTitle: 'EXPERIENCE',
    experienceContent: "With experience in both frontend and backend development, I specialize in the MERN stack and modern frameworks. I enjoy working on challenging projects that push the boundaries of what's possible on the web.",
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Next.js', 'Python', 'AWS', 'Docker', 'Git'],
    resumeDescription: "Download or preview my complete resume to learn more about my experience and qualifications."
  });
  const [newSkill, setNewSkill] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    username: '',
    email: '',
    isAdmin: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [credentialsData, setCredentialsData] = useState({
    username: '',
    email: '',
    currentPassword: ''
  });
  const [funCentreSettings, setFunCentreSettings] = useState<FunCentreSettings>({
    enabled: true,
    title: "Fun Centre",
    description: "Take a break and enjoy some interactive games while exploring my portfolio!",
    games: {
      ticTacToe: {
        enabled: true,
        title: "Tic Tac Toe",
        description: "Classic Tic Tac Toe game. Challenge yourself!"
      },
      memoryGame: {
        enabled: true,
        title: "Memory Game",
        description: "Test your memory with this card matching game."
      }
    }
  });

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'contact-details') {
      fetchContactDetails();
      fetchCurrentResume();
    } else if (activeTab === 'hero') {
      fetchHeroContent();
    } else if (activeTab === 'about') {
      fetchAboutContent();
    } else if (activeTab === 'account') {
      fetchUserInfo();
    } else if (activeTab === 'fun-centre') {
      fetchFunCentreSettings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchContactDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact-details`);
      if (response.ok) {
        const data = await response.json();
        setContactDetails(data);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const updateContactDetails = async () => {
    try {
      // Exclude resume field from contact details update to prevent overwriting blob URLs
      const { resume, ...contactDetailsWithoutResume } = contactDetails;
      
      const response = await fetch(`${API_BASE_URL}/contact-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactDetailsWithoutResume)
      });

      if (response.ok) {
        const data = await response.json();
        setContactDetails(data);
        toast.success('Contact details updated successfully!', 'Your information has been saved.');
      } else {
        toast.error('Failed to update contact details', 'Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact details:', error);
      toast.error('Error updating contact details', 'Please check your connection and try again.');
    }
  };

  const fetchCurrentResume = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/current`);
      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data);
      }
    } catch (error) {
      console.error('Error fetching current resume:', error);
    }
  };

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`);
      if (response.ok) {
        const data = await response.json();
        setHeroContent(data);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/about`);
      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.warning('No file selected', 'Please select a PDF file first.');
      return;
    }

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Resume uploaded successfully!', 'Your resume is now available for download.');
        setResumeFile(null);
        setCurrentResume({ hasResume: true, resumeUrl: data.resumeUrl });
        fetchContactDetails(); // Refresh contact details
      } else {
        const error = await response.json();
        toast.error('Upload failed', error.message || 'Failed to upload resume. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Upload error', 'Please check your connection and try again.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/resume`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Resume deleted successfully', 'Your resume has been removed.');
        setCurrentResume({ hasResume: false, resumeUrl: null });
        fetchContactDetails(); // Refresh contact details
      } else {
        toast.error('Failed to delete resume', 'Please try again.');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Delete error', 'Please check your connection and try again.');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedProjects = projects.filter(p => p._id !== id);
        setProjects(updatedProjects);
        // Update cache with the new data instead of clearing it
        updateProjectsCache(updatedProjects);
        toast.success('Project deleted successfully', 'The project has been removed from your portfolio.');
      } else {
        toast.error('Failed to delete project', 'Please try again.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Delete error', 'Please check your connection and try again.');
    }
  };

  const markContactAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(contacts.map(c => 
          c._id === id ? { ...c, read: true } : c
        ));
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c._id !== id));
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  const handleProjectSave = (project: Project) => {
    console.log('AdminPanel: handleProjectSave called with project:', project);
    console.log('AdminPanel: Current editingProject:', editingProject);
    console.log('AdminPanel: Current projects array:', projects);
    
    let updatedProjects;
    if (editingProject) {
      console.log('AdminPanel: Updating existing project');
      updatedProjects = projects.map(p => p._id === project._id ? project : p);
    } else {
      console.log('AdminPanel: Adding new project');
      updatedProjects = [project, ...projects];
    }
    
    console.log('AdminPanel: Updated projects array:', updatedProjects);
    setProjects(updatedProjects);
    
    // Update cache with fresh data instead of clearing
    console.log('AdminPanel: Updating projects cache');
    updateProjectsCache(updatedProjects);
    
    // Also dispatch a custom event with the updated data
    console.log('AdminPanel: Dispatching forceProjectRefresh event');
    window.dispatchEvent(new CustomEvent('forceProjectRefresh', { 
      detail: { projects: updatedProjects }
    }));
    
    console.log('AdminPanel: Closing project editor');
    setShowProjectEditor(false);
    setEditingProject(null);
  };

  const updateHeroContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroContent)
      });

      if (response.ok) {
        const data = await response.json();
        setHeroContent(data);
        toast.success('Hero section updated successfully!', 'Your changes have been saved.');
      } else {
        toast.error('Failed to update hero section', 'Please try again.');
      }
    } catch (error) {
      console.error('Error updating hero content:', error);
      toast.error('Error updating hero section', 'Please check your connection and try again.');
    }
  };

  const updateAboutContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(aboutContent)
      });

      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
        toast.success('About section updated successfully!', 'Your changes have been saved.');
      } else {
        toast.error('Failed to update about section', 'Please try again.');
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      toast.error('Error updating about section', 'Please check your connection and try again.');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !aboutContent.skills.includes(newSkill.trim())) {
      setAboutContent({
        ...aboutContent,
        skills: [...aboutContent.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setAboutContent({
      ...aboutContent,
      skills: aboutContent.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setCredentialsData({
          username: data.user.username,
          email: data.user.email,
          currentPassword: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password mismatch', 'New password and confirm password do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Invalid password', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully!', 'Your password has been updated.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        toast.error('Failed to change password', error.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password', 'Please check your connection and try again.');
    }
  };

  const updateCredentials = async () => {
    if (!credentialsData.currentPassword) {
      toast.error('Current password required', 'Please enter your current password to update credentials.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credentialsData)
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setCredentialsData({
          username: data.user.username,
          email: data.user.email,
          currentPassword: ''
        });
        toast.success('Credentials updated successfully!', 'Your information has been saved.');
      } else {
        const error = await response.json();
        toast.error('Failed to update credentials', error.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      toast.error('Error updating credentials', 'Please check your connection and try again.');
    }
  };

  const fetchFunCentreSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fun-centre`);
      if (response.ok) {
        const data = await response.json();
        setFunCentreSettings(data);
      }
    } catch (error) {
      console.error('Error fetching fun centre settings:', error);
    }
  };

  const updateFunCentreSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fun-centre`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(funCentreSettings)
      });

      if (response.ok) {
        const data = await response.json();
        setFunCentreSettings(data);
        toast.success('Fun Centre updated successfully!', 'Your changes have been saved.');
      } else {
        toast.error('Failed to update Fun Centre', 'Please try again.');
      }
    } catch (error) {
      console.error('Error updating fun centre settings:', error);
      toast.error('Error updating Fun Centre', 'Please check your connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="flex space-x-1 mb-6 border-b overflow-x-auto">
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'hero' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('hero')}
          >
            <Home className="w-4 h-4 inline mr-2" />
            Hero Section
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'about' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('about')}
          >
            <Info className="w-4 h-4 inline mr-2" />
            About Section
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'projects' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Projects
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contacts' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Contacts ({contacts.filter(c => !c.read).length})
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contact-details' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('contact-details')}
          >
            <User className="w-4 h-4 inline mr-2" />
            My Details
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'fun-centre' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('fun-centre')}
          >
            <Gamepad2 className="w-4 h-4 inline mr-2" />
            Fun Centre
          </button>
          <button
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'account' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('account')}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Account
          </button>
        </div>

        {activeTab === 'hero' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Edit Hero Section</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Greeting</label>
                  <input
                    type="text"
                    value={heroContent.greeting}
                    onChange={(e) => setHeroContent({ ...heroContent, greeting: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="Hi, I'm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={heroContent.name}
                    onChange={(e) => setHeroContent({ ...heroContent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="AAYUSH GUPTA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="FULL STACK DEVELOPER"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={heroContent.description}
                    onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    rows={4}
                    placeholder="Creating modern web applications..."
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Button Text</label>
                    <input
                      type="text"
                      value={heroContent.primaryButtonText}
                      onChange={(e) => setHeroContent({ ...heroContent, primaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="View My Work"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
                    <input
                      type="text"
                      value={heroContent.secondaryButtonText}
                      onChange={(e) => setHeroContent({ ...heroContent, secondaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Get In Touch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Resume Button Text</label>
                    <input
                      type="text"
                      value={heroContent.resumeButtonText}
                      onChange={(e) => setHeroContent({ ...heroContent, resumeButtonText: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Resume"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={updateHeroContent} className="w-full md:w-auto">
                    Update Hero Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Edit About Section</h2>
            
            <div className="space-y-6">
              {/* Background Section */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Background Section</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Title</label>
                    <input
                      type="text"
                      value={aboutContent.backgroundTitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, backgroundTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="BACKGROUND"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Content</label>
                    <textarea
                      value={aboutContent.backgroundContent}
                      onChange={(e) => setAboutContent({ ...aboutContent, backgroundContent: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={4}
                      placeholder="Tell your story..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Experience Section</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Title</label>
                    <input
                      type="text"
                      value={aboutContent.experienceTitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, experienceTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="EXPERIENCE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Content</label>
                    <textarea
                      value={aboutContent.experienceContent}
                      onChange={(e) => setAboutContent({ ...aboutContent, experienceContent: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={4}
                      placeholder="Describe your experience..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aboutContent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Add new skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Section */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Resume Section</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Resume Description</label>
                    <textarea
                      value={aboutContent.resumeDescription}
                      onChange={(e) => setAboutContent({ ...aboutContent, resumeDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={2}
                      placeholder="Describe the resume section..."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4">
                <Button onClick={updateAboutContent} className="w-full md:w-auto">
                  Update About Section
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Projects</h2>
              <Button onClick={() => {
                setEditingProject(null);
                setShowProjectEditor(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          {project.featured && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProject(project);
                            setShowProjectEditor(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProject(project._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Messages</h2>
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <Card key={contact._id} className={contact.read ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{contact.name}</h3>
                          <span className="text-sm text-muted-foreground">{contact.email}</span>
                          {!contact.read && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{contact.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!contact.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markContactAsRead(contact._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteContact(contact._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {contacts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No contact messages yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact-details' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Contact Details</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={contactDetails.phone}
                      onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={contactDetails.location}
                    onChange={(e) => setContactDetails({ ...contactDetails, location: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={contactDetails.linkedin}
                      onChange={(e) => setContactDetails({ ...contactDetails, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input
                      type="url"
                      value={contactDetails.github}
                      onChange={(e) => setContactDetails({ ...contactDetails, github: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Twitter</label>
                  <input
                    type="url"
                    value={contactDetails.twitter}
                    onChange={(e) => setContactDetails({ ...contactDetails, twitter: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={updateContactDetails} className="w-full md:w-auto">
                    Update Contact Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload Section */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Resume Management
                </h3>
                
                {currentResume.hasResume ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 dark:text-green-400">Resume is uploaded and active</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`${BLOB_BASE_URL}/resume`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`${BLOB_BASE_URL}/resume/download`, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResumeDelete}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No resume uploaded yet</p>
                  </div>
                )}

                {/* Upload New Resume */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Upload New Resume</h4>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleResumeUpload}
                      disabled={!resumeFile || resumeUploading}
                      className="whitespace-nowrap"
                    >
                      {resumeUploading ? (
                        'Uploading...'
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload PDF
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only PDF files are allowed. Maximum file size: 5MB.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'fun-centre' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Fun Centre Management</h2>
            
            <div className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">General Settings</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="funCentreEnabled"
                      checked={funCentreSettings.enabled}
                      onChange={(e) => setFunCentreSettings({ ...funCentreSettings, enabled: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="funCentreEnabled" className="text-sm font-medium">
                      Enable Fun Centre Section
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Title</label>
                    <input
                      type="text"
                      value={funCentreSettings.title}
                      onChange={(e) => setFunCentreSettings({ ...funCentreSettings, title: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Fun Centre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Description</label>
                    <textarea
                      value={funCentreSettings.description}
                      onChange={(e) => setFunCentreSettings({ ...funCentreSettings, description: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={3}
                      placeholder="Take a break and enjoy some interactive games..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tic Tac Toe Game */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Tic Tac Toe Game</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ticTacToeEnabled"
                      checked={funCentreSettings.games.ticTacToe.enabled}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          ticTacToe: { ...funCentreSettings.games.ticTacToe, enabled: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    <label htmlFor="ticTacToeEnabled" className="text-sm font-medium">
                      Enable Tic Tac Toe Game
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Title</label>
                    <input
                      type="text"
                      value={funCentreSettings.games.ticTacToe.title}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          ticTacToe: { ...funCentreSettings.games.ticTacToe, title: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Tic Tac Toe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Description</label>
                    <textarea
                      value={funCentreSettings.games.ticTacToe.description}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          ticTacToe: { ...funCentreSettings.games.ticTacToe, description: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={2}
                      placeholder="Classic Tic Tac Toe game..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Memory Game */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Memory Game</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="memoryGameEnabled"
                      checked={funCentreSettings.games.memoryGame.enabled}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          memoryGame: { ...funCentreSettings.games.memoryGame, enabled: e.target.checked }
                        }
                      })}
                      className="rounded"
                    />
                    <label htmlFor="memoryGameEnabled" className="text-sm font-medium">
                      Enable Memory Game
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Title</label>
                    <input
                      type="text"
                      value={funCentreSettings.games.memoryGame.title}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          memoryGame: { ...funCentreSettings.games.memoryGame, title: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Memory Game"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Description</label>
                    <textarea
                      value={funCentreSettings.games.memoryGame.description}
                      onChange={(e) => setFunCentreSettings({
                        ...funCentreSettings,
                        games: {
                          ...funCentreSettings.games,
                          memoryGame: { ...funCentreSettings.games.memoryGame, description: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      rows={2}
                      placeholder="Test your memory with this card matching game..."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4">
                <Button onClick={updateFunCentreSettings} className="w-full md:w-auto">
                  Update Fun Centre Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              {/* User Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    User Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">User ID</label>
                        <p className="text-sm font-mono bg-muted px-3 py-2 rounded">{userInfo.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                        <p className="text-sm px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${userInfo.isAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}>
                            {userInfo.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Update Credentials */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Update Credentials
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          value={credentialsData.username}
                          onChange={(e) => setCredentialsData({ ...credentialsData, username: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={credentialsData.email}
                          onChange={(e) => setCredentialsData({ ...credentialsData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password *</label>
                      <PasswordInput
                        value={credentialsData.currentPassword}
                        onChange={(e) => setCredentialsData({ ...credentialsData, currentPassword: e.target.value })}
                        placeholder="Enter current password to verify changes"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <Button onClick={updateCredentials} className="w-full md:w-auto">
                      Update Credentials
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <PasswordInput
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <PasswordInput
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password (min 6 chars)"
                          autoComplete="new-password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <PasswordInput
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <Button onClick={changePassword} className="w-full md:w-auto">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showProjectEditor && (
        <ProjectEditor
          project={editingProject}
          token={token}
          onSave={handleProjectSave}
          onClose={() => {
            setShowProjectEditor(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;