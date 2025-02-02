import { db } from './firebase';
import { collection, getDocs, doc } from 'firebase/firestore';
import { Event } from '@/types/workspace'; // adjust the import according to your project structure
import moment from 'moment';

const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date(NaN);
  
  // If it's a Firestore Timestamp with a toDate method, use it.
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If the timestamp is a number, assume it's a Unix timestamp.
  // Use a heuristic: if it's less than 10 billion, it's likely in seconds.
  if (typeof timestamp === 'number') {
    return timestamp < 1e10 ? new Date(timestamp * 1000) : new Date(timestamp);
  }
  
  // Support objects with a 'seconds' or '_seconds' property.
  if (typeof timestamp === 'object' && ('seconds' in timestamp || '_seconds' in timestamp)) {
    const seconds = timestamp.seconds ?? timestamp._seconds;
    return new Date(seconds * 1000);
  }
  
  // Fallback: try parsing with moment (or the Date constructor)
  const parsed = moment(timestamp);
  return parsed.isValid() ? parsed.toDate() : new Date(timestamp);
}

export async function getEvents(workspaceId: string, enabledDataSources: string[]): Promise<Event[]> {
  try {
    // Make sure this is the correct path for your events
    const eventsDocRef = doc(db, 'workspaces', workspaceId, 'dataSources', 'events');
    const allEvents: Event[] = [];

    // For each enabled data source, fetch its events
    for (const source of enabledDataSources) {
      try {
        const sourceCollection = collection(eventsDocRef, source);
        const sourceEvents = await getDocs(sourceCollection);

        sourceEvents.forEach(docSnapshot => {
          const eventData = docSnapshot.data();
          const start = convertTimestamp(eventData.start);
          const end = convertTimestamp(eventData.end);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return; // skip this event if dates are invalid
          }

          allEvents.push({
            id: docSnapshot.id,
            source,
            ...eventData,
            start,
            end,
          } as Event);
        });
      } catch (error) {
        console.error(`Failed to fetch events for source ${source}:`, error);
      }
    }

    return allEvents;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}

export { convertTimestamp }; 