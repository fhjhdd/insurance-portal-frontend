import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getTeamStats, getRecentReferrals } from "@/services/api";
import { getReferralTree, addUser, getUsersByIds } from "@/services/api";
import {
  Users,
  BadgeDollarSign,
  DollarSign,
  Trophy,
  Clock,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getUserById } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthUser } from "@/types";
import type { User } from "@/types";

interface TeamMember {
  id: string;
  name: string;
  uniqueId: string;
  createdAt: string | Date;
}
const UserDashboard = () => {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState({
    teamSize: 0,
    activeTeamMembers: 0,
    totalEarnings: 0,
    pendingWithdrawal: 0,
    totalWithdrawn: 0,
  });
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          const referrals = await getReferralTree(user.uniqueId);
          const refereeIds = referrals.map((r) => r.refereeId);
          const allUsers: User[] = await getUsersByIds(refereeIds);
          const latestMembers = allUsers
            .filter((u) => !!u.createdAt)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5) // take top 5
            .map((user) => ({
              id: user._id || user.uniqueId,
              name: user.name,
              uniqueId: user.uniqueId,
              email: user.email,
              createdAt: new Date(user.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }), // e.g., "20 May 2025"
              isApproved: user.isApproved,
              balance: user.balance ?? 0,
            }));
          console.log("Latest Team Members:", latestMembers);
          setRecentReferrals(latestMembers)
          const apiUser = await getUserById(user.id);
          const updatedUser: AuthUser = {
            id: apiUser.id,
            email: apiUser.email,
            name: apiUser.name,
            uniqueId: apiUser.uniqueId,
            isAdmin: apiUser.isAdmin ?? false,
            isVerified: apiUser.isVerified,
            isApproved: apiUser.isApproved,
            isBlocked: apiUser.isBlocked,
            isExpired: apiUser.isExpired,
            expiryDate: apiUser.expiryDate
              ? new Date(apiUser.expiryDate)
              : undefined,
            balance: apiUser.balance ?? 0,
          };
          setUser(updatedUser);
        } catch (error) {
          console.error("Error loading dashboard data", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
  }, []);

  const getDaysUntilExpiry = (expiryDate?: Date): number | null => {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const handleWithdrawalClick = () => {
    if (user?.isExpired) {
      // Show a toast message instead of navigating
      // Use the native alert since we don't want to add toast functionality here
      alert(
        "Your account has expired. Please contact an administrator to reactivate your account before making withdrawals."
      );
      return;
    }
    navigate("/withdrawal");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-56">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {user?.isExpired && (
          <Alert className="bg-red-50 border-red-200 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">Account Expired</AlertTitle>
            <AlertDescription className="text-red-600">
              Your account has expired. You cannot make withdrawals or recruit
              new members until your account is reactivated by an administrator.
            </AlertDescription>
          </Alert>
        )}

        {user?.expiryDate &&
          !user?.isExpired &&
          getDaysUntilExpiry(user.expiryDate)! <= 14 && (
            <Alert className="bg-yellow-50 border-yellow-200 mb-4">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-700">
                Account Expiring Soon
              </AlertTitle>
              <AlertDescription className="text-yellow-600">
                Your account will expire in{" "}
                {getDaysUntilExpiry(user.expiryDate)} days on{" "}
                {new Date(user.expiryDate).toLocaleDateString()}. Please contact
                an administrator for reactivation.
              </AlertDescription>
            </Alert>
          )}

        <div className="grid gap-4 md:grid-cols-3">
          {/* <StatCard 
            title="Team Size" 
            value={stats.teamSize} 
            icon={<Users size={20} />}
          />
          <StatCard 
            title="Total Earnings" 
            value={`$${stats.totalEarnings.toFixed(2)}`} 
            icon={<BadgeDollarSign size={20} />} 
          /> */}
          <StatCard
            title="Available Balance"
            value={`$${user?.balance.toFixed(2) || "0.00"}`}
            icon={<DollarSign size={20} />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Team Activity</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                  onClick={() => navigate("/team")}
                >
                  View All
                </Button>
              </div>
              <CardDescription>
                Latest members who joined your team
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentReferrals.length === 0 ? (
                <div className="text-center py-8 px-6">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No team members yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Share your referral link to grow your team
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">
                          {referral.name}
                        </TableCell>
                       
                        <TableCell>
                          {referral.createdAt}
                        </TableCell>
                        <TableCell>
                          {referral.isApproved ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy size={18} className="text-amber-500 mr-2" />
                    <span className="font-medium">Your Unique ID</span>
                  </div>
                  <span className="font-mono bg-white px-3 py-1 border rounded text-sm">
                    {user?.uniqueId}
                  </span>
                </div>
              </div>

              {user?.expiryDate && (
                <div
                  className={`p-4 rounded-md flex items-center ${
                    user?.isExpired
                      ? "bg-red-50"
                      : getDaysUntilExpiry(user.expiryDate)! <= 14
                      ? "bg-yellow-50"
                      : "bg-blue-50"
                  }`}
                >
                  <Calendar
                    size={18}
                    className={`mr-3 ${
                      user?.isExpired
                        ? "text-red-500"
                        : getDaysUntilExpiry(user.expiryDate)! <= 14
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm">Account Expires:</div>
                    <div
                      className={`text-sm ${
                        user?.isExpired
                          ? "text-red-600"
                          : getDaysUntilExpiry(user.expiryDate)! <= 14
                          ? "text-yellow-600 font-medium"
                          : "text-blue-600"
                      }`}
                    >
                      {user?.isExpired
                        ? "EXPIRED"
                        : new Date(user.expiryDate).toLocaleDateString()}

                      {!user?.isExpired && (
                        <span className="ml-2">
                          ({getDaysUntilExpiry(user.expiryDate)} days remaining)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 pb-0 px-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handleWithdrawalClick}
                disabled={user?.isExpired}
                title={
                  user?.isExpired
                    ? "Account expired - withdrawals disabled"
                    : "Make a withdrawal"
                }
              >
                {user?.isExpired ? "Withdrawals Disabled" : "Withdrawal"}
              </Button>
              <Button variant="default" onClick={() => navigate("/profile")}>
                Profile Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
