import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';

export async function GET(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json(userData);

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 