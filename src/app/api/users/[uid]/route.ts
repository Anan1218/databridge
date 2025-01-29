import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';

export async function GET(
  request: Request,
  context: { params: { uid: string } }
) {
  try {
    // Explicitly await the params
    const params = await context.params;
    const uid = params.uid;
    
    // Get user document from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      // Return a default structure if user doesn't exist yet
      return NextResponse.json({
        subscription: null,
        dataSources: []
      });
    }

    const userData = userDoc.data();
    
    // Ensure we always return an object with expected properties
    return NextResponse.json({
      ...userData,
      subscription: userData?.subscription || null,
      dataSources: userData?.dataSources || []
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}