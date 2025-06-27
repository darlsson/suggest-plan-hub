
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Target, Clock } from 'lucide-react';
import { RoadmapItem } from '@/types';

interface RoadmapItemDialogProps {
  roadmapItem: RoadmapItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapItemDialog({ roadmapItem, open, onOpenChange }: RoadmapItemDialogProps) {
  if (!roadmapItem) return null;

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

            <Card>
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
