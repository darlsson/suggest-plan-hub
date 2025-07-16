
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, Search, BarChart3, Plus, Archive } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Suggestion } from '@/types';
import { SuggestionManagementDialog } from '@/components/admin/SuggestionManagementDialog';
import { SuggestionForm } from '@/components/suggestions/SuggestionForm';
import { formatDate } from '@/utils/auth';

export default function AdminSuggestions() {
  const { suggestions } = useAppData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isNewSuggestionOpen, setIsNewSuggestionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);

  // Set initial filter from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Separate active and archived suggestions
  const activeSuggestions = suggestions.filter(s => s.status !== 'completed' && s.status !== 'rejected');
  const archivedSuggestions = suggestions.filter(s => s.status === 'completed' || s.status === 'rejected');
  
  const filteredSuggestions = (showArchived ? archivedSuggestions : activeSuggestions).filter((suggestion) => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || suggestion.status === statusFilter;
    const matchesType = typeFilter === 'all' || suggestion.category === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleViewAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleNewSuggestion = () => {
    setIsNewSuggestionOpen(true);
  };

  const handleNewSuggestionSuccess = () => {
    setIsNewSuggestionOpen(false);
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  return (
    <Layout title="All Suggestions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {showArchived ? 'Archived Suggestions' : 'Active Suggestions'}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {filteredSuggestions.length} of {showArchived ? archivedSuggestions.length : activeSuggestions.length}
              {showArchived ? ' archived' : ' active'}
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:gap-3 md:space-y-0">
            <Button 
              variant="outline" 
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Archive className="h-4 w-4" />
              {showArchived ? 'View Active' : 'View Archived'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewAnalytics}
              className="flex items-center justify-center gap-2 min-h-[44px]"
            >
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button 
              onClick={handleNewSuggestion}
              className="flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="h-4 w-4" />
              New Suggestion
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 md:flex-row md:gap-4 md:items-end md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search suggestions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 md:flex-row md:gap-2 md:space-y-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[150px] min-h-[44px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[150px] min-h-[44px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between md:space-y-0 mb-3">
                        <div className="flex flex-col space-y-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">
                            {suggestion.title}
                          </h3>
                          <Badge className={`self-start ${categoryColors[suggestion.category]}`}>
                            {suggestion.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={statusColors[suggestion.status]}>
                            {suggestion.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={priorityColors[suggestion.priority]}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{truncateDescription(suggestion.description)}</p>
                      
                      <div className="text-sm text-gray-500">
                        Submitted by {suggestion.authorName} on {formatDate(suggestion.createdAt)}
                      </div>

                      {suggestion.adminNotes && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-blue-900 text-sm mb-1">Admin Feedback:</h4>
                          <p className="text-blue-800 text-sm">{suggestion.adminNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-0 md:ml-4 mt-4 md:mt-0 self-start md:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSuggestion(suggestion)}
                        className="min-h-[40px] w-full md:w-auto"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">No suggestions found matching your criteria.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Management Dialog */}
        <SuggestionManagementDialog
          suggestion={selectedSuggestion}
          open={!!selectedSuggestion}
          onOpenChange={(open) => !open && setSelectedSuggestion(null)}
        />

        {/* New Suggestion Dialog */}
        <Dialog open={isNewSuggestionOpen} onOpenChange={setIsNewSuggestionOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Suggestion</DialogTitle>
            </DialogHeader>
            <SuggestionForm onSuccess={handleNewSuggestionSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
