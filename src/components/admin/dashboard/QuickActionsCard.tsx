
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserSearch, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Manage your platform with these quick actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col h-16 md:h-20 items-center justify-center space-y-1"
            onClick={() => navigate('/admin/users')}
          >
            <Users size={18} className="mb-1" />
            <span className="text-xs md:text-sm text-center">Manage Users</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-16 md:h-20 items-center justify-center space-y-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
            onClick={() => navigate('/admin/user-management')}
          >
            <UserSearch size={18} className="mb-1 text-blue-600" />
            <span className="text-blue-600 text-xs md:text-sm text-center">User Management</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-16 md:h-20 items-center justify-center space-y-1"
            onClick={() => navigate('/admin/referrals')}
          >
            <TrendingUp size={18} className="mb-1" />
            <span className="text-xs md:text-sm text-center">Team Tracking</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-16 md:h-20 items-center justify-center space-y-1"
            onClick={() => navigate('/admin/withdrawals')}
          >
            <Wallet size={18} className="mb-1" />
            <span className="text-xs md:text-sm text-center">Manage Withdrawals</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
