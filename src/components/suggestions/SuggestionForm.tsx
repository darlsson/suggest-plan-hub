
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';

interface SuggestionFormProps {
  onSuccess?: () => void;
}

export function SuggestionForm({ onSuccess }: SuggestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'feature' | 'improvement' | 'bug' | 'other'>('feature');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createSuggestion } = useAppData();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      createSuggestion({
        title: title.trim(),
        description: description.trim(),
        category,
        status: 'pending',
        priority: 'medium',
      });

      toast({
        title: "Success",
        description: "Your suggestion has been submitted successfully!",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('feature');
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter suggestion title"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="improvement">Improvement</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your suggestion in detail"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
      </Button>
    </form>
  );
}
