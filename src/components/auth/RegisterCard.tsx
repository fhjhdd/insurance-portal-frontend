
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegisterForm } from './RegisterForm';
import type { RegisterFormValues } from '@/validations/registerSchema';

interface RegisterCardProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  formError: string | null;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
  onSubmit,
  isLoading,
  formError,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">TeamBoost</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              formError={formError}
            />
          </CardContent>
          <CardFooter className="flex justify-center flex-wrap">
            <p className="text-sm text-center text-gray-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
