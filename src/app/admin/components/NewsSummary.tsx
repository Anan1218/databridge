"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuthContext } from '@/contexts/AuthContext';

interface NewsItem {
  id: string;
  content: string;
  email: string;
  status: string;
  timestamp: Date;
  userId: string;
}

export default function NewsSummary() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { user } = useAuthContext();
  
  useEffect(() => {
    async function fetchNews() {
      if (!user?.uid) return;
      
      try {
        const eventsRef = collection(db, 'users', user.uid, 'reports');
        const q = query(
          eventsRef,
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const newsItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          content: doc.data().content || '',
          email: doc.data().email || '',
          status: doc.data().status || 'unknown',
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          userId: doc.data().userId || '',
        }));
        
        setNews(newsItems);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, [user]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getContentPreview = (content: string) => {
    const words = content.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : content;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="p-4 bg-white rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : (
          news.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {item.email}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Report Summary
                </h3>
                <p className="text-gray-600 mb-4">
                  {expandedItems.has(item.id) ? item.content : getContentPreview(item.content)}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedItems.has(item.id) ? 'Show Less' : 'Show More'}
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