import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    // Get user document from Firebase
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // If user has a subscription ID, verify it with Stripe
    if (userData.subscription?.subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(
        userData.subscription.subscriptionId
      );

      // Update subscription status if it has changed
      if (subscription.status !== userData.subscription.status) {
        await setDoc(doc(db, 'users', uid), {
          subscription: {
            ...userData.subscription,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ 
          success: true,
          updated: true,
          newStatus: subscription.status
        });
      }

      return NextResponse.json({ 
        success: true,
        updated: false,
        status: subscription.status
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'No subscription found'
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription status' },
      { status: 500 }
    );
  }
} 