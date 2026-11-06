require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { buildOwnerMail, buildThankYouMail, createTransporter } = require('./mailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

function createApp({ getTransporter, ownerEmail, hasAppPassword = false }) {
  const app = express();
  const hits = new Map();

  app.use(cors());
  app.use(express.json({ limit: '20kb' }));
  app.use(express.urlencoded({ extended: true, limit: '20kb' }));

  // Only the public/ folder is served, so server.js and .env are never exposed.
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api/status', (req, res) => {
    res.json({ status: 'online', recipient: ownerEmail, hasAppPassword });
  });

  app.post('/api/contact', async (req, res) => {
    const now = Date.now();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
    if (recent.length >= RATE_LIMIT.max) {
      return res.status(429).json({ success: false, message: 'Too many messages. Please try again later.' });
    }

    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const message = String(req.body?.message ?? '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    if (!EMAIL_RE.test(email) || email.length > 254 || name.length > 100 || message.length > 5000) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email and shorter text.' });
    }

    recent.push(now);
    hits.set(req.ip, recent);

    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    try {
      const transporter = await getTransporter();

      // 1. Deliver the visitor's message to Tharun.
      const ownerResult = await transporter.sendMail(buildOwnerMail({ ownerEmail, name, email, message, timestamp }));
      console.log(`[Mail] Message from ${email} delivered to ${ownerEmail} (${ownerResult.messageId})`);

      // 2. Once received, send the thank-you reply back to the visitor.
      let thankYouSent = true;
      let previewUrl = null;
      try {
        const thanks = await transporter.sendMail(buildThankYouMail({ ownerEmail, name, email, message }));
        console.log(`[Mail] Thank-you reply sent to ${email} (${thanks.messageId})`);
        previewUrl = nodemailer.getTestMessageUrl(thanks) || null;
        if (previewUrl) console.log(`[Mail] Ethereal preview of thank-you mail: ${previewUrl}`);
      } catch (err) {
        thankYouSent = false;
        console.error('[Mail] Thank-you reply failed:', err.message);
      }

      return res.json({
        success: true,
        thankYouSent,
        visitorPreviewUrl: previewUrl,
        message: thankYouSent
          ? 'Message delivered to Tharun and a thank-you mail was sent to your inbox.'
          : 'Message delivered to Tharun. The thank-you mail could not be sent.'
      });
    } catch (err) {
      console.error('[Mail] Delivery failed:', err.message);
      return res.status(500).json({ success: false, message: 'Failed to send your message. Please try again later.' });
    }
  });

  return app;
}

async function start() {
  const PORT = process.env.PORT || 5000;
  const ownerEmail = process.env.EMAIL_USER || 'tharunparthiban2006@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  const mailerPromise = createTransporter({ user: ownerEmail, pass });
  const { mode } = await mailerPromise;

  const app = createApp({
    getTransporter: async () => (await mailerPromise).transporter,
    ownerEmail,
    hasAppPassword: Boolean(pass)
  });

  app.listen(PORT, () => {
    console.log(`\nPortfolio running at http://localhost:${PORT}`);
    console.log(`Mail mode: ${mode}${mode === 'gmail' ? ` (sending as ${ownerEmail})` : ' (set EMAIL_PASS in .env to send real emails)'}\n`);
  });
}

if (require.main === module) start();

module.exports = { createApp };
