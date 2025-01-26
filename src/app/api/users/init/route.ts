import { adminDb } from '@/utils/firebaseAdmin'; // Would need to create admin instance
import { UserData } from '@/types'; // Assuming type definition exists

export async function POST(req: Request) {
  try {
    const { userData, uid } = await req.json();
    
    // Server-side validation
    if (!uid || !userData?.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Write to Firestore using Admin SDK
    await adminDb.collection('users').doc(uid).set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize user' },
      { status: 500 }
    );
  }
}