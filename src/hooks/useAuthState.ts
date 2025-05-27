
import { useState, useEffect } from 'react';
import { AuthUser } from '@/types';
import { getStoredUser } from '@/services/storage';
import { useAuthentication } from './useAuthentication';
import { useAdminActions } from './useAdminActions';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuthentication();
  const adminActions = useAdminActions();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          adminActions.setIsImpersonating(localStorage.getItem('refferx_impersonating') === 'true');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isLoading: isLoading || auth.isLoading || adminActions.isLoading,
    isImpersonating: adminActions.isImpersonating,
    login: auth.login,
    verifyOtp: auth.verifyOtp,
    logout: () => {
      setUser(null);
      adminActions.setIsImpersonating(false);
      auth.logout();
    },
    register: auth.register,
    verifyEmail: auth.verifyEmail,
    impersonate: adminActions.impersonate,
    stopImpersonating: adminActions.stopImpersonating,
    resetUserPassword: adminActions.resetUserPassword,
    blockUser: adminActions.blockUser,
    unblockUser: adminActions.unblockUser,
    approveUser: adminActions.approveUser,
    rejectUser: adminActions.rejectUser
  };
};
