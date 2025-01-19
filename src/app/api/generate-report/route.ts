import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface ReportRequest {
  email: string;
  userId: string;
  searchQueries: string[];
  urls: string[];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Fetch user data from Firebase
    const userDoc = await db.collection('users').doc(data.userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // Collect all URLs into an array, filtering out empty strings
    const urls = [
      userData?.website,
      userData?.googleMaps,
      userData?.yelpUrl
    ].filter(url => url && url.trim() !== '');

    // Create search queries array with business name and location
    const searchQueries = [
      userData?.businessName,
      userData?.location
    ].filter(query => query && query.trim() !== '');

    // Combine the request data with user data from Firebase
    const enrichedData: ReportRequest = {
      email: data.email,
      userId: data.userId,
      searchQueries: searchQueries,
      urls: urls,
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