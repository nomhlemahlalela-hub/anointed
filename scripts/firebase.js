// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey:            "AIzaSyAXgQEkeXd58-zDemTvoiy26Fbb5Scupqc",
  authDomain:        "anointed-361fa.firebaseapp.com",
  projectId:         "anointed-361fa",
  storageBucket:     "anointed-361fa.firebasestorage.app",
  messagingSenderId: "463194333436",
  appId:             "1:463194333436:web:217fa6d32be7051720b779"
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