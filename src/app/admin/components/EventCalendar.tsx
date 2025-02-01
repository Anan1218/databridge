"use client";

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { useWorkspace } from './AdminLayout';
import { User } from '@/types/user';
import { useAuthContext } from '@/contexts/AuthContext';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  // Add other event properties as needed
  source: string;
}

async function getEvents(workspaceId: string, dataSources: string[]): Promise<Event[]> {
  try {
    const eventsDocRef = doc(db, 'workspaces', workspaceId, 'dataSources', 'events');
    const allEvents: Event[] = [];

    for (const source of dataSources) {
      try {
        const sourceCollection = collection(eventsDocRef, source);
        const sourceEvents = await getDocs(sourceCollection);
        
        sourceEvents.forEach(doc => {
          const eventData = doc.data();
          allEvents.push({
            id: doc.id,
            source,
            ...eventData
          } as Event);
        });
      } catch (error) {
        console.error(`Error fetching events for source ${source}:`, error);
      }
    }

    return allEvents;
  } catch (error) {
    console.error('Error in getEvents:', error);
    return [];
  }
}

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const { selectedWorkspace } = useWorkspace();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (selectedWorkspace?.id && userData?.dataSources) {
      getEvents(selectedWorkspace.id, userData.dataSources).then(fetchedEvents => {
        setEvents(fetchedEvents);
      });
    }
  }, [selectedWorkspace, userData]);

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
        onSelectEvent={(event) => {
          // TODO: Implement event selection handling
          console.log('Event selected:', event);
        }}
        onSelectSlot={(slotInfo) => {
          // TODO: Implement slot selection handling
          console.log('Slot selected:', slotInfo);
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#8b5cf6',
            borderRadius: '4px',
            border: 'none',
            color: 'white',
          },
        })}
        dayPropGetter={() => ({
          style: {
            border: '1px solid #e5e7eb',
            color: 'black',
          },
        })}
      />
    </div>
  );
} 