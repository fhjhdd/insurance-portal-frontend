
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Wallet } from 'lucide-react';
import { Withdrawal } from '@/types';

interface WithdrawalDetailsProps {
  withdrawal: Withdrawal;
  withdrawalUser: any;
}

const WithdrawalDetails: React.FC<WithdrawalDetailsProps> = ({ withdrawal, withdrawalUser }) => {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Withdrawal Details</DialogTitle>
        <DialogDescription>
          View processed withdrawal and user information
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Amount</h3>
          <p className="text-2xl font-bold">${withdrawal.amount.toFixed(2)}</p>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Withdrawal ID</p>
            <p className="break-all">{withdrawal.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                withdrawal.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Method</p>
            <p>{withdrawal.method === 'uniqueId' ? 'Unique ID Transfer' : 'USDT TRC-20'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="break-all">{withdrawal.address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Request Date</p>
            <p>{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Processed Date</p>
            <p>{withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          {withdrawal.recipientName && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Withdrawaler Name</p>
              <p>{withdrawal.recipientName}</p>
            </div>
          )}
        </div>
    
        {withdrawalUser && (
          <div className="border p-4 rounded-md space-y-4">
            <div className="flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              <h3 className="font-medium">User Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{withdrawalUser.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Unique ID</p>
                <p>{withdrawalUser.uniqueId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="break-all">{withdrawalUser.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <p>${withdrawalUser.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default WithdrawalDetails;
