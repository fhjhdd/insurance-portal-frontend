import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingHeader = () => (
  <header className="w-full py-4 px-6 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
      <h1 className="text-2xl font-bold text-primary">TeamBoost</h1>
      <div className="flex gap-3 w-full justify-end md:w-auto">
        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild className="w-full md:w-auto">
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </div>
  </header>
);

export default LandingHeader;
