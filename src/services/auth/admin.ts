// Mock user type - replace with your actual AuthUser type if available
type User = {
  id: string;
  email: string;
  name: string;
  uniqueId: string;
  isAdmin: boolean;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
};

import type { AuthUser } from '@/types';
import { apiRequest } from '../apiClient';
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('refferx_token') || ''}`,
});
export const impersonateUser = async (
  userId: string
): Promise<{ success: boolean; user: AuthUser | null }> => {
  try {
    console.log(`Impersonating user: ${userId}`);

    const user: AuthUser = {
      id: userId,
      email: 'impersonated@refferx.com',
      name: 'Impersonated User',
      uniqueId: `USER${userId}`,
      isAdmin: false,
      isVerified: true,
      isApproved: true,
      isBlocked: false,
      balance: 0,          // must exist on AuthUser type
      // add any other required properties on AuthUser here
    };

    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('refferx_impersonating', 'true');

    return { success: true, user };
  } catch (error) {
    console.error('Error impersonating user:', error);
    return { success: false, user: null };
  }
};



// Mock stop impersonation function
export const stopImpersonateUser = async (): Promise<{ success: boolean; user: User | null }> => {
  try {
    const adminUser: User = {
      id: '1',
      email: 'admin@refferx.com',
      name: 'Admin User',
      uniqueId: 'ADMIN001',
      isAdmin: true,
      isVerified: true,
      isApproved: true,
      isBlocked: false,
    };

    localStorage.setItem('authUser', JSON.stringify(adminUser));
    localStorage.removeItem('refferx_impersonating');

    return { success: true, user: adminUser };
  } catch (error) {
    console.error('Error stopping impersonation:', error);
    return { success: false, user: null };
  }
};

// Admin action mocks

export const resetPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/reset-password/${userId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });
    return true;
  } catch (error) {
    console.error('Error resetting user password:', error);
    return false;
  }
};

export const blockUserService = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/block/${userId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return true;
  } catch (error) {
    console.error('Error blocking user:', error);
    return false;
  }
};

export const unblockUserService = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/unblock/${userId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return true;
  } catch (error) {
    console.error('Error unblocking user:', error);
    return false;
  }
};

export const approveUserService = async (uniqueId: string, expiryDuration): Promise<boolean> => {
  try {
    await apiRequest(`/users/approve/${uniqueId}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiryDuration }),
    });
    return true;
  } catch {
    return false;
  }
};

export const rejectUserService = async (uniqueId: string): Promise<boolean> => {
  try {
    console.log(`Rejecting user: ${uniqueId}`);
    return true;
  } catch (error) {
    console.error('Error rejecting user:', error);
    return false;
  }
};
