
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

interface PendingUsersCardProps {
  pendingUsers: [];
}

export const PendingUsersCard = (
  pendingUsers
) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center">
            <Clock size={18} className="mr-2" />
            Pending Approvals
          </CardTitle>
          <CardDescription className="text-xs">
            New users waiting for your approval
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center justify-center bg-blue-50 rounded-full w-14 h-14 sm:w-16 sm:h-16">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">{pendingUsers.pendingUsers.length}</span>
          </div>
          <div className="text-center px-2">
            <p className="font-medium text-sm sm:text-base">User{pendingUsers.pendingUsers.length !== 1 ? 's' : ''} Waiting</p>
            <p className="text-xs sm:text-sm text-gray-500">Pending approval requests</p>
          </div>
          <Button 
            className="mt-2 w-full sm:w-auto px-4" 
            onClick={() => navigate('/admin/users')}
          >
            Review Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
