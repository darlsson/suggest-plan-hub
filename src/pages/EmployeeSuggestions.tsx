import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppData } from '@/hooks/useAppData';
import { useAuth } from '@/hooks/useAuth';
import { SuggestionCard } from '@/components/suggestions/SuggestionCard';
import { SuggestionForm } from '@/components/suggestions/SuggestionForm';
import { Plus, FileText, Archive } from 'lucide-react';

export default function EmployeeSuggestions() {
  const { auth } = useAuth();
  const { suggestions } = useAppData();
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const userSuggestions = suggestions.filter(s => s.authorId === auth.user?.id);
  
  // Filter suggestions based on current view
  const activeSuggestions = userSuggestions.filter(s => s.status !== 'completed' && s.status !== 'rejected');
  const archivedSuggestions = userSuggestions.filter(s => s.status === 'completed' || s.status === 'rejected');
  const displayedSuggestions = showArchived ? archivedSuggestions : activeSuggestions;

  const stats = [
    {
      title: 'Total Suggestions',
      value: userSuggestions.length,
      description: 'All suggestions you\'ve submitted',
      color: 'text-blue-600',
    },
    {
      title: 'Pending Review',
      value: userSuggestions.filter(s => s.status === 'pending').length,
      description: 'Awaiting admin review',
      color: 'text-yellow-600',
    },
    {
      title: 'Approved',
      value: userSuggestions.filter(s => s.status === 'approved').length,
      description: 'Approved for development',
      color: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: userSuggestions.filter(s => s.status === 'in-progress').length,
      description: 'Currently being worked on',
      color: 'text-orange-600',
    },
  ];

  return (
    <Layout title="My Suggestions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {showArchived ? 'My Archived Suggestions' : 'My Suggestions'}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {showArchived 
                ? `View completed and rejected suggestions (${archivedSuggestions.length})`
                : 'Submit new suggestions and track your existing ones'
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowArchived(!showArchived)}
              className="min-h-[44px]"
            >
              <Archive className="mr-2 h-4 w-4" />
              {showArchived ? 'View Active' : 'View Archived'}
            </Button>
            {!showArchived && (
              <Button onClick={() => setShowSuggestionForm(true)} className="min-h-[44px]">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Submit New Suggestion</span>
                <span className="sm:hidden">New Suggestion</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <FileText className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Suggestions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {showArchived ? 'Archived Suggestions' : 'Your Suggestions'}
            </CardTitle>
            <CardDescription>
              {showArchived 
                ? 'Completed and rejected suggestions, organized by most recent'
                : 'All suggestions you\'ve submitted, organized by most recent'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayedSuggestions.length > 0 ? (
              <div className="space-y-4">
                {displayedSuggestions
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No suggestions yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by submitting your first suggestion. Share your ideas to help improve our product!
                </p>
                <Button 
                  onClick={() => setShowSuggestionForm(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Your First Suggestion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggestion Form Dialog */}
        <Dialog open={showSuggestionForm} onOpenChange={setShowSuggestionForm}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Suggestion</DialogTitle>
            </DialogHeader>
            <SuggestionForm 
              onSuccess={() => setShowSuggestionForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}