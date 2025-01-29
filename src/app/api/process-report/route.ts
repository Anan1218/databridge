import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate user exists
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?uid=${data.userId}`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('FastAPI error:', errorData);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 500 }
    );
  }
} 