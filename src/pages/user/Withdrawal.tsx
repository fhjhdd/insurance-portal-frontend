
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { getUserByUniqueId, requestWithdrawal, getWithdrawalsByUserId } from '@/services/api';
import { Wallet, CreditCard, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const UserWithdrawal: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'uniqueId' | 'crypto'>('uniqueId');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uniqueId) return;
      
      try {
        const [userDetails, withdrawals] = await Promise.all([
          getUserByUniqueId(user.uniqueId),
          getWithdrawalsByUserId(user.uniqueId)
        ]);
        console.log('User Data:', userDetails);
        setUserData(userDetails);
        setWithdrawalHistory(withdrawals);
        setWithdrawalAddress(user.uniqueId)
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uniqueId) return;
    
    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    
    if (!withdrawalAddress.trim()) {
      toast.error('Please enter a valid withdrawal address');
      return;
    }
    
    if (userData && amount > userData.balance) {
      toast.error('Withdrawal amount exceeds available balance');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const {success,message} = await requestWithdrawal(user.uniqueId, amount, withdrawalMethod, withdrawalAddress);
      
      if (success) {
        toast.success('Withdrawal request submitted successfully');
        
        // Refresh user data and withdrawal history
        const [updatedUser, updatedWithdrawals] = await Promise.all([
          getUserByUniqueId(user.uniqueId),
          getWithdrawalsByUserId(user.uniqueId)
        ]);
        
        setUserData(updatedUser);
        setWithdrawalHistory(updatedWithdrawals);
        setWithdrawalAmount('');
        setWithdrawalAddress('');
      }else{
        toast.error(message);
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check size={16} className="text-green-500" />;
      case 'rejected':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
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
          <h1 className="text-2xl font-bold">Withdrawal</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet size={20} className="mr-2" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>
                Withdraw your earned rewards to your preferred method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Balance</Label>
                  <div className="text-2xl font-bold">${userData?.balance.toFixed(2)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawalMethod">Withdrawal Method</Label>
                  <RadioGroup 
                    value={withdrawalMethod} 
                    onValueChange={(value) => setWithdrawalMethod(value as 'uniqueId' | 'crypto')}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uniqueId" id="uniqueId" />
                      <Label htmlFor="uniqueId" className="flex items-center cursor-pointer">
                        <CreditCard size={16} className="mr-2 text-gray-500" />
                        Unique ID Transfer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <RadioGroupItem value="crypto" id="crypto" /> */}
                      {/* <Label htmlFor="crypto" className="flex items-center cursor-pointer">
                        <Wallet size={16} className="mr-2 text-gray-500" />
                        Crypto (USDT TRC-20)
                      </Label> */}
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawalAddress">
                    {withdrawalMethod === 'uniqueId' ? 'Recipient Unique ID' : 'USDT TRC-20 Address'}
                  </Label>
                  <Input 
                    id="withdrawalAddress" 
                    value={userData.uniqueId}
                    // onChange={(e) => setWithdrawalAddress(e.target.value)}
                    placeholder={withdrawalMethod === 'uniqueId' ? 'e.g., USER001' : 'Enter USDT TRC-20 address'}
                    disabled={true}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawalAmount">Amount ($)</Label>
                  <Input 
                    id="withdrawalAmount" 
                    type="number"
                    min="10"
                    step="0.01"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                  <p className="text-xs text-gray-500">Minimum withdrawal: $10.00</p>
                </div>
              
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitting || !userData || userData.balance <= 0 || userData.isExpired}
                >
                  {submitting ? 'Processing...' : 'Request Withdrawal'}
                </Button>
                
                {userData && userData.balance <= 0 && (
                  <p className="text-xs text-center text-red-500">
                    Insufficient balance for withdrawal
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                Track the status of your withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawalHistory.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard size={40} className="mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">No Withdrawals Yet</h3>
                  <p className="text-gray-500 mt-1">
                    Your withdrawal history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawalHistory.map((withdrawal) => (
                    <div 
                      key={withdrawal.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                    >
                      <div>
                        <div className="flex items-center">
                          {getStatusIcon(withdrawal.status)}
                          <span className="ml-2 font-medium">
                            ${withdrawal.amount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          via {withdrawal.method === 'uniqueId' ? 'Unique ID' : 'Crypto'} • {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </p>
                        {withdrawal.notes && (
                          <p className="text-sm text-red-500 mt-1">{withdrawal.notes}</p>
                        )}
                      </div>
                      <div>
                        <span 
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : withdrawal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserWithdrawal;
