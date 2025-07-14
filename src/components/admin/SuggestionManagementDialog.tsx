
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Suggestion } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/auth';
import { TagManager } from './TagManager';

interface SuggestionManagementDialogProps {
  suggestion: Suggestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuggestionManagementDialog({ 
  suggestion, 
  open, 
  onOpenChange 
}: SuggestionManagementDialogProps) {
  const { updateSuggestion, startVoteSession, endVoteSession } = useAppData();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Reset form when suggestion changes
  useEffect(() => {
    if (suggestion) {
      setStatus(suggestion.status);
      setPriority(suggestion.priority);
      setAdminNotes(suggestion.adminNotes || '');
      setTags(suggestion.tags || []);
    }
  }, [suggestion]);

  if (!suggestion) return null;

  const handleStartVote = () => {
    startVoteSession(suggestion.id);
    toast({
      title: "Vote Started",
      description: "Employees can now vote on this suggestion.",
    });
  };

  const handleEndVote = () => {
    endVoteSession(suggestion.id);
    toast({
      title: "Vote Ended",
      description: "Voting for this suggestion has been closed.",
    });
  };

  const handleSave = () => {
    updateSuggestion(suggestion.id, {
      status: status as any,
      priority: priority as any,
      adminNotes: adminNotes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    toast({
      title: "Suggestion Updated",
      description: "The suggestion has been successfully updated.",
    });

    onOpenChange(false);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{suggestion.title}</DialogTitle>
          <DialogDescription>
            Manage this suggestion and provide feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Suggestion Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {suggestion.description}
              </p>
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>Author: {suggestion.authorName}</span>
              <span>Created: {formatDate(suggestion.createdAt)}</span>
              <span>Votes: {suggestion.votes}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={statusColors[suggestion.status]}>
                {suggestion.status.replace('-', ' ')}
              </Badge>
              <Badge className={priorityColors[suggestion.priority]}>
                {suggestion.priority} priority
              </Badge>
              <Badge variant="outline">
                {suggestion.category}
              </Badge>
            </div>

            {/* Display existing tags */}
            {suggestion.tags && suggestion.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Current Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {/* Display voting results if vote session exists */}
            {suggestion.voteSession && (
              <div>
                <h4 className="font-semibold mb-2">Voting Results</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    <Badge variant={suggestion.voteSession.isActive ? "default" : "secondary"}>
                      {suggestion.voteSession.isActive ? "Active" : "Ended"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Votes:</span>
                    <span className="font-medium">{suggestion.voteSession.votes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thumbs Up:</span>
                    <span className="font-medium text-green-600">
                      {suggestion.voteSession.votes.filter(v => v.voteType === 'up').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thumbs Down:</span>
                    <span className="font-medium text-red-600">
                      {suggestion.voteSession.votes.filter(v => v.voteType === 'down').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Management Form */}
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add feedback, reasoning, or next steps..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <TagManager
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="Add tags for analytics..."
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {!suggestion.voteSession?.isActive ? (
              <Button variant="outline" onClick={handleStartVote}>
                Start Vote
              </Button>
            ) : (
              <Button variant="outline" onClick={handleEndVote}>
                End Vote
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
