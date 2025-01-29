import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.user_id || !body.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: user_id and location' },
        { status: 400 }
      );
    }

    // Validate user exists
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?uid=${body.user_id}`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = `${BACKEND_URL}/api/events/${body.user_id}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: body.location,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        updatedAt: new Date(),
        receiveUpdates: body.receiveUpdates || false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching events:', err);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 