import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { UserSubscription } from '@/types/user';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function SubscriptionStatus({ userData, loading }: { userData: any; loading: boolean }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [dataSourceCount, setDataSourceCount] = useState(0);

  useEffect(() => {
    if (!userData?.uid) return;
    setSubscription(userData.subscription || null);
    setDataSourceCount(userData.dataSources?.length || 0);
  }, [userData]);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Status</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-medium">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Free
              </span>
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Data Sources</p>
            <p className="text-lg font-medium">{dataSourceCount}/3 Used</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Active Subscription</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-lg font-medium">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              subscription.subscriptionStatus === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {subscription.subscriptionStatus === 'active' ? 'Premium' : 'Free'}
            </span>
          </p>
        </div>

        {subscription.trialEnds && (
          <div>
            <p className="text-sm text-gray-500">Trial Ends</p>
            <p className="text-lg font-medium">{formatDate(subscription.trialEnds)}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Data Sources</p>
          <p className="text-lg font-medium">
            {dataSourceCount}/
            {subscription.subscriptionStatus === 'active' ? '10' : '3'} Used
          </p>
        </div>
      </div>
    </div>
  );
} 