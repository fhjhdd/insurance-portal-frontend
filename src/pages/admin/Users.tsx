import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUsers, reactivateUser} from '@/services/api';
import { addUser } from '@/services/api';

import { toast } from 'sonner';
import { User } from '@/types';
import { SearchBar } from '@/components/admin/SearchBar';
import { UserTabs } from '@/components/admin/UserTabs';
import { ResetPasswordDialog } from '@/components/admin/ResetPasswordDialog';
import { useUserFilter } from '@/hooks/useUserFilter';

// ✅ shadcn dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const Users: React.FC = () => {
  const {
    resetUserPassword,
    blockUser,
    unblockUser,
    impersonate,
    approveUser,
    rejectUser,
  } = useAuth();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Add User Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '',referrerId:''})

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { searchQuery, setSearchQuery, filteredUsers } = useUserFilter(users);

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    setProcessingAction(true);
    try {
      const success = await resetUserPassword(selectedUser.uniqueId, newPassword);
      if (success) {
        toast.success('Password reset successfully');
        setIsResetDialogOpen(false);
        setNewPassword('');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting password');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleToggleBlock = async (user: User) => {
    setProcessingAction(true);
    try {
      const success = user.isBlocked
        ? await unblockUser(user.uniqueId)
        : await blockUser(user.uniqueId);

      if (success) {
        toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
        refetch();
      } else {
        toast.error(`Failed to ${user.isBlocked ? 'unblock' : 'block'} user`);
      }
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error('An error occurred while updating user status');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleApproveUser = async (user: User, expiryDays: number) => {
    setProcessingAction(true);
    try {
      const success = await approveUser(user.uniqueId,expiryDays);
      if (success) {
        toast.success('User approved successfully');
        // if (expiryDays) {
        //   const expirySuccess = await reactivateUser(user.id, expiryDays);
        //   if (expirySuccess) {
        //     toast.success('User approved with expiry set');
        //   } else {
        //     toast.error('User approved but failed to set expiry date');
        //   }
        // } else {
        //   toast.success('User approved successfully');
        // }
        refetch();
      } else {
        toast.error('Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('An error occurred while approving user');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectUser = async (user: User) => {
    setProcessingAction(true);
    try {
      const success = await rejectUser(user.uniqueId);
      if (success) {
        toast.success('User rejected successfully');
        refetch();
      } else {
        toast.error('Failed to reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('An error occurred while rejecting user');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReactivateUser = async (user: User, expiryDays: number) => {
    setProcessingAction(true);
    try {
      const success = await reactivateUser(user.id, expiryDays);
      if (success) {
        toast.success('User reactivated successfully');
        refetch();
      } else {
        toast.error('Failed to reactivate user');
      }
    } catch (error) {
      console.error('Error reactivating user:', error);
      toast.error('An error occurred while reactivating user');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleImpersonate = async (userId: string) => {
    try {
      await impersonate(userId);
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast.error('Failed to impersonate user');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }
  
    setProcessingAction(true);
    try {
      const storedUser = localStorage.getItem('refferx_user');
      let uniqueId = "";
      if (storedUser) {
        const user = JSON.parse(storedUser);
         uniqueId = user.uniqueId;
      }
      const userData = newUser;
      userData.referrerId = uniqueId;
      const success = await addUser(newUser);
  
      if (success) {
        toast.success('User created successfully');
        setNewUser({ name: '', email: '', password: '',referrerId:''})
        setIsAddUserOpen(false);
        refetch();
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating user');
    } finally {
      setProcessingAction(false);
    }
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
          {/* <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add User
          </button> */}
        </div>

        <div className="flex items-center mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <UserTabs
          pendingUsers={filteredUsers.pending}
          approvedUsers={filteredUsers.approved}
          expiredUsers={filteredUsers.expired}
          onOpenResetDialog={(user) => {
            setSelectedUser(user);
            setIsResetDialogOpen(true);
          }}
          onImpersonate={handleImpersonate}
          onToggleBlock={handleToggleBlock}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onReactivate={handleReactivateUser}
        />
      </div>

      <ResetPasswordDialog
        user={selectedUser}
        isOpen={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onReset={handleResetPassword}
        newPassword={newPassword}
        onNewPasswordChange={setNewPassword}
      />

      {/* Add User Dialog */}
      {/* <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              type="text"
              autoComplete="off"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password" // Or "off"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              disabled={processingAction}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {processingAction ? 'Creating...' : 'Create'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </Layout>
  );
};

export default Users;
