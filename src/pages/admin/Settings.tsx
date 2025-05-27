
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, Mail, Settings, ShieldCheck } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState('admin@teamboost');
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('notifications@refferx.com');
  const [smtpPassword, setSmtpPassword] = useState('********');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [submittingSmtp, setSubmittingSmtp] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEmail(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Admin email updated successfully');
      setSubmittingEmail(false);
    }, 1000);
  };

  const handleSmtpUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSmtp(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('SMTP settings updated successfully');
      setSubmittingSmtp(false);
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setSubmittingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password updated successfully');
      setSubmittingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            {/* <TabsTrigger value="email">Email</TabsTrigger> */}
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings size={20} className="mr-2" />
                  Admin Account
                </CardTitle>
                <CardDescription>
                  Update your admin account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail" 
                      type="email" 
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      This email will be used for admin notifications and login
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={submittingEmail}>
                    {submittingEmail ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* <TabsContent value="email" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail size={20} className="mr-2" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure your SMTP settings for system emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSmtpUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input 
                        id="smtpUser" 
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={submittingSmtp} className="mt-4">
                    {submittingSmtp ? 'Saving...' : 'Save SMTP Settings'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock size={20} className="mr-2" />
                  Password
                </CardTitle>
                <CardDescription>
                  Update your admin password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={submittingPassword}>
                    {submittingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck size={20} className="mr-2" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Manage your two-factor authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Two-factor authentication is enabled for your account. All admin users must verify their identity using email verification codes on login.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This security feature cannot be disabled for admin accounts.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminSettings;
