import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { db } from '@/utils/firebase';
import { doc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        if (!session.subscription) {
          console.error('No subscription ID in session');
          return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log('Retrieved subscription:', subscription.id);

        if (!session.metadata?.userId) {
          console.error('Missing user ID in session metadata');
          return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const userRef = doc(db, 'users', session.metadata.userId);
        console.log('Updating user:', session.metadata.userId);

        await setDoc(userRef, {
          subscription: {
            status: 'active',
            subscriptionId: session.subscription as string,
            customerId: session.customer as string,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log('User subscription updated successfully');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userRef = doc(db, 'users', subscription.metadata.userId);
        
        // Verify user exists
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users?uid=${subscription.metadata.userId}`);
        if (!response.ok) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        await setDoc(userRef, {
          subscription: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userRef = doc(db, 'users', subscription.metadata.userId);
        await setDoc(userRef, {
          subscription: {
            status: 'canceled',
            canceledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 