
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Calendar, User, Target, Clock, MessageSquare } from 'lucide-react';
import { RoadmapItem } from '@/types';
import { useAppData } from '@/hooks/useAppData';

interface RoadmapItemDialogProps {
  roadmapItem: RoadmapItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapItemDialog({ roadmapItem, open, onOpenChange }: RoadmapItemDialogProps) {
  const { suggestions } = useAppData();
  
  if (!roadmapItem) return null;

  // Get the actual suggestion objects from the IDs
  const relatedSuggestions = suggestions.filter(suggestion => 
    roadmapItem.relatedSuggestions.includes(suggestion.id)
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'improvement':
        return 'bg-green-100 text-green-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'roadmap':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {roadmapItem.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex gap-3">
            <Badge className={getStatusColor(roadmapItem.status)}>
              {roadmapItem.status}
            </Badge>
            <Badge className={getPriorityColor(roadmapItem.priority)}>
              {roadmapItem.priority} priority
            </Badge>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{roadmapItem.description}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quarter</p>
                    <p className="text-sm text-gray-600">{roadmapItem.quarter}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {roadmapItem.estimatedCompletion && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Estimated Completion</p>
                      <p className="text-sm text-gray-600">
                        {new Date(roadmapItem.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {roadmapItem.assignedTo && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Assigned To</p>
                      <p className="text-sm text-gray-600">{roadmapItem.assignedTo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Related Suggestions</p>
                        <p className="text-sm text-gray-600">
                          {roadmapItem.relatedSuggestions.length} linked
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 z-50 bg-background">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <h4 className="text-sm font-semibold">Related Suggestions</h4>
                  </div>
                  {relatedSuggestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No suggestions linked</p>
                  ) : (
                    <div className="space-y-3">
                      {relatedSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <h5 className="text-sm font-medium line-clamp-1">{suggestion.title}</h5>
                            <Badge className={getCategoryColor(suggestion.category)} variant="outline">
                              {suggestion.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>by {suggestion.authorName}</span>
                            <span>{suggestion.votes} votes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Created Date */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">
                Created on {new Date(roadmapItem.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
