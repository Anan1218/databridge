import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { UserData } from '@/types/user';
import { FieldValue } from 'firebase-admin/firestore';
import { Workspace } from '@/types/workspace';

export async function POST(req: Request) {
  try {
    const { userData, uid, workspaceData }: { userData: UserData; uid: string; workspaceData?: Workspace } = await req.json();

    if (!uid || !userData?.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create default workspace if not provided
    const defaultWorkspace = workspaceData || {
      name: `${userData.firstName || 'My'} Workspace`,
      owner: {
        uid: uid,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || ''
      },
      members: [{
        uid: uid,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: 'owner'
      }],
      dashboards: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Create workspace document
    const workspaceRef = adminDb.collection('workspaces').doc();
    await workspaceRef.set(defaultWorkspace);

    // Initialize user with default workspace
    await adminDb.collection('users').doc(uid).set({
      ...userData,
      workspaces: [workspaceRef.id],
      defaultWorkspace: workspaceRef.id,
      dataSources: [],
      enabledDashboards: [],
      subscription: {
        subscriptionStatus: null,
        subscriptionId: null,
        customerId: null,
        trialEnds: null,
        plan: null
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ 
      success: true,
      workspaceId: workspaceRef.id
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user' },
      { status: 500 }
    );
  }
}