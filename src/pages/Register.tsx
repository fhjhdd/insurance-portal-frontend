
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterCard } from '@/components/auth/RegisterCard';
import type { RegisterFormValues } from '@/validations/registerSchema';
import { toast } from 'sonner';
import { addUser } from '@/services/api';
const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    setIsLoading(true);
    const userObjRegister = {
      name: data.name,
      email: data.email,
      password: data.password,
      referrerId: data.referrerId
    }
    try {
      const success = await addUser(userObjRegister)
      if (success) {
        navigate('/login');
      }else{
        console.log(success)
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error instanceof Error ? error.message : 'An error occurred during registration');
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterCard
      onSubmit={onSubmit}
      isLoading={isLoading}
      formError={formError}
    />
  );
};

export default Register;
