import { NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;
    const { dataSource } = await req.json();

    if (!uid || !dataSource) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await adminDb.collection('users').doc(uid).update({
      dataSources: FieldValue.arrayUnion(dataSource)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update data sources error:', error);
    return NextResponse.json(
      { error: 'Failed to update data sources' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;
    const { dataSource } = await req.json();

    if (!uid || !dataSource) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await adminDb.collection('users').doc(uid).update({
      dataSources: FieldValue.arrayRemove(dataSource)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete data source error:', error);
    return NextResponse.json(
      { error: 'Failed to delete data source' },
      { status: 500 }
    );
  }
} 