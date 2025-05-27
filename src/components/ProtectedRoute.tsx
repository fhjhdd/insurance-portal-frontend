
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isLoading, isImpersonating, stopImpersonating } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  const requiresOtp = localStorage.getItem('refferx_requires_otp') === 'true';
  if (requiresOtp) {
    console.log('OTP verification required');
    return <Navigate to="/verify-otp" />;
  }

  if (requireAdmin && !user.isAdmin && !isImpersonating) {
    console.log('Admin access required but user is not admin');
    return <Navigate to="/dashboard" />;
  }

  if (user.isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h1>
          <p className="text-gray-600 mb-6">
            Your account has been blocked by an administrator. 
            Please contact support for more information.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/login"}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!user.isApproved && !user.isAdmin && !isImpersonating) {
    return <Navigate to="/pending-approval" />;
  }

  return (
    <>
      {isImpersonating && (
        <Alert className="bg-amber-50 border-amber-200 mb-4">
          <AlertDescription className="flex items-center justify-between text-amber-800">
            <span>You are currently viewing as {user.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={stopImpersonating}
              className="border-amber-300 hover:bg-amber-100"
            >
              <ArrowLeft size={14} className="mr-1" /> Return to Admin
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
