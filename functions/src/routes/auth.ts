import { Router } from 'express';
import * as admin from 'firebase-admin';

export const authRoutes = Router();

// Register endpoint
authRoutes.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, role = 'donor' } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and display name are required'
      });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'User registered successfully',
      data: { uid: userRecord.uid }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Login is handled by Firebase Auth SDK on client side
authRoutes.post('/login', async (req, res) => {
  res.json({
    success: true,
    message: 'Use Firebase Auth SDK for login'
  });
});

// Logout is handled by Firebase Auth SDK on client side
authRoutes.post('/logout', async (req, res) => {
  res.json({
    success: true,
    message: 'Use Firebase Auth SDK for logout'
  });
});
