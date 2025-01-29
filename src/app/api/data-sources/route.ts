import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { uid, dataSource } = await request.json();

    // Validate user exists
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's data sources
    await adminDb.collection('users').doc(uid).update({
      dataSources: FieldValue.arrayUnion(dataSource)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding data source:', error);
    return NextResponse.json(
      { error: 'Failed to add data source' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { uid, dataSource } = await request.json();

    // Validate user exists
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove data source from user
    await adminDb.collection('users').doc(uid).update({
      dataSources: FieldValue.arrayRemove(dataSource)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing data source:', error);
    return NextResponse.json(
      { error: 'Failed to remove data source' },
      { status: 500 }
    );
  }
} 