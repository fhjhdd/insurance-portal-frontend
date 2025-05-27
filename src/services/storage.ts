
import { AuthUser } from '@/types';

export const getStoredUser = (): AuthUser | null => {
  try {
    const storedUser = localStorage.getItem('refferx_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to get stored user:', error);
    return null;
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem('refferx_user');
  localStorage.removeItem('refferx_requires_otp');
};
