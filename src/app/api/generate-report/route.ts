import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { getDoc, doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { businessTypes } from '@/utils/businessQueries';

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
    const data = await request.json();
    const { userId, email } = data;

    // First check if user exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a new report document
    const reportsRef = collection(db, 'users', userId, 'reports');
    const newReport = await addDoc(reportsRef, {
      userId,
      email,
      status: 'pending',
      timestamp: serverTimestamp(),
      // Add other fields as needed
    });

    // Forward request to FastAPI
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        reportId: newReport.id
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true, reportId: newReport.id });

  } catch (error) {
    console.error('Error in generate-report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 