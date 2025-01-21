"use client";

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuthContext } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EventCalendarProps {
  onDateChange: (dates: Value) => void;
}

export default function EventCalendar({ onDateChange }: EventCalendarProps) {
  const [dateRange, setDateRange] = useState<Value>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!user?.uid) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserLocation(userDoc.data().location);
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, [user]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.uid,
          location: userLocation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ text: 'Failed to fetch events', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value: Value) => {
    setDateRange(value);
    onDateChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Today you have 0 upcoming events</p>
        </div>
        <div className="flex items-center gap-4">
          {message && (
            <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Fetching...' : 'Fetch Events'}
          </button>
        </div>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={true}
        className="w-full border-none shadow-none custom-calendar"
        tileClassName={({ date }) => {
          return "text-sm p-3 rounded-lg hover:bg-gray-100 transition-colors"
        }}
        navigationLabel={({ date }) =>
          date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }
        prevLabel={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        }
        nextLabel={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        }
      />
    </div>
  );
} 