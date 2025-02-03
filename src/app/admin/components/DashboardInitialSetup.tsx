import React from 'react';
import Link from 'next/link';
import { MdStorage, MdIntegrationInstructions } from 'react-icons/md';

export default function DashboardInitialSetup() {
  return (
    <div className="max-w-xl mx-auto w-full">
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
    </div>
  );
}