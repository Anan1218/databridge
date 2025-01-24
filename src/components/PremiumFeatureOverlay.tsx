'use client';

import { useState } from 'react';
import SubscriptionPlans from './SubscriptionPlans';

interface PremiumFeatureOverlayProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function PremiumFeatureOverlay({
  title = "Premium Feature",
  description = "Upgrade to Premium to access this feature and unlock more powerful tools for your business.",
  buttonText = "Upgrade to Premium"
}: PremiumFeatureOverlayProps) {
  const [showPlans, setShowPlans] = useState(false);

  return (
    <div className="absolute inset-0 backdrop-blur-md bg-black/30 z-10 rounded-lg flex flex-col items-center justify-center text-center p-6">
      {!showPlans ? (
        <>
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-200 mb-6 max-w-md">
            {description}
          </p>
          <button
            onClick={() => setShowPlans(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            {buttonText}
          </button>
        </>
      ) : (
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-8">Upgrade to Premium</h2>
          <SubscriptionPlans />
        </div>
      )}
    </div>
  );
} 