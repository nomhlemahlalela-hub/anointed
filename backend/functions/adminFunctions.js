const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const cors      = require('cors')({ origin: true });

const db = admin.firestore();

// ── HELPER: Verify admin token ──
async function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return null;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Check if the uid has an entry in the admins collection
    const adminDoc = await db.collection('admins').doc(decoded.uid).get();
    if (!adminDoc.exists) {
      res.status(403).json({ error: 'Forbidden: Not an admin' });
      return null;
    }
    return decoded;
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return null;
  }
}


// ── UPDATE ORDER STATUS ──
// PATCH /api/admin-updateOrderStatus
// Body: { orderId, status }
exports.updateOrderStatus = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await verifyAdmin(req, res);
    if (!user) return;

    const { orderId, status } = req.body;
    const validStatuses = ['pending_payment', 'confirmed', 'in_progress', 'dispatched', 'delivered'];

    if (!orderId || !status) {
      return res.status(400).json({ error: 'orderId and status are required' });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    try {
      await db.collection('orders').doc(orderId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: user.uid,
      });
      return res.status(200).json({ success: true, orderId, status });
    } catch (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }
  });
});


// ── DASHBOARD STATS ──
// GET /api/admin-getDashboardStats
// Returns counts for orders, members, rsvps, prayer requests
exports.getDashboardStats = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await verifyAdmin(req, res);
    if (!user) return;

    try {
      const [ordersSnap, membersSnap, rsvpsSnap, prayerSnap, feedbackSnap] = await Promise.all([
        db.collection('orders').get(),
        db.collection('members').get(),
        db.collection('rsvps').get(),
        db.collection('prayerRequests').get(),
        db.collection('feedback').get(),
      ]);

      // Revenue summary
      let totalRevenue = 0;
      let pendingOrders = 0;
      ordersSnap.docs.forEach(doc => {
        const d = doc.data();
        totalRevenue += Number(d.total || 0);
        if (d.status === 'pending_payment') pendingOrders++;
      });

      // Average feedback rating
      let totalRating = 0;
      feedbackSnap.docs.forEach(doc => {
        totalRating += Number(doc.data().rating || 0);
      });
      const avgRating = feedbackSnap.size > 0
        ? (totalRating / feedbackSnap.size).toFixed(1)
        : 0;

      return res.status(200).json({
        orders:        { total: ordersSnap.size,  pending: pendingOrders, revenue: totalRevenue },
        members:       { total: membersSnap.size },
        rsvps:         { total: rsvpsSnap.size },
        prayerRequests:{ total: prayerSnap.size },
        feedback:      { total: feedbackSnap.size, avgRating },
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
});


// ── GET ALL ORDERS (Paginated) ──
// GET /api/admin-getOrders?limit=20&status=pending_payment
exports.getOrders = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await verifyAdmin(req, res);
    if (!user) return;

    const { status, limit = '20' } = req.query;
    const pageLimit = Math.min(parseInt(limit, 10) || 20, 100);

    try {
      let query = db.collection('orders').orderBy('createdAt', 'desc').limit(pageLimit);
      if (status) query = query.where('status', '==', status);

      const snap = await query.get();
      const orders = snap.docs.map(doc => ({
        id:  doc.id,
        ref: 'ALC-' + doc.id.substring(0, 8).toUpperCase(),
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      }));

      return res.status(200).json({ orders, count: orders.length });
    } catch (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
});


// ── ADD PRODUCT TO FIRESTORE ──
// POST /api/admin-addProduct
// Body: { name, price, img, rating, sizes, category }
exports.addProduct = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await verifyAdmin(req, res);
    if (!user) return;

    const { name, price, img, rating = 4.0, sizes = ['S','M','L','XL'], category = 'Clothing' } = req.body;

    if (!name || !price || !img) {
      return res.status(400).json({ error: 'name, price, and img are required' });
    }

    try {
      const docRef = await db.collection('products').add({
        name,
        price: Number(price),
        img,
        rating: Number(rating),
        sizes,
        category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: user.uid,
      });
      return res.status(201).json({ success: true, productId: docRef.id, name });
    } catch (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
  });
});
