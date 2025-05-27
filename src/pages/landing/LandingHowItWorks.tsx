
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: 1,
    title: 'Register Your Account',
    description: 'Sign up with your unique ID from an existing member and complete your verification.',
  },
  {
    number: 2,
    title: 'Build Your Team',
    description: 'Share your unique ID with others to build your team. As they join, your network grows.',
  },
  {
    number: 3,
    title: 'Earn Rewards',
    description: 'Earn rewards from your team\'s activities across multiple levels of connections.',
  },
  {
    number: 4,
    title: 'Withdraw Your Earnings',
    description: 'Request withdrawals through our secure platform and receive your earnings.',
  },
];

const LandingHowItWorks = () => (
  <section className="container mx-auto py-16 px-6 md:py-24">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
      <div className="space-y-8">
        {steps.map(step => (
          <div key={step.number} className="flex flex-col md:flex-row items-start gap-6">
            <div className="bg-primary text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center shrink-0">
              {step.number}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link to="/register">Join TeamBoost Today</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default LandingHowItWorks;
