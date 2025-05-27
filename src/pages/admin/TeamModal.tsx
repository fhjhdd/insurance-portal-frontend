import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferralTree from "@/components/admin/referrals/ReferralTree";
import { User } from "@/types";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  referralTree: { level: number; users: any[] }[];
  loadingTree: boolean;
  activeLevel: number | null;
  onLevelChange: (level: number | null) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  user,
  referralTree,
  loadingTree,
  activeLevel,
  onLevelChange,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Users size={20} />
            Team View of {user.name}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              {/* <X size={20} /> */}
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="py-4">
          <ReferralTree
            user={user}
            referralTree={referralTree}
            loadingTree={loadingTree}
            activeLevel={activeLevel}
            onLevelChange={onLevelChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamModal;
