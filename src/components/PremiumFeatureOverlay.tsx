'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import SubscriptionPlans from './SubscriptionPlans';

interface PremiumFeatureOverlayProps {
  title: string;
  description: string;
}

export default function PremiumFeatureOverlay({ title, description }: PremiumFeatureOverlayProps) {
  const { userData } = useAuthContext();
  
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <p className="text-lg mb-8">{description}</p>
        <SubscriptionPlans userData={userData}/>
      </div>
    </div>
  );
} 