
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('refferx_registration_email');
    if (!storedEmail) {
      navigate('/register');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await verifyEmail(email, otp);
      if (success) {
        navigate('/registration-success');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    setCountdown(60);
    // In a real app, you would call an API to resend the OTP
    // For demo purposes, just show a message
    alert('OTP code has been resent to your email. For demo, use 123456.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RefferX</h1>
          <p className="mt-2 text-gray-600">Email Verification</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to <span className="font-medium">{email}</span>.
              Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg"
                  required
                />
                <p className="text-xs text-center text-gray-500">
                  For demo purposes, use code: 123456
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                  >
                    {resendDisabled 
                      ? `Resend in ${countdown}s` 
                      : 'Resend'
                    }
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
