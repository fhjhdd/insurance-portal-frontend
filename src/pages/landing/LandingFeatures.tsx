
import React from 'react';
import { Users as UsersIcon, Wallet, CreditCard } from 'lucide-react';

const LandingFeatures = () => (
  <section className="bg-gray-50 py-16 px-6 md:py-24">
    <div className="container mx-auto max-w-6xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose TeamBoost?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <UsersIcon className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Build Your Team</h3>
          <p className="text-gray-600">
            Create a powerful network of connections and grow your team with our easy-to-use platform.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <Wallet className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
          <p className="text-gray-600">
            Get rewarded for growing your team. Earn from multiple connection levels.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Easy Withdrawals</h3>
          <p className="text-gray-600">
            Withdraw your earnings with ease using your preferred payment method.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default LandingFeatures;
