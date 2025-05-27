
import React, { useState } from 'react';
import { User, ExpiryOption } from '@/types';
import { UserIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const EXPIRY_OPTIONS: ExpiryOption[] = [
  { label: '3 months (90 days)', days: 90 },
  { label: '4 months (120 days)', days: 120 },
  { label: '6 months (180 days)', days: 180 },
  { label: '12 months (360 days)', days: 360 },
];

interface PendingUsersTableProps {
  users: User[];
  onApprove: (user: User, expiryDays: number) => void;
  onReject: (user: User) => void;
}

export const PendingUsersTable: React.FC<PendingUsersTableProps> = ({
  users,
  onApprove,
  onReject,
}) => {
  const [selectedExpiryDays, setSelectedExpiryDays] = useState<{ [key: string]: number }>({});

  const handleApprove = (user: User) => {
    if (!selectedExpiryDays[user.id]) {
      toast.error("Please select an expiry period before approving");
      return;
    }
    onApprove(user, selectedExpiryDays[user.id]);
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon size={40} className="mx-auto text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No Pending Users</h3>
        <p className="text-gray-500 mt-1">All users have been approved</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Unique ID</TableHead>
            {/* <TableHead>Referrer ID</TableHead> */}
            <TableHead>Expiry Period</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.uniqueId}</TableCell>
              {/* <TableCell>{user.referrerId || 'N/A'}</TableCell> */}
              <TableCell>
                <Select
                  value={selectedExpiryDays[user.id]?.toString()}
                  onValueChange={(value) => 
                    setSelectedExpiryDays(prev => ({ ...prev, [user.id]: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select expiry period" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPIRY_OPTIONS.map((option) => (
                      <SelectItem key={option.days} value={option.days.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onReject(user)}
                    className="whitespace-nowrap"
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                    onClick={() => handleApprove(user)}
                    disabled={!selectedExpiryDays[user.id]}
                  >
                    Approve
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
