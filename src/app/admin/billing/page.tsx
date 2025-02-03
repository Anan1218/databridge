'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export default function BillingPage() {
  const { userData } = useAuthContext();

  return (
    <div id="pricing" className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 -mt-10">
          <h2 className="text-3xl font-medium text-gray-900">Simple, Affordable Pricing</h2>
          <p className="text-neutral-700 mt-2 font-normal">Choose the plan that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-gray-600">Contact us for pricing</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Perfect for small teams</p>
            <button 
              className="w-full bg-[#8b5cf6] text-white rounded-lg py-2.5 mb-6 hover:bg-[#7c3aed] transition-colors"
            >
              Contact Sales
            </button>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Basic lead generation
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 5 data sources
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                1 workspace
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Email support
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#faf5ff] rounded-2xl p-6 border-[1px] border-[#8b5cf6] relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#8b5cf6] text-white px-3 py-1 rounded-full text-sm">
              Most popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-gray-600">Contact us for pricing</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">For growing businesses</p>
            <button 
              className="w-full bg-[#8b5cf6] text-white rounded-lg py-2.5 mb-6 hover:bg-[#7c3aed] transition-colors"
            >
              Contact Sales
            </button>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Advanced lead generation
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Autorespond to leads
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited data sources
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Multiple workspaces
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited team members
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                24/7 Priority support
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom integrations
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gradient-to-b from-purple-50 to-blue-50 rounded-2xl p-6 border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-gray-600">Enterprise pricing</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Enterprise-grade solution</p>
            <button 
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 mb-6 hover:bg-blue-700 transition-colors"
            >
              Contact Sales
            </button>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Everything in Pro
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom API integration
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Support ticket integration
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom data sources
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Dedicated account manager
              </li>
              <li className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom SLA
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 