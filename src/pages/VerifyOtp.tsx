
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [email, setEmail] = useState('');
  const { verifyOtp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('refferx_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmail(parsedUser.email);
    } else {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }

    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyOtp(email, otp);
      if (success) {
        toast.success('OTP verified successfully');
        
        // Remove OTP requirement flag
        localStorage.removeItem('refferx_requires_otp');
        
        // Get the updated user data after OTP verification
        const storedUser = localStorage.getItem('refferx_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Add a small delay to ensure toast is visible
          setTimeout(() => {
            if (parsedUser.isAdmin) {
              navigate('/admin/dashboard');
            } else {
              navigate('/dashboard');
            }
          }, 500);
        }
      } else {
        toast.error('Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    // In production, this would make an API call to resend the OTP
    toast.success('OTP has been resent to your email');
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RefferX</h1>
          <p className="mt-2 text-gray-600">Two-Factor Authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email {email && <strong>{email}</strong>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center py-4">
                <InputOTP 
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  {countdown > 0 ? (
                    <span className="text-gray-400">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-primary hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('refferx_user');
              localStorage.removeItem('refferx_requires_otp');
              navigate('/login');
            }}
            className="text-sm text-gray-600 hover:text-primary"
          >
            ← Back to login
          </button>
        </div>

        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 text-center p-4 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-amber-800 font-medium">Development Mode</p>
            <p className="text-sm text-amber-700">OTP code for testing: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
