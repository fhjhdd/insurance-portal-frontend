import { apiRequest } from '../apiClient';
import { AuthUser } from '@/types';

export const loginUser = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  user: AuthUser | null;
  token?: string;
  errorMessage?: string;
  statusCode?: number;
}> => {
  try {
    const data = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token and user locally for session persistence
    localStorage.setItem('refferx_token', data.token);
    localStorage.setItem('refferx_user', JSON.stringify(data.user));
    
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
   

    const message = error?.message || "Something went wrong";
    const status = error.statusCode

    return {
      success: false,
      user: null,
      errorMessage: message,
      statusCode: status,
    };
  }
};

export const verifyOtpCode = async (email: string, otp: string): Promise<boolean> => {
  try {
    await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('refferx_token') || ''}`,
      },
    });
    // Remove any flags if you have
    localStorage.removeItem('refferx_requires_otp');
    return true;
  } catch (error) {
    console.error('OTP verification failed:', error);
    return false;
  }
};

