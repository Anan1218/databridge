import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { UserData } from '@/types/user';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { userData, uid }: { userData: UserData; uid: string } = await req.json();

    if (!uid || !userData?.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize user with empty arrays for workspaces and other collections
    await adminDb.collection('users').doc(uid).set({
      ...userData,
      workspaces: [],
      dataSources: [],
      enabledDashboards: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
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