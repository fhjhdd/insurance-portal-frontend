import React, { useState } from "react";
import { User, ExpiryOption } from "@/types";
import { UserIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

import { toast } from "sonner";

const EXPIRY_OPTIONS: ExpiryOption[] = [
  { label: "3 months (90 days)", days: 90 },
  { label: "4 months (120 days)", days: 120 },
  { label: "6 months (180 days)", days: 180 },
  { label: "12 months (360 days)", days: 360 },
];

interface ExpiredUsersTableProps {
  users: User[];
  onReactivate: (user: User, expiryDays: number) => void;
}

export const ExpiredUsersTable: React.FC<ExpiredUsersTableProps> = ({
  users,
  onReactivate,
}) => {
  const [selectedExpiryDays, setSelectedExpiryDays] = useState<{
    [key: string]: number;
  }>({});
  const { approveUser } = useAuth();
  const handleReactivate = async (user: User) => {
    if (!selectedExpiryDays[user.id]) {
      toast.error("Please select an expiry period before reactivating");
      return;
    }
    // onReactivate(user, selectedExpiryDays[user.id]);
    const success = await approveUser(
      user.uniqueId,
      selectedExpiryDays[user.id]
    );
    if (success) {
      toast.success("User Reactivated successfully");
    } else {
      toast.error("Failed to Reactivate User");
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon size={40} className="mx-auto text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No Expired Users</h3>
        <p className="text-gray-500 mt-1">All users are active</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email / ID</th>
            <th className="px-4 py-2">Registered</th>
            <th className="px-4 py-2">Expired On</th>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Expiry Period</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="bg-red-50">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span>{user.name}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Expired
                  </span>
                </div>
              </td>
              <td className="px-4 py-2">
                <div>{user.email}</div>
                <div className="text-xs text-gray-500">{user.uniqueId}</div>
              </td>
              <td className="px-4 py-2">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {user.expiryDate
                  ? new Date(user.expiryDate).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2">
                ${user.balance?.toFixed(2) || "0.00"}
              </td>
              <td className="px-4 py-2">
                <Select
                  value={selectedExpiryDays[user.id]?.toString()}
                  onValueChange={(value) =>
                    setSelectedExpiryDays((prev) => ({
                      ...prev,
                      [user.id]: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPIRY_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.days}
                        value={option.days.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleReactivate(user)}
                  disabled={!selectedExpiryDays[user.id]}
                >
                  <Clock size={16} className="mr-1" />
                  Reactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
