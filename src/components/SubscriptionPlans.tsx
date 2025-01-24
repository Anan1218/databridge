'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Stripe price IDs
const PRICE_IDS = {
  trial: process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID!,
  monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
} as const;

const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export default function SubscriptionPlans() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();

  const handlePlanSelect = async (planType: 'trial' | 'monthly' | 'yearly') => {
    if (!user) {
      router.push('/signin?return_to=subscribe');
      return;
    }

    setError(null);
    setLoading(true);

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

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create subscription');
      if (!data.sessionId) throw new Error('No session ID returned from server');

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Failed to load Stripe');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* Free Trial Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800">Free Trial</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-indigo-600">$0</span>
              <span className="text-gray-500">/3 days</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-600 text-sm">Try Premium Features!</span>
            </div>
            <ul className="mt-8 space-y-4 text-gray-600">
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
            className="mt-8 w-full bg-transparent border-2 border-indigo-600 text-indigo-600 rounded-lg py-3 px-4 hover:bg-indigo-600 hover:text-white transition-all"
          >
            Start Free Trial
          </button>
        </div>

        {/* Monthly Plan */}
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-600 flex flex-col justify-between transform scale-105 relative shadow-lg">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800">Monthly</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-indigo-600">$5</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="mt-8 space-y-4 text-gray-600">
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
            className="mt-8 w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700 transition-all"
          >
            Get Started Monthly
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800">Yearly</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-indigo-600">$50</span>
              <span className="text-gray-500">/year</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-600 text-sm">Get 2 Months Free!</span>
            </div>
            <ul className="mt-8 space-y-4 text-gray-600">
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
            className="mt-8 w-full bg-transparent border-2 border-indigo-600 text-indigo-600 rounded-lg py-3 px-4 hover:bg-indigo-600 hover:text-white transition-all"
          >
            Get Started Yearly
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            Processing...
          </div>
        </div>
      )}
    </>
  );
} 