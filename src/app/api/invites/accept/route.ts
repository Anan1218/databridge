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

    // Retrieve the invitation from the notifications subcollection in the user document
    const inviteRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .doc(inviteId);
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

    // Retrieve the workspace using inviteData.workspaceId.
    const workspaceRef = adminDb.collection('workspaces').doc(inviteData.workspaceId);
    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found.' },
        { status: 404 }
      );
    }

    // Get user details.
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();

    // Create new member object; use the invitation's role if provided.
    const newMember = {
      uid: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: inviteData.role || 'member',
    };

    // Add the user to the workspace.
    await workspaceRef.update({
      members: FieldValue.arrayUnion(newMember),
      memberEmails: FieldValue.arrayUnion(userData.email),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Mark the invitation as accepted.
    await inviteRef.update({
      status: 'accepted',
      acceptedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error('Error accepting invite:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
} 