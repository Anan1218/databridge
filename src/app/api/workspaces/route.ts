import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Workspace } from '@/types/workspace';

export async function POST(req: Request) {
  try {
    const { workspace, uid } = await req.json();

    if (!uid || !workspace?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the workspace document
    const workspaceRef = adminDb.collection('workspaces').doc();
    const workspaceData: Workspace = {
      id: workspaceRef.id,
      name: workspace.name,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      ownerId: uid,
      members: [{
        userId: uid,
        role: 'owner',
        joinedAt: FieldValue.serverTimestamp(),
        email: workspace.ownerEmail,
        name: workspace.ownerName || ''
      }],
      settings: {
        defaultTheme: 'light',
        isPublic: false,
        allowGuestAccess: false
      }
    };

    await workspaceRef.set(workspaceData);

    // Add workspace reference to user's document
    await adminDb.collection('users').doc(uid).update({
      workspaces: FieldValue.arrayUnion(workspaceRef.id),
      defaultWorkspace: workspaceRef.id
    });

    return NextResponse.json({ 
      success: true,
      workspaceId: workspaceRef.id 
    });
  } catch (error) {
    console.error('Workspace creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
} 