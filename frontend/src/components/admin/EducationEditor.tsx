
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X } from 'lucide-react';

interface Education {
  _id: string;
  type: 'degree' | 'certification' | 'course';
  title: string;
  institution: string;
  location?: string;
  period: string;
  description: string[];
  grade?: string;
  status: 'completed' | 'in-progress';
  highlights?: string[];
}

interface EducationEditorProps {
  education: Education | null;
  token: string;
  onSave: (education: Education) => void;
  onClose: () => void;
}

const EducationEditor: React.FC<EducationEditorProps> = ({ education, token, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Education>>(education || {});

  useEffect(() => {
    setFormData(education || {});
  }, [education]);

  const handleSave = async () => {
    const url = education ? `/api/education/${education._id}` : '/api/education';
    const method = education ? 'PUT' : 'POST';

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
        const savedEducation = await response.json();
        onSave(savedEducation);
      }
    } catch (error) {
      console.error('Failed to save education', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{education ? 'Edit' : 'Add'} Education</h2>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select type</option>
                <option value="degree">Degree</option>
                <option value="certification">Certification</option>
                <option value="course">Course</option>
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
              <label className="block text-sm font-medium mb-2">Institution</label>
              <input
                type="text"
                value={formData.institution || ''}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
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
              <label className="block text-sm font-medium mb-2">Grade</label>
              <input
                type="text"
                value={formData.grade || ''}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Highlights (comma-separated)</label>
              <input
                type="text"
                value={formData.highlights?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split(', ').map(t => t.trim()) })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationEditor;
