'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionPlans from '@/components/SubscriptionPlans';

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      if (!data.sessionId) {
        throw new Error('No session ID returned from server');
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Rest of your subscription page UI */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            Processing...
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Simple, Affordable Pricing</h2>
            <p className="mt-4 text-xl text-gray-400">Choose the plan that works best for you</p>
          </div>
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
} 