"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  category: string;
  imageUrl?: string;
  timestamp: Date;
}

interface NewsSummaryProps {
  news?: NewsItem[];
}

export default function NewsSummary() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  
  useEffect(() => {
    async function fetchNews() {
      if (!user?.uid) return;
      
      try {
        // First, get the latest report
        const reportsRef = collection(db, 'users', user.uid, 'reports');
        const reportsQuery = query(reportsRef, orderBy('timestamp', 'desc'), limit(1));
        const reportsSnapshot = await getDocs(reportsQuery);
        
        if (reportsSnapshot.empty) return;
        
        const latestReportId = reportsSnapshot.docs[0].id;
        
        // Then get events from the latest report
        const eventsRef = collection(db, 'users', user.uid, 'reports', latestReportId, 'events');
        const eventsQuery = query(eventsRef, orderBy('timestamp', 'desc'), limit(10));
        
        const querySnapshot = await getDocs(eventsQuery);
        const newsItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          headline: doc.data().name || '',
          summary: doc.data().description || '',
          source: doc.data().url || 'Unknown',
          category: doc.data().category || 'General',
          imageUrl: doc.data().imageUrl,
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));
        
        setNews(newsItems);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, [user]);

  const categories = ['all', ...new Set(news.map(item => item.category))];

  const filteredNews = news.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      technology: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      health: 'bg-red-100 text-red-800',
      politics: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-yellow-100 text-yellow-800',
      environment: 'bg-emerald-100 text-emerald-800',
      science: 'bg-teal-100 text-teal-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const formatDate = (date: Date): string => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="p-4 bg-white rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : (
          filteredNews.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {item.headline}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Source: {item.source}
                  </span>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 