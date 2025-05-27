
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import WithdrawalDetails from './WithdrawalDetails';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Withdrawal } from '@/types';

interface PendingWithdrawalsTableProps {
  withdrawals: Withdrawal[];
  onViewDetails: (withdrawal: Withdrawal) => void;
  onApprove: (withdrawalId: string) => void;
  onReject: (withdrawalId: string) => void;
  withdrawalUser: any;
  selectedWithdrawal: Withdrawal | null;
  processingAction: boolean;
}

const PendingWithdrawalsTable: React.FC<PendingWithdrawalsTableProps> = ({
  withdrawals,
  onViewDetails,
  onApprove,
  onReject,
  withdrawalUser,
  selectedWithdrawal,
  processingAction
}) => {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard size={40} className="mx-auto text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No Pending Withdrawals</h3>
        <p className="text-gray-500 mt-1">
          All withdrawal requests have been processed
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
            <TableHead>Request Date</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell className="font-medium">${withdrawal.amount.toFixed(2)}</TableCell>
              <TableCell>
                {withdrawal.method === 'uniqueId' ? 'Unique ID' : 'Crypto'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{withdrawal.address}</TableCell>
              <TableCell>{new Date(withdrawal.createdAt).toLocaleDateString()}</TableCell>
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
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onApprove(withdrawal._id)}
                  disabled={processingAction}
                  className="h-8 w-8"
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onReject(withdrawal._id)}
                  disabled={processingAction}
                  className="h-8 w-8"
                  title="Reject"
                >
                  <XCircle className="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingWithdrawalsTable;
