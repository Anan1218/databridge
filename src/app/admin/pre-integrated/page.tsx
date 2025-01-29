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
  FaTwitter
} from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  status: 'available' | 'coming_soon';
}

export default function PreIntegratedPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const dataSources: DataSource[] = [
    {
      id: 'google-business',
      name: 'Google Business Profile',
      description: 'Connect your Google Business Profile to monitor reviews, ratings, and customer interactions.',
      icon: <FaGoogle className="w-8 h-8 text-blue-500" />,
      status: 'available'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Track your Facebook page engagement, reviews, and social metrics.',
      icon: <FaFacebookSquare className="w-8 h-8 text-blue-600" />,
      status: 'available'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Monitor your Instagram engagement, follower growth, and content performance.',
      icon: <FaInstagram className="w-8 h-8 text-pink-500" />,
      status: 'available'
    },
    {
      id: 'yelp',
      name: 'Yelp',
      description: 'Track your Yelp reviews, ratings, and customer feedback.',
      icon: <FaYelp className="w-8 h-8 text-red-500" />,
      status: 'coming_soon'
    },
    {
      id: 'tripadvisor',
      name: 'TripAdvisor',
      description: 'Monitor your TripAdvisor reviews, ratings, and rankings.',
      icon: <FaTripadvisor className="w-8 h-8 text-green-500" />,
      status: 'coming_soon'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Track mentions, engagement, and social sentiment on Twitter.',
      icon: <FaTwitter className="w-8 h-8 text-blue-400" />,
      status: 'coming_soon'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Connect your Google Analytics to track website traffic and user behavior.',
      icon: <SiGoogleanalytics className="w-8 h-8 text-yellow-500" />,
      status: 'coming_soon'
    },
  ];

  const handleSourceSelect = (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    if (source?.status === 'available') {
      setSelectedSource(sourceId);
      router.push(`/admin/integration/${sourceId}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">Pre-Integrated Data Sources</h1>
        <p className="text-gray-600">
          Select from our collection of pre-integrated data sources to start monitoring your business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source) => (
          <div
            key={source.id}
            onClick={() => handleSourceSelect(source.id)}
            className={`
              bg-white rounded-lg p-6 border border-gray-200 
              ${source.status === 'available' 
                ? 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200' 
                : 'opacity-75 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {source.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {source.name}
                  </h3>
                  {source.status === 'coming_soon' && (
                    <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-600">
                  {source.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 