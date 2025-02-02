import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  if (!uid) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const notificationsSnap = await adminDb
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .where('status', '==', 'pending')
      // .orderBy('timestamp', 'desc')
      .get();

    const notifications = notificationsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
} 