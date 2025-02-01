"use client";

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const events = [
    {
      id: 1,
      title: 'Sample Event',
      start: new Date(2025, 0, 12, 10, 0),
      end: new Date(2025, 1, 12, 12, 0),
    },
    {
      id: 2,
      title: 'Happy Hour',
      start: new Date(2025, 0, 31, 17, 0, 0, 0),
      end: new Date(2025, 0, 31, 17, 30, 0, 0),
      desc: 'Most important meal of the day',
    },
  ];

  return (
    <div className="w-full h-[800px] text-black">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        onView={setCurrentView}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        selectable
        onSelectEvent={(event) => console.log('Event selected:', event)}
        onSelectSlot={(slotInfo) => console.log('Slot selected:', slotInfo)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: '#3b82f6',
            borderRadius: '4px',
            border: 'none',
            color: 'black',
          },
        })}
        dayPropGetter={(date) => ({
          style: {
            border: '1px solid #e5e7eb',
            color: 'black',
          },
        })}
      />
    </div>
  );
} 