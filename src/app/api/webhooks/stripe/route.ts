import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed':
      // Update user's subscription status in Firebase
      const userRef = doc(db, 'users', session.metadata.userId);
      await updateDoc(userRef, {
        subscriptionStatus: 'active',
        subscriptionId: session.subscription as string,
        customerId: session.customer as string,
      });
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscription = event.data.object as Stripe.Subscription;
      const userDoc = doc(db, 'users', subscription.metadata.userId);
      await updateDoc(userDoc, {
        subscriptionStatus: 'canceled',
      });
      break;
  }

  return NextResponse.json({ received: true });
} 