
import { Suggestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdminRoutes } from '@/utils/auth';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onEdit?: (suggestion: Suggestion) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

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

const categoryColors = {
  feature: 'bg-blue-100 text-blue-800',
  improvement: 'bg-green-100 text-green-800',
  bug: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
};

export function SuggestionCard({ suggestion, onEdit, onDelete, showActions = false }: SuggestionCardProps) {
  const { auth } = useAuth();
  const isAdmin = canAccessAdminRoutes(auth.user);
  const isAuthor = auth.user?.id === suggestion.authorId;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={statusColors[suggestion.status]}>
              {suggestion.status.replace('-', ' ')}
            </Badge>
            <Badge className={priorityColors[suggestion.priority]}>
              {suggestion.priority}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge className={categoryColors[suggestion.category]}>
            {suggestion.category}
          </Badge>
          <span>by {suggestion.authorName}</span>
          <span>•</span>
          <span>{formatDate(suggestion.createdAt)}</span>
          <span>•</span>
          <span>{suggestion.votes} votes</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{suggestion.description}</p>
        
        {suggestion.adminNotes && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-900 mb-1">Admin Notes:</h4>
            <p className="text-blue-800 text-sm">{suggestion.adminNotes}</p>
          </div>
        )}

        {showActions && (isAdmin || isAuthor) && (
          <div className="flex gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(suggestion)}>
                Edit
              </Button>
            )}
            {onDelete && (isAdmin || isAuthor) && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(suggestion.id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
