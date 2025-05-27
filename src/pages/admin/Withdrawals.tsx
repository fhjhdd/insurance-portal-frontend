
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useWithdrawalFilter } from '@/hooks/useWithdrawalFilter';
import { getAllWithdrawals, approveWithdrawal, rejectWithdrawal, getUserById } from '@/services/api';
import PendingWithdrawalsTable from '@/components/admin/withdrawals/PendingWithdrawalsTable';
import ProcessedWithdrawalsTable from '@/components/admin/withdrawals/ProcessedWithdrawalsTable';
import { Withdrawal } from '@/types';

const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [withdrawalUser, setWithdrawalUser] = useState<any>(null);
  const [processingAction, setProcessingAction] = useState(false);
  
  const { searchQuery, setSearchQuery, filteredWithdrawals } = useWithdrawalFilter(withdrawals);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const allWithdrawals = await getAllWithdrawals();
        setWithdrawals(allWithdrawals);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleViewDetails = async (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectionNote('');
    
    try {
      const userDetails = await getUserById(withdrawal.recipientId);
      setWithdrawalUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setWithdrawalUser(null);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    setProcessingAction(true);
    try {
      const success = await approveWithdrawal(withdrawalId);
      if (success) {
        toast.success('Withdrawal approved successfully');
        window.location.reload()
        setWithdrawals((prevWithdrawals) =>
          prevWithdrawals.map((w) =>
            w.id === withdrawalId ? { ...w, status: 'approved', processedAt: new Date() } : w
          )
        );
      } else {
        toast.error('Failed to approve withdrawal');
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error('An error occurred while approving withdrawal');
    } finally {
      setProcessingAction(false);
      setSelectedWithdrawal(null);
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: string) => {
    setRejectionNote('Withdrawal request rejected');
    setProcessingAction(true);
    try {
      const success = await rejectWithdrawal(withdrawalId, rejectionNote);
      if (success) {
        toast.success('Withdrawal rejected successfully');
         window.location.reload()
        setWithdrawals((prevWithdrawals) =>
          prevWithdrawals.map((w) =>
            w.id === withdrawalId ? { 
              ...w, 
              status: 'rejected',
              notes: rejectionNote,
              processedAt: new Date() 
            } : w
          )
        );
      } else {
        toast.error('Failed to reject withdrawal');
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast.error('An error occurred while rejecting withdrawal');
    } finally {
      setProcessingAction(false);
      setSelectedWithdrawal(null);
      setRejectionNote('');
    }
  };

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
          <h1 className="text-2xl font-bold">Withdrawal Management</h1>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by withdrawal ID or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="relative">
              Pending Requests
              {filteredWithdrawals.pending.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                  {filteredWithdrawals.pending.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="processed">Processed Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Withdrawal Requests</CardTitle>
                <CardDescription>
                  Review and process pending withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PendingWithdrawalsTable
                  withdrawals={filteredWithdrawals.pending}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApproveWithdrawal}
                  onReject={handleRejectWithdrawal}
                  withdrawalUser={withdrawalUser}
                  selectedWithdrawal={selectedWithdrawal}
                  processingAction={processingAction}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Processed Withdrawals</CardTitle>
                <CardDescription>
                  History of processed withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcessedWithdrawalsTable
                  withdrawals={filteredWithdrawals.processed}
                  onViewDetails={handleViewDetails}
                  withdrawalUser={withdrawalUser}
                  selectedWithdrawal={selectedWithdrawal}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminWithdrawals;
