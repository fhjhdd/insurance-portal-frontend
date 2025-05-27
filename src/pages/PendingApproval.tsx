
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PendingApproval: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TeamBoost</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Clock className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-center">Account Pending Approval</CardTitle>
            <CardDescription className="text-center">
              Your account is awaiting admin approval
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Thank you for your registration! Your account is currently being reviewed by our administrators.
              </p>
              <p className="text-gray-600">
                Once approved, your account will be active for a specific period set by the administrator.
                You'll be able to access all platform features during this active period.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Status
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;
