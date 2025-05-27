
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardStats, getPendingWithdrawals, getPendingUsers } from '@/services/api';
// import { StatsSection } from '@/components/admin/dashboard/StatsSection';
import { PendingUsersCard } from '@/components/admin/dashboard/PendingUsersCard';
import { PendingWithdrawalsCard } from '@/components/admin/dashboard/PendingWithdrawalsCard';
import { QuickActionsCard } from '@/components/admin/dashboard/QuickActionsCard';
import { useUserFilter } from '@/hooks/useUserFilter';
import { getUsers, reactivateUser} from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useWithdrawalFilter } from '@/hooks/useWithdrawalFilter';
 import { getAllWithdrawals, approveWithdrawal, rejectWithdrawal, getUserById } from '@/services/api';
 import { Withdrawal } from '@/types';
const AdminDashboard: React.FC = () => {
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPaidSignups: 0,
    totalCommission: 0,
    pendingWithdrawals: 0,
    totalWithdrawals: 0
  });
  const [pendingWithdrawalRequests, setPendingWithdrawalRequests] = useState<any[]>([]);
  const [pendingUserRequests, setPendingUserRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const {  filteredUsers } = useUserFilter(users);
  const { filteredWithdrawals } = useWithdrawalFilter(withdrawals);
  useEffect(() => {
    const fetchDashboardData = async () => {
       const allWithdrawals = await getAllWithdrawals();
      try {
        const [ withdrawals] = await Promise.all([
          // getDashboardStats(),
          getPendingWithdrawals(),
          // getPendingUsers()
        ]);
        
        // setStats(dashboardStats);
        console.log(withdrawals)
        setPendingWithdrawalRequests(withdrawals);
        // setPendingUserRequests(pendingUsers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* <StatsSection stats={stats} /> */}

        <div className="grid gap-6 md:grid-cols-2">
          <PendingUsersCard pendingUsers={filteredUsers.pending} />
          <PendingWithdrawalsCard withdrawals={pendingWithdrawalRequests} />
        </div>

        <QuickActionsCard />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
