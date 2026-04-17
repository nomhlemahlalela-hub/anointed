const functions  = require('firebase-functions');
const admin      = require('firebase-admin');
const nodemailer = require('nodemailer');

const db = admin.firestore();

function getTransporter() {
  const config = functions.config().mail || {};
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user || process.env.MAIL_USER,
      pass: config.pass || process.env.MAIL_PASS,
    },
  });
}

// ── WELCOME EMAIL ON REGISTRATION ──
// Fires when a new Firebase Auth user is created
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;
  const name = displayName || (email ? email.split('@')[0] : 'Friend');

  // Ensure user doc exists in Firestore
  await db.collection('users').doc(uid).set(
    { uid, email, name, createdAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
      <div style="background:#1a3d2e;padding:40px;text-align:center">
        <h1 style="color:#b8922a;font-size:2rem;margin:0;font-weight:400">Welcome to the Family</h1>
        <p style="color:rgba(255,255,255,0.5);margin:10px 0 0;font-size:0.8rem;letter-spacing:0.14em;text-transform:uppercase">
          Anointed in Living Christ
        </p>
      </div>
      <div style="padding:40px;background:#fffdf8">
        <p style="font-size:1.1rem">Dear <strong>${name}</strong>,</p>
        <p style="line-height:1.8;color:#383838">
          We are so glad you have joined us. You are now part of the Anointed in Living Christ family —
          a community rooted in faith, love, and the power of the Holy Spirit.
        </p>
        <blockquote style="border-left:3px solid #b8922a;margin:24px 0;padding:12px 20px;font-style:italic;color:#888;font-size:1rem">
          "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you,
          plans to give you hope and a future." — Jeremiah 29:11
        </blockquote>
        <p style="line-height:1.8;color:#383838">
          With your account you can now:
        </p>
        <ul style="line-height:2;color:#383838;padding-left:20px">
          <li>Track your orders from our store</li>
          <li>RSVP to upcoming events</li>
          <li>Submit prayer requests</li>
          <li>Take the Bible Quiz and save your score to the leaderboard</li>
        </ul>
        <div style="text-align:center;margin:32px 0">
          <a href="https://anointedlivingchrist.org"
             style="background:#1a3d2e;color:white;text-decoration:none;padding:14px 32px;border-radius:2px;font-size:0.8rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase">
            Visit Our Website
          </a>
        </div>
        <p style="font-size:0.85rem;color:#888">
          God bless you, ${name}. We look forward to growing in faith together. 🙏
        </p>
      </div>
      <div style="background:#1a3d2e;padding:20px;text-align:center">
        <p style="color:rgba(255,255,255,0.4);font-size:0.72rem;margin:0;letter-spacing:0.1em;text-transform:uppercase">
          © 2026 Anointed in Living Christ · All rights reserved
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from:    '"Anointed in Living Christ" <noreply@anointedlivingchrist.org>',
      to:      email,
      subject: `Welcome to Anointed in Living Christ, ${name}! 🙏`,
      html,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
});


// ── CLEANUP ON USER DELETION ──
// Fires when a Firebase Auth user account is deleted
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;
  try {
    // Delete the user's Firestore profile document
    await db.collection('users').doc(uid).delete();
    console.log(`Deleted Firestore user doc for uid: ${uid}`);
  } catch (err) {
    console.error(`Failed to delete Firestore data for uid ${uid}:`, err);
  }
});
