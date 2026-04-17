const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const nodemailer = require('nodemailer');

const db = admin.firestore();

// ── EMAIL TRANSPORTER ──
// Set these in Firebase environment config:
//   firebase functions:config:set mail.user="your@gmail.com" mail.pass="app_password"
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

// ── ORDER CONFIRMATION EMAIL ──
// Triggered whenever a new order document is created in Firestore
exports.onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order   = snap.data();
    const orderId = context.params.orderId;
    const ref     = 'ALC-' + orderId.substring(0, 8).toUpperCase();

    // Build items table for email
    const itemRows = (order.items || [])
      .map(i => `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e6e0d4">${i.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e6e0d4">${i.size || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e6e0d4;text-align:right">R${i.price}</td>
      </tr>`)
      .join('');

    const deliveryInfo = order.method === 'pickup'
      ? `<p><strong>Method:</strong> Church Pickup — ${order.branch || 'Branch TBC'}</p>`
      : `<p><strong>Method:</strong> Delivery to ${order.address || 'Address on file'}</p>`;

    const html = `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
        <div style="background:#1a3d2e;padding:32px;text-align:center">
          <h1 style="color:#b8922a;font-size:1.6rem;margin:0;font-weight:400">Anointed in Living Christ</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase">Order Confirmation</p>
        </div>

        <div style="padding:32px;background:#fffdf8">
          <p>Dear <strong>${order.name}</strong>,</p>
          <p>Thank you for your order. We have received it and it is currently <strong>pending payment</strong>.</p>

          <div style="background:#fff8e1;border-left:3px solid #b8922a;padding:12px 16px;margin:20px 0;font-size:0.9rem">
            <strong>Order Reference:</strong> ${ref}
          </div>

          <h3 style="font-size:1rem;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid #e6e0d4;padding-bottom:8px">Order Summary</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <thead>
              <tr style="background:#f2ece0">
                <th style="padding:8px 12px;text-align:left;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase">Item</th>
                <th style="padding:8px 12px;text-align:left;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase">Size</th>
                <th style="padding:8px 12px;text-align:right;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:700;font-size:1rem">Total</td>
                <td style="padding:12px;font-weight:700;font-size:1.1rem;text-align:right;color:#1a3d2e">R${order.total}</td>
              </tr>
            </tfoot>
          </table>

          ${deliveryInfo}
          <p><strong>Payment Method:</strong> ${order.payMethod || 'EFT'}</p>

          <div style="background:#f2ece0;border-radius:4px;padding:16px;margin-top:24px;font-size:0.88rem">
            <p style="margin:0 0 8px"><strong>Bank Details for EFT:</strong></p>
            <p style="margin:0;line-height:2">
              Bank: <strong>FNB</strong><br>
              Account Name: <strong>Anointed in Living Christ</strong><br>
              Account Number: <strong>XXXX XXXX XXXX</strong><br>
              Branch Code: <strong>250655</strong><br>
              Reference: <strong>${ref}</strong>
            </p>
          </div>

          <p style="margin-top:24px;font-size:0.88rem;color:#888">
            Questions? Email <a href="mailto:finance@anointedlivingchrist.org" style="color:#1a3d2e">finance@anointedlivingchrist.org</a>
            with your reference <strong>${ref}</strong>.
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
        to:      order.email,
        subject: `Order Confirmed — ${ref} | Anointed in Living Christ`,
        html,
      });
      console.log(`Order confirmation email sent to ${order.email} for ${ref}`);
    } catch (err) {
      console.error('Failed to send order confirmation email:', err);
    }
  });


// ── ORDER STATUS UPDATE EMAIL ──
// Triggered whenever an order's status field changes
exports.onOrderStatusUpdated = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before  = change.before.data();
    const after   = change.after.data();
    const orderId = context.params.orderId;

    // Only proceed if status actually changed
    if (before.status === after.status) return null;

    const ref = 'ALC-' + orderId.substring(0, 8).toUpperCase();

    const statusMessages = {
      confirmed:       { label: 'Order Confirmed',  body: 'Great news — your order has been confirmed and is being processed.' },
      in_progress:     { label: 'Being Prepared',   body: 'Your order is currently being packed and prepared for dispatch.' },
      dispatched:      { label: 'On the Way!',      body: 'Your order has been dispatched and is on its way to you.' },
      delivered:       { label: 'Delivered',         body: 'Your order has been delivered. We hope you enjoy it! God bless 🙏' },
      pending_payment: { label: 'Pending Payment',  body: 'Your order is waiting for payment confirmation.' },
    };

    const info = statusMessages[after.status] || { label: after.status, body: 'Your order status has been updated.' };

    const html = `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0e0e0e">
        <div style="background:#1a3d2e;padding:32px;text-align:center">
          <h1 style="color:#b8922a;font-size:1.6rem;margin:0;font-weight:400">Anointed in Living Christ</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase">Order Update</p>
        </div>
        <div style="padding:32px;background:#fffdf8">
          <p>Dear <strong>${after.name}</strong>,</p>
          <p>${info.body}</p>
          <div style="background:#fff8e1;border-left:3px solid #b8922a;padding:12px 16px;margin:20px 0">
            <strong>Reference:</strong> ${ref}<br>
            <strong>Status:</strong> ${info.label}
          </div>
          <p style="font-size:0.88rem;color:#888">
            Questions? Email <a href="mailto:finance@anointedlivingchrist.org" style="color:#1a3d2e">finance@anointedlivingchrist.org</a>.
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
        to:      after.email,
        subject: `Order Update: ${info.label} — ${ref}`,
        html,
      });
      console.log(`Status update email sent to ${after.email} — ${after.status}`);
    } catch (err) {
      console.error('Failed to send status update email:', err);
    }

    return null;
  });
