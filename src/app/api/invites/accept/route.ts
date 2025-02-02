import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { inviteId, userId } = await request.json();

    if (!inviteId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Invite ID and user ID are required' },
        { status: 400 }
      );
    }

    // Retrieve the invitation document
    const inviteRef = adminDb.collection('invitations').doc(inviteId);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const inviteData = inviteDoc.data();
    if (inviteData.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Invitation has already been processed' },
        { status: 400 }
      );
    }

    // Retrieve the workspace referenced by the invitation
    const workspaceRef = adminDb.collection('workspaces').doc(inviteData.workspaceId);
    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Retrieve the user's document
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const userData = userDoc.data();

    // Create a new member object; optionally, use the role provided in the invitation
    const newMember = {
      uid: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: inviteData.role || 'member',
    };

    // Update the workspace:
    // • Add the user to the members list  
    // • Add the email to the memberEmails list  
    await workspaceRef.update({
      members: FieldValue.arrayUnion(newMember),
      memberEmails: FieldValue.arrayUnion(userData.email),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Mark the invitation as accepted
    await inviteRef.update({
      status: 'accepted',
      acceptedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Invitation accepted successfully' });
  } catch (error) {
    console.error('Error accepting invite:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
} 