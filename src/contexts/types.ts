
import { AuthUser } from '@/types';

export type AuthContextType = {
  user: AuthUser;
  login: (email: string, password: string) => Promise<boolean>;
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
  approveUser: (uniqueId: string) => Promise<boolean>;
  rejectUser: (uniqueId: string) => Promise<boolean>;
};
