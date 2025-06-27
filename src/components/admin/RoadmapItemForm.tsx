
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppData } from '@/hooks/useAppData';
import { RoadmapItem, Suggestion } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RoadmapItemFormProps {
  roadmapItem?: RoadmapItem;
  suggestions: Suggestion[];
  onSubmit: (data?: Partial<RoadmapItem>) => void;
  onCancel: () => void;
}

export function RoadmapItemForm({
  roadmapItem,
  suggestions,
  onSubmit,
  onCancel,
}: RoadmapItemFormProps) {
  const { createRoadmapItem } = useAppData();
  
  const [formData, setFormData] = useState({
    title: roadmapItem?.title || '',
    description: roadmapItem?.description || '',
    status: roadmapItem?.status || 'planned',
    priority: roadmapItem?.priority || 'medium',
    quarter: roadmapItem?.quarter || '',
    estimatedCompletion: roadmapItem?.estimatedCompletion || '',
    assignedTo: roadmapItem?.assignedTo || '',
    relatedSuggestions: roadmapItem?.relatedSuggestions || []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionToggle = (suggestionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      relatedSuggestions: checked
        ? [...prev.relatedSuggestions, suggestionId]
        : prev.relatedSuggestions.filter(id => id !== suggestionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roadmapItem) {
      // Edit existing item
      onSubmit(formData);
    } else {
      // Create new item
      createRoadmapItem(formData);
      onSubmit();
    }
  };

  const getSelectedSuggestions = () => {
    return suggestions.filter(s => formData.relatedSuggestions.includes(s.id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Phase</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quarter">Quarter/Timetable *</Label>
            <Input
              id="quarter"
              value={formData.quarter}
              onChange={(e) => handleInputChange('quarter', e.target.value)}
              placeholder="e.g., Q1 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
            <Input
              id="estimatedCompletion"
              type="date"
              value={formData.estimatedCompletion}
              onChange={(e) => handleInputChange('estimatedCompletion', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            placeholder="Team or person name"
          />
        </div>

        <div>
          <Label>Related Suggestions</Label>
          <div className="mt-2 space-y-3 max-h-48 overflow-y-auto border rounded-lg p-3">
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-500">No suggestions available</p>
            ) : (
              suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`suggestion-${suggestion.id}`}
                    checked={formData.relatedSuggestions.includes(suggestion.id)}
                    onCheckedChange={(checked) => 
                      handleSuggestionToggle(suggestion.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`suggestion-${suggestion.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {suggestion.title}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {getSelectedSuggestions().length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">
                Selected: {getSelectedSuggestions().length} suggestion(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {getSelectedSuggestions().map((suggestion) => (
                  <Badge key={suggestion.id} variant="secondary" className="text-xs">
                    {suggestion.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {roadmapItem ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}
