'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

// Stripe price IDs (get these from your Stripe dashboard)
const PRICE_IDS = {
  trial: process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID!,
  monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
} as const;

// Checkmark icon component
const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export default function SubscribePage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const handlePlanSelect = async (planType: 'trial' | 'monthly' | 'yearly') => {
    if (!user) {
      router.push('/signup?return_to=subscribe');
      return;
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICE_IDS[planType],
          userId: user.uid,
          email: user.email,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Simple, Affordable Pricing</h2>
          <p className="mt-4 text-xl text-gray-400">Choose the plan that works best for you</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Free Trial Plan */}
          <div className="bg-[#1a1f37] rounded-2xl p-8 border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-center">Free Trial</h3>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-[#8b5cf6]">$0</span>
                <span className="text-gray-400">/3 days</span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-green-500 text-sm">Try Premium Features!</span>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckIcon />
                  Full Platform Access
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  All Features Included
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  No Credit Card Required
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanSelect('trial')}
              className="mt-8 w-full bg-transparent border-2 border-[#8b5cf6] text-white rounded-lg py-3 px-4 hover:bg-[#8b5cf6] hover:bg-opacity-90 transition-all"
            >
              Start Free Trial
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-[#1a1f37] rounded-2xl p-8 border border-[#8b5cf6] flex flex-col justify-between transform scale-105 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-[#8b5cf6] text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-center">Monthly</h3>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-[#8b5cf6]">$5</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckIcon />
                  Full Platform Access
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  All Features Included
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Cancel Anytime
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanSelect('monthly')}
              className="mt-8 w-full bg-[#8b5cf6] text-white rounded-lg py-3 px-4 hover:bg-opacity-90 transition-all"
            >
              Get Started Monthly
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-[#1a1f37] rounded-2xl p-8 border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-center">Yearly</h3>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-[#8b5cf6]">$50</span>
                <span className="text-gray-400">/year</span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-green-500 text-sm">Get 2 Months Free!</span>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckIcon />
                  Full Platform Access
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  24/7 Support
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  All Features Included
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Priority Support
                </li>
              </ul>
            </div>
            <button
              onClick={() => handlePlanSelect('yearly')}
              className="mt-8 w-full bg-transparent border-2 border-[#8b5cf6] text-white rounded-lg py-3 px-4 hover:bg-[#8b5cf6] hover:bg-opacity-90 transition-all"
            >
              Get Started Yearly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 