
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Withdrawal } from '@/types';

interface PendingWithdrawalsCardProps {
  withdrawals: Withdrawal[];
}

export const PendingWithdrawalsCard = (
  withdrawals
) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center">
            <CreditCard size={18} className="mr-2" />
            Pending Withdrawals
          </CardTitle>
          <CardDescription className="text-xs">
            Withdrawal requests awaiting your approval
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center justify-center bg-amber-50 rounded-full w-14 h-14 sm:w-16 sm:h-16">
            <span className="text-xl sm:text-2xl font-bold text-amber-600">{withdrawals.withdrawals.length}</span>
          </div>
          <div className="text-center px-2">
            <p className="font-medium text-sm sm:text-base">Withdrawal{withdrawals.withdrawals.length !== 1 ? 's' : ''} Pending</p>
            <p className="text-xs sm:text-sm text-gray-500">Awaiting your approval</p>
          </div>
          <Button 
            className="mt-2 w-full sm:w-auto px-4" 
            onClick={() => navigate('/admin/withdrawals')}
          >
            Review Withdrawals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
