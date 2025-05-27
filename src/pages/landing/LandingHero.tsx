
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingHero = () => (
  <section className="container mx-auto py-16 px-6 md:py-24">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6">
        Grow Your Team, <span className="text-primary">Multiply</span> Your Rewards
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10">
        Join TeamBoost and unlock the power of team connections. Invite friends, build your network, and earn rewards together.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" asChild>
          <Link to="/register">Start Earning Today</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/login">Member Login</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default LandingHero;
