"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { FaYelp, FaTicketAlt } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";

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
      id: 'ticketmaster',
      name: 'Ticketmaster',
      icon: <FaTicketAlt className="w-8 h-8 text-blue-500" />,
      status: 'available',
    },
    {
      id: 'google-business',
      name: 'Google Business',
      icon: <svg className="w-8 h-8 text-blue-500" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.9C34.4 3.1 29.7 1 24 1 14.7 1 6.9 6.9 3.5 15.4l6.9 5.4C12.1 14.1 17.5 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.1-2.4 5.7-5 7.4l7.7 6C43.1 38.1 46.5 31.8 46.5 24.5z"/>
              <path fill="#FBBC05" d="M10.4 28.8c-1-3.1-1-6.5 0-9.6L3.5 13.8C-1.2 22.1-1.2 33.9 3.5 42.2l6.9-5.4z"/>
              <path fill="#EA4335" d="M24 46.5c5.7 0 10.4-1.9 13.9-5.1l-7.7-6c-2.1 1.4-4.7 2.2-7.4 2.2-6.5 0-12-4.6-13.9-10.8l-6.9 5.4C6.9 41.1 14.7 46.5 24 46.5z"/>
            </svg>,
      status: 'coming_soon',
    },
    {
      id: 'yelp',
      name: 'Yelp',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
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