"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { MdStorage, MdIntegrationInstructions, MdDashboard } from "react-icons/md";
import { useState } from "react";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, userData } = useAuthContext();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const router = useRouter();
  
  if (!user) {
    return null;
  }

  const handleCustomIntegration = (e: React.MouseEvent) => {
    e.preventDefault();
    const isPremium = userData?.subscription?.status === 'active';
    
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    
    router.push('/admin/custom-data');
  };

  const renderDashboards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userData?.enabledDashboards.map((dashboard: string) => (
          <Link href={`/admin/dashboard/${dashboard}`} key={dashboard} className="group">
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
              <div className="flex-1">
                <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <MdDashboard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">
                  {dashboard.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                <p className="text-gray-600 mb-6">
                  View and analyze your {dashboard} data
                </p>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Add New Dashboard Button */}
        <Link href="/admin/integrated" className="group">
          <div className="bg-white rounded-xl p-8 border border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300 h-full flex flex-col items-center justify-center">
            <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <MdStorage className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">Add New Dashboard</h3>
          </div>
        </Link>
      </div>
    );
  };

  const renderInitialSetup = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Browse Integrated Data Sources Card */}
        <Link href="/admin/integrated" className="group">
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="flex-1">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MdStorage className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Browse Integrated Data Sources</h3>
              <p className="text-black mb-6">
                Explore and connect to our collection of integrated data sources including social media, analytics, and review platforms.
              </p>
            </div>
          </div>
        </Link>

        {/* Custom Data Integration Card */}
        <a href="#" onClick={handleCustomIntegration} className="group">
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="flex-1">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MdIntegrationInstructions className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Add Custom Data Source</h3>
              <p className="text-gray-600 mb-6">
                Import your own data sources or connect custom APIs to create personalized monitoring dashboards.
              </p>
            </div>
          </div>
        </a>
      </div>
    );
  };

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8 text-black">
          {userData?.enabledDashboards?.length ? 'Your Dashboards' : 'Build Your Dashboard'}
        </h1>
        <p className="text-black mb-12 text-lg">
          {userData?.enabledDashboards?.length 
            ? 'View and manage your connected data sources'
            : 'Select a category below to get started with your data monitoring setup.'}
        </p>

        {userData?.enabledDashboards?.length ? renderDashboards() : renderInitialSetup()}
      </div>

      <PremiumUpgradeModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={() => {
          setIsPremiumModalOpen(false);
          router.push('/admin/billing');
        }}
        title="Premium Feature"
        description="You need to upgrade to a premium plan to integrate custom data sources."
      />
    </div>
  );
}