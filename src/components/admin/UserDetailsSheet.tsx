
import React from 'react';
import { User } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserDetailsSheetProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailsSheet: React.FC<UserDetailsSheetProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            Detailed information about {user.name}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
              <dl className="mt-2 divide-y divide-gray-100">
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Name</dt>
                  <dd className="col-span-2 text-sm">{user.name}</dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Email</dt>
                  <dd className="col-span-2 text-sm">{user.email}</dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Unique ID</dt>
                  <dd className="col-span-2 text-sm">{user.uniqueId}</dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Status</dt>
                  <dd className="col-span-2 text-sm">
                    {user.isBlocked ? "Blocked" : user.isApproved ? "Approved" : "Pending"}
                  </dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Balance</dt>
                  <dd className="col-span-2 text-sm">${user.balance.toFixed(2)}</dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Registration Date</dt>
                  <dd className="col-span-2 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">Expiry Date</dt>
                  <dd className="col-span-2 text-sm">
                    {new Date(user.expiryDate).toLocaleDateString()}
                  </dd>
                </div>
                {/* <div className="grid grid-cols-3 py-3">
                  <dt className="text-sm font-medium">ReferrerID</dt>
                  <dd className="col-span-2 text-sm">{user.referrerId}</dd>
                </div> */}
              </dl>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
