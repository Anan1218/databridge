'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Stripe price IDs
const PRICE_IDS = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
} as const;

const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export default function SubscriptionPlans({ userData, loading }: { userData: any; loading: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'monthly' | 'yearly' | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!userData?.subscription) return;
    
    if (userData.subscription?.subscriptionStatus === 'active') {
      setCurrentPlan(userData.subscription.interval || null);
    }
  }, [userData]);

  const handlePlanSelect = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      router.push('/signin?return_to=subscribe');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/subscriptions/create-subscription', {
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
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-gray-100 p-2 rounded-full">
          <span 
            className={`px-4 py-2 rounded-full cursor-pointer text-sm transition-colors ${
              !isPremium ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
            }`}
            onClick={() => setIsPremium(false)}
          >
            Monthly
          </span>
          <span 
            className={`px-4 py-2 rounded-full cursor-pointer text-sm transition-colors ${
              isPremium ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
            }`}
            onClick={() => setIsPremium(true)}
          >
            Yearly
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full">
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800">Free</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-indigo-600">$0.00</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-600 text-sm">Basic Features</span>
            </div>
            <ul className="mt-8 space-y-4 text-gray-600">
              <li className="flex items-center">
                <CheckIcon />
                Full Platform Access
              </li>
              <li className="flex items-center">
                <CheckIcon />
                Link up to 3 data sources
              </li>
              <li className="flex items-center">
                <CheckIcon />
                1 space
              </li>
              <li className="flex items-center">
                <CheckIcon />
                2 team members
              </li>
            </ul>
          </div>
          <button
            className="mt-8 w-full bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg py-3 px-4 transition-all"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-600 flex flex-col justify-between shadow-lg h-full relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm">
              Most Popular
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mt-4">Premium</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-indigo-600">
                {isPremium ? '$49.99' : '$4.99'}
              </span>
              <span className="text-gray-500">
                {isPremium ? '/year' : '/month'}
              </span>
            </div>
            {isPremium && (
              <div className="mt-2 text-center">
                <span className="text-green-600 text-sm">Get 2 Months Free!</span>
              </div>
            )}
            <ul className="mt-8 space-y-4 text-gray-600">
              <li className="flex items-center">
                <CheckIcon />
                Full Platform Access
              </li>
              <li className="flex items-center">
                <CheckIcon />
                Link up to 10 data sources
              </li>
              <li className="flex items-center">
                <CheckIcon />
                Create up to 3 spaces
              </li>
              <li className="flex items-center">
                <CheckIcon />
                24/7 Support
              </li>
              <li className="flex items-center">
                <CheckIcon />
                30 day money back guarantee
              </li>
              <li className="flex items-center">
                <CheckIcon />
                {isPremium ? 'Priority Support' : 'Cancel Anytime'}
              </li>
            </ul>
          </div>
          <button
            onClick={() => handlePlanSelect(isPremium ? 'yearly' : 'monthly')}
            disabled={currentPlan === (isPremium ? 'yearly' : 'monthly')}
            className={`mt-8 w-full ${
              currentPlan === (isPremium ? 'yearly' : 'monthly')
                ? 'bg-gray-400 hover:bg-gray-400 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white rounded-lg py-3 px-4 transition-all`}
          >
            {currentPlan === (isPremium ? 'yearly' : 'monthly')
              ? 'Your current plan'
              : `Get Premium ${isPremium ? 'Yearly' : 'Monthly'}`}
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
    </div>
  );
} 