
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Lock, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { auth } = useAuth();
  const { toast } = useToast();
  
  // Profile Information State
  const [fullName, setFullName] = useState(auth.user?.name || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
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
      description: "Your password has been updated successfully.",
    });
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout title="User Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
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
                    <CardDescription>Update your personal information</CardDescription>
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
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Account Role</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium capitalize">{auth.user?.role}</span>
                    <span className="text-sm text-gray-500">Full system access</span>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  <SettingsIcon className="mr-2 h-4 w-4" />
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
                    <CardDescription>Update your account password</CardDescription>
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

                <Button onClick={handleChangePassword} className="w-full md:w-auto">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications and Account Summary */}
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
                    <CardDescription>Manage your notification preferences</CardDescription>
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails" className="text-sm font-medium">
                      Marketing emails
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="marketingEmails"
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      {marketingEmails ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <SettingsIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Account Summary</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account status</span>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last login</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member since</span>
                  <span className="text-xs text-gray-500">
                    {auth.user?.createdAt ? formatDate(auth.user.createdAt) : 'Demo account'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
