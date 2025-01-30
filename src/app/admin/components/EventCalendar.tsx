"use client";

import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// interface EventCalendarProps {
//   onDateChange: (dates: Value) => void;
// }

export default function EventCalendar() {
  const [dateRange, setDateRange] = useState<Value>(new Date());

  const handleDateChange = (value: Value) => {
    setDateRange(value);
    // Handle date change logic here
  };

  return (
    <div className="w-full">
      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={true}
        className="w-full border-none shadow-none custom-calendar"
        tileClassName={() => "text-sm p-3 rounded-lg hover:bg-gray-100 transition-colors"}
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