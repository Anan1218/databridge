"use client";

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase'; // Adjust the import path as necessary
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { useWorkspace } from './AdminLayout';
import { User } from '@/types/user';  // Add this import
import { useAuthContext } from '@/contexts/AuthContext'; // Add this import if not already present

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
    console.log('Getting events for workspace:', workspaceId);
    console.log('Data sources to fetch:', dataSources);
    
    const eventsDocRef = doc(db, 'workspaces', workspaceId, 'dataSources', 'events');
    console.log('Events doc reference path:', eventsDocRef.path);
    const allEvents: Event[] = [];

    // Fetch events from each data source in the user's dataSources array
    for (const source of dataSources) {
      try {
        console.log(`Fetching events for source: ${source}`);
        const sourceCollection = collection(eventsDocRef, source);
        console.log('Source collection path:', sourceCollection.path);
        
        const sourceEvents = await getDocs(sourceCollection);
        console.log(`Found ${sourceEvents.size} events for source: ${source}`);
        
        sourceEvents.forEach(doc => {
          console.log(`Event data for ${doc.id}:`, doc.data());
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

    console.log('Final events array:', allEvents);
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
  const { user } = useAuthContext(); // Add this line
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data to get dataSources
    const fetchUserData = async () => {
      if (!user?.uid) {
        console.log('No user UID available');
        return;
      }
      
      console.log('Fetching user data for UID:', user.uid);
      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);
        console.log('User data response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        console.log('Fetched user data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]); // Changed dependency to user instead of selectedWorkspace

  useEffect(() => {
    console.log('Effect triggered with:', {
      workspaceId: selectedWorkspace?.id,
      dataSources: userData?.dataSources
    });

    if (selectedWorkspace?.id && userData?.dataSources) {
      console.log('Fetching events with sources:', userData.dataSources);
      getEvents(selectedWorkspace.id, userData.dataSources).then(fetchedEvents => {
        console.log('Setting events:', fetchedEvents);
        setEvents(fetchedEvents);
      });
    }
  }, [selectedWorkspace, userData]);

  console.log('Rendering calendar with events:', events);

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