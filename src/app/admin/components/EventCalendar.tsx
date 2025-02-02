"use client";

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { getEvents } from '@/utils/getEvents';
import { Event } from '@/types/workspace';

const localizer = momentLocalizer(moment);

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const { selectedWorkspace } = useWorkspace();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        await response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (selectedWorkspace?.id && selectedWorkspace.dashboards) {
      // Derive enabled data sources from the workspace dashboards.
      // Each dashboard has an array of enabled data sources.
      const enabledDataSources = selectedWorkspace.dashboards.reduce<string[]>((acc, dashboard) => {
        if (dashboard.dataSources) {
          acc.push(...dashboard.dataSources);
        }
        return acc;
      }, []);

      // Remove duplicates if any exist.
      const uniqueDataSources = Array.from(new Set(enabledDataSources));

      // Fetch events using the updated getEvents function
      getEvents(selectedWorkspace.id, uniqueDataSources).then(setEvents);
    } else {
      setEvents([]);
    }
  }, [selectedWorkspace?.id, selectedWorkspace?.dashboards]);

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