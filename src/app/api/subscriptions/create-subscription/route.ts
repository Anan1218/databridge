import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, email } = await req.json();

    // Validate user exists
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?uid=${userId}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 