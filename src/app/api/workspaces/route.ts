import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const { uid, workspace } = body;

    if (!uid) {
      console.error('Missing uid in request');
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    if (!workspace) {
      console.error('Missing workspace data in request');
      return NextResponse.json({
        success: false,
        error: 'Workspace data is required'
      }, { status: 400 });
    }

    // Check if user exists
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?uid=${uid}`);
    if (!response.ok) {
      console.error('User not found');
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const now = Timestamp.now();
    const workspaceRef = adminDb.collection('workspaces').doc();
    
    const workspaceData = {
      id: workspaceRef.id,
      name: workspace.name || 'My Workspace',
      createdAt: now,
      updatedAt: now,
      owner: {
        uid: uid,
        email: workspace.ownerEmail || '',
        firstName: workspace.ownerFirstName || '',
        lastName: workspace.ownerLastName || ''
      },
      members: [{
        uid: uid,
        email: workspace.ownerEmail || '',
        firstName: workspace.ownerFirstName || '',
        lastName: workspace.ownerLastName || '',
        role: 'owner' as const
      }],
      dashboards: [],
      dataSources: []
    };

    // Use batch instead of transaction
    const batch = adminDb.batch();
    
    // Create workspace
    batch.set(workspaceRef, workspaceData);
    
    // Get user document reference
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user with workspace reference
    batch.update(userRef, {
      workspaces: FieldValue.arrayUnion(workspaceRef.id),
      defaultWorkspace: workspaceRef.id,
      updatedAt: now
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      workspaceId: workspaceRef.id,
      workspace: workspaceData
    });

  } catch (error) {
    console.error('Workspace creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
} 