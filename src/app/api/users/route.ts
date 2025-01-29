import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 