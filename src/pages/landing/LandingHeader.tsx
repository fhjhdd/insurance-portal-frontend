
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingHeader = () => (
  <header className="w-full py-4 px-6 bg-white shadow-sm">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">TeamBoost</h1>
      </div>
      <div className="space-x-4">
        <Button variant="outline" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </div>
  </header>
);

export default LandingHeader;
