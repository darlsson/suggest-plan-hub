
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Lock, Settings as SettingsIcon, ArrowLeft, Save } from 'lucide-react';
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
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

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

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would change the password
    toast({
      title: "Password changed",
      description: `Password for ${fullName} has been updated successfully.`,
    });
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile and Password */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Change Password */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Lock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update user account password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleChangePassword} className="w-full md:w-auto">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button onClick={handleResetPassword} variant="outline" className="w-full md:w-auto">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage user notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-sm font-medium">
                      Email notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                    <span className="text-xs text-green-600 font-medium">
                      {emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts" className="text-sm font-medium">
                      System alerts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAlerts"
                      checked={systemAlerts}
                      onCheckedChange={setSystemAlerts}
                    />
                    <span className="text-xs text-green-600 font-medium">
                      {systemAlerts ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
