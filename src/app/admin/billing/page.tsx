'use client';

import SubscriptionPlans from '@/components/SubscriptionPlans';
import { useAuthContext } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function BillingPage() {
  const { userData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('');
  const [error, setError] = useState('');

  // Initialize state directly from userData
  useEffect(() => {
    if (userData?.subscription) {
      setIsPremium(userData.subscription.status === 'active');
      setCurrentPlan(userData.subscription.interval || '');
      setLoading(false);
    }
  }, [userData]);

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
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