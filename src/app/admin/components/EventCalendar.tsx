"use client";

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EventCalendarProps {
  onDateChange: (dates: Value) => void;
}

export default function EventCalendar({ onDateChange }: EventCalendarProps) {
  const [dateRange, setDateRange] = useState<Value>(new Date());

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
      </div>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          All Task
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Backlog
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Active
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Closed
        </button>
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