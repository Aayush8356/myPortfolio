import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

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

interface ProjectEditorProps {
  project: Project | null;
  token: string;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, token, onSave, onClose }) => {
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        imageUrl: project.imageUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/projects/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        imageUrl: data.imageUrl
      }));
      setImageFile(null);
      setImagePreview('');
      setError('');
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('ProjectEditor: Starting submit process');
    console.log('ProjectEditor: Form data:', formData);
    console.log('ProjectEditor: Existing project:', project);

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        imageUrl: formData.imageUrl,
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
        featured: formData.featured
      };

      const url = project 
        ? `${API_BASE_URL}/projects/${project._id}`
        : `${API_BASE_URL}/projects`;
      
      const method = project ? 'PUT' : 'POST';

      console.log('ProjectEditor: Making API request to:', url, 'with method:', method);
      console.log('ProjectEditor: Project data being sent:', projectData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });

      console.log('ProjectEditor: API response status:', response.status);

      if (response.ok) {
        const savedProject = await response.json();
        console.log('ProjectEditor: API response successful, saved project:', savedProject);
        console.log('ProjectEditor: Calling onSave callback with:', savedProject);
        onSave(savedProject);
      } else {
        const data = await response.json();
        console.error('ProjectEditor: API error response:', data);
        setError(data.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('ProjectEditor: Network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {project ? 'Edit Project' : 'Add New Project'}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={(e) => {
            console.log('ProjectEditor: Form onSubmit triggered');
            handleSubmit(e);
          }} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Project title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Project description"
              />
            </div>
            
            <div>
              <label htmlFor="technologies" className="block text-sm font-medium mb-2">
                Technologies * (comma-separated)
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Image
              </label>
              
              {/* Current Image Display */}
              {formData.imageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img 
                    src={formData.imageUrl.startsWith('/projects') ? `${API_BASE_URL}${formData.imageUrl}` : formData.imageUrl}
                    alt="Project preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label 
                    htmlFor="imageUpload"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choose Image
                  </label>
                  
                  {imageFile && (
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={imageUploading}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imageUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  )}
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                {/* Manual URL Input */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                    Or enter image URL manually:
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg or /projects/images/..."
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo"
              />
            </div>
            
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-input"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Project
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {project ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectEditor;