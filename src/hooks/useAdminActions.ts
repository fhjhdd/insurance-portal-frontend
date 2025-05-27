import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  impersonateUser,
  stopImpersonation,
  adminResetUserPassword,
  adminBlockUser,
  adminUnblockUser,
  adminApproveUser,
  adminRejectUser
} from '@/services/auth';

export const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const navigate = useNavigate();

  const impersonate = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await impersonateUser(userId);
      if (result.success && result.user) {
        setIsImpersonating(true);
        navigate('/dashboard');
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const stopImpersonating = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await stopImpersonation();
      if (result.success && result.user) {
        setIsImpersonating(false);
        navigate('/admin/dashboard');
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await adminResetUserPassword(userId, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await adminBlockUser(userId);
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await adminUnblockUser(userId);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (uniqueId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await adminApproveUser(uniqueId);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectUser = async (uniqueId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await adminRejectUser(uniqueId);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isImpersonating,
    setIsImpersonating,
    impersonate,
    stopImpersonating,
    resetUserPassword,
    blockUser,
    unblockUser,
    approveUser,
    rejectUser,
    isLoading
  };
};
