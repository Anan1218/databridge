import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Initialize Stripe with the latest version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const { priceId, userId, email } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        priceId
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/admin?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe?canceled=true`,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    try {
      // Update Firestore document with more complete subscription data
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        subscription: {
          customerId: customer.id,
          status: 'pending',
          priceId: priceId,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (firestoreError) {
      // Log Firestore error but don't fail the request
      console.error('Firestore update error:', firestoreError);
      // We'll update the user document via webhook instead
    }

    // Return session ID even if Firestore update fails
    return NextResponse.json({ sessionId: session.id });
    
  } catch (error) {
    console.error('Error in create-subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription. Please try again.' },
      { status: 500 }
    );
  }
} 