
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Save, X } from 'lucide-react';

interface Experience {
  _id: string;
  type: 'education' | 'project' | 'learning' | 'goal';
  title: string;
  organization?: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
  current?: boolean;
}

interface ExperienceEditorProps {
  experience: Experience | null;
  token: string;
  onSave: (experience: Experience) => void;
  onClose: () => void;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, token, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Experience>>(experience || {});

  useEffect(() => {
    setFormData(experience || {});
  }, [experience]);

  const handleSave = async () => {
    const url = experience ? `/api/experience/${experience._id}` : '/api/experience';
    const method = experience ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedExperience = await response.json();
        onSave(savedExperience);
      }
    } catch (error) {
      console.error('Failed to save experience', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {experience ? 'Edit Experience' : 'Add New Experience'}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select type</option>
                <option value="education">Education</option>
                <option value="project">Project</option>
                <option value="learning">Learning</option>
                <option value="goal">Goal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Organization</label>
              <input
                type="text"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <input
                type="text"
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (one item per line)</label>
              <textarea
                value={formData.description?.join('\n') || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.split('\n') })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={formData.technologies?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(', ').map(t => t.trim()) })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.current || false}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium">Current</label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {experience ? 'Update Experience' : 'Create Experience'}
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

export default ExperienceEditor;
