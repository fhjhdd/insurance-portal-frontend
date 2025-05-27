
import { Referral, User } from '@/types';
import { mockReferrals, mockUsers } from './mockData';
import { apiRequest } from './apiClient';

export const getReferralsByUserId = async (uniqueId: string): Promise<Referral[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referrals = mockReferrals.filter(r => r.referrerId === uniqueId);
      resolve(referrals);
    }, 500);
  });
};

// Adding the missing function that's being imported in api.ts
export const getReferralsByReferrerId = async (referrerId: string): Promise<Referral[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referrals = mockReferrals.filter(r => r.referrerId === referrerId);
      resolve(referrals);
    }, 500);
  });
};

export const getReferralTree = async (
  uniqueId: string
): Promise<Referral[]> => {
  return await apiRequest<Referral[]>(`/users/referrals/specificUserTeamData/${uniqueId}`);
};
