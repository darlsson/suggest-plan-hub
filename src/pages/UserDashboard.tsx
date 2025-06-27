
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/hooks/useAppData';
import { useAuth } from '@/hooks/useAuth';
import { SuggestionCard } from '@/components/suggestions/SuggestionCard';
import { Link } from 'react-router-dom';
import { Plus, FileText, Calendar, CheckCircle } from 'lucide-react';

export default function UserDashboard() {
  const { auth } = useAuth();
  const { suggestions, roadmapItems } = useAppData();

  const userSuggestions = suggestions.filter(s => s.authorId === auth.user?.id);
  const recentSuggestions = userSuggestions.slice(0, 3);
  const completedRoadmapItems = roadmapItems.filter(item => item.status === 'completed');

  const stats = [
    {
      title: 'My Suggestions',
      value: userSuggestions.length,
      description: 'Total suggestions submitted',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Approved',
      value: userSuggestions.filter(s => s.status === 'approved').length,
      description: 'Suggestions approved',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: userSuggestions.filter(s => s.status === 'in-progress').length,
      description: 'Currently being worked on',
      icon: Calendar,
      color: 'text-orange-600',
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {auth.user?.name}!
          </h2>
          <p className="text-gray-600 mb-4">
            Here's what's happening with your suggestions and the roadmap.
          </p>
          <Link to="/my-suggestions">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit New Suggestion
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Recent Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Suggestions</CardTitle>
              <CardDescription>
                Your latest suggestion submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {recentSuggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                  {userSuggestions.length > 3 && (
                    <Link to="/my-suggestions">
                      <Button variant="outline" className="w-full">
                        View All Suggestions
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No suggestions yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by submitting your first suggestion.
                  </p>
                  <Link to="/my-suggestions">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Suggestion
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Roadmap Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Completions</CardTitle>
              <CardDescription>
                Recently completed roadmap items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedRoadmapItems.length > 0 ? (
                <div className="space-y-4">
                  {completedRoadmapItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-semibold text-green-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Completed • {item.quarter}
                      </p>
                    </div>
                  ))}
                  <Link to="/roadmap">
                    <Button variant="outline" className="w-full">
                      View Full Roadmap
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No completed items
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check back later for roadmap updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
