'use client';

import { useState } from 'react';

export default function PricingPage() {
  return (
    <div className="py-12 px-4">
      {/* Value Proposition Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">
          Simple, Affordable Pricing
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Choose the plan that works best for you
        </p>
        
        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-lg border-2 border-transparent hover:border-indigo-500 transition-all">
            <div className="text-2xl font-bold mb-2">Monthly</div>
            <div className="text-4xl font-bold text-indigo-500 mb-4">$5<span className="text-lg text-gray-400">/month</span></div>
            <ul className="text-gray-400 space-y-3 mb-6">
              <li>✓ Full Platform Access</li>
              <li>✓ 24/7 Support</li>
              <li>✓ All Features Included</li>
              <li>✓ Cancel Anytime</li>
            </ul>
            <button className="w-full py-3 px-4 rounded-lg text-center font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Get Started Monthly
            </button>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border-2 border-indigo-500">
            <div className="text-2xl font-bold mb-2">Yearly</div>
            <div className="text-4xl font-bold text-indigo-500 mb-4">$50<span className="text-lg text-gray-400">/year</span></div>
            <div className="text-green-500 text-sm mb-4">Get 2 Months Free!</div>
            <ul className="text-gray-400 space-y-3 mb-6">
              <li>✓ Full Platform Access</li>
              <li>✓ 24/7 Support</li>
              <li>✓ All Features Included</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="w-full py-3 px-4 rounded-lg text-center font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Get Started Yearly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 