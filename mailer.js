const nodemailer = require('nodemailer');

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Build the mail sent to the portfolio owner when someone submits the form. */
function buildOwnerMail({ ownerEmail, name, email, message, timestamp }) {
  return {
    from: `"Tharun Portfolio Bot" <${ownerEmail}>`,
    to: ownerEmail,
    replyTo: email,
    subject: `New Portfolio Message from ${name.replace(/[\r\n]+/g, ' ')}`,
    text: `New Portfolio Contact Submission\n\nName: ${name}\nEmail: ${email}\nDate: ${timestamp}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#030712;color:#f3f4f6;padding:30px;border-radius:12px;max-width:600px;margin:0 auto;border:1px solid #1f2937;">
        <div style="border-bottom:2px solid #00f0ff;padding-bottom:15px;margin-bottom:20px;">
          <h2 style="color:#00f0ff;margin:0;font-size:24px;letter-spacing:1px;">&lt;THARUN.P/&gt; PORTFOLIO TRANSMISSION</h2>
          <p style="color:#9ca3af;margin:5px 0 0;font-size:13px;">Inbound message from the website contact form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
          <tr><td style="padding:8px 0;color:#00f0ff;font-weight:bold;width:90px;">SENDER:</td><td style="padding:8px 0;color:#fff;">${esc(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#00f0ff;font-weight:bold;">EMAIL:</td><td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#00f0ff;">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#00f0ff;font-weight:bold;">TIME:</td><td style="padding:8px 0;color:#9ca3af;">${esc(timestamp)}</td></tr>
        </table>
        <div style="background:#0b1329;border-left:4px solid #ff0055;border-radius:6px;padding:18px;margin:20px 0;">
          <h4 style="margin:0 0 10px;color:#ff0055;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Message</h4>
          <p style="margin:0;color:#e5e7eb;line-height:1.6;white-space:pre-wrap;font-size:15px;">${esc(message)}</p>
        </div>
        <p style="text-align:center;margin-top:25px;">
          <a href="mailto:${esc(email)}" style="background:#00f0ff;color:#000;font-weight:bold;text-decoration:none;padding:12px 25px;border-radius:6px;display:inline-block;font-size:14px;">REPLY TO ${esc(name.toUpperCase())}</a>
        </p>
      </div>`
  };
}

/** Build the automatic thank-you reply sent back to the visitor after their message is received. */
function buildThankYouMail({ ownerEmail, name, email, message }) {
  const excerpt = message.length > 250 ? `${message.slice(0, 250)}...` : message;
  return {
    from: `"Tharun P" <${ownerEmail}>`,
    to: email,
    replyTo: ownerEmail,
    subject: `Thank you for reaching out, ${name.replace(/[\r\n]+/g, ' ')}! - Tharun P`,
    text:
`Hi ${name},

Thank you for reaching out through my portfolio website! I have received your message:

"${excerpt}"

I personally review every message and will reply within 24 hours.

Warm regards,
Tharun P
AI & ML Engineer - Creative Full-Stack Developer
Chennai, Tamil Nadu, India
LinkedIn: https://www.linkedin.com/in/tharun-p-dce-chennai-901892342`,
    html: `
      <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#020617;color:#f8fafc;padding:35px 25px;border-radius:14px;max-width:620px;margin:0 auto;border:1px solid rgba(0,240,255,.3);">
        <div style="text-align:center;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:20px;margin-bottom:25px;">
          <div style="display:inline-block;padding:4px 14px;border-radius:20px;background:rgba(0,255,135,.15);border:1px solid #00ff87;color:#00ff87;font-size:11px;letter-spacing:1.5px;font-weight:bold;margin-bottom:12px;">&#9679; MESSAGE RECEIVED</div>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;">Thank You for Reaching Out!</h1>
        </div>
        <div style="font-size:15px;line-height:1.7;color:#cbd5e1;">
          <p style="font-size:17px;font-weight:bold;color:#fff;margin-top:0;">Hi ${esc(name)},</p>
          <p>Thank you so much for getting in touch through my portfolio website. Your message has landed safely in my inbox.</p>
          <div style="background:#0b1329;border-left:4px solid #00f0ff;border-radius:8px;padding:15px 18px;margin:20px 0;">
            <div style="color:#00f0ff;font-size:12px;font-family:monospace;font-weight:bold;margin-bottom:6px;text-transform:uppercase;">Your message</div>
            <div style="color:#e2e8f0;font-style:italic;font-size:14px;line-height:1.5;white-space:pre-wrap;">&ldquo;${esc(excerpt)}&rdquo;</div>
          </div>
          <p>I personally review every enquiry about <strong>machine learning &amp; AI</strong>, <strong>full-stack engineering</strong> and <strong>creative technology</strong>. You can expect a reply within <strong>24 hours</strong>.</p>
          <p style="text-align:center;margin:25px 0;">
            <a href="https://www.linkedin.com/in/tharun-p-dce-chennai-901892342" style="background:#0077b5;color:#fff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:6px;display:inline-block;font-size:13px;">Connect on LinkedIn &rarr;</a>
          </p>
          <div style="border-top:1px dashed rgba(255,255,255,.15);padding-top:18px;margin-top:25px;">
            <p style="margin:0;color:#94a3b8;font-size:13px;font-family:monospace;">Warm regards,</p>
            <h3 style="margin:4px 0 2px;color:#fff;font-size:18px;">Tharun P</h3>
            <p style="margin:0;color:#00f0ff;font-size:13px;">AI &amp; ML Engineer &bull; Creative Full-Stack Developer</p>
            <p style="margin:2px 0 0;color:#64748b;font-size:12px;">Chennai, Tamil Nadu, India</p>
          </div>
        </div>
        <p style="border-top:1px solid rgba(255,255,255,.08);padding-top:15px;margin:25px 0 0;text-align:center;font-size:11px;color:#64748b;">This confirmation was sent automatically from the portfolio of Tharun P.</p>
      </div>`
  };
}

/**
 * Create a transporter. With EMAIL_PASS set, uses Gmail SMTP (App Password).
 * Otherwise falls back to an Ethereal test inbox, or a console-logging mock when offline.
 */
async function createTransporter({ user, pass }) {
  if (pass) {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    return { transporter, mode: 'gmail' };
  }
  try {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass }
    });
    return { transporter, mode: 'ethereal' };
  } catch (err) {
    const transporter = {
      sendMail: async (opts) => {
        console.log(`[Mock mail] To: ${opts.to} | Subject: ${opts.subject}`);
        return { messageId: `mock-${Date.now()}` };
      }
    };
    return { transporter, mode: 'mock' };
  }
}

module.exports = { esc, buildOwnerMail, buildThankYouMail, createTransporter };
