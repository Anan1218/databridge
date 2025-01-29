'use client';

import SubscriptionPlans from '@/components/SubscriptionPlans';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import { useAuthContext } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function BillingPage() {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const response = await fetch(`/api/users/${user.uid}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <SubscriptionStatus userData={userData} loading={loading} />
      <div className="bg-white text-black py-10 border border-gray-200">
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