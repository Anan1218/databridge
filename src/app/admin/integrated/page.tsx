"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaGoogle, 
  FaFacebookSquare, 
  FaInstagram, 
  FaYelp, 
  FaTripadvisor,
  FaTwitter,
  FaTicketAlt
} from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  status: 'available' | 'coming_soon';
  tags: string[];
}

export default function IntegratedPage() {
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const dataSources: DataSource[] = [
    {
      id: 'ticketmaster',
      name: 'Ticketmaster',
      description: 'Monitor events near your area',
      icon: <FaTicketAlt className="w-8 h-8 text-blue-700" />,
      status: 'available',
      tags: ['calendar']
    },
    {
      id: 'google-business',
      name: 'Google Business',
      description: 'Connect your Google Business Profile to monitor reviews, ratings, and customer interactions.',
      icon: <FaGoogle className="w-8 h-8 text-blue-500" />,
      status: 'coming_soon',
      tags: ['analytics']
    },
    {
      id: 'yelp',
      name: 'Yelp',
      description: 'Track your Yelp reviews, ratings, and customer feedback.',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'coming_soon',
      tags: ['reviews']
    },
  ];

  const handleSourceSelect = async (sourceId: string) => {
    if (!user) return;
    
    const source = dataSources.find(s => s.id === sourceId);
    if (source?.status !== 'available') return;

    // Check if user already has this data source
    if (userData?.dataSources?.includes(sourceId)) {
      return; // Source already connected
    }

    try {
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

      await refreshUserData();
    } catch (error) {
      console.error('Error connecting data source:', error);
    }
  };

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
              onClick={() => !isConnected && handleSourceSelect(source.id)}
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
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        {source.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
                  <p className="text-gray-600">
                    {source.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 