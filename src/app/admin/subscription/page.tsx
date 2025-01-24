'use client';

import SubscriptionPlans from '@/components/SubscriptionPlans';

// Stripe price IDs (get these from your Stripe dashboard)
// const PRICE_IDS = {
//   trial: process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID!,
//   monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
//   yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
// } as const;

export default function SubscribePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
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