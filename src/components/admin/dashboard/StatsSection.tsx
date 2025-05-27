
import React from 'react';
import StatCard from '@/components/StatCard';
import { Users, UserPlus, TrendingUp, Wallet } from 'lucide-react';

interface StatsSectionProps {
  stats: {
    totalUsers: number;
    totalPaidSignups: number;
    totalCommission: number;
    totalWithdrawals: number;
  };
}

// export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <StatCard 
//         title="Total Users" 
//         value={stats.totalUsers} 
//         icon={<Users size={20} />} 
//       />
//       <StatCard 
//         title="Paid Signups" 
//         value={stats.totalPaidSignups} 
//         icon={<UserPlus size={20} />} 
//       />
//       <StatCard 
//         title="Total Commission" 
//         value={`$${stats.totalCommission.toFixed(2)}`} 
//         icon={<TrendingUp size={20} />} 
//       />
//       <StatCard 
//         title="Total Withdrawals" 
//         value={`$${stats.totalWithdrawals.toFixed(2)}`} 
//         icon={<Wallet size={20} />} 
//       />
//     </div>
//   );
// };
