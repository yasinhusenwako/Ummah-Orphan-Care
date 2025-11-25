import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configure your email service
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ummah-orphan-care.org',
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
