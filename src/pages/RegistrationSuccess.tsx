
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegistrationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TeamBoost</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Registration Successful</CardTitle>
            <CardDescription className="text-center">
              Your account has been created and is pending approval
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Thank you for registering with TeamBoost! An admin will review your account shortly.
              You'll receive an email notification once your account is approved.
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/login">Go to Login</Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
