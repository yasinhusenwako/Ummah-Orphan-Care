import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Process recurring donations (backup to Stripe)
export const processRecurringDonations = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const now = new Date();
      
      // Get active recurring donations
      const donationsSnapshot = await admin.firestore()
        .collection('donations')
        .where('type', '==', 'recurring')
        .where('status', '==', 'active')
        .get();

      console.log(`Processing ${donationsSnapshot.size} active subscriptions`);

      // Update orphan donor counts
      const orphanUpdates: { [key: string]: number } = {};

      donationsSnapshot.docs.forEach(doc => {
        const donation = doc.data();
        if (donation.orphanId) {
          orphanUpdates[donation.orphanId] = (orphanUpdates[donation.orphanId] || 0) + 1;
        }
      });

      // Update each orphan's donor count
      for (const [orphanId, count] of Object.entries(orphanUpdates)) {
        await admin.firestore()
          .collection('orphans')
          .doc(orphanId)
          .update({ currentDonors: count });
      }

      console.log('Recurring donations processed successfully');
    } catch (error) {
      console.error('Error processing recurring donations:', error);
    }
  });
