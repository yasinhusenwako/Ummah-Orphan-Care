import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import routes
import { authRoutes } from './routes/auth';
import { donorRoutes } from './routes/donor';
import { orphanRoutes } from './routes/orphan';
import { donationRoutes } from './routes/donation';
import { adminRoutes } from './routes/admin';
import { webhookRoutes } from './routes/webhook';

// Register routes
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/orphans', orphanRoutes);
app.use('/donations', donationRoutes);
app.use('/admin', adminRoutes);
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export the API
export const api = functions.https.onRequest(app);

// Export scheduled functions
export { sendMonthlyReports } from './scheduled/reports';
export { processRecurringDonations } from './scheduled/donations';
