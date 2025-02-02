import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { inviteId, userId } = await request.json();

    if (!inviteId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Invite ID and user ID are required.' },
        { status: 400 }
      );
    }

    // Retrieve the invitation document
    const inviteRef = adminDb.collection('invitations').doc(inviteId);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found.' },
        { status: 404 }
      );
    }

    const inviteData = inviteDoc.data();
    if (inviteData.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Invitation has already been processed.' },
        { status: 400 }
      );
    }

    // Mark the invitation as declined
    await inviteRef.update({
      status: 'declined',
      declinedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation declined successfully',
    });
  } catch (error) {
    console.error('Error declining invite:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred.' },
      { status: 500 }
    );
  }
} 