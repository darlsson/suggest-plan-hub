import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppData } from '@/hooks/useAppData';
import { RoadmapItem } from '@/types';
import { List, Kanban, Calendar, User, Target, Eye, Plus } from 'lucide-react';
import { RoadmapItemDialog } from '@/components/admin/RoadmapItemDialog';
import { SuggestionForm } from '@/components/suggestions/SuggestionForm';

type ViewMode = 'kanban' | 'list';

export default function EmployeeRoadmap() {
  const { roadmapItems } = useAppData();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleViewItem = (item: RoadmapItem) => {
    setSelectedItem(item);
  };

  const canSubmitSuggestion = (status: string) => {
    return status === 'planned' || status === 'in-progress';
  };

  const renderKanbanView = () => {
    const columns = [
      { status: 'planned', title: 'Planned', items: roadmapItems.filter(item => item.status === 'planned') },
      { status: 'in-progress', title: 'In Progress', items: roadmapItems.filter(item => item.status === 'in-progress') },
      { status: 'completed', title: 'Completed', items: roadmapItems.filter(item => item.status === 'completed') }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {columns.map((column) => (
          <div key={column.status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base md:text-lg">{column.title}</h3>
              <Badge variant="outline">{column.items.length}</Badge>
            </div>
            {canSubmitSuggestion(column.status) && (
              <Button 
                onClick={() => setShowSuggestionForm(true)}
                className="w-full mb-3"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Suggestion
              </Button>
            )}
            <div className="space-y-3 min-h-[300px] md:min-h-[400px] bg-gray-50 rounded-lg p-3 md:p-4">
              {column.items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.quarter}</span>
                      </div>
                      <div className="flex items-center justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewItem(item)}
                          className="min-h-[36px] text-xs"
                        >
                          <Eye className="h-3 w-3 md:mr-1" />
                          <span className="hidden md:inline">View</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {roadmapItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {item.quarter}
                    </span>
                    {item.assignedTo && (
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {item.assignedTo}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Target className="mr-1 h-4 w-4" />
                      {item.relatedSuggestions.length} linked
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-0 md:ml-4 mt-3 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewItem(item)}
                    className="min-h-[40px] text-xs md:text-sm"
                  >
                    <Eye className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                    View
                  </Button>
                  {canSubmitSuggestion(item.status) && (
                    <Button
                      onClick={() => setShowSuggestionForm(true)}
                      size="sm"
                      className="min-h-[40px] text-xs md:text-sm"
                    >
                      <Plus className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                      Suggest
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout title="Roadmap">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Roadmap</h1>
            <p className="text-sm md:text-base text-gray-600">View planned features and submit suggestions for active phases</p>
          </div>
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                onClick={() => setViewMode('kanban')}
                className="text-xs md:text-sm min-h-[40px]"
              >
                <Kanban className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="text-xs md:text-sm min-h-[40px]"
              >
                <List className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                List
              </Button>
            </div>
            <Button onClick={() => setShowSuggestionForm(true)} className="min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Submit Suggestion</span>
              <span className="sm:hidden">Suggest</span>
            </Button>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'kanban' ? renderKanbanView() : renderListView()}

        {/* View Item Dialog */}
        <RoadmapItemDialog
          roadmapItem={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />

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