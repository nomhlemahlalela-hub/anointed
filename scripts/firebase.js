// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

let isLoggedIn = false, currentMember = null;
let selectedProfilePhotoData = null;
let cart = [], activeCategory = 'All';
let guestDeliveryMethod = '', memberDeliveryMethod = '';
let selectedPaymentMethod = { guest: '', member: '' };
let wishlist = JSON.parse(localStorage.getItem('alc_wishlist') || '[]');