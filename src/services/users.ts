import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';
import { apiRequest } from './apiClient';
export interface TeamMember {
  name: string;
  email: string;
  uniqueId: string;
  createdAt: string;
}

export interface LatestTeamMembersResponse {
  success: boolean;
  message: string;
  data: TeamMember[];
}
// Helper to get auth header
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('refferx_token') || ''}`,
});

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  return await apiRequest<User[]>('/users', {
    headers: getAuthHeader(),
  });
};

// Fetch pending users (not approved and not expired)
export const getPendingUsers = async (): Promise<User[]> => {
  return await apiRequest<User[]>('/users/pending', {
    headers: getAuthHeader(),
  });
};

// services/api.ts

export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  return await apiRequest<User[]>('/users/by-ids',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth if needed: ...getAuthHeader()
    },
    body: JSON.stringify({ ids }),
  });
};
// Fetch expired users
export const getExpiredUsers = async (): Promise<User[]> => {
  return await apiRequest<User[]>('/users/expired', {
    headers: getAuthHeader(),
  });
};

export const fetchLatestTeamMembers = async (
  referrerId: string
): Promise<LatestTeamMembersResponse> => {
  try {
    return await apiRequest<LatestTeamMembersResponse>(`/users/team/latest/${referrerId}`, {
      method: 'GET',
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch team members',
      data: [],
    };
  }
};

// Fetch user by ID
export const getUserById = async (userId: string): Promise<User | undefined> => {
  return await apiRequest<User | undefined>(`/users/${userId}`, {
    headers: getAuthHeader(),
  });
};

// Fetch user by uniqueId
export const getUserByUniqueId = async (uniqueId: string): Promise<User | undefined> => {
  return await apiRequest<User | undefined>(`/users/unique/${uniqueId}`, {
    headers: getAuthHeader(),
  });
};


// Fetch user by email
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return await apiRequest<User | undefined>(`/users/email/${email}`, {
    headers: getAuthHeader(),
  });
};

// Approve user by uniqueId
export const approveUser = async (uniqueId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/approve/${uniqueId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return true;
  } catch {
    return false;
  }
};

// Reactivate user (set expiry date and remove expired flag)
export const reactivateUser = async (userId: string, expiryDays: number = 120): Promise<boolean> => {
  try {
    await apiRequest(`/users/reactivate/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ expiryDays }),
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return true;
  } catch {
    return false;
  }
};

// Reject (delete) user by uniqueId
export const rejectUser = async (uniqueId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/reject/${uniqueId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return true;
  } catch {
    return false;
  }
};

// Block user by userId
export const blockUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/block/${userId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return true;
  } catch {
    return false;
  }
};

// Unblock user by userId
export const unblockUser = async (userId: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/unblock/${userId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return true;
  } catch {
    return false;
  }
};

// Reset user password
export const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    await apiRequest(`/users/reset-password/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return true;
  } catch {
    return false;
  }
};

// Add new user
export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  referrerId: string
  // other optional fields like isAdmin, etc.
}): Promise<User> => {
  const userWithId = {
    ...userData,
    uniqueId: uuidv4(), // generate and include uniqueId
  };

  return await apiRequest<User>('/users/add', {
    method: 'POST',
    body: JSON.stringify(userWithId),
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
};

// Get dashboard stats
export const getDashboardStats = async (): Promise<{
  totalUsers: number;
  totalPaidSignups: number;
  totalCommission: number;
  pendingWithdrawals: number;
  totalWithdrawals: number;
}> => {
  return await apiRequest<{
    totalUsers: number;
    totalPaidSignups: number;
    totalCommission: number;
    pendingWithdrawals: number;
    totalWithdrawals: number;
  }>('/dashboard/stats', {
    headers: getAuthHeader(),
  });
};
