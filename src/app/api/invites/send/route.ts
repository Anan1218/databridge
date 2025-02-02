import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    console.log('Invite API invoked');
    const body = await req.json();
    console.log('Request body:', body);

    const { workspaceId, invitedEmail, role } = body;

    if (!workspaceId || !invitedEmail) {
      console.log('Missing workspaceId or invitedEmail', { workspaceId, invitedEmail });
      return NextResponse.json(
        { success: false, error: 'Workspace ID and email are required.' },
        { status: 400 }
      );
    }
    
    // Normalize email address.
    const normalizedEmail = invitedEmail.trim().toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    // Ensure the workspace exists.
    const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
    const workspaceDoc = await workspaceRef.get();
    if (!workspaceDoc.exists) {
      console.log('Workspace not found:', workspaceId);
      return NextResponse.json(
        { success: false, error: 'Workspace not found.' },
        { status: 404 }
      );
    }
    console.log('Workspace exists:', workspaceDoc.data());

    // Lookup the user by email.
    const usersQuery = await adminDb
      .collection('users')
      .where('email', '==', normalizedEmail)
      .get();
    console.log('Users query size:', usersQuery.size);
    if (usersQuery.empty) {
      console.log('No user found for email:', normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'User not found. Invitation can only be sent to registered users.' },
        { status: 404 }
      );
    }
    
    // Use the first matching user.
    const userDoc = usersQuery.docs[0];
    const userId = userDoc.id;
    console.log('User found for invited email:', userDoc.data());

    // Check if a pending invitation already exists in the user's notifications subcollection.
    const notificationsQuery = await adminDb
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .where('workspaceId', '==', workspaceId)
      .where('type', '==', 'invite')
      .where('status', '==', 'pending')
      .get();

    console.log('Notifications query size:', notificationsQuery.size);
    notificationsQuery.forEach(doc => {
      console.log('Found notification:', doc.id, doc.data());
    });

    if (notificationsQuery.size > 0) {
      console.log('An invitation already exists for this user in the notifications subcollection.');
      return NextResponse.json(
        { success: false, error: 'An invitation for this user already exists.' },
        { status: 400 }
      );
    }
    
    // Create a new invitation as a notification.
    const notification = {
      type: 'invite',
      message: `You've been invited to join the workspace "${workspaceDoc.data().name}" as a ${role || 'member'}.`,
      workspaceId,
      role: role || 'member',
      invitedAt: FieldValue.serverTimestamp(),
      status: 'pending' // pending, accepted, or declined
    };
    
    console.log('Creating notification:', notification);
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .add(notification);
    console.log('Notification created successfully for user:', userId);
    
    return NextResponse.json({
      success: true,
      message: 'Invitation notification sent to the user.'
    });
  } catch (error) {
    console.error('Invite teammate error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred.' },
      { status: 500 }
    );
  }
}