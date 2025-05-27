import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getUsers,
  getReferralTree,
  getUserByUniqueId,
  getUsersByIds,
} from "@/services/api";
import { Users } from "lucide-react";
import { toast } from "sonner";
import UserList from "@/components/admin/referrals/UserList";
import TeamModal from "./TeamModal";
import { User } from "@/types";
interface TeamMember {
  id: string;
  name: string;
  uniqueId: string;
  createdAt: string | Date;
  balance: any;
  email: string;
}
const AdminReferrals: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [referralTree, setReferralTree] = useState<
    { level: number; users: any[] }[]
  >([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = async (uniqueId: string) => {
    setLoadingTree(true);
    setSelectedUserId(uniqueId);

    try {
      const [user, tree] = await Promise.all([
        getUserByUniqueId(uniqueId),
        getReferralTree(uniqueId),
      ]);
      const refereeIds = tree.map((r) => r.refereeId);
      const allUsers: User[] = await getUsersByIds(refereeIds);

      const grouped = tree.reduce((acc, referral) => {
        const foundUser = allUsers.find(
          (u) => u.uniqueId === referral.refereeId
        );
        if (!foundUser) return acc;

        const levelGroup = acc.find((group) => group.level === referral.level);
        const userWithFormattedDate = {
          id: foundUser._id || foundUser.uniqueId,
          name: foundUser.name,
          uniqueId: foundUser.uniqueId,
          createdAt:
            foundUser.createdAt instanceof Date
              ? foundUser.createdAt.toISOString()
              : foundUser.createdAt,
          balance: foundUser.balance,
          email: foundUser.email,
        };

        if (levelGroup) {
          levelGroup.users.push(userWithFormattedDate);
        } else {
          acc.push({
            level: referral.level,
            users: [userWithFormattedDate],
          });
        }

        return acc;
      }, [] as { level: number; users: TeamMember[] }[]);
      setSelectedUser(user);
      setReferralTree(grouped);
      setActiveLevel(null);
    } catch (error) {
      console.error("Error fetching referral tree:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoadingTree(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uniqueId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Tracking</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <UserList
              users={paginatedUsers}
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPageChange={setCurrentPage}
              onUserSelect={handleUserSelect}
            />
          </CardContent>
        </Card>

        {selectedUser && (
          <TeamModal
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            user={selectedUser}
            referralTree={referralTree}
            loadingTree={loadingTree}
            activeLevel={activeLevel}
            onLevelChange={setActiveLevel}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminReferrals;
