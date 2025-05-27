
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from 'lucide-react';
import { User } from '@/types';

interface ResetPasswordDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  user,
  isOpen,
  onOpenChange,
  onReset,
  newPassword,
  onNewPasswordChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter a new password for {user?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input
              id="new-password"
              type="text"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              className="col-span-3"
              placeholder="Minimum 8 characters"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onReset}
            className="ml-2"
          >
            <RefreshCcw size={14} className="mr-1" />
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
