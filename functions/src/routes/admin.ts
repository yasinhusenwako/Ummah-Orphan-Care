import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

export const adminRoutes = Router();

// All admin routes require authentication and admin role
adminRoutes.use(authenticate, requireRole('admin'));

// Get dashboard stats
adminRoutes.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const [usersSnapshot, orphansSnapshot, donationsSnapshot] = await Promise.all([
      admin.firestore().collection('users').get(),
      admin.firestore().collection('orphans').get(),
      admin.firestore().collection('donations').get()
    ]);

    const users = usersSnapshot.docs.map(doc => doc.data());
    const donations = donationsSnapshot.docs.map(doc => doc.data());

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = donations
      .filter((d: any) => {
        const createdAt = d.createdAt?.toDate();
        return createdAt && 
               createdAt.getMonth() === currentMonth && 
               createdAt.getFullYear() === currentYear;
      })
      .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

    const stats = {
      totalDonors: users.filter((u: any) => u.role === 'donor').length,
      totalOrphans: orphansSnapshot.size,
      totalDonations: donationsSnapshot.size,
      monthlyRevenue,
      activeSubscriptions: donations.filter((d: any) => 
        d.type === 'recurring' && d.status === 'active'
      ).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all donors
adminRoutes.get('/donors', async (req: AuthRequest, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('users')
      .where('role', '==', 'donor')
      .orderBy('createdAt', 'desc')
      .get();

    const donors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: donors
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all donations
adminRoutes.get('/donations', async (req: AuthRequest, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('donations')
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

// Category management
adminRoutes.get('/category', async (req: AuthRequest, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('categories')
      .get();

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

adminRoutes.post('/category', async (req: AuthRequest, res) => {
  try {
    const docRef = await admin.firestore()
      .collection('categories')
      .add({
        ...req.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      success: true,
      message: 'Category created successfully',
      data: { id: docRef.id }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

adminRoutes.put('/category/:id', async (req: AuthRequest, res) => {
  try {
    await admin.firestore()
      .collection('categories')
      .doc(req.params.id)
      .update(req.body);

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

adminRoutes.delete('/category/:id', async (req: AuthRequest, res) => {
  try {
    await admin.firestore()
      .collection('categories')
      .doc(req.params.id)
      .delete();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Orphan updates
adminRoutes.post('/orphan-update', async (req: AuthRequest, res) => {
  try {
    const docRef = await admin.firestore()
      .collection('orphanUpdates')
      .add({
        ...req.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      success: true,
      message: 'Update posted successfully',
      data: { id: docRef.id }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

adminRoutes.delete('/orphan-update/:id', async (req: AuthRequest, res) => {
  try {
    await admin.firestore()
      .collection('orphanUpdates')
      .doc(req.params.id)
      .delete();

    res.json({
      success: true,
      message: 'Update deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
