"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuthContext } from '@/contexts/AuthContext';

interface BaseItem {
  id: string;
  timestamp: Date;
  type: string;
}

interface NewsItem extends BaseItem {
  content: string;
  email: string;
  status: string;
  userId: string;
  type: 'report';
}

interface EventItem extends BaseItem {
  name: string;
  description: string;
  date: string;
  location: string;
  url: string;
  type: 'event';
}

type LocalItem = NewsItem | EventItem;

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface LocalEventsProps {
  selectedDates: Value;
}

export default function LocalEvents({ selectedDates }: LocalEventsProps) {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchNews = async () => {
      if (!user?.uid) return;
      setIsLoading(false); // For now, just set loading to false
      setNews([]); // Initialize with empty array
    };

    fetchNews();
  }, [user, selectedDates]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {news.length === 0 && (
        <div className="text-center text-gray-500">
          No events found for the selected dates
        </div>
      )}
    </div>
  );
}