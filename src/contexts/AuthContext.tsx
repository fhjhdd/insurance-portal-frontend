import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '@/types';
import {
  loginUser,
  verifyOtpCode,
  registerUser,
  verifyEmail as verifyEmailService,
  impersonateUser,
  stopImpersonateUser,
  resetPassword,
  blockUserService,
  unblockUserService,
  approveUserService,
  rejectUserService
} from '@/services/auth'; // Adjust imports as per your API

export type AuthContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string ; status?:any}>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, referrerId?: string) => Promise<boolean>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  isLoading: boolean;
  isImpersonating: boolean;
  impersonate: (userId: string) => Promise<boolean>;
  stopImpersonating: () => Promise<boolean>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  approveUser: (uniqueId: string,expiryDays:any) => Promise<boolean>;
  rejectUser: (uniqueId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const impersonatingFlag = localStorage.getItem('refferx_impersonating') === 'true';
    setIsImpersonating(impersonatingFlag);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string ; status?:any}> => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result?.token && result.user) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('authUser', JSON.stringify(result.user));
        setUser(result.user);
        setIsImpersonating(false);
        return { success: true };
      }
       return { success: false, message: result.errorMessage || 'Login failed.' , status : result.statusCode };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await verifyOtpCode(email, otp);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, referrerId?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await registerUser(name, email, password, referrerId);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await verifyEmailService(email, otp);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refferx_impersonating');
    setUser(null);
    setIsImpersonating(false);
  };

  const impersonate = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await impersonateUser(userId);  // result is { success, user }
      if (result.success && result.user) {
        localStorage.setItem('authUser', JSON.stringify(result.user));
        localStorage.setItem('refferx_impersonating', 'true');
        setUser(result.user);  // <-- ONLY pass the user, NOT the whole result object
        setIsImpersonating(true);
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
      // Usually you reload original user data here, e.g. from your backend or local storage
      localStorage.removeItem('refferx_impersonating');
      // Reload original user - for example, fetch from API or local storage
      const originalUser = JSON.parse(localStorage.getItem('authUser') || 'null');
      setUser(originalUser);
      setIsImpersonating(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await resetPassword(userId, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await blockUserService(userId);
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await unblockUserService(userId);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (uniqueId: string,expiryDays:any): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await approveUserService(uniqueId,expiryDays);
    } finally {
      setIsLoading(false);
    }
  };

  const rejectUser = async (uniqueId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await rejectUserService(uniqueId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        verifyOtp,
        logout,
        register,
        verifyEmail,
        isLoading,
        isImpersonating,
        impersonate,
        stopImpersonating,
        resetUserPassword,
        blockUser,
        unblockUser,
        approveUser,
        rejectUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};