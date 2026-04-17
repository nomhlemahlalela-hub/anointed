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

// ── RSVP CONFIRMATION EMAIL ──
// Triggered when a new RSVP document is created
exports.onRsvpCreated = functions.firestore
  .document('rsvps/{rsvpId}')
  .onCreate(async (snap) => {
    const rsvp = snap.data();

    const html = `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
        <div style="background:#1a3d2e;padding:32px;text-align:center">
          <h1 style="color:#b8922a;font-size:1.6rem;margin:0;font-weight:400">Anointed in Living Christ</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase">RSVP Confirmed</p>
        </div>
        <div style="padding:32px;background:#fffdf8">
          <p>Dear <strong>${rsvp.name}</strong>,</p>
          <p>Your RSVP for <strong>${rsvp.event}</strong> has been received. We are looking forward to seeing you!</p>

          <div style="background:#f2ece0;border-radius:4px;padding:20px;margin:20px 0">
            <p style="margin:0;line-height:2.2;font-size:0.9rem">
              <strong>Event:</strong> ${rsvp.event}<br>
              <strong>Guests:</strong> ${rsvp.count || 1}<br>
              ${rsvp.message ? `<strong>Note:</strong> ${rsvp.message}` : ''}
            </p>
          </div>

          <p style="font-size:0.88rem;color:#888">
            Questions? Email us at
            <a href="mailto:info@anointedlivingchrist.org" style="color:#1a3d2e">info@anointedlivingchrist.org</a>
          </p>
          <p>God bless you, ${rsvp.name}! 🙏</p>
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
        to:      rsvp.email,
        subject: `RSVP Confirmed — ${rsvp.event}`,
        html,
      });
      console.log(`RSVP confirmation sent to ${rsvp.email}`);
    } catch (err) {
      console.error('Failed to send RSVP confirmation:', err);
    }
  });


// ── PRAYER REQUEST ACKNOWLEDGEMENT ──
// Triggered when a new prayer request is submitted
exports.onPrayerRequestCreated = functions.firestore
  .document('prayerRequests/{reqId}')
  .onCreate(async (snap) => {
    const req = snap.data();

    // Only email if not anonymous and email was provided
    if (req.anonymous || !req.email) return null;

    const html = `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
        <div style="background:#1a3d2e;padding:32px;text-align:center">
          <h1 style="color:#b8922a;font-size:1.6rem;margin:0;font-weight:400">Anointed in Living Christ</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase">Prayer Request Received</p>
        </div>
        <div style="padding:32px;background:#fffdf8">
          <p>Dear <strong>${req.name}</strong>,</p>
          <p>
            We have received your prayer request and our prayer team has been notified.
            You are not alone — we are standing in faith with you.
          </p>
          <blockquote style="border-left:3px solid #b8922a;margin:24px 0;padding:12px 20px;font-style:italic;color:#888">
            "Cast all your anxiety on him because he cares for you." — 1 Peter 5:7
          </blockquote>
          <p style="font-size:0.88rem;color:#888">
            If you need to speak to a pastor, please email
            <a href="mailto:pastor@anointedlivingchrist.org" style="color:#1a3d2e">pastor@anointedlivingchrist.org</a>
          </p>
          <p>God bless you! 🙏</p>
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
        to:      req.email,
        subject: 'Prayer Request Received — Anointed in Living Christ',
        html,
      });
      console.log(`Prayer acknowledgement sent to ${req.email}`);
    } catch (err) {
      console.error('Failed to send prayer acknowledgement:', err);
    }

    return null;
  });


// ── WEEKLY SUNDAY REMINDER ──
// Runs every Sunday at 8:00 AM (Africa/Johannesburg = UTC+2, so 06:00 UTC)
exports.sundayServiceReminder = functions.pubsub
  .schedule('0 6 * * 0')
  .timeZone('Africa/Johannesburg')
  .onRun(async () => {
    console.log('Running Sunday service reminder...');

    // Get all users who have eventReminders enabled
    const usersSnap = await db.collection('users')
      .where('eventReminders', '==', true)
      .get();

    if (usersSnap.empty) {
      console.log('No users with reminders enabled.');
      return null;
    }

    const transporter = getTransporter();

    const sendPromises = usersSnap.docs.map(async (doc) => {
      const user = doc.data();
      if (!user.email) return;

      const html = `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
          <div style="background:#1a3d2e;padding:32px;text-align:center">
            <h1 style="color:#b8922a;font-size:1.6rem;margin:0;font-weight:400">Sunday Service Today</h1>
            <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase">Anointed in Living Christ</p>
          </div>
          <div style="padding:32px;background:#fffdf8;text-align:center">
            <p style="font-size:1.1rem">Good morning, <strong>${user.name || 'Beloved'}</strong>!</p>
            <p style="line-height:1.8;color:#383838">
              Sunday service is today. Come as you are and experience the presence of God.
              All our branches are open and ready to worship with you.
            </p>
            <blockquote style="border-left:3px solid #b8922a;margin:24px auto;padding:12px 20px;font-style:italic;color:#888;max-width:400px;text-align:left">
              "This is the day that the Lord has made; let us rejoice and be glad in it." — Psalm 118:24
            </blockquote>
            <a href="https://anointedlivingchrist.org"
               style="background:#b8922a;color:#0e0e0e;text-decoration:none;padding:14px 32px;border-radius:2px;font-size:0.8rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;display:inline-block;margin-top:8px">
              Visit Website
            </a>
          </div>
          <div style="background:#1a3d2e;padding:20px;text-align:center">
            <p style="color:rgba(255,255,255,0.4);font-size:0.72rem;margin:0;letter-spacing:0.1em;text-transform:uppercase">
              © 2026 Anointed in Living Christ · All rights reserved
            </p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from:    '"Anointed in Living Christ" <noreply@anointedlivingchrist.org>',
          to:      user.email,
          subject: '🙏 Sunday Service Today — Anointed in Living Christ',
          html,
        });
      } catch (err) {
        console.error(`Failed to send Sunday reminder to ${user.email}:`, err);
      }
    });

    await Promise.all(sendPromises);
    console.log(`Sunday reminders sent to ${usersSnap.size} users.`);
    return null;
  });
