'use client';

import SubscriptionPlans from '@/components/SubscriptionPlans';
import SubscriptionStatus from '@/components/SubscriptionStatus';

// Stripe price IDs (get these from your Stripe dashboard)
// const PRICE_IDS = {
//   trial: process.env.NEXT_PUBLIC_STRIPE_TRIAL_PRICE_ID!,
//   monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
//   yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
// } as const;

export default function BillingPage() {
  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <SubscriptionStatus />
      
      <div className="bg-white text-black py-10 border border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Simple, Affordable Pricing</h2>
            <p className="mt-4 text-xl text-gray-400">Choose the plan that works best for you</p>
          </div>
          <div className="mt-6">
            <SubscriptionPlans />
          </div>
        </div>
      </div>
    </div>
  );
} 