"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { MdStorage, MdIntegrationInstructions } from "react-icons/md";

export default function AdminDashboard() {
  const { user } = useAuthContext();
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8 text-black">Build Your Dashboard</h1>
        <p className="text-black mb-12 text-lg">
          Select a category below to get started with your data monitoring setup.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monitor Data Sources Card */}
          <Link href="/admin/data-sources" className="group">
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
              <div className="flex-1">
                <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <MdStorage className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Monitor Data Sources</h3>
                <p className="text-black mb-6">
                  Connect and monitor your business data from various sources including social media, analytics, and review platforms.
                </p>
              </div>
            </div>
          </Link>

          {/* Custom Data Integration Card */}
          <Link href="/admin/custom-data" className="group">
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
              <div className="flex-1">
                <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <MdIntegrationInstructions className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Integrate Custom Data</h3>
                <p className="text-gray-600 mb-6">
                  Import your own data sources or connect custom APIs to create personalized monitoring dashboards.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}