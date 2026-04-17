# Anointed in Living Christ — Backend Setup Guide

## Overview

The backend uses **Firebase** (no separate server needed). It consists of:

| Layer | Technology | Purpose |
|---|---|---|
| Database | Firestore | All app data (orders, users, sermons, etc.) |
| Auth | Firebase Auth | Email/password login & registration |
| Functions | Cloud Functions (Node.js) | Emails, triggers, admin API |
| Storage | Firebase Storage | Profile photos, product images |
| Hosting | Firebase Hosting | Serve the frontend |
| Security | Firestore & Storage Rules | Protect data access |

---

## Firestore Collections

| Collection | Description | Who writes |
|---|---|---|
| `users` | Profile data, notification prefs, avatar URL | User (own doc) |
| `members` | Registration records | Created on signup |
| `orders` | Store orders (guest & member) | Frontend on checkout |
| `quizScores` | Bible quiz leaderboard entries | Frontend on quiz end |
| `rsvps` | Event RSVPs | Frontend on RSVP form |
| `prayerRequests` | Prayer request submissions | Frontend on form submit |
| `feedback` | Event feedback & ratings | Frontend on form submit |
| `sermons` | Sermon records added by admin | Admin panel |
| `announcements` | Event announcements by admin | Admin panel |
| `events` | Calendar events | Admin panel / manual |
| `products` | Store products (via admin API) | Admin Cloud Function |
| `admins` | Admin UIDs (managed manually) | Firebase Console only |

---

## Cloud Functions

| Function | Trigger | What it does |
|---|---|---|
| `orders.onOrderCreated` | Firestore `orders` onCreate | Sends order confirmation email to customer |
| `orders.onOrderStatusUpdated` | Firestore `orders` onUpdate | Sends status update email when order status changes |
| `auth.onUserCreated` | Firebase Auth onCreate | Sends welcome email; creates Firestore user doc |
| `auth.onUserDeleted` | Firebase Auth onDelete | Deletes Firestore user doc |
| `notifications.onRsvpCreated` | Firestore `rsvps` onCreate | Sends RSVP confirmation email |
| `notifications.onPrayerRequestCreated` | Firestore `prayerRequests` onCreate | Sends prayer acknowledgement email |
| `notifications.sundayServiceReminder` | Cron: every Sunday 8AM SAST | Sends Sunday service reminder to opted-in users |
| `admin.updateOrderStatus` | HTTPS (PATCH) | Admin updates an order's status |
| `admin.getDashboardStats` | HTTPS (GET) | Returns counts & revenue for admin dashboard |
| `admin.getOrders` | HTTPS (GET) | Returns paginated orders list for admin |
| `admin.addProduct` | HTTPS (POST) | Adds a product to the `products` Firestore collection |

---

## Step-by-Step Setup

### 1. Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `anointed-living-christ`
3. Enable **Google Analytics** (optional)

### 2. Enable Firebase Services
In the Firebase Console:
- **Authentication** → Sign-in method → Enable **Email/Password**
- **Firestore Database** → Create database → Start in **production mode**
- **Storage** → Get started → Start in **production mode**

### 3. Get Your Firebase Config
In Firebase Console → Project Settings → Your apps → Web app:
Copy the config object and paste it into `scripts/firebase.js`:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### 4. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```
Select: **Firestore, Functions, Storage, Hosting**

### 5. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 6. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 7. Configure Email for Cloud Functions
```bash
firebase functions:config:set \
  mail.user="your-gmail@gmail.com" \
  mail.pass="your-app-password"
```
> Use a **Gmail App Password**, not your account password.
> Generate at: https://myaccount.google.com/apppasswords

### 8. Install & Deploy Functions
```bash
cd backend/functions
npm install
cd ../..
firebase deploy --only functions
```

### 9. Set Up Admin Users
After a user registers, go to Firebase Console → Firestore → create a document manually:

```
Collection: admins
Document ID: <the user's UID from Firebase Auth>
Fields: { role: "admin" }
```

### 10. Deploy Frontend (Hosting)
```bash
firebase deploy --only hosting
```

---

## Admin Panel Security

The current `admin.js` frontend uses a hardcoded password (`church123`) — **this must be replaced** before going live.

**Recommended approach:**
1. Create an admin user in Firebase Auth
2. Add their UID to the `admins` Firestore collection
3. In `scripts/admin.js`, replace `loginAdmin()` with a Firebase Auth sign-in that checks the `admins` collection
4. The Cloud Functions already validate admin status via Firebase ID token

---

## Local Development

Run the Firebase Emulator Suite to develop locally without affecting production:

```bash
firebase emulators:start
```

This starts:
- Firestore emulator on `localhost:8080`
- Auth emulator on `localhost:9099`
- Functions emulator on `localhost:5001`
- Storage emulator on `localhost:9199`
- Hosting on `localhost:5000`

---

## File Structure

```
backend/
├── functions/
│   ├── index.js           ← Entry point, exports all functions
│   ├── orders.js          ← Order confirmation & status emails
│   ├── auth.js            ← Welcome email & user cleanup
│   ├── notifications.js   ← RSVP, prayer & Sunday reminder
│   ├── adminFunctions.js  ← Admin HTTP API (stats, orders, products)
│   └── package.json
├── rules/
│   ├── firestore.rules    ← Firestore security rules
│   └── storage.rules      ← Storage security rules
└── config/
    ├── firestore.indexes.json  ← Composite indexes
    └── .env.example            ← Environment variable template
```
