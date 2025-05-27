import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthUser } from '@/types';
import { getStoredUser, clearStoredUser } from '@/services/storage';
import { loginUser, verifyOtpCode, registerUser, verifyEmail as verifyEmailService } from '@/services/auth';
import Swal from 'sweetalert2';

export const useAuthentication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string ; status?:any}> => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
  
      if (result.success && result.token && result.user) {
        Swal.fire("Success", "Login successful!", "success");
        navigate('/admin/dashboard');
        return {success:true};
      } else if (result.statusCode === 403) {
        await Swal.fire({
          title: "Access Denied",
          text: result.errorMessage,
          icon: "warning",
          confirmButtonText: "Ok",
        });
        window.location.reload();
         return {success:false , message :result.errorMessage , status:result.statusCode};
      } else if (result.errorMessage) {
        await Swal.fire("Login Failed", result.errorMessage, "error");
       return {success:false , message :result.errorMessage , status:result.statusCode};
      } else {
        await Swal.fire("Login Failed", "Unknown error occurred", "error");
        return {success:false , message :result.errorMessage , status:result.statusCode};
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await verifyOtpCode(email, otp);
      
      if (success) {
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log('User verified successfully:', storedUser);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
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
    clearStoredUser();
    localStorage.removeItem('refferx_impersonating');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    login,
    verifyOtp,
    register,
    verifyEmail,
    logout,
    isLoading
  };
};
