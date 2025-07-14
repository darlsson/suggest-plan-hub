import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { Suggestion } from '@/types';
import { useAppData } from '@/hooks/useAppData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/auth';

interface VotingCardProps {
  suggestion: Suggestion;
}

export function VotingCard({ suggestion }: VotingCardProps) {
  const { submitVote } = useAppData();
  const { auth } = useAuth();
  const { toast } = useToast();

  if (!suggestion.voteSession?.isActive) return null;

  const userVote = suggestion.voteSession.votes.find(
    vote => vote.userId === auth.user?.id
  );

  const upVotes = suggestion.voteSession.votes.filter(v => v.voteType === 'up').length;
  const downVotes = suggestion.voteSession.votes.filter(v => v.voteType === 'down').length;
  const totalVotes = suggestion.voteSession.votes.length;

  const handleVote = (voteType: 'up' | 'down') => {
    submitVote(suggestion.id, voteType);
    toast({
      title: "Vote Submitted",
      description: `You voted ${voteType === 'up' ? 'thumbs up' : 'thumbs down'} on "${suggestion.title}".`,
    });
  };

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

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{suggestion.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {suggestion.description}
            </CardDescription>
          </div>
          <Badge className={getCategoryColor(suggestion.category)}>
            {suggestion.category}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Started {formatDate(suggestion.voteSession.startedAt)}
          </span>
          <span>by {suggestion.authorName}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Vote Results */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-green-600">
              <ThumbsUp className="h-3 w-3" />
              {upVotes}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <ThumbsDown className="h-3 w-3" />
              {downVotes}
            </span>
          </div>
          <span className="text-muted-foreground">
            {totalVotes} total votes
          </span>
        </div>

        {/* Voting Buttons */}
        <div className="flex gap-3">
          <Button
            variant={userVote?.voteType === 'up' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => handleVote('up')}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {userVote?.voteType === 'up' ? 'Voted Up' : 'Thumbs Up'}
          </Button>
          <Button
            variant={userVote?.voteType === 'down' ? 'destructive' : 'outline'}
            className="flex-1"
            onClick={() => handleVote('down')}
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            {userVote?.voteType === 'down' ? 'Voted Down' : 'Thumbs Down'}
          </Button>
        </div>

        {userVote && (
          <div className="text-center text-sm text-muted-foreground">
            You can change your vote anytime while voting is active
          </div>
        )}
      </CardContent>
    </Card>
  );
}