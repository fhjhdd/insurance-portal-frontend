
import { getStoredUser } from './storage';

// Import services
import { 
  getUsers as getUsersService, 
  getPendingUsers as getPendingUsersService,
  getUserById as getUserByIdService, 
  getUserByEmail as getUserByEmailService,
  getUserByUniqueId as getUserByUniqueIdService, 
  blockUser as blockUserService,
  unblockUser as unblockUserService,
  approveUser as approveUserService,
  rejectUser as rejectUserService,
  resetUserPassword as resetUserPasswordService,
  reactivateUser as reactivateUserService,
  getDashboardStats as getDashboardStatsService ,
  addUser as addUserService ,
  getUsersByIds as getUsersByIdsService
} from './users';

import { 
  getAllWithdrawals as getAllWithdrawalsService, 
  getWithdrawalsByUserId as getWithdrawalsByUserIdService, 
  getPendingWithdrawals as getPendingWithdrawalsService,
  requestWithdrawal as requestWithdrawalService, 
  approveWithdrawal as approveWithdrawalService,
  rejectWithdrawal as rejectWithdrawalService 
} from './withdrawals';

import { 
  getReferralsByUserId as getReferralsByUserIdService, 
  getReferralsByReferrerId as getReferralsByReferrerIdService, 
  getReferralTree as getReferralTreeService 
} from './referrals';

import { 
  getCommissionsByUserId 
} from './commissions';

// Users
export const getUsers = getUsersService;
export const getPendingUsers = getPendingUsersService;
export const getUserById = getUserByIdService;
export const getUserByEmail = getUserByEmailService;
export const getUserByUniqueId = getUserByUniqueIdService;

// User management
export const blockUser = blockUserService;
export const unblockUser = unblockUserService;
export const approveUser = approveUserService;
export const rejectUser = rejectUserService;
export const resetUserPassword = resetUserPasswordService;
export const reactivateUser = reactivateUserService;

// Withdrawals
export const getAllWithdrawals = getAllWithdrawalsService;
export const getWithdrawalsByUserId = getWithdrawalsByUserIdService;
export const getPendingWithdrawals = getPendingWithdrawalsService;
export const requestWithdrawal = requestWithdrawalService;
export const approveWithdrawal = approveWithdrawalService;
export const rejectWithdrawal = rejectWithdrawalService;

// Referrals
export const getReferralsByUserId = getReferralsByUserIdService;
export const getReferralsByReferrerId = getReferralsByReferrerIdService;
export const getReferralTree = getReferralTreeService;

// Dashboard stats
export const getDashboardStats = getDashboardStatsService;



//add user
export const addUser = addUserService;
export const getUsersByIds = getUsersByIdsService
// Get user team stats
export const getTeamStats = async (userId: string) => {
  try {
    const [directReferrals, indirectReferrals, commissions] = await Promise.all([
      getReferralsByReferrerId(userId),
      getReferralsByReferrerId(userId),
      getCommissionsByUserId(userId)
    ]);
    
    const teamSize = directReferrals.length + indirectReferrals.length;
    const activeTeamMembers = directReferrals.filter(ref => ref.refereeId !== '').length;
    const totalEarnings = commissions.reduce((sum, commission) => sum + commission.amount, 0);
    
    const currentUser = await getUserById(userId);
    const pendingWithdrawal = 0; // This would come from a withdrawal service
    const totalWithdrawn = currentUser?.totalWithdrawals || 0;
    
    return {
      teamSize,
      activeTeamMembers,
      totalEarnings,
      pendingWithdrawal,
      totalWithdrawn
    };
  } catch (error) {
    console.error('Error getting team stats:', error);
    throw error;
  }
};

export const getRecentReferrals = async (userId: string) => {
  try {
    const [directReferrals, indirectReferrals] = await Promise.all([
      getReferralsByReferrerId(userId),
      getReferralsByReferrerId(userId)
    ]);
    
    const allReferrals = [...directReferrals, ...indirectReferrals]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
      
    return allReferrals;
  } catch (error) {
    console.error('Error getting recent referrals:', error);
    throw error;
  }
};

// Protected route check
export const checkAuthStatus = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getStoredUser();
      resolve(!!user);
    }, 500);
  });
};
