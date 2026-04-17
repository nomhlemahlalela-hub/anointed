const admin     = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

// ── EXPORT ALL FUNCTION MODULES ──
exports.orders        = require('./orders');
exports.notifications = require('./notifications');
exports.auth          = require('./auth');
exports.admin         = require('./adminFunctions');
