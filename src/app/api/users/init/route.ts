import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { UserData } from '@/types/user';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { userData, uid } = await req.json();

    if (!uid || !userData?.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use the imported FieldValue directly
    await adminDb.collection('users').doc(uid).set({
      ...userData,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user' },
      { status: 500 }
    );
  }
}