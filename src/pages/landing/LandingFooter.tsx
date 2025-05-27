
import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => (
  <footer className="bg-secondary text-white py-12 px-6">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">TeamBoost</h3>
          <p className="text-gray-300">
            Building stronger teams and rewarding connections.
          </p>
        </div>
      
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <p className="text-gray-300">
            Email: support@TeamBoost.com<br />
            Phone: +1 234 567 890
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} TeamBoost. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
