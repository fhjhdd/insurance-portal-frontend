
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';
import { UserTable } from '@/components/admin/UserTable';
import { ResetPasswordDialog } from '@/components/admin/ResetPasswordDialog';

const AdminUserManagement: React.FC = () => {
  const { impersonate, resetUserPassword, blockUser, unblockUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.uniqueId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImpersonate = async (userId: string) => {
    await impersonate(userId);
  };

  const handleOpenResetDialog = (user: User) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (selectedUser && newPassword) {
      if (newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      
      const success = await resetUserPassword(selectedUser.id, newPassword);
      if (success) {
        setIsResetDialogOpen(false);
        setSelectedUser(null);
        setNewPassword('');
      }
    } else {
      toast.error('Please enter a valid password');
    }
  };

  const handleToggleBlock = async (user: User) => {
    if (user.isBlocked) {
      await unblockUser(user.uniqueId);
    } else {
      await blockUser(user.uniqueId);
    }
    refetch();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search users by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users, reset passwords, and control access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              users={filteredUsers}
              onOpenResetDialog={handleOpenResetDialog}
              onImpersonate={handleImpersonate}
              onToggleBlock={handleToggleBlock}
            />
          </CardContent>
        </Card>
      </div>

      <ResetPasswordDialog
        user={selectedUser}
        isOpen={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onReset={handleResetPassword}
        newPassword={newPassword}
        onNewPasswordChange={setNewPassword}
      />
    </Layout>
  );
};

export default AdminUserManagement;
