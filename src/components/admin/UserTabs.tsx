
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, User as UserIcon } from 'lucide-react';
import { UserTable } from './UserTable';
import { PendingUsersTable } from './tables/PendingUsersTable';
import { ExpiredUsersTable } from './tables/ExpiredUsersTable';

interface UserTabsProps {
  pendingUsers: User[];
  approvedUsers: User[];
  expiredUsers?: User[];
  onOpenResetDialog: (user: User) => void;
  onImpersonate: (userId: string) => void;
  onToggleBlock: (user: User) => void;
  onApprove: (user: User, expiryDays: number) => void;
  onReject: (user: User) => void;
  onReactivate?: (user: User, expiryDays: number) => void;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  pendingUsers,
  approvedUsers,
  expiredUsers = [],
  onOpenResetDialog,
  onImpersonate,
  onToggleBlock,
  onApprove,
  onReject,
  onReactivate
}) => {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending" className="relative">
          Pending Approvals
          {pendingUsers.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
              {pendingUsers.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved">Active Users</TabsTrigger>
        <TabsTrigger value="expired" className="relative">
          Expired Users
          {expiredUsers.length > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full">
              {expiredUsers.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Users</CardTitle>
            <CardDescription>Review and approve new user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingUsersTable 
              users={pendingUsers}
              onApprove={onApprove}
              onReject={onReject}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="approved" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>List of all approved active users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {approvedUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon size={40} className="mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No Users Found</h3>
                <p className="text-gray-500 mt-1">No active users matching your search</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <UserTable 
                  users={approvedUsers}
                  onOpenResetDialog={onOpenResetDialog}
                  onImpersonate={onImpersonate}
                  onToggleBlock={onToggleBlock}
                  showExpiry={true}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expired" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle size={20} className="mr-2 text-orange-500" />
              Expired Users
            </CardTitle>
            <CardDescription>Users with expired accounts that need reactivation</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpiredUsersTable 
              users={expiredUsers}
              onReactivate={onReactivate!}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
