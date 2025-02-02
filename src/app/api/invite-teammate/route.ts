import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { workspaceId, invitedEmail } = await req.json();

    if (!workspaceId || !invitedEmail) {
      return NextResponse.json(
        { success: false, error: 'Workspace ID and email are required.' },
        { status: 400 }
      );
    }

    // Query the users collection to see if a user with this email exists.
    const usersRef = adminDb.collection('users');
    const userQuerySnapshot = await usersRef
      .where('email', '==', invitedEmail)
      .limit(1)
      .get();

    // Get the workspace document.
    const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
    const workspaceDoc = await workspaceRef.get();

    if (!workspaceDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found.' },
        { status: 404 }
      );
    }

    if (!userQuerySnapshot.empty) {
      // Existing user – add them to the workspace.
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();
      const newMember = {
        uid: userDoc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'member',
      };

      // Update the workspace: if not already present, add newMember and the email.
      await workspaceRef.update({
        members: FieldValue.arrayUnion(newMember),
        memberEmails: FieldValue.arrayUnion(userData.email),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        message: 'User added to workspace.',
      });
    } else {
      // New user – create an invitation record.
      const invitation = {
        invitedEmail,
        workspaceId,
        invitedAt: FieldValue.serverTimestamp(),
        status: 'pending',
      };

      await adminDb.collection('invitations').add(invitation);

      // Note: You might also send an email here using a mail provider.
      return NextResponse.json({
        success: true,
        message: 'Invitation sent to email.',
      });
    }
  } catch (error) {
    console.error('Invite teammate error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred.' },
      { status: 500 }
    );
  }
} 