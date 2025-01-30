"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { FaYelp } from "react-icons/fa";

interface DataSource {
  id: string;
  name: string;
  icon: JSX.Element;
  status: 'available' | 'connected' | 'pending' | 'coming_soon';
}

export default function IntegratedPage() {
  const { userData } = useAuthContext();

  if (!userData) {
    return null;
  }

  const dataSources: DataSource[] = [
    {
      id: 'ticketmaster',
      name: 'Ticketmaster',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'available',
    },
    {
      id: 'google-business',
      name: 'Google Business',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'coming_soon',
    },
    {
      id: 'yelp',
      name: 'Yelp',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'coming_soon',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
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
                    ) : isConnected && (
                      <span className="px-2 py-1 text-xs font-medium text-green-500 bg-green-100 rounded-full">
                        Connected
                      </span>
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