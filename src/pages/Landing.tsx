
import React from 'react';
import LandingHeader from './landing/LandingHeader';
import LandingHero from './landing/LandingHero';
import LandingFeatures from './landing/LandingFeatures';
import LandingHowItWorks from './landing/LandingHowItWorks';
import LandingFooter from './landing/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingFooter />
    </div>
  );
};

export default Landing;
