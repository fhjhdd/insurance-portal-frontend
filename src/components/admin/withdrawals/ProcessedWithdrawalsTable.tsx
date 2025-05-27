
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import WithdrawalDetails from './WithdrawalDetails';
import { CreditCard } from 'lucide-react';
import { Withdrawal } from '@/types';

interface ProcessedWithdrawalsTableProps {
  withdrawals: Withdrawal[];
  onViewDetails: (withdrawal: Withdrawal) => void;
  withdrawalUser: any;
  selectedWithdrawal: Withdrawal | null;
}

const ProcessedWithdrawalsTable: React.FC<ProcessedWithdrawalsTableProps> = ({
  withdrawals,
  onViewDetails,
  withdrawalUser,
  selectedWithdrawal
}) => {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard size={40} className="mx-auto text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No Processed Withdrawals</h3>
        <p className="text-gray-500 mt-1">
          No withdrawal history found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell className="font-medium">
                ${withdrawal.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {withdrawal.method === 'uniqueId' ? 'Unique ID' : 'Crypto'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {withdrawal.address}
              </TableCell>
              <TableCell>
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    withdrawal.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(withdrawal.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => onViewDetails(withdrawal)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  {selectedWithdrawal && selectedWithdrawal.id === withdrawal.id && (
                    <WithdrawalDetails
                      withdrawal={selectedWithdrawal}
                      withdrawalUser={withdrawalUser}
                    />
                  )}
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessedWithdrawalsTable;
