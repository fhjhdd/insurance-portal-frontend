
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  restricted = false 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && restricted) {
    const requiresOtp = localStorage.getItem('refferx_requires_otp') === 'true';
    
    if (requiresOtp) {
      return <Navigate to="/verify-otp" />;
    }
    
    if (user.isAdmin) {
      console.log('Redirecting admin to dashboard');
      return <Navigate to="/admin/dashboard" />;
    } else {
      console.log('Redirecting user to dashboard');
      return <Navigate to="/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
