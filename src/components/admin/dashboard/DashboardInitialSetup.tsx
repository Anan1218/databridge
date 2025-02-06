import React from 'react';
import Link from 'next/link';
import { MdStorage, MdCode } from 'react-icons/md';

interface DashboardInitialSetupProps {
  onCustomIntegrationClick: (e: React.MouseEvent) => void;
}

export default function DashboardInitialSetup({ onCustomIntegrationClick }: DashboardInitialSetupProps) {
  return (
    <div className="max-w-xl mx-auto w-full space-y-6">
      {/* Browse Integrated Data Sources Card */}
      <Link href="/admin/integrated" className="group block">
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

      {/* Custom Integration Card */}
      <button onClick={onCustomIntegrationClick} className="w-full">
        <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
          <div className="flex-1">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <MdCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">Custom Integration</h3>
            <p className="text-black mb-6">
              Connect your own data source or API to create custom dashboards and visualizations.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
} 