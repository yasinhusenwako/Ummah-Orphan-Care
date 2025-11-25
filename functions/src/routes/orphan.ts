import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

export const orphanRoutes = Router();

// Get all orphans (public)
orphanRoutes.get('/', async (req, res) => {
  try {
    const { categoryId, search, limit = 10 } = req.query;
    
    let query: admin.firestore.Query = admin.firestore()
      .collection('orphans')
      .orderBy('createdAt', 'desc')
      .limit(Number(limit));

    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }

    const snapshot = await query.get();
    let orphans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side search
    if (search) {
      const searchTerm = String(search).toLowerCase();
      orphans = orphans.filter((orphan: any) =>
        orphan.name?.toLowerCase().includes(searchTerm) ||
        orphan.location?.toLowerCase().includes(searchTerm) ||
        orphan.story?.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      data: orphans
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get orphan by ID (public)
orphanRoutes.get('/:id', async (req, res) => {
  try {
    const doc = await admin.firestore()
      .collection('orphans')
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Orphan not found'
      });
    }

    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create orphan (admin only)
orphanRoutes.post('/', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const orphanData = {
      ...req.body,
      currentDonors: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore()
      .collection('orphans')
      .add(orphanData);

    res.json({
      success: true,
      message: 'Orphan created successfully',
      data: { id: docRef.id }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update orphan (admin only)
orphanRoutes.put('/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    await admin.firestore()
      .collection('orphans')
      .doc(req.params.id)
      .update({
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({
      success: true,
      message: 'Orphan updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete orphan (admin only)
orphanRoutes.delete('/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    await admin.firestore()
      .collection('orphans')
      .doc(req.params.id)
      .delete();

    res.json({
      success: true,
      message: 'Orphan deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
