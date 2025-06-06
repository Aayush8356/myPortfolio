import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Edit, Trash2, Eye, LogOut, Mail, Settings } from 'lucide-react';
import ProjectEditor from './ProjectEditor';

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

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectEditor, setShowProjectEditor] = useState(false);

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/projects');
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
      const response = await fetch('http://localhost:5002/api/contact', {
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

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`http://localhost:5002/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const markContactAsRead = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5002/api/contact/${id}/read`, {
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
      const response = await fetch(`http://localhost:5002/api/contact/${id}`, {
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