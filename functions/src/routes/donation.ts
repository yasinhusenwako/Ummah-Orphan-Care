import { Router } from 'express';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { authenticate, AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

export const donationRoutes = Router();

// Create subscription
donationRoutes.post('/subscribe', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orphanId, amount } = req.body;

    if (!orphanId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Orphan ID and amount are required'
      });
    }

    // Get or create Stripe customer
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId!)
      .get();

    const userData = userDoc.data();
    let customerId = userData?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: { userId: req.userId! }
      });
      customerId = customer.id;

      // Save customer ID
      await admin.firestore()
        .collection('users')
        .doc(req.userId!)
        .update({ stripeCustomerId: customerId });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price_data: {
        currency: 'etb',
        product_data: { name: `Monthly support for orphan ${orphanId}` },
        recurring: { interval: 'month' },
        unit_amount: amount * 100
      }}],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Create donation record
    const donationRef = await admin.firestore()
      .collection('donations')
      .add({
        donorId: req.userId,
        orphanId,
        amount,
        currency: 'etb',
        type: 'recurring',
        status: 'active',
        stripeSubscriptionId: subscription.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      success: true,
      data: {
        donationId: donationRef.id,
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel subscription
donationRoutes.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { donationId } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        error: 'Donation ID is required'
      });
    }

    const donationDoc = await admin.firestore()
      .collection('donations')
      .doc(donationId)
      .get();

    if (!donationDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
    }

    const donation = donationDoc.data();

    // Verify ownership
    if (donation?.donorId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    // Cancel Stripe subscription
    if (donation?.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(donation.stripeSubscriptionId);
    }

    // Update donation status
    await admin.firestore()
      .collection('donations')
      .doc(donationId)
      .update({
        status: 'cancelled',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get donation history
donationRoutes.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('donations')
      .where('donorId', '==', req.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: donations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
