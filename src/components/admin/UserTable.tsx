
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, ShieldX, ShieldCheck, MoreHorizontal, Eye, Users, RefreshCw } from 'lucide-react';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDetailsSheet } from './UserDetailsSheet';

interface UserTableProps {
  users: User[];
  onOpenResetDialog: (user: User) => void;
  onImpersonate: (userId: string) => void;
  onToggleBlock: (user: User) => void;
  onApprove?: (user: User) => void;
  onReject?: (user: User) => void;
  onReactivate?: (user: User) => void;
  onViewTeam?: (user: User) => void;
  showApproveReject?: boolean;
  showExpiry?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onOpenResetDialog,
  onImpersonate,
  onToggleBlock,
  onApprove,
  onReject,
  onReactivate,
  onViewTeam,
  showApproveReject = false,
  showExpiry = false,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleDropdownOpenChange = (isOpen: boolean, userId: string) => {
    setOpenDropdownId(isOpen ? userId : null);
  };

  const getDaysUntilExpiry = (expiryDate?: Date): number | null => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Set expiry time to 120 days
  const getExpiryText = (days: number | null) => {
    if (days === null) return "Not set";
    if (days === 0) return "Expired today";
    if (days === 1) return "Expires tomorrow";
    return `${days} days left`;
  };

  const getExpiryClass = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days <= 14) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Unique ID</TableHead>
              <TableHead>Status</TableHead>
              {showExpiry && (
                <TableHead>Expiry</TableHead>
              )}
              <TableHead>Registration Date</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user._id} 
                className={
                  user.isBlocked 
                    ? "bg-gray-50" 
                    : user.isExpired 
                      ? "bg-red-50" 
                      : ""
                }
              >
                <TableCell className="font-medium">
                  {user.name}
                  {user.isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.uniqueId}</TableCell>
                <TableCell>
                  {user.isBlocked ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      <ShieldX size={12} className="mr-1" /> Blocked
                    </span>
                  ) : user.isExpired ? (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Expired
                    </span>
                  ) : user.isApproved ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      <ShieldCheck size={12} className="mr-1" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </TableCell>
                {showExpiry && (
                  <TableCell>
                    {user.expiryDate ? (
                      <div>
                        <div className="text-sm">{new Date(user.expiryDate).toLocaleDateString()}</div>
                        {getDaysUntilExpiry(user.expiryDate) !== null && (
                          <div className={`text-xs mt-1 font-medium ${getExpiryClass(getDaysUntilExpiry(user.expiryDate))}`}>
                            {getExpiryText(getDaysUntilExpiry(user.expiryDate))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Not set</span>
                    )}
                  </TableCell>
                )}
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${user.balance?.toFixed(2) || '0.00'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {showApproveReject && !user.isApproved && !user.isExpired && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove?.(user)}
                          className="bg-green-600 hover:bg-green-700 h-8"
                        >
                          <Check size={14} className="mr-1" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onReject?.(user)}
                          className="h-8"
                        >
                          <X size={14} className="mr-1" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </>
                    )}
                    {user.isExpired && onReactivate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReactivate(user)}
                        className="border-green-200 text-green-700 hover:bg-green-50 h-8"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        <span className="hidden sm:inline">Reactivate</span>
                      </Button>
                    )}
                    {onViewTeam && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewTeam(user)}
                        className="h-8"
                      >
                        <Users size={14} className="mr-1" />
                        <span className="hidden sm:inline">Team</span>
                      </Button>
                    )}
                    <DropdownMenu 
                      open={openDropdownId === user._id}
                      onOpenChange={(isOpen) => handleDropdownOpenChange(isOpen, user._id)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] bg-white">
                        <DropdownMenuItem onClick={() => {
                          handleViewDetails(user);
                          setOpenDropdownId(null);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          onOpenResetDialog(user);
                          setOpenDropdownId(null);
                        }}>
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            onToggleBlock(user);
                            setOpenDropdownId(null);
                          }}
                          disabled={user.isAdmin || user.isExpired}
                        >
                          {user.isBlocked ? "Unblock User" : "Block User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserDetailsSheet
        user={selectedUser}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};
