import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/api/send-bulk-email', async (req, res) => {
  try {
    const { recipients, subject, body } = req.body;

    // Validate input
    if (!recipients?.length || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    const results = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const emailPromises = batch.map(recipient => 
        transporter.sendMail({
          from: {
            name: 'Your App Name',
            address: process.env.SMTP_FROM_ADDRESS as string
          },
          to: {
            name: recipient.name,
            address: recipient.email
          },
          subject: subject,
          text: body,
          html: body.replace(/\n/g, '<br>'),
        })
      );

      const batchResults = await Promise.allSettled(emailPromises);
      results.push(...batchResults);
    }

    // Check for any failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length) {
      console.error('Some emails failed to send:', failures);
      return res.status(207).json({
        message: `${results.length - failures.length} of ${results.length} emails sent successfully`,
        failures: failures.length
      });
    }

    res.json({ 
      success: true, 
      message: `Successfully sent ${results.length} emails` 
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ 
      error: 'Failed to send emails',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 