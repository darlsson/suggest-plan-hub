import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/hooks/useAppData';
import { RoadmapItem, Suggestion } from '@/types';
import { Plus, List, Kanban, Calendar, User, Target, Clock, Eye, Edit } from 'lucide-react';
import { RoadmapItemForm } from '@/components/admin/RoadmapItemForm';
import { RoadmapItemDialog } from '@/components/admin/RoadmapItemDialog';

type ViewMode = 'kanban' | 'list';

export default function AdminRoadmap() {
  const { roadmapItems, suggestions, updateRoadmapItem } = useAppData();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

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

  const handleEditItem = (item: RoadmapItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updates: Partial<RoadmapItem>) => {
    if (editingItem) {
      updateRoadmapItem(editingItem.id, updates);
      setEditingItem(null);
    }
  };

  const renderKanbanView = () => {
    const columns = [
      { status: 'planned', title: 'Planned', items: roadmapItems.filter(item => item.status === 'planned') },
      { status: 'in-progress', title: 'In Progress', items: roadmapItems.filter(item => item.status === 'in-progress') },
      { status: 'completed', title: 'Completed', items: roadmapItems.filter(item => item.status === 'completed') }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <Badge variant="outline">{column.items.length}</Badge>
            </div>
            <div className="space-y-3 min-h-[400px] bg-gray-50 rounded-lg p-4">
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
                      <div className="flex items-center justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
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
              <div className="flex items-start justify-between">
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
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    onClick={() => handleViewItem(item)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout title="Roadmap Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roadmap Panel</h1>
            <p className="text-gray-600">Manage and track roadmap items across different phases</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="mr-2 h-4 w-4" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
            </div>
            <Button onClick={() => setIsNewItemOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Roadmap Item
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

        {/* Edit Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Roadmap Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <RoadmapItemForm
                roadmapItem={editingItem}
                suggestions={suggestions}
                onSubmit={handleUpdateItem}
                onCancel={() => setEditingItem(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* New Item Dialog */}
        <Dialog open={isNewItemOpen} onOpenChange={setIsNewItemOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Roadmap Item</DialogTitle>
            </DialogHeader>
            <RoadmapItemForm
              suggestions={suggestions}
              onSubmit={() => setIsNewItemOpen(false)}
              onCancel={() => setIsNewItemOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
