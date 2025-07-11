import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock, 
  Tags, 
  BarChart3,
  Calendar,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '@/hooks/useAppData';

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: '#10b981',
  warning: '#f59e0b', 
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

export default function AdminAnalytics() {
  const { suggestions } = useAppData();
  const [timeRange, setTimeRange] = useState('30d');

  // Analytics calculations
  const analytics = useMemo(() => {
    // Category distribution
    const categoryData = suggestions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution  
    const statusData = suggestions.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const priorityData = suggestions.reduce((acc, s) => {
      acc[s.priority] = (acc[s.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tag frequency
    const tagData = suggestions.reduce((acc, s) => {
      s.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Suggestions over time (last 30 days)
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const timelineData = last30Days.map(date => {
      const count = suggestions.filter(s => 
        s.createdAt.split('T')[0] === date
      ).length;
      return { date, count };
    });

    // Vote distribution
    const voteRanges = {
      '0-5': 0,
      '6-15': 0, 
      '16-30': 0,
      '31+': 0
    };
    
    suggestions.forEach(s => {
      if (s.votes <= 5) voteRanges['0-5']++;
      else if (s.votes <= 15) voteRanges['6-15']++;
      else if (s.votes <= 30) voteRanges['16-30']++;
      else voteRanges['31+']++;
    });

    return {
      total: suggestions.length,
      categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
      statusData: Object.entries(statusData).map(([name, value]) => ({ name, value })),
      priorityData: Object.entries(priorityData).map(([name, value]) => ({ name, value })),
      topTags: Object.entries(tagData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value })),
      timelineData,
      voteData: Object.entries(voteRanges).map(([name, value]) => ({ name, value })),
      avgVotes: suggestions.length ? 
        Math.round(suggestions.reduce((sum, s) => sum + s.votes, 0) / suggestions.length) : 0
    };
  }, [suggestions]);

  return (
    <Layout title="Suggestion Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-4">
            <Link to="/admin/suggestions">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Suggestions
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Suggestion Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Insights and patterns from user suggestions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.statusData.find(s => s.name === 'pending')?.value || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.topTags.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Suggestions by Category</CardTitle>
              <CardDescription>
                Distribution of suggestion types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Suggestions by Status</CardTitle>
              <CardDescription>
                Current processing status of suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Levels</CardTitle>
              <CardDescription>
                Distribution of suggestion priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.priorityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.warning} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Suggestions Over Time</CardTitle>
              <CardDescription>
                Daily suggestion submissions (last 30 days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={COLORS.info} 
                    fill={COLORS.info} 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Tags and Vote Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Tags</CardTitle>
              <CardDescription>
                Frequently used tags across suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topTags.map((tag, index) => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{tag.name}</Badge>
                      <span className="text-sm text-gray-600">#{index + 1}</span>
                    </div>
                    <div className="text-sm font-medium">{tag.value} uses</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vote Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Vote Distribution</CardTitle>
              <CardDescription>
                How suggestions perform in voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.voteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              Automated analysis of suggestion patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">📈 Trending Categories</h4>
                <div className="space-y-2">
                  {analytics.categoryData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map((cat, index) => (
                      <div key={cat.name} className="flex justify-between text-sm">
                        <span>#{index + 1} {cat.name}</span>
                        <span className="font-medium">{cat.value} suggestions</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">🎯 Action Required</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pending Review</span>
                    <Badge variant="outline">
                      {analytics.statusData.find(s => s.name === 'pending')?.value || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>High Priority</span>
                    <Badge variant="outline">
                      {analytics.priorityData.find(p => p.name === 'high')?.value || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}