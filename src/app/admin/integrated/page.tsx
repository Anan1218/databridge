"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { FaYelp, FaReddit, FaLinkedin, FaProductHunt, FaYoutube } from "react-icons/fa";
import { SiUpwork, SiFiverr } from "react-icons/si";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

interface DataSource {
  id: string;
  name: string;
  icon: JSX.Element;
  status: 'available' | 'connected' | 'pending' | 'coming_soon';
}

export default function IntegratedPage() {
  const { userData, user } = useAuthContext();

  if (!userData) {
    return null;
  }

  const dataSources: DataSource[] = [
    {
      id: 'reddit',
      name: 'Reddit',
      icon: <FaReddit className="w-8 h-8 text-orange-500" />,
      status: 'available',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-8 h-8 text-blue-600" />,
      status: 'available',
    },
    {
      id: 'producthunt',
      name: 'Product Hunt',
      icon: <FaProductHunt className="w-8 h-8 text-orange-600" />,
      status: 'coming_soon',
    },
    {
      id: 'fiverr',
      name: 'Fiverr',
      icon: <SiFiverr className="w-8 h-8 text-green-500" />,
      status: 'coming_soon',
    },
    {
      id: 'yelp',
      name: 'Yelp',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'coming_soon',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <FaYoutube className="w-8 h-8 text-red-600" />,
      status: 'coming_soon',
    },
    {
      id: 'upwork',
      name: 'UpWork',
      icon: <SiUpwork className="w-8 h-8 text-green-600" />,
      status: 'coming_soon',
    },
  ];

  const handleConnect = async (sourceId: string) => {
    if (!user?.uid) return;

    try {
      // Call the API endpoint to update Firebase
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          dataSource: sourceId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect data source');
      }

      // Refresh the page or refetch user data as needed
      window.location.reload();
      
    } catch (error) {
      console.error('Error connecting data source:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/data-sources"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Data Sources</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Integrated Data Sources</h1>
        <p className="text-gray-600">
          Select from our collection of integrated data sources to start monitoring your business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source) => {
          const isConnected = userData?.dataSources?.includes(source.id);
          
          return (
            <div
              key={source.id}
              className={`
                bg-white rounded-lg p-6 border border-gray-200 
                ${source.status === 'available' 
                  ? isConnected
                    ? 'opacity-75 cursor-not-allowed border-green-500'
                    : 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200'
                  : 'opacity-75 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {source.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {source.name}
                      </h3>
                    </div>
                    {source.status === 'coming_soon' ? (
                      <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                        Coming Soon
                      </span>
                    ) : (
                      isConnected ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-500 bg-green-100 rounded-full">
                          Connected
                        </span>
                      ) : (
                        <button 
                          className="px-4 py-1 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                          onClick={() => handleConnect(source.id)}
                        >
                          Connect
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 