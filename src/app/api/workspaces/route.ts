import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const { uid, workspace } = await req.json();
    console.log('Creating workspace for:', uid);

    if (!uid || !workspace) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Use a transaction to ensure user exists
    const result = await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(adminDb.collection('users').doc(uid));
      
      if (!userDoc.exists) {
        throw new Error('User document not found');
      }

      const now = Timestamp.now();
      const workspaceRef = adminDb.collection('workspaces').doc();
      
      const workspaceData = {
        id: workspaceRef.id,
        name: workspace.name,
        createdAt: now,
        updatedAt: now,
        ownerId: uid,
        members: [{
          userId: uid,
          role: 'owner',
          joinedAt: now,
          email: workspace.ownerEmail,
          name: workspace.ownerName
        }],
        enabledDashboards: [],
        dataSources: []
      };

      // Create workspace
      transaction.set(workspaceRef, workspaceData);
      
      // Update user with workspace reference
      transaction.update(userDoc.ref, {
        workspaces: FieldValue.arrayUnion(workspaceRef.id),
        defaultWorkspace: workspaceRef.id,
        updatedAt: now
      });

      return { workspaceId: workspaceRef.id, workspace: workspaceData };
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Workspace creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 