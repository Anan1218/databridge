import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { businessTypes } from '@/utils/businessQueries';
import { getDoc, doc } from 'firebase/firestore';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface ReportRequest {
  email: string;
  userId: string;
  searchQueries: string[];
  urls: string[];
  location: string;
  businessName: string;
}

export async function POST(request: Request) {
  try {
    const data: ReportRequest = await request.json();

    // Fetch user data from Firebase
    const userDoc = await getDoc(doc(db, 'users', data.userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const businessType = businessTypes[userData?.businessType || 'restaurant'];
    
    // Create search queries array with business name and location
    const searchQueries = [
      userData?.businessName,
      userData?.location,
      ...businessType.queries
    ].filter(query => query && query.trim() !== '');

    // Collect all URLs into an array
    const urls = [
      userData?.website,
      userData?.googleMaps,
      userData?.yelpUrl,
      ...businessType.urls || []
    ].filter(url => url && url.trim() !== '');

    const enrichedData = {
      email: data.email,
      userId: data.userId,
      searchQueries,
      urls
    };

    // Forward the enriched request to FastAPI
    const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in generate-report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 