import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticate, AuthRequest } from '../middleware/auth';

export const donorRoutes = Router();

// Get donor profile
donorRoutes.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId!)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { id: userDoc.id, ...userDoc.data() }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get donor donations
donorRoutes.get('/donations', authenticate, async (req: AuthRequest, res) => {
  try {
    const donationsSnapshot = await admin.firestore()
      .collection('donations')
      .where('donorId', '==', req.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const donations = donationsSnapshot.docs.map(doc => ({
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
