"use client";

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase'; // Adjust the import path as necessary
import { collection, doc, getDocs } from 'firebase/firestore';
import { useWorkspace } from './AdminLayout';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  // Add other event properties as needed
}

async function getEvents(workspaceId: string): Promise<Event[]> {
  try {
    const eventsRef = collection(
      doc(collection(db, 'workspaces'), workspaceId),
      'dataSources/events/uc-berkeley'
    );
    const snapshot = await getDocs(eventsRef);

    if (snapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const { selectedWorkspace } = useWorkspace();

  useEffect(() => {
    if (selectedWorkspace?.id) {
      getEvents(selectedWorkspace.id).then(fetchedEvents => {
        setEvents(fetchedEvents);
      });
    }
  }, [selectedWorkspace]);

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
            backgroundColor: '#8b5cf6',
            borderRadius: '4px',
            border: 'none',
            color: 'white',
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