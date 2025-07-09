
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, ArrowLeft, Save, Mail } from 'lucide-react';
import { formatDate } from '@/utils/auth';

export default function AdminUserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, updateUser } = useAppData();
  const { toast } = useToast();
  
  const user = users.find(u => u.id === id);
  
  // Profile Information State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  if (!user) {
    return (
      <Layout title="User Not Found">
        <div className="text-center py-8">
          <p className="text-gray-500">User not found.</p>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </Layout>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleSaveProfile = () => {
    updateUser(user.id, {
      name: fullName,
      email: email,
      role: role,
    });
    
    toast({
      title: "User profile updated",
      description: `${fullName}'s profile has been saved successfully.`,
    });
  };

  const handleResetPassword = () => {
    // In a real app, this would send a password reset email
    toast({
      title: "Password reset sent",
      description: `A password reset link has been sent to ${email}.`,
    });
  };

  return (
    <Layout title={`Edit User: ${user.name}`}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit User: {user.name}</h1>
            <p className="text-gray-600 mt-2">Manage user account settings and permissions</p>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update user personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select 
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Member since</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{memberSince}</span>
                  </div>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Password Reset */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Password Management</CardTitle>
                  <CardDescription>Send password reset email to user</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Send a password reset link to {email}. The user will receive an email with instructions to create a new password.
                </p>
                <Button onClick={handleResetPassword} className="w-full md:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Password Reset Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
