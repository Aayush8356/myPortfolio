import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Edit, Trash2, Eye, LogOut, Mail, Settings, User, Upload, Download, FileText } from 'lucide-react';
import ProjectEditor from './ProjectEditor';
import { API_BASE_URL } from '../../config/api';
import { useToast, ToastContainer } from '../ui/toast';

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

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'contact-details') {
      fetchContactDetails();
      fetchCurrentResume();
    }
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
      const response = await fetch(`${API_BASE_URL}/contact-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactDetails)
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
        setProjects(projects.filter(p => p._id !== id));
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
    if (editingProject) {
      setProjects(projects.map(p => p._id === project._id ? project : p));
    } else {
      setProjects([project, ...projects]);
    }
    setShowProjectEditor(false);
    setEditingProject(null);
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

        <div className="flex space-x-1 mb-6 border-b">
          <button
            className={`px-4 py-2 border-b-2 transition-colors ${
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
            className={`px-4 py-2 border-b-2 transition-colors ${
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
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'contact-details' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('contact-details')}
          >
            <User className="w-4 h-4 inline mr-2" />
            My Details
          </button>
        </div>

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

                <div className="grid md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Resume URL</label>
                    <input
                      type="url"
                      value={contactDetails.resume}
                      onChange={(e) => setContactDetails({ ...contactDetails, resume: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="/resume.pdf or external link"
                    />
                  </div>
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
                          onClick={() => window.open('/uploads/resume.pdf', '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`${API_BASE_URL}/resume/download`, '_blank')}
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