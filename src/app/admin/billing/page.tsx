'use client';

import SubscriptionPlans from '@/components/SubscriptionPlans';
import { useAuthContext } from '@/contexts/AuthContext';

export default function BillingPage() {
  const { userData, loading } = useAuthContext();

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      {/* <SubscriptionStatus userData={userData} loading={loading} /> */}
      <div className="text-black py-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Simple, Affordable Pricing</h2>
            <p className="mt-4 text-xl text-gray-400">Choose the plan that works best for you</p>
          </div>
          <div className="mt-6">
            <SubscriptionPlans userData={userData} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
} 