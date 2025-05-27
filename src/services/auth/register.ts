
import { toast } from 'sonner';
import { getUserByUniqueId } from '@/services/users';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  referrerId?: string
): Promise<boolean> => {
  try {
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    if (email !== 'newuser@refferx.com') {
      if (!referrerId) {
        toast.error('Referrer ID is required');
        return false;
      }

      const referrer = await getUserByUniqueId(referrerId);
      if (!referrer) {
        toast.error('Invalid Referrer ID. Please check and try again.');
        return false;
      }

      if (!referrer.isApproved) {
        toast.error('The referrer account is not approved yet');
        return false;
      }
    }

    const uniqueId = 'USER' + Math.floor(1000 + Math.random() * 9000);

    localStorage.setItem('refferx_registration_email', email);
    localStorage.setItem(
      'refferx_registration_data',
      JSON.stringify({
        name,
        email,
        uniqueId,
        referrerId,
        password
      })
    );

    toast.success('Please check your email for the verification code');
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    toast.error('Registration failed. Please try again.');
    return false;
  }
};

export const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    if (otp !== '123456') {
      toast.error('Invalid verification code');
      return false;
    }

    const registrationData = localStorage.getItem('refferx_registration_data');
    if (!registrationData) {
      toast.error('Registration data not found');
      return false;
    }

    toast.success('Account created successfully! Please wait for admin approval.');
    localStorage.removeItem('refferx_registration_email');
    localStorage.removeItem('refferx_registration_data');
    return true;
  } catch (error) {
    console.error('Email verification failed:', error);
    toast.error('Verification failed. Please try again.');
    return false;
  }
};
