
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppData, mockUsers } from '@/hooks/useAppData';
import { useAuth } from '@/hooks/useAuth';
import { Users, FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SuggestionManagementDialog } from '@/components/admin/SuggestionManagementDialog';
import { Suggestion } from '@/types';

export default function AdminDashboard() {
  const { suggestions, roadmapItems, users } = useAppData();
  const { auth } = useAuth();
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const inProgressItems = roadmapItems.filter(item => item.status === 'in-progress');
  const totalEmployees = users.filter(u => u.role === 'employee').length;
  const activeRoadmapItem = roadmapItems.find(item => item.status === 'in-progress');

  const stats = [
    {
      title: 'Current Active Item',
      value: activeRoadmapItem ? activeRoadmapItem.title : 'None',
      description: activeRoadmapItem ? `Due: ${activeRoadmapItem.quarter}` : 'No active roadmap items',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Suggestions',
      value: pendingSuggestions.length,
      description: 'Waiting for review',
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: inProgressItems.length,
      description: 'Roadmap items being worked on',
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Total Suggestions',
      value: suggestions.length,
      description: 'All time submissions',
      icon: FileText,
      color: 'text-green-600',
    },
  ];

  const recentSuggestions = suggestions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hello, {user.id}!
              </h2>
              <p className="text-gray-600">
                Manage users, suggestions, and roadmap items.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Suggestions</CardTitle>
              <CardDescription>
                Latest submissions from users (click to manage)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {recentSuggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id} 
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {suggestion.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          by {suggestion.authorName} • {suggestion.status}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {suggestion.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No suggestions yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/suggestions">
                  <FileText className="mr-2 h-4 w-4" />
                  Review Suggestions ({pendingSuggestions.length} pending)
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/roadmap">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Roadmap
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Suggestion Management Dialog */}
        <SuggestionManagementDialog
          suggestion={selectedSuggestion}
          open={!!selectedSuggestion}
          onOpenChange={(open) => !open && setSelectedSuggestion(null)}
        />
      </div>
    </Layout>
  );
}
