import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from '../utils/email';

// Send monthly reports to admins
export const sendMonthlyReports = functions.pubsub
  .schedule('0 0 1 * *') // First day of every month at midnight
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      // Get all admins
      const adminsSnapshot = await admin.firestore()
        .collection('users')
        .where('role', '==', 'admin')
        .get();

      // Get stats for last month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const donationsSnapshot = await admin.firestore()
        .collection('donations')
        .where('createdAt', '>=', lastMonth)
        .where('createdAt', '<', thisMonth)
        .get();

      const donations = donationsSnapshot.docs.map(doc => doc.data());
      const totalRevenue = donations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      const newDonors = donations.filter((d: any) => d.type === 'recurring').length;

      // Send email to each admin
      for (const adminDoc of adminsSnapshot.docs) {
        const admin = adminDoc.data();
        if (admin.email) {
          await sendEmail({
            to: admin.email,
            subject: 'Monthly Report - Ummah Orphan Care',
            html: `
              <h1>Monthly Report</h1>
              <p>Here's your monthly summary:</p>
              <ul>
                <li>Total Donations: ${donations.length}</li>
                <li>Total Revenue: ብር ${totalRevenue} (ETB ${totalRevenue})</li>
                <li>New Recurring Donors: ${newDonors}</li>
              </ul>
            `
          });
        }
      }

      console.log('Monthly reports sent successfully');
    } catch (error) {
      console.error('Error sending monthly reports:', error);
    }
  });
