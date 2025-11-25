import { Router } from 'express';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { sendEmail } from '../utils/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

export const webhookRoutes = Router();

// Stripe webhook handler
webhookRoutes.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({
      success: false,
      error: 'Webhook secret not configured'
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: `Webhook Error: ${err.message}`
    });
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleSuccessfulPayment(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  // Find donation by subscription ID
  const donationsSnapshot = await admin.firestore()
    .collection('donations')
    .where('stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get();

  if (!donationsSnapshot.empty) {
    const donationDoc = donationsSnapshot.docs[0];
    const donation = donationDoc.data();

    // Update donation record
    await donationDoc.ref.update({
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get donor info
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(donation.donorId)
      .get();

    const userData = userDoc.data();

    // Send thank you email
    if (userData?.email) {
      await sendEmail({
        to: userData.email,
        subject: 'Thank you for your donation',
        html: `
          <h1>እናመሰግናለን! (Thank you!)</h1>
          <p>Your monthly donation of ብር ${donation.amount} (ETB ${donation.amount}) has been processed successfully.</p>
          <p>Your support makes a real difference in the lives of Ethiopian orphans across all regions - from Addis Ababa to Mekelle, Bahir Dar to Hawassa.</p>
          <p>የኢትዮጵያ ወላጅ አልባ ህጻናት እንክብካቤ - Ethiopian Orphan Care</p>
        `
      });
    }
  }
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  const donationsSnapshot = await admin.firestore()
    .collection('donations')
    .where('stripeSubscriptionId', '==', subscriptionId)
    .limit(1)
    .get();

  if (!donationsSnapshot.empty) {
    const donationDoc = donationsSnapshot.docs[0];
    const donation = donationDoc.data();

    // Get donor info
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(donation.donorId)
      .get();

    const userData = userDoc.data();

    // Send payment failed email
    if (userData?.email) {
      await sendEmail({
        to: userData.email,
        subject: 'Payment Failed',
        html: `
          <h1>Payment Failed - ክፍያ አልተሳካም</h1>
          <p>We were unable to process your monthly donation of ብር ${donation.amount} (ETB ${donation.amount}).</p>
          <p>Please update your payment method to continue supporting Ethiopian orphans across all regions.</p>
          <p>የኢትዮጵያ ወላጅ አልባ ህጻናት እንክብካቤ - Ethiopian Orphan Care</p>
        `
      });
    }
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const donationsSnapshot = await admin.firestore()
    .collection('donations')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (!donationsSnapshot.empty) {
    await donationsSnapshot.docs[0].ref.update({
      status: 'cancelled',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}
