import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, UserSubscription } from '@/types/user';

// Initialize Stripe with the latest version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-02-15',  // Latest version as of March 2024
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, email } = await req.json();

    // Create or retrieve customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        priceId
      },
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: {
        userId,
        priceId
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto'
      }
    });

    // Update user document with customer ID
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.customerId': customer.id,
      'subscription.status': 'pending',
      updatedAt: new Date()
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 