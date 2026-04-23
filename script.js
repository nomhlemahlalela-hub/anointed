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

// ── TOAST ──
function showToast(msg, type = 'success') {
  const el   = document.getElementById('toastEl');
  const icon = document.getElementById('toastIcon');
  const text = document.getElementById('toastMsg');
  el.className = 'toast-notification ' + type;
  icon.className = type === 'success' ? 'bi bi-check-circle-fill' : type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-info-circle-fill';
  text.innerText = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3800);
}

// ── LIVE CHAT ──
let chatOpen = false;
let chatMessages = [
  { type: 'received', content: 'Hello! Welcome to Anointed in Living Christ. How can we help you today?', time: 'Just now' }
];

function toggleChat() {
  const widget = document.getElementById('chatWidget');
  const window = document.getElementById('chatWindow');
  chatOpen = !chatOpen;
  if (chatOpen) {
    window.style.display = 'flex';
    widget.classList.add('open');
  } else {
    window.style.display = 'none';
    widget.classList.remove('open');
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  addChatMessage('sent', message);

  // Clear input
  input.value = '';

  // Simulate response (in real implementation, this would connect to a chat service)
  setTimeout(() => {
    const responses = [
      "Thank you for your message. Our team will get back to you soon.",
      "We appreciate you reaching out. How else can we assist you?",
      "That's a great question! Let us help you with that.",
      "We're here to support you. Is there anything specific you'd like to know about our church?"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addChatMessage('received', randomResponse);
  }, 1000 + Math.random() * 2000);
}

function addChatMessage(type, content) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show notification if chat is closed
  if (!chatOpen) {
    document.getElementById('chatNotification').style.display = 'flex';
  }
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

// ── RATING SYSTEM ──
document.addEventListener('DOMContentLoaded', function() {
  // Initialize rating stars
  const ratingStars = document.querySelectorAll('#ratingStars i');
  ratingStars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      document.getElementById('selectedRating').value = rating;

      // Update star display
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Schedule event notifications
  scheduleEventNotifications();
});

function submitFeedback() {
  const event = document.getElementById('feedbackEvent').value;
  const rating = document.getElementById('selectedRating').value;
  const feedback = document.getElementById('feedbackText').value.trim();
  const name = document.getElementById('feedbackName').value.trim();
  const email = document.getElementById('feedbackEmail').value.trim();
  const anonymous = document.getElementById('feedbackAnonymous').checked;
  const msg = document.getElementById('feedbackMsg');

  if (!event) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please select an event.';
    return;
  }

  if (!rating || rating === '0') {
    msg.style.color = '#c94040';
    msg.innerText = 'Please provide a rating.';
    return;
  }

  if (!feedback) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please share your feedback.';
    return;
  }

  try {
    const feedbackData = {
      event,
      rating: parseInt(rating),
      feedback,
      anonymous,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!anonymous && name) feedbackData.name = name;
    if (!anonymous && email) feedbackData.email = email;

    db.collection('feedback').add(feedbackData);

    msg.style.color = '#2d7a4f';
    msg.innerText = '✓ Thank you for your feedback!';

    // Clear form
    document.getElementById('feedbackEvent').value = '';
    document.getElementById('selectedRating').value = '0';
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackEmail').value = '';
    document.getElementById('feedbackAnonymous').checked = false;

    // Reset stars
    document.querySelectorAll('#ratingStars i').forEach(star => {
      star.classList.remove('active');
    });

    showToast('Feedback submitted successfully!');
  } catch (e) {
    msg.style.color = '#c94040';
    msg.innerText = 'Something went wrong. Please try again.';
  }
}

// ── BIBLE STUDY TOOLS ──
function lookupVerse() {
  const book = document.getElementById('bibleBook').value;
  const chapter = document.getElementById('bibleChapter').value;
  const verse = document.getElementById('bibleVerse').value;

  if (!book || !chapter) {
    showToast('Please select a book and chapter', 'error');
    return;
  }

  // This is a simplified Bible API call - in a real implementation, you'd use a Bible API
  const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;

  // Mock verse data - replace with actual API call
  const mockVerses = {
    "John 3:16": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    "Jeremiah 29:11": "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    "Psalms 23:1": "The Lord is my shepherd, I lack nothing.",
    "Philippians 4:13": "I can do all things through Christ who strengthens me.",
    "Romans 8:28": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
  };

  const verseText = mockVerses[reference] || "This verse lookup feature connects to a Bible API. In a full implementation, this would fetch real Bible verses from a service like Bible Gateway or ESV API.";

  document.getElementById('verseReference').textContent = reference;
  document.getElementById('verseText').textContent = verseText;
  document.getElementById('verseResult').style.display = 'block';

  showToast(`Found verse: ${reference}`);
}

function shareVerse() {
  const reference = document.getElementById('verseReference').textContent;
  const text = document.getElementById('verseText').textContent;

  if (navigator.share) {
    navigator.share({
      title: `Bible Verse: ${reference}`,
      text: `${text} - ${reference}`,
      url: window.location.href
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text} - ${reference}`).then(() => {
      showToast('Verse copied to clipboard!');
    });
  }
}

function addToStudyPlan() {
  const reference = document.getElementById('verseReference').textContent;
  showToast(`Added ${reference} to your study plan!`);
  // In a real implementation, this would save to user's study plan
}

function highlightVerse() {
  const reference = document.getElementById('verseReference').textContent;
  const bookmarksContainer = document.getElementById('bookmarkedVerses');

  const bookmarkItem = document.createElement('div');
  bookmarkItem.className = 'bookmark-item';
  bookmarkItem.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-weight:500;font-size:0.85rem">${reference}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--ink-muted);font-size:0.8rem;cursor:pointer">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `;

  // Remove empty state if it exists
  const emptyState = bookmarksContainer.querySelector('p');
  if (emptyState) emptyState.remove();

  bookmarksContainer.appendChild(bookmarkItem);
  showToast(`Bookmarked ${reference}!`);
}

function startStudyPlan(planType) {
  const planNames = {
    'beginners': 'Beginner\'s Guide to Faith',
    'prayer': 'The Power of Prayer',
    'discipleship': 'Discipleship Journey'
  };

  showToast(`Starting study plan: ${planNames[planType]}`);
  // In a real implementation, this would navigate to the study plan page
}

function getNewVerse() {
  const verses = [
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" }
  ];

  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  document.querySelector('.verse-text-small').textContent = randomVerse.text;
  document.querySelector('.verse-ref-small').textContent = randomVerse.ref;
}

// ── NOTIFICATION SYSTEM ──
async function toggleBrowserNotifications() {
  const btn = document.getElementById('browserNotifBtn');

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showToast('Browser notifications are already enabled!');
      btn.innerHTML = '<i class="bi bi-bell-fill me-1"></i>Enabled';
      btn.className = 'btn-submit';
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Browser notifications enabled!');
        btn.innerHTML = '<i class="bi bi-bell-fill me-1"></i>Enabled';
        btn.className = 'btn-submit';

        // Save preference to Firebase
        if (isLoggedIn && currentMember) {
          db.collection('users').doc(currentMember.uid).update({
            browserNotifications: true
          });
        }

        // Schedule a test notification
        setTimeout(() => {
          new Notification('Anointed in Living Christ', {
            body: 'Notifications are now enabled! You\'ll be notified about upcoming events.',
            icon: 'Logo.png.jpeg'
          });
        }, 2000);
      } else {
        showToast('Notification permission denied', 'error');
        // Save preference to Firebase
        if (isLoggedIn && currentMember) {
          db.collection('users').doc(currentMember.uid).update({
            browserNotifications: false
          });
        }
      }
    } else {
      showToast('Please enable notifications in your browser settings', 'error');
    }
  } else {
    showToast('Your browser doesn\'t support notifications', 'error');
  }
}

function updateEmailPreferences() {
  const enabled = document.getElementById('emailNotifications').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`Email notifications ${status}!`);

  // In a real implementation, this would update user preferences in the database
  if (isLoggedIn) {
    // Save preference to Firebase
    db.collection('users').doc(currentMember.uid).update({
      emailNotifications: enabled
    });
  }
}

function updateEventReminders() {
  const enabled = document.getElementById('eventReminders').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`Event reminders ${status}!`);

  if (isLoggedIn) {
    db.collection('users').doc(currentMember.uid).update({
      eventReminders: enabled
    });
  }
}

function scheduleEventNotifications() {
  // Get upcoming events from Firebase
  db.collection('events').where('date', '>=', new Date()).orderBy('date').limit(5).get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const event = doc.data();
      const eventTime = event.date.toDate();
      const now = new Date();
      const timeDiff = eventTime - now;

      // Schedule notification 1 hour before event
      if (timeDiff > 0 && timeDiff <= 3600000) { // 1 hour in milliseconds
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`Upcoming Event: ${event.title}`, {
              body: `Starts at ${event.time} - ${event.location}`,
              icon: '/favicon.ico'
            });
          }
        }, timeDiff);
      }
    });
  })
  .catch(error => {
    console.error('Error scheduling notifications:', error);
  });
}

function updatePrayerUpdates() {
  const enabled = document.getElementById('prayerUpdates').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`Prayer request updates ${status}!`);

  if (isLoggedIn) {
    db.collection('users').doc(currentMember.uid).update({
      prayerUpdates: enabled
    });
  }
}

function updateBrowserNotifications() {
  const enabled = document.getElementById('browserNotifications').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`Browser notifications ${status}!`);

  if (isLoggedIn) {
    db.collection('users').doc(currentMember.uid).update({
      browserNotifications: enabled
    });
  }
}

function updateProfileSettings() {
  const name = document.getElementById('settingsName').value.trim();
  if (!name) {
    showToast('Please enter your name', 'error');
    return;
  }

  if (!isLoggedIn || !currentMember) {
    showToast('Please login first', 'error');
    return;
  }

  db.collection('users').doc(currentMember.uid).set({
    name: name
  }, { merge: true }).then(()=>{
    currentMember.name = name;
    document.getElementById('profileDisplayName').innerText = name;
    document.getElementById('profileInfoBox').innerHTML = `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${currentMember.email}<br><strong>Member Since:</strong> 2026`;

    const initials = name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    if (!currentMember.photoURL) {
      document.getElementById('profileAvatarRing').style.backgroundImage = '';
      document.getElementById('profileAvatarRing').innerText = initials;
    }

    if (auth.currentUser) auth.currentUser.updateProfile({ displayName: name }).catch(()=>{});

    showToast('Profile updated!');
  }).catch(()=>showToast('Error updating profile', 'error'));
}

function setProfileAvatar(photoURL) {
  const avatarEl = document.getElementById('profileAvatarRing');
  if (!avatarEl) return;
  if (photoURL) {
    avatarEl.style.backgroundImage = `url('${photoURL}')`;
    avatarEl.innerText = '';
  } else {
    avatarEl.style.backgroundImage = '';
    if (currentMember && currentMember.name) {
      avatarEl.innerText = currentMember.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    } else {
      avatarEl.innerText = '?';
    }
  }
}

function uploadProfilePhoto(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please choose an image file', 'error');
    return;
  }
  if (file.size > 1024 * 1024) {
    showToast('Please use an image smaller than 1MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    selectedProfilePhotoData = e.target.result;
    const preview = document.getElementById('profileAvatarPreview');
    if (preview) {
      preview.src = selectedProfilePhotoData;
      preview.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

function saveProfilePhoto() {
  if (!isLoggedIn || !currentMember) {
    showToast('Log in to upload a profile picture', 'error');
    return;
  }
  if (!selectedProfilePhotoData) {
    showToast('Select an image first', 'error');
    return;
  }

  const updates = {
    avatarURL: selectedProfilePhotoData
  };

  db.collection('users').doc(currentMember.uid).set(updates, { merge: true })
    .then(() => {
      if (auth.currentUser) {
        auth.currentUser.updateProfile({ photoURL: selectedProfilePhotoData }).catch(()=>{});
      }

      currentMember.photoURL = selectedProfilePhotoData;
      setProfileAvatar(selectedProfilePhotoData);
      localStorage.setItem('alc_profile_photo', selectedProfilePhotoData);
      showToast('Profile photo saved!');
    }).catch(err => {
      showToast('Could not save profile photo', 'error');
      console.error(err);
    });
}

// Initialize notification settings when profile loads
function loadNotificationSettings() {
  if (isLoggedIn) {
    // Load user preferences from Firebase
    db.collection('users').doc(currentMember.uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('emailNotifications').checked = data.emailNotifications || false;
        document.getElementById('eventReminders').checked = data.eventReminders !== false; // Default true
        document.getElementById('prayerUpdates').checked = data.prayerUpdates || false;
      }
    });
  }

  // Check browser notification status
  if ('Notification' in window) {
    const btn = document.getElementById('browserNotifBtn');
    if (Notification.permission === 'granted') {
      btn.innerHTML = '<i class="bi bi-bell-fill me-1"></i>Enabled';
      btn.className = 'btn-submit';
    }
  }
}

// ── AUTH ──
auth.onAuthStateChanged(user => {
  if (user) {
    isLoggedIn = true;
    currentMember = { email: user.email, name: user.displayName || user.email.split('@')[0], uid: user.uid };
    updateHeaderProfile(currentMember.name);
    refreshProfileUI();
  } else {
    isLoggedIn = false; currentMember = null;
    updateHeaderProfile(null);
    refreshProfileUI();
  }
});

function updateHeaderProfile(name) {
  const btn   = document.getElementById('profileBtn');
  const label = document.getElementById('profileBtnLabel');
  if (name) {
    label.innerText = name.split(' ')[0];
    btn.innerHTML = `<i class="bi bi-person-check-fill"></i><span>${name.split(' ')[0]}</span>`;
  } else {
    btn.innerHTML = `<i class="bi bi-person-circle"></i><span id="profileBtnLabel">Sign In</span>`;
  }
}

function refreshProfileUI() {
  const loggedOut = document.getElementById('profileLoggedOut');
  const loggedIn  = document.getElementById('profileLoggedIn');
  if (!loggedOut || !loggedIn) return;
  if (isLoggedIn && currentMember) {
    loggedOut.style.display = 'none';
    loggedIn.style.display  = 'block';
    const initials = currentMember.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('profileDisplayName').innerText     = currentMember.name;
    document.getElementById('profileDisplayEmail').innerText    = currentMember.email;
    document.getElementById('settingsName').value               = currentMember.name;
    document.getElementById('profileInfoBox').innerHTML         = `<strong>Name:</strong> ${currentMember.name}<br><strong>Email:</strong> ${currentMember.email}<br><strong>Member Since:</strong> 2026`;

    // Load saved avatar from Firestore or localStorage
    if (currentMember.uid) {
      db.collection('users').doc(currentMember.uid).get().then(doc => {
        if (doc.exists && doc.data().avatarURL) {
          setProfileAvatar(doc.data().avatarURL);
          currentMember.photoURL = doc.data().avatarURL;
          const preview = document.getElementById('profileAvatarPreview');
          if (preview) { preview.src = doc.data().avatarURL; preview.style.display = 'block'; }
        } else {
          const localURL = localStorage.getItem('alc_profile_photo');
          if (localURL) {
            setProfileAvatar(localURL);
            currentMember.photoURL = localURL;
            const preview = document.getElementById('profileAvatarPreview');
            if (preview) { preview.src = localURL; preview.style.display = 'block'; }
          } else {
            setProfileAvatar('');
            document.getElementById('profileAvatarRing').innerText = initials;
          }
        }
      }).catch(() => {
        const localURL = localStorage.getItem('alc_profile_photo');
        if (localURL) {
          setProfileAvatar(localURL);
          currentMember.photoURL = localURL;
          const preview = document.getElementById('profileAvatarPreview');
          if (preview) { preview.src = localURL; preview.style.display = 'block'; }
        } else {
          setProfileAvatar('');
          document.getElementById('profileAvatarRing').innerText = initials;
        }
      });
    }

    loadProfileQuizStats();
    loadProfileOrders();
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display  = 'none';
  }
}

async function loadProfileQuizStats() {
  if (!isLoggedIn || !currentMember) return;
  try {
    const snap = await db.collection('quizScores').doc(currentMember.uid).get();
    if (snap.exists) {
      const d = snap.data();
      document.getElementById('profileQuizBest').innerText = (d.bestScore || 0) + '/30';
      document.getElementById('statBestScore').innerText   = (d.bestScore || 0) + '/30';
      document.getElementById('statTotalPlays').innerText  = d.plays || 0;
      document.getElementById('statPct').innerText         = Math.round(((d.bestScore||0)/30)*100) + '%';
    }
  } catch(e) {}
}

async function loadProfileOrders() {
  if (!isLoggedIn || !currentMember) return;
  try {
    const snap = await db.collection('orders').where('uid','==',currentMember.uid).orderBy('createdAt','desc').limit(10).get();
    document.getElementById('profileOrderCount').innerText = snap.size;
    const list = document.getElementById('profileOrderList');
    if (snap.empty) { list.innerHTML = '<div style="text-align:center;padding:48px;color:var(--ink-muted);font-style:italic">No orders yet. <a href="#" onclick="show(\'store\')" style="color:var(--forest)">Visit the store</a></div>'; return; }
    list.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      const date = d.createdAt ? new Date(d.createdAt.seconds*1000).toLocaleDateString('en-ZA') : 'Pending';
      return `<div class="order-row"><div style="flex:1"><div style="font-weight:600;font-size:0.9rem">${(d.items||[]).map(i=>i.name).join(', ') || 'Order'}</div><div style="font-size:0.75rem;color:var(--ink-muted);margin-top:2px">${date} · ${d.method||''}</div></div><div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:600;color:var(--forest);margin-right:12px">R${d.total||0}</div><span class="order-status status-pending">${d.status||'pending'}</span></div>`;
    }).join('');
    const recentEl = document.getElementById('profileRecentActivity');
    if (recentEl) recentEl.innerHTML = `Last order placed on ${new Date(snap.docs[0].data().createdAt?.seconds*1000).toLocaleDateString('en-ZA')}`;
  } catch(e) { document.getElementById('profileOrderList').innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)">Could not load orders.</div>'; }
}

// Profile page login/register
async function profileLogin() {
  const email = document.getElementById('pLoginEmail').value.trim();
  const pass  = document.getElementById('pLoginPass').value;
  const err   = document.getElementById('pLoginErr');
  if (!email || !pass) { err.innerText = 'Please enter your email and password.'; return; }
  err.innerText = '';
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    showToast('Welcome back, ' + (currentMember?.name || 'friend') + '! 🙏');
    switchProfilePanel('overview');
  } catch(e) { err.innerText = getFriendlyError(e.code); }
}

async function profileRegister() {
  const name    = document.getElementById('pRegName').value.trim();
  const email   = document.getElementById('pRegEmail').value.trim();
  const pass    = document.getElementById('pRegPass').value;
  const confirm = document.getElementById('pRegConfirm').value;
  const err     = document.getElementById('pRegErr');
  const ok      = document.getElementById('pRegOk');
  err.innerText = ''; ok.innerText = '';
  if (!name || !email || !pass) { err.innerText = 'Please fill in all fields.'; return; }
  if (pass.length < 6)          { err.innerText = 'Password must be at least 6 characters.'; return; }
  if (pass !== confirm)          { err.innerText = 'Passwords do not match.'; return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('members').add({ uid: cred.user.uid, name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    await db.collection('users').doc(cred.user.uid).set({ uid: cred.user.uid, name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    ok.innerText = 'Account created! Welcome to the family 🎉';
    setTimeout(() => switchProfilePanel('overview'), 1200);
    showToast('Account created! Welcome, ' + name + ' 🙏');
  } catch(e) { err.innerText = getFriendlyError(e.code); }
}

async function updateDisplayName() {
  const name = document.getElementById('settingsName').value.trim();
  if (!name || !auth.currentUser) return;
  try {
    await auth.currentUser.updateProfile({ displayName: name });
    currentMember.name = name;
    refreshProfileUI();
    showToast('Display name updated!');
  } catch(e) { showToast('Could not update name.', 'error'); }
}

function switchProfileTab(tab) {
  document.getElementById('profileLoginForm').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('profileRegisterForm').style.display = tab === 'register' ? 'block' : 'none';
  // style the tab buttons
  ['pTabLogin','pTabRegister'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const isActive = (id === 'pTabLogin' && tab === 'login') || (id === 'pTabRegister' && tab === 'register');
    btn.style.color = isActive ? 'var(--forest)' : 'var(--ink-muted)';
    btn.style.borderBottom = isActive ? '2px solid var(--forest)' : '2px solid transparent';
  });
}

function switchProfilePanel(panel) {
  ['overview','orders','quiz','settings'].forEach(p => {
    const el = document.getElementById('panel' + p.charAt(0).toUpperCase() + p.slice(1));
    if (el) el.classList.toggle('active', p === panel);
  });
  document.querySelectorAll('.profile-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === ['overview','orders','quiz','settings'].indexOf(panel));
  });

  // Load notification settings when settings panel is opened
  if (panel === 'settings') {
    loadNotificationSettings();
  }
}

function loadNotificationSettings() {
  if (isLoggedIn && currentMember) {
    // Load browser notification preference
    db.collection('users').doc(currentMember.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('browserNotifications').checked = data.browserNotifications || false;
        document.getElementById('emailNotifications').checked = data.emailNotifications || false;
        document.getElementById('eventReminders').checked = data.eventReminders || false;
      }
    })
    .catch(error => {
      console.error('Error loading notification settings:', error);
    });
  }
}

async function memberLogout() {
  await auth.signOut();
  isLoggedIn = false; currentMember = null;
  cart = []; updateCartCount();
  updateHeaderProfile(null);
  refreshProfileUI();
  show('home');
  showToast('You have been signed out. God bless! 🙏');
}

// Modal auth (kept for compatibility)
function openAuthModal(tab) { document.getElementById('authModal').style.display = 'flex'; switchAuthTab(tab || 'login'); }
function closeAuthModal() { document.getElementById('authModal').style.display = 'none'; }
function switchAuthTab(tab) {
  document.getElementById('panelLogin').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('panelRegister').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('tabLogin').classList.toggle('active',    tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

async function firebaseLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const msg   = document.getElementById('loginErrMsg');
  if (!email || !pass) { msg.innerText = 'Please enter email and password.'; return; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    closeAuthModal();
    showToast('Signed in successfully! Welcome back 🙏');
  } catch(err) { msg.innerText = getFriendlyError(err.code); }
}

async function firebaseRegister() {
  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const errMsg  = document.getElementById('regErrMsg');
  const okMsg   = document.getElementById('regSuccessMsg');
  errMsg.innerText = ''; okMsg.innerText = '';
  if (!name || !email || !pass) { errMsg.innerText = 'Please fill in all fields.'; return; }
  if (pass.length < 6)          { errMsg.innerText = 'Password must be at least 6 characters.'; return; }
  if (pass !== confirm)          { errMsg.innerText = 'Passwords do not match.'; return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('members').add({ uid: cred.user.uid, name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    okMsg.innerText = 'Account created!';
    setTimeout(() => { closeAuthModal(); }, 1200);
    showToast('Welcome to the family, ' + name + '! 🎉');
  } catch(err) { errMsg.innerText = getFriendlyError(err.code); }
}

function getFriendlyError(code) {
  const map = {'auth/user-not-found':'No account found with this email.','auth/wrong-password':'Incorrect password. Please try again.','auth/email-already-in-use':'This email is already registered.','auth/invalid-email':'Please enter a valid email address.','auth/weak-password':'Password must be at least 6 characters.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/invalid-credential':'Incorrect email or password.'};
  return map[code] || 'Something went wrong. Please try again.';
}

// ── PAYMENT METHODS ──
function selectPaymentMethod(flow, method) {
  selectedPaymentMethod[flow] = method;
  const grid = document.getElementById(flow + 'PaymentGrid');
  if (grid) grid.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
  // find clicked card and select it
  const allCards = document.querySelectorAll('#' + flow + 'PaymentGrid .payment-method-card');
  const methods  = ['eft','snapscan','zapper','ozow','payflex','cash'];
  const idx      = methods.indexOf(method);
  if (allCards[idx]) allCards[idx].classList.add('selected');
  // hide all detail boxes for this flow, show correct one
  methods.forEach(m => {
    const box = document.getElementById('pmDetail-' + flow + '-' + m);
    if (box) box.classList.toggle('active', m === method);
  });
}

// ── CHECKOUT ──
function selectCheckoutType(type) {
  document.getElementById('cardMember').classList.toggle('selected', type === 'member');
  document.getElementById('cardGuest').classList.toggle('selected',  type === 'guest');
  document.getElementById('checkoutStep1').style.display  = 'none';
  document.getElementById('memberCheckout').style.display = type === 'member' ? 'block' : 'none';
  document.getElementById('guestCheckout').style.display  = type === 'guest'  ? 'block' : 'none';
  if (type === 'member') {
    if (isLoggedIn && currentMember) {
      document.getElementById('memberLoggedIn').style.display    = 'block';
      document.getElementById('memberNotLoggedIn').style.display = 'none';
      document.getElementById('memberBankDetails').style.display = 'block';
      document.getElementById('memberCheckoutName').innerText    = currentMember.name;
      document.getElementById('memberCheckoutEmail').innerText   = currentMember.email;
    } else {
      document.getElementById('memberLoggedIn').style.display    = 'none';
      document.getElementById('memberNotLoggedIn').style.display = 'block';
      document.getElementById('memberBankDetails').style.display = 'none';
    }
  }
}

async function checkoutMemberLogin() {
  const email = document.getElementById('checkoutLoginEmail').value.trim();
  const pass  = document.getElementById('checkoutLoginPass').value;
  const err   = document.getElementById('checkoutLoginErr');
  if (!email || !pass) { err.innerText = 'Please enter email and password.'; return; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    setTimeout(() => {
      if (isLoggedIn && currentMember) {
        document.getElementById('memberLoggedIn').style.display    = 'block';
        document.getElementById('memberNotLoggedIn').style.display = 'none';
        document.getElementById('memberBankDetails').style.display = 'block';
        document.getElementById('memberCheckoutName').innerText    = currentMember.name;
        document.getElementById('memberCheckoutEmail').innerText   = currentMember.email;
        showToast('Signed in! Complete your order below.');
      }
    }, 800);
  } catch(e) { err.innerText = getFriendlyError(e.code); }
}

function getEstimatedDate(method) {
  const now = new Date(); const days = method === 'pickup' ? 2 : 5; let added = 0;
  while (added < days) { now.setDate(now.getDate() + 1); if (now.getDay() !== 0 && now.getDay() !== 6) added++; }
  return now.toLocaleDateString('en-ZA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function selectDelivery(method) {
  guestDeliveryMethod = method;
  document.getElementById('optDelivery').classList.toggle('selected', method === 'delivery');
  document.getElementById('optPickup').classList.toggle('selected',   method === 'pickup');
  document.getElementById('deliveryAddressField').style.display = method === 'delivery' ? 'block' : 'none';
  document.getElementById('pickupBranchField').style.display    = method === 'pickup'   ? 'block' : 'none';
  document.getElementById('estimatedDelivery').style.display    = 'block';
  document.getElementById('estimatedDateText').innerText = method === 'pickup' ? 'Ready for pickup by ' + getEstimatedDate('pickup') : 'Expected delivery by ' + getEstimatedDate('delivery');
}

function selectMemberDelivery(method) {
  memberDeliveryMethod = method;
  document.getElementById('mOptDelivery').classList.toggle('selected', method === 'delivery');
  document.getElementById('mOptPickup').classList.toggle('selected',   method === 'pickup');
  document.getElementById('mDeliveryAddressField').style.display = method === 'delivery' ? 'block' : 'none';
  document.getElementById('mPickupBranchField').style.display    = method === 'pickup'   ? 'block' : 'none';
  document.getElementById('mEstimatedDelivery').style.display    = 'block';
  document.getElementById('mEstimatedDateText').innerText = method === 'pickup' ? 'Ready for pickup by ' + getEstimatedDate('pickup') : 'Expected delivery by ' + getEstimatedDate('delivery');
}

async function confirmOrder() {
  const payMethod = isLoggedIn ? selectedPaymentMethod.member : selectedPaymentMethod.guest;
  if (!payMethod) { showToast('Please select a payment method.', 'error'); return; }

  if (!isLoggedIn) {
    const name    = document.getElementById('guestName').value.trim();
    const email   = document.getElementById('guestEmail').value.trim();
    const phone   = document.getElementById('guestPhone').value.trim();
    const notes   = document.getElementById('guestNotes').value.trim();
    const method  = guestDeliveryMethod;
    const address = method === 'delivery' ? document.getElementById('guestAddress').value.trim() : '';
    const branch  = method === 'pickup'   ? document.getElementById('guestPickupBranch').value.trim() : '';
    if (!name || !email || !phone) { showToast('Please fill in your name, email and phone.', 'error'); return; }
    if (!method) { showToast('Please select a delivery method.', 'error'); return; }
    if (method === 'delivery' && !address) { showToast('Please enter your delivery address.', 'error'); return; }
    if (method === 'pickup' && !branch)    { showToast('Please select a pickup branch.', 'error'); return; }
    try { await db.collection('orders').add({ type:'guest', name, email, phone, method, payMethod, address, branch, notes, items: cart.map(i=>({name:i.name,size:i.size,price:i.price})), total: cart.reduce((s,i)=>s+Number(i.price),0), status:'pending_payment', createdAt: firebase.firestore.FieldValue.serverTimestamp() }); } catch(e) {}
    showToast('Order confirmed, ' + name + '! Check your email for details. 🙏');
  } else {
    const notes   = document.getElementById('memberNotes').value.trim();
    const method  = memberDeliveryMethod;
    const address = method === 'delivery' ? document.getElementById('memberAddress').value.trim() : '';
    const branch  = method === 'pickup'   ? document.getElementById('memberPickupBranch').value.trim() : '';
    if (!method) { showToast('Please select a delivery method.', 'error'); return; }
    if (method === 'delivery' && !address) { showToast('Please enter your delivery address.', 'error'); return; }
    if (method === 'pickup' && !branch)    { showToast('Please select a pickup branch.', 'error'); return; }
    try { await db.collection('orders').add({ type:'member', uid: currentMember.uid, name: currentMember.name, email: currentMember.email, method, payMethod, address, branch, notes, items: cart.map(i=>({name:i.name,size:i.size,price:i.price})), total: cart.reduce((s,i)=>s+Number(i.price),0), status:'pending_payment', createdAt: firebase.firestore.FieldValue.serverTimestamp() }); } catch(e) {}
    showToast('Order confirmed, ' + currentMember.name + '! 🙏');
  }
  cart = []; updateCartCount(); document.getElementById('checkoutSection').style.display = 'none'; displayCart();
}

// ── PRODUCTS ──
let products = [
  { name:"Long T-Shirt",      price:300, img:"Long T-shirt.jpeg",   rating:4.5, sizes:["S","M","L","XL"],  category:"Clothing" },
  { name:"White Jacket",      price:850, img:"white jacket.jpeg",   rating:4.0, sizes:["M","L","XL"],      category:"Jackets" },
  { name:"Hat",               price:180, img:"Hat.jpeg",            rating:3.5, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Black Jacket",      price:850, img:"jacket black.jpeg",   rating:4.8, sizes:["S","M","L","XL"],  category:"Jackets" },
  { name:"Jacket",            price:850, img:"bumba jacket 2.jpeg", rating:4.7, sizes:["S","M","L","XL"],  category:"Clothing" },
  { name:"Anointed Socks",    price:130, img:"white socks.jpeg",    rating:4.2, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Green Socks",       price:130, img:"socks green.jpeg",    rating:4.9, sizes:["One Size"],        category:"Clothing" },
  { name:"Travelling Bag",    price:700, img:"bag.jpeg",            rating:4.6, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Grace Mug",         price:90,  img:"https://via.placeholder.com/300x240?text=Grace+Mug",       rating:4.3, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Hope Journal",      price:130, img:"https://via.placeholder.com/300x240?text=Hope+Journal",    rating:4.8, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Salvation T-Shirt", price:300, img:"https://via.placeholder.com/300x240?text=Salvation+Tee",  rating:4.5, sizes:["S","M","L","XL"], category:"Clothing" },
  { name:"Worship Hoodie",    price:530, img:"https://via.placeholder.com/300x240?text=Worship+Hoodie", rating:4.7, sizes:["M","L","XL"], category:"Jackets" },
  { name:"Faith Keychain",    price:60,  img:"https://via.placeholder.com/300x240?text=Faith+Keychain", rating:4.4, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Scripture Poster",  price:210, img:"https://via.placeholder.com/300x240?text=Scripture+Poster",rating:4.9, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Anointed Cap",      price:170, img:"https://via.placeholder.com/300x240?text=Anointed+Cap",   rating:4.2, sizes:["One Size"], category:"Bags & Accessories" }
];

function getStars(r) { const f=Math.floor(r),h=r-f>=0.5; return '★'.repeat(f)+(h?'½':'')+'☆'.repeat(5-f-(h?1:0)); }

function renderProductCards(list) {
  const container = document.getElementById('productList'); if (!container) return;
  container.innerHTML = '';
  if (!list.length) { container.innerHTML = '<div class="col-12 text-center py-5" style="color:var(--ink-muted)"><i class="bi bi-search" style="font-size:2rem"></i><p class="mt-3">No products found</p></div>'; return; }
  list.forEach((p, idx) => {
    const sizeId    = `sz-${idx}-${Date.now()}`;
    const badge     = idx === 0 ? '<span class="new-badge">NEW</span>' : '';
    const isWished  = wishlist.some(w => w.name === p.name);
    const wishClass = isWished ? 'wish-btn wishlisted' : 'wish-btn';
    const wishIcon  = isWished ? 'bi-heart-fill' : 'bi-heart';
    container.innerHTML += `<div class="col-6 col-md-4 col-lg-3"><div class="product-card"><div class="product-img-wrap">${badge}<button class="${wishClass}" onclick="toggleWishlist('${p.name}')" title="Save to wishlist"><i class="bi ${wishIcon}" style="color:${isWished?'#e05353':'var(--ink-muted)'}"></i></button><img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/300x220?text=${encodeURIComponent(p.name)}'"></div><div class="product-body"><div class="product-cat">${p.category}</div><div class="product-name">${p.name}</div><div class="product-stars">${getStars(p.rating)} <span style="color:var(--ink-muted);font-size:0.73rem">(${p.rating})</span></div><div class="product-price">R${p.price}</div><div class="sizes-row" id="${sizeId}">${p.sizes.map(s=>`<button class="size-pill" data-size="${s}" onclick="selectSize('${sizeId}','${s}')">${s}</button>`).join('')}</div><button class="btn-add-cart" onclick="addToCart('${p.name}','${sizeId}')"><i class="bi bi-bag-plus"></i>Add to Bag</button></div></div></div>`;
  });
}

function loadProducts() { applyStoreFilters(); }
function setCategory(cat) { activeCategory = cat; document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat)); applyStoreFilters(); }
function applyStoreFilters() {
  const search  = (document.getElementById('storeSearchInput')?.value || '').toLowerCase();
  const sortVal = document.getElementById('sortSelect')?.value || 'default';
  let filtered  = products.filter(p => (activeCategory === 'All' || p.category === activeCategory) && p.name.toLowerCase().includes(search));
  if (sortVal === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortVal === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortVal === 'rating')     filtered = [...filtered].sort((a,b) => b.rating - a.rating);
  if (sortVal === 'name')       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));
  const countEl = document.getElementById('storeResultsCount');
  if (countEl) countEl.innerText = filtered.length === products.length ? 'Showing all ' + filtered.length + ' products' : filtered.length + ' product' + (filtered.length !== 1 ? 's' : '') + ' found';
  renderProductCards(filtered);
}

function selectSize(id, size) {
  const c = document.getElementById(id); if (!c) return;
  c.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
  const btn = Array.from(c.querySelectorAll('.size-pill')).find(b => b.dataset.size === size);
  if (btn) btn.classList.add('active');
  c.dataset.selectedSize = size;
}

function addToCart(name, sizeId) {
  const c = document.getElementById(sizeId); if (!c) return;
  const size = c.dataset.selectedSize;
  if (!size) { showToast('Please select a size first.', 'error'); return; }
  const product = products.find(p => p.name === name); if (!product) return;
  cart.push({ ...product, size }); updateCartCount();
  showToast(name + ' (' + size + ') added to your bag!');
  const btn = c.parentElement.querySelector('.btn-add-cart');
  if (btn) { btn.innerHTML = '<i class="bi bi-check-circle"></i>Added'; btn.style.background = '#1a5c38'; setTimeout(() => { btn.innerHTML = '<i class="bi bi-bag-plus"></i>Add to Bag'; btn.style.background = ''; }, 1500); }
}

function updateCartCount() { document.getElementById('cartCount').innerText = cart.length; }
function removeFromCart(i) { cart.splice(i, 1); displayCart(); updateCartCount(); }

function displayCart() {
  const div = document.getElementById('cartItems'); if (!div) return;
  if (!cart.length) {
    div.innerHTML = `<div class="text-center py-5" style="color:var(--ink-muted)"><i class="bi bi-bag" style="font-size:2.5rem;display:block;margin-bottom:14px"></i><p style="font-size:0.9rem">Your cart is empty</p><button class="btn-primary-g mt-3" onclick="show('store')" style="border-radius:2px">Browse Store</button></div>`;
    document.getElementById('checkoutSection').style.display = 'none'; return;
  }
  let total = 0, html = '';
  cart.forEach((item, i) => {
    total += Number(item.price);
    html += `<div class="cart-item"><img src="${item.img}" onerror="this.src='https://via.placeholder.com/60?text=Item'"><div class="flex-grow-1"><div class="cart-item-name">${item.name}</div><div class="cart-item-meta">Size: ${item.size}</div></div><div class="cart-item-price me-3">R${item.price}</div><button class="btn btn-sm btn-outline-danger rounded-1" onclick="removeFromCart(${i})" style="width:30px;height:30px;padding:0"><i class="bi bi-trash"></i></button></div>`;
  });
  html += `<div class="d-flex justify-content-between align-items-center mt-3 p-3" style="background:var(--warm);border-radius:3px;border:1px solid var(--border)"><span style="font-weight:500;font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase">Total</span><span style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--forest)">R${total}</span></div>`;
  div.innerHTML = html;
  document.getElementById('checkoutSection').style.display = 'none';
}

function toggleCheckout() {
  if (!cart.length) { showToast('Your cart is empty.', 'error'); return; }
  const s = document.getElementById('checkoutSection');
  if (s.style.display === 'none' || !s.style.display) {
    s.style.display = 'block';
    document.getElementById('checkoutStep1').style.display  = 'block';
    document.getElementById('memberCheckout').style.display = 'none';
    document.getElementById('guestCheckout').style.display  = 'none';
    if (isLoggedIn && currentMember) selectCheckoutType('member');
  } else { s.style.display = 'none'; }
}

// ── LEADERS ──
const leaders = [
  { name:"Late Arch Bishop Mvuleni", title:"Founding Arch Bishop",     category:"Arch Bishops",  photo:"archbishop1.jpg" },
  { name:"Lady Arch Bishop",         title:"Presiding Arch Bishop",    category:"Arch Bishops",  photo:"lady arch.jpeg" },
  { name:"Bishop Gantana",            title:"Senior Bishop",           category:"Bishops",      photo:"babe gantana.jpeg" },
  { name:"Bishop Ndungwane",         title:"Bishop",                   category:"Bishops",       photo:"bishop2.jpg" },
  { name:"Bishop ",                  title:"Bishop ",                  category:"Bishops",       photo:"bishop3.jpg" },
  { name:"Pastor Lady Nkosi",       title:"Mpumalanga Branch Pastor",  category:"Pastors",       photo:"gogo.jpeg" },
  { name:"Pastor Elvis Mamba ",    title:"Pretoria Branch Pastor", category:"Pastors",           photo:"pastor2.jpg" },
  { name:"Pastor Dladla",   title:"Pretoria Branch Pastor",        category:"Pastors",           photo:"babe dladla.jpeg" },
  { name:"Pastor Nelsiwe sthole",        title:"Mpumalanga Branch Pastor", category:"Pastors",   photo:"mama nelly.jpeg" },
  { name:"Pastor Lady Mamba",        title:" Pastor",   category:"Pastors",                      photo:"pastor6.jpg" },
  { name:"Preacher Goodman Mamba",   title:"Evangelist",               category:"Preachers",     photo:"preacher1.jpg" },
  { name:"Preacher Nkuli",           title:"Youth Preacher",           category:"Preachers",     photo:"preacher2.jpg" },
  { name:"Preacher Blessing",        title:"Evangelist",               category:"Preachers",     photo:"preacher3.jpg" },
  { name:"Preacher Mthembu",         title:" Preacher", category:"Preachers",     photo:"preacher6.jpg" }
];

function loadLeaders() {
  const c = document.getElementById('leaders-container'); if (!c) return; c.innerHTML = '';
  ['Arch Bishops','Bishops','Pastors','Preachers'].forEach(cat => {
    const catL = leaders.filter(l => l.category === cat); if (!catL.length) return;
    c.innerHTML += `<div class="category-heading">${cat}</div>`;
    const row = document.createElement('div'); row.className = 'row g-4';
    catL.forEach(l => { row.innerHTML += `<div class="col-md-3 col-sm-6"><div class="leader-card"><img src="${l.photo}" class="leader-photo" onerror="this.src='https://via.placeholder.com/88?text=${encodeURIComponent(l.name.split(' ').slice(-1)[0])}'"><div class="leader-name">${l.name}</div><div class="leader-role">${l.title}</div></div></div>`; });
    c.appendChild(row);
  });
}

// ── SERMONS ──
let sermons = [
  { title:"The Power of Prayer", speaker:"Pastor Mamba", date:"March 15, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"In this message, Pastor Mamba explores the transformative power of persistent prayer.", series:"power-of-prayer", category:"prayer", duration:"42:15", verse:"1 Thessalonians 5:17", takeaway:"Prayer changes things and moves the hand of God.", notes:"Key Points:\\n1. The purpose of prayer\\n2. Overcoming obstacles in prayer\\n3. Praying with authority\\n4. Seeing results through faith", transcript:"[Sermon transcript would appear here]", rating:4.8 },
  { title:"Faith in Action", speaker:"Pastor Nelsiwe", date:"March 8, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Pastor Nelsiwe teaches from James 2 about how genuine faith produces works.", series:"abundant-life", category:"leadership", duration:"38:42", verse:"James 2:26", takeaway:"Faith without works is dead - demonstrate your faith through action.", notes:"Key Points:\\n1. Faith is more than belief\\n2. Your works prove your faith\\n3. Serving others demonstrates faith\\n4. Being a living testimony", transcript:"[Sermon transcript would appear here]", rating:4.9 },
  { title:"God's Love Endures", speaker:"Lady Arch Bishop", date:"March 1, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"A heartfelt message on the unfailing love of God.", series:"grace-upon-grace", category:"salvation", duration:"45:30", verse:"Romans 8:39", takeaway:"Nothing can separate you from God's eternal love and protection.", notes:"Key Points:\\n1. God's love is unconditional\\n2. His love covers all your sins\\n3. Love gives us confidence\\n4. Share God's love with others", transcript:"[Sermon transcript would appear here]", rating:5.0 },
  { title:"Walking in Grace", speaker:"Pastor Mamba", date:"February 22, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Discover the freedom that comes from living under God's grace.", series:"grace-upon-grace", category:"worship", duration:"41:18", verse:"2 Corinthians 12:9", takeaway:"God's grace is sufficient for all your needs - live in that freedom.", notes:"Key Points:\\n1. Understanding grace vs law\\n2. The power of God's grace\\n3. Living confidently in grace\\n4. Extending grace to others", transcript:"[Sermon transcript would appear here]", rating:4.7 },
  { title:"The Armor of God", speaker:"Pastor Nelsiwe", date:"February 15, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Learn how to put on the full armor of God.", series:"walking-by-faith", category:"prayer", duration:"39:22", verse:"Ephesians 6:10-18", takeaway:"Equip yourself with God's armor to stand against all spiritual attacks.", notes:"Key Points:\\n1. The belt of truth\\n2. The breastplate of righteousness\\n3. The shield of faith\\n4. Prayer as a weapon", transcript:"[Sermon transcript would appear here]", rating:4.8 },
  { title:"Overcoming Fear", speaker:"Lady Arch Bishop", date:"February 8, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"A powerful word on how to conquer fear with faith.", series:"walking-by-faith", category:"family", duration:"43:05", verse:"2 Timothy 1:7", takeaway:"Fear comes from the enemy, but faith comes from God - choose faith.", notes:"Key Points:\\n1. The source of fear\\n2. Faith as an antidote\\n3. Trusting God in uncertainty\\n4. Developing spiritual courage", transcript:"[Sermon transcript would appear here]", rating:4.9 }
];

let favoriteSermons = [], sermonComments = {};

function renderSermons(list) {
  const grid = document.getElementById('sermonGrid'); if (!grid) return;
  grid.innerHTML = '';
  list.forEach(s => {
    const shortDesc = s.desc.length > 80 ? s.desc.substring(0,80) + '…' : s.desc;
    const isFav = favoriteSermons.some(fs => fs.title === s.title) ? 'bi-heart-fill' : 'bi-heart';
    grid.innerHTML += `<div class="col-md-4"><div class="sermon-card" style="cursor:pointer"><img src="${s.img}" class="sermon-img" onerror="this.src='https://via.placeholder.com/400x160?text=Sermon'"><div class="sermon-body"><div style="display:flex;justify-content:space-between;align-items:start"><div><div class="sermon-title">${s.title}</div><div class="sermon-meta">${s.speaker} · ${s.date}</div></div><button class="btn btn-sm" style="background:none;border:none;font-size:1.2rem;padding:0" onclick="toggleFavoriteSermon(this, '${s.title}')"><i class="bi ${isFav}" style="color:#e74c3c"></i></button></div><p style="font-size:0.82rem;color:var(--ink-muted);line-height:1.6;margin:8px 0">${shortDesc}</p><div style="font-size:0.75rem;color:var(--ink-muted);margin-bottom:10px"><i class="bi bi-clock me-1"></i>${s.duration} | <i class="bi bi-star-fill" style="color:var(--gold)"></i> ${s.rating}</div><button class="btn-watch" onclick="openSermonDetail('${s.title}')"><i class="bi bi-play-circle me-2"></i>Watch</button></div></div></div>`;
  });
}

function renderSermons(list) {
  const grid = document.getElementById('sermonGrid'); if (!grid) return;
  grid.innerHTML = '';
  list.forEach(s => {
    const shortDesc = s.desc.length > 80 ? s.desc.substring(0,80) + '…' : s.desc;
    const isFav = favoriteSermons.some(fs => fs.title === s.title) ? 'bi-heart-fill' : 'bi-heart';
    grid.innerHTML += `<div class="col-md-4"><div class="sermon-card" style="cursor:pointer"><img src="${s.img}" class="sermon-img" onerror="this.src='https://via.placeholder.com/400x160?text=Sermon'"><div class="sermon-body"><div style="display:flex;justify-content:space-between;align-items:start"><div><div class="sermon-title">${s.title}</div><div class="sermon-meta">${s.speaker} · ${s.date}</div></div><button class="btn btn-sm" style="background:none;border:none;font-size:1.2rem;padding:0;pointer-events:all" onclick="event.stopPropagation(); toggleFavoriteSermon(this, '${s.title}')"><i class="bi ${isFav}" style="color:#e74c3c"></i></button></div><p style="font-size:0.82rem;color:var(--ink-muted);line-height:1.6;margin:8px 0">${shortDesc}</p><div style="font-size:0.75rem;color:var(--ink-muted);margin-bottom:10px"><i class="bi bi-clock me-1"></i>${s.duration} | <i class="bi bi-star-fill" style="color:var(--gold)"></i> ${s.rating}</div><button class="btn-watch" onclick="openSermonDetail('${s.title}')"><i class="bi bi-play-circle me-2"></i>Watch</button></div></div></div>`;
  });
}

function filterSermons(q) { renderSermons(sermons.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.speaker.toLowerCase().includes(q.toLowerCase()))); }

function filterSermonsBySeries(series) {
  let filtered = sermons;
  if (series) filtered = filtered.filter(s => s.series === series);
  renderSermons(filtered);
}

function filterSermonsByCategory(category) {
  let filtered = sermons;
  if (category) filtered = filtered.filter(s => s.category === category);
  renderSermons(filtered);
}

function filterSermonsByDate(range) {
  let filtered = sermons;
  if (range) {
    const now = new Date();
    let startDate;
    if (range === 'week') startDate = new Date(now.getTime() - 7*24*60*60*1000);
    else if (range === 'month') startDate = new Date(now.getTime() - 30*24*60*60*1000);
    else if (range === 'quarter') startDate = new Date(now.getTime() - 90*24*60*60*1000);
    else if (range === 'year') startDate = new Date(now.getTime() - 365*24*60*60*1000);
    filtered = filtered.filter(s => new Date(s.date) >= startDate);
  }
  renderSermons(filtered);
}

function openSermonDetail(title) {
  const sermon = sermons.find(s => s.title === title);
  if (!sermon) return;
  
  document.getElementById('sermonTitle').innerText = sermon.title;
  document.getElementById('sermonSpeaker').innerText = sermon.speaker;
  document.getElementById('sermonDate').innerText = sermon.date;
  document.getElementById('sermonSeriesName').innerText = sermon.series ? sermon.series.replace(/-/g, ' ').toUpperCase() : 'General';
  document.getElementById('sermonCategory').innerText = sermon.category.toUpperCase();
  document.getElementById('sermonDuration').innerText = sermon.duration;
  document.getElementById('sermonVerse').innerText = sermon.verse;
  document.getElementById('sermonTakeaway').innerText = sermon.takeaway;
  document.getElementById('sermonNotes').innerText = sermon.notes;
  document.getElementById('sermonTranscript').innerText = sermon.transcript;
  document.getElementById('commentCount').innerText = (sermonComments[title] || []).length;
  
  const videoContainer = document.getElementById('sermonVideoContainer');
  videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${sermon.videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:3px" allowfullscreen></iframe>`;
  
  renderSermonComments(title);
  
  const modal = new bootstrap.Modal(document.getElementById('sermonDetailModal'));
  modal.show();
  
  window.currentSermonTitle = title;
}

function renderSermonComments(title) {
  const comments = sermonComments[title] || [];
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  comments.forEach((c, i) => {
    list.innerHTML += `<div style="border-bottom:1px solid var(--border);padding:12px 0;font-size:0.85rem"><div style="display:flex;justify-content:space-between"><strong>${c.name}</strong> <span style="color:var(--ink-muted);font-size:0.75rem">${c.date}</span></div><p style="margin:6px 0;color:var(--ink-muted)">${c.text}</p><button class="btn btn-sm btn-link" style="padding:0;font-size:0.75rem" onclick="replyComment(${i}, '${title}')">Reply</button></div>`;
  });
}

function submitSermonComment(e) {
  e.preventDefault();
  const title = window.currentSermonTitle;
  const text = document.getElementById('commentText').value;
  if (!text || !title) return;
  if (!sermonComments[title]) sermonComments[title] = [];
  sermonComments[title].push({ name:'You', date:'Just now', text:text });
  document.getElementById('commentText').value = '';
  renderSermonComments(title);
  document.getElementById('commentCount').innerText = sermonComments[title].length;
  showToast('Comment posted! ✓');
}

function toggleFavoriteSermon(btn, title) {
  const idx = favoriteSermons.findIndex(s => s.title === title);
  if (idx > -1) {
    favoriteSermons.splice(idx, 1);
    if (btn && btn.querySelector) btn.querySelector('i').classList.remove('bi-heart-fill');
    if (btn && btn.querySelector) btn.querySelector('i').classList.add('bi-heart');
  } else {
    const sermon = sermons.find(s => s.title === title);
    if (sermon) {
      favoriteSermons.push(sermon);
      if (btn && btn.querySelector) btn.querySelector('i').classList.add('bi-heart-fill');
      if (btn && btn.querySelector) btn.querySelector('i').classList.remove('bi-heart');
    }
  }
  showToast(idx > -1 ? 'Removed from favorites' : 'Added to favorites! ♡');
}

function rateSermon(stars) {
  const title = window.currentSermonTitle;
  const sermon = sermons.find(s => s.title === title);
  if (sermon) {
    sermon.rating = ((sermon.rating * 10 + stars) / 11).toFixed(1);
    showToast(`Rated ${stars} ⭐`);
    const stars_el = document.querySelectorAll('#sermonDetailModal .btn-sm[style*="background:none"]');
    stars_el.forEach((s, i) => s.innerText = i < stars ? '★' : '☆');
  }
}

function shareSermon(source) {
  const title = window.currentSermonTitle;
  const text = `Check out "${title}" from Anointed in Living Christ`;
  window.currentSermonText = text;
  showToast('Share option opened!');
}

function shareToWhatsApp() {
  const text = encodeURIComponent(window.currentSermonText || 'Check out our latest sermon!');
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToX() {
  const text = encodeURIComponent(window.currentSermonText || 'Check out our latest sermon!');
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareToInstagram() {
  showToast('Open Instagram to share! 📱');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  showToast('Link copied to clipboard! 📋');
}

function downloadSermon() {
  showToast('Download started... 📥');
}

// ── MEMBERSHIP ──
function submitMembershipForm() { showToast('Thank you! We will contact you soon. God bless 🙏'); document.getElementById('membershipForm').reset(); return false; }

// ── CALENDAR ──
const events = [
  { date:'2026-04-03', name:'Good Friday Service',  time:'10:00 PM', venue:'Akasia Community Hall, Pretoria' },
  { date:'2026-06-29', name:'Youth Conference',      time:'9:00 AM',  venue:'Headquarters, Pretoria' },
  { date:'2026-08-05', name:"Women's Conference",    time:'10:00 AM', venue:'Soshanguve Branch, Pretoria' },
  { date:'2026-10-10', name:'Regional Conference',   time:'8:00 AM',  venue:'Msogwaba Hall, Nelspruit' }
];
let currentMonth = 3, currentYear = 2026;

function renderCalendar(month, year) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById('monthYearDisplay').innerText = `${months[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = '', date = 1;
  for (let i = 0; i < 6; i++) {
    let row = '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) { row += '<td></td>'; }
      else if (date > daysInMonth) { row += '<td></td>'; }
      else {
        const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
        const ev = events.find(e => e.date === ds);
        if (ev) { row += `<td class="cal-event-cell" onclick="showEventPopup('${ev.name}','${ev.time}','${ev.venue}','${ds}')" title="${ev.name}">${date}</td>`; }
        else { row += `<td>${date}</td>`; }
        date++;
      }
    }
    row += '</tr>'; html += row; if (date > daysInMonth) break;
  }
  document.getElementById('calendarBody').innerHTML = html;
}

function changeMonth(d) {
  currentMonth += d;
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0;  currentYear++; }
  renderCalendar(currentMonth, currentYear);
}

function showEventPopup(name, time, venue, date) {
  const d = new Date(date + 'T00:00:00');
  const formatted = d.toLocaleDateString('en-ZA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const existing = document.getElementById('eventPopup'); if (existing) existing.remove();
  const popup = document.createElement('div'); popup.id = 'eventPopup';
  popup.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)" onclick="this.remove()"><div style="background:white;border-radius:4px;padding:32px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.15)" onclick="event.stopPropagation()"><div style="font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:8px">Event</div><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:600;color:var(--ink);margin-bottom:4px">${name}</h3><p style="font-size:0.8rem;color:var(--ink-muted);margin-bottom:20px">${formatted}</p><div style="display:flex;flex-direction:column;gap:10px;font-size:0.85rem"><div><span style="font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:2px">Time</span>${time}</div><div><span style="font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:2px">Venue</span>${venue}</div></div><button onclick="document.getElementById('eventPopup').remove()" style="margin-top:24px;width:100%;padding:11px;background:var(--forest);color:white;border:none;border-radius:2px;font-family:'Jost',sans-serif;font-weight:500;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer">Close</button></div></div>`;
  document.body.appendChild(popup);
}

// ── RSVP ──
async function submitRSVP() {
  const event = document.getElementById('rsvpEvent').value;
  const name  = document.getElementById('rsvpName').value.trim();
  const email = document.getElementById('rsvpEmail').value.trim();
  const phone = document.getElementById('rsvpPhone').value.trim();
  const count = document.getElementById('rsvpCount').value;
  const source = document.getElementById('rsvpSource').value;
  const message = document.getElementById('rsvpMessage').value.trim();
  const msg   = document.getElementById('rsvpMsg');

  if (!event) { msg.style.color='#c94040'; msg.innerText='Please select an event.'; return; }
  if (!name)  { msg.style.color='#c94040'; msg.innerText='Please enter your name.'; return; }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) { msg.style.color='#c94040'; msg.innerText='Enter a valid email address.'; return; }
  if (!phone) { msg.style.color='#c94040'; msg.innerText='Please enter your phone number.'; return; }

  try {
    await db.collection('rsvps').add({
      event, name, email, phone, count, source, message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    msg.style.color = '#2d7a4f'; msg.innerText = `✓ RSVP confirmed for ${name}!`;
    showToast('RSVP confirmed for ' + name + '! See you there 🙏');

    // Clear form
    document.getElementById('rsvpEvent').value = '';
    document.getElementById('rsvpName').value = '';
    document.getElementById('rsvpEmail').value = '';
    document.getElementById('rsvpPhone').value = '';
    document.getElementById('rsvpCount').value = '1';
    document.getElementById('rsvpSource').value = '';
    document.getElementById('rsvpMessage').value = '';
  } catch(e) {
    msg.style.color='#c94040'; msg.innerText='Something went wrong. Please try again.';
  }
}

async function submitPrayerRequest() {
  const name = document.getElementById('prayerName').value.trim();
  const email = document.getElementById('prayerEmail').value.trim();
  const category = document.getElementById('prayerCategory').value;
  const request = document.getElementById('prayerRequest').value.trim();
  const anonymous = document.getElementById('prayerAnonymous').checked;
  const msg = document.getElementById('prayerMsg');

  if (!name) { msg.style.color='#c94040'; msg.innerText='Please enter your name.'; return; }
  if (!category) { msg.style.color='#c94040'; msg.innerText='Please select a category.'; return; }
  if (!request) { msg.style.color='#c94040'; msg.innerText='Please share your prayer request.'; return; }

  try {
    await db.collection('prayerRequests').add({
      name: anonymous ? 'Anonymous Member' : name,
      email: email || null,
      category, request, anonymous,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    msg.style.color = '#2d7a4f'; msg.innerText = '✓ Prayer request submitted and shared with our prayer team!';
    showToast('Prayer request submitted 🙏');

    document.getElementById('prayerName').value = '';
    document.getElementById('prayerEmail').value = '';
    document.getElementById('prayerCategory').value = '';
    document.getElementById('prayerRequest').value = '';
    document.getElementById('prayerAnonymous').checked = false;
  } catch(e) {
    msg.style.color='#c94040'; msg.innerText='Something went wrong. Please try again.';
  }
}

// ── ADMIN ──
function loginAdmin() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if (u === 'admin' && p === 'church123') { show('admin'); showToast('Welcome, Admin!'); }
  else { document.getElementById('loginMsg').innerText = 'Incorrect login details.'; }
}

async function addProduct() {
  const name   = document.getElementById('productName').value.trim();
  const price  = document.getElementById('productPrice').value.trim();
  const img    = document.getElementById('productImg').value.trim();
  const rating = parseFloat(document.getElementById('productRating').value) || 4.0;
  const sizes  = (document.getElementById('productSizes').value.trim() || 'S,M,L,XL').split(',').map(s => s.trim());
  const msg    = document.getElementById('productNotifyMsg');
  if (!name || !price || !img) { showToast('Please fill name, price, and image URL', 'error'); return; }
  products.push({ name, price, img, rating, sizes, category:'Clothing' });
  loadProducts();
  ['productName','productPrice','productImg','productRating','productSizes'].forEach(id => document.getElementById(id).value = '');
  msg.style.color = '#2d7a4f'; msg.innerText = '✓ Product added!';
  showToast('Product "' + name + '" added to store!');
}

async function announceEvent() {
  const name  = document.getElementById('newEventName').value.trim();
  const date  = document.getElementById('newEventDate').value.trim();
  const time  = document.getElementById('newEventTime').value.trim();
  const venue = document.getElementById('newEventVenue').value.trim();
  const desc  = document.getElementById('newEventDesc').value.trim();
  const msg   = document.getElementById('eventNotifyMsg');
  if (!name || !date || !time || !venue) { msg.style.color='#c94040'; msg.innerText='Please fill in all fields.'; return; }
  try { await db.collection('announcements').add({ type:'event', name, date, time, venue, desc, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); } catch(e) {}
  msg.style.color = '#2d7a4f'; msg.innerText = '✓ Event announced!';
  showToast('Event "' + name + '" announced!');
  ['newEventName','newEventDate','newEventTime','newEventVenue','newEventDesc'].forEach(id => document.getElementById(id).value = '');
}

async function addSermon() {
  const title   = document.getElementById('newSermonTitle').value.trim();
  const speaker = document.getElementById('newSermonSpeaker').value.trim();
  const date    = document.getElementById('newSermonDate').value.trim();
  const videoId = document.getElementById('newSermonVideo').value.trim();
  const desc    = document.getElementById('newSermonDesc').value.trim();
  const msg     = document.getElementById('sermonNotifyMsg');
  if (!title || !speaker || !date) { msg.style.color='#c94040'; msg.innerText='Please fill title, speaker and date.'; return; }
  sermons.unshift({ title, speaker, date, img:'https://via.placeholder.com/400x180?text='+encodeURIComponent(title), videoId: videoId||'hEl_ULInpng', desc: desc||'A message from '+speaker+'.' });
  renderSermons(sermons);
  try { await db.collection('sermons').add({ title, speaker, date, videoId, desc, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); } catch(e) {}
  msg.style.color = '#2d7a4f'; msg.innerText = '✓ Sermon added!';
  showToast('Sermon "' + title + '" added!');
  ['newSermonTitle','newSermonSpeaker','newSermonDate','newSermonVideo','newSermonDesc'].forEach(id => document.getElementById(id).value = '');
}

// ── DAILY VERSE ──
const dailyVerses = [
  {text:"The Lord is my shepherd; I shall not want.",ref:"Psalm 23:1"},
  {text:"For God so loved the world that he gave his one and only Son.",ref:"John 3:16"},
  {text:"I can do all this through him who gives me strength.",ref:"Philippians 4:13"},
  {text:"For I know the plans I have for you, declares the Lord, plans to prosper you.",ref:"Jeremiah 29:11"},
  {text:"And we know that in all things God works for the good of those who love him.",ref:"Romans 8:28"},
  {text:"Trust in the Lord with all your heart and lean not on your own understanding.",ref:"Proverbs 3:5"},
  {text:"Be strong and courageous. Do not be afraid, for the Lord your God will be with you.",ref:"Joshua 1:9"},
  {text:"The Spirit of the Lord is on me, because he has anointed me to proclaim good news.",ref:"Luke 4:18"},
  {text:"Faith is confidence in what we hope for and assurance about what we do not see.",ref:"Hebrews 11:1"},
  {text:"Cast all your anxiety on him because he cares for you.",ref:"1 Peter 5:7"},
  {text:"Your word is a lamp for my feet, a light on my path.",ref:"Psalm 119:105"},
  {text:"Love is patient, love is kind. It does not envy, it does not boast.",ref:"1 Corinthians 13:4"},
  {text:"For by grace you have been saved through faith — it is the gift of God.",ref:"Ephesians 2:8"},
  {text:"Be still, and know that I am God.",ref:"Psalm 46:10"},
  {text:"If anyone is in Christ, the new creation has come: The old has gone, the new is here!",ref:"2 Corinthians 5:17"},
  {text:"Whatever you do, work at it with all your heart, as working for the Lord.",ref:"Colossians 3:23"},
  {text:"The Lord bless you and keep you; the Lord make his face shine on you.",ref:"Numbers 6:24-25"},
  {text:"Do not be anxious about anything, but present your requests to God.",ref:"Philippians 4:6"},
  {text:"He gives strength to the weary and increases the power of the weak.",ref:"Isaiah 40:29"},
  {text:"Taste and see that the Lord is good; blessed is the one who takes refuge in him.",ref:"Psalm 34:8"},
  {text:"Give thanks to the Lord, for he is good; his love endures forever.",ref:"Psalm 136:1"},
  {text:"Let your light shine before others, that they may see your good deeds.",ref:"Matthew 5:16"},
  {text:"This is the day that the Lord has made; let us rejoice and be glad in it.",ref:"Psalm 118:24"},
  {text:"Seek first his kingdom and his righteousness, and all these things will be given.",ref:"Matthew 6:33"},
  {text:"The Lord is close to the brokenhearted and saves those who are crushed in spirit.",ref:"Psalm 34:18"},
  {text:"Fear not, for I am with you; be not dismayed, for I am your God.",ref:"Isaiah 41:10"},
  {text:"He heals the brokenhearted and binds up their wounds.",ref:"Psalm 147:3"},
  {text:"For where two or three gather in my name, there am I with them.",ref:"Matthew 18:20"},
  {text:"The name of the Lord is a fortified tower; the righteous run to it and are safe.",ref:"Proverbs 18:10"},
  {text:"I am the resurrection and the life. Whoever believes in me will live, even though they die.",ref:"John 11:25"}
];

function loadDailyVerse() {
  const today = new Date();
  const idx   = (today.getDate() + today.getMonth() * 3) % dailyVerses.length;
  const v     = dailyVerses[idx];
  const el    = document.getElementById('dailyVerseText');
  const ref   = document.getElementById('dailyVerseRef');
  if (el)  el.innerText  = '\u201c' + v.text + '\u201d';
  if (ref) ref.innerText = '\u2014 ' + v.ref;
}

function shareDailyVerse() {
  const today = new Date();
  const v     = dailyVerses[(today.getDate() + today.getMonth() * 3) % dailyVerses.length];
  const text  = '\u201c' + v.text + '\u201d \u2014 ' + v.ref + ' | Anointed in Living Christ';
  if (navigator.share) navigator.share({ title:'Verse of the Day', text });
  else navigator.clipboard.writeText(text).then(() => showToast('Verse copied to clipboard!'));
}

function checkLiveStatus() {
  const now = new Date(); const day = now.getDay(); const hour = now.getHours();
  const banner = document.getElementById('liveBanner');
  if (banner) banner.style.display = (day === 0 && hour >= 10 && hour < 16) ? 'block' : 'none';
}

// ── BIBLE QUIZ ──
const quizQuestions = [
  {q:"How many days did God take to create the world?",opts:["5","6","7","8"],ans:1},
  {q:"Who was swallowed by a great fish?",opts:["Elijah","Moses","Jonah","Noah"],ans:2},
  {q:"What is the shortest verse in the Bible?",opts:["God is love","Jesus wept","Fear not","Be still"],ans:1},
  {q:"How many disciples did Jesus have?",opts:["10","11","12","13"],ans:2},
  {q:"Who wrote most of the Psalms?",opts:["Solomon","Moses","David","Paul"],ans:2},
  {q:"In what city was Jesus born?",opts:["Nazareth","Jerusalem","Bethlehem","Jericho"],ans:2},
  {q:"Who was the first man created by God?",opts:["Noah","Abraham","Moses","Adam"],ans:3},
  {q:"What river was Jesus baptised in?",opts:["Nile","Euphrates","Jordan","Tigris"],ans:2},
  {q:"How many books are in the New Testament?",opts:["24","27","30","33"],ans:1},
  {q:"Who denied Jesus three times?",opts:["John","Judas","Peter","Thomas"],ans:2},
  {q:"What did God create on the first day?",opts:["Animals","Light","Plants","Water"],ans:1},
  {q:"Which book comes first in the New Testament?",opts:["Mark","Luke","John","Matthew"],ans:3},
  {q:"How many plagues did God send on Egypt?",opts:["7","10","12","9"],ans:1},
  {q:"Who built the ark?",opts:["Abraham","Noah","Moses","David"],ans:1},
  {q:"What was the name of the garden where Adam and Eve lived?",opts:["Gethsemane","Eden","Canaan","Goshen"],ans:1},
  {q:"How many commandments did God give Moses?",opts:["5","8","10","12"],ans:2},
  {q:"Who was thrown into the lion's den?",opts:["Elijah","Ezekiel","Daniel","Jeremiah"],ans:2},
  {q:"What is the first book of the Bible?",opts:["Exodus","Genesis","Leviticus","Numbers"],ans:1},
  {q:"How many times did Israelites march around Jericho?",opts:["3","5","7","9"],ans:2},
  {q:"Who was the mother of Jesus?",opts:["Martha","Elizabeth","Mary","Sarah"],ans:2},
  {q:"What did Jesus turn water into at the wedding in Cana?",opts:["Milk","Honey","Wine","Oil"],ans:2},
  {q:"Who betrayed Jesus for 30 pieces of silver?",opts:["Peter","Thomas","Judas","James"],ans:2},
  {q:"On which day did Jesus rise from the dead?",opts:["First day","Second day","Third day","Fourth day"],ans:2},
  {q:"Who was the first king of Israel?",opts:["David","Solomon","Saul","Samuel"],ans:2},
  {q:"What language was most of the Old Testament originally written in?",opts:["Greek","Aramaic","Hebrew","Latin"],ans:2},
  {q:"How many sons did Jacob have?",opts:["10","11","12","13"],ans:2},
  {q:"Who led the Israelites out of Egypt?",opts:["Abraham","Moses","Joshua","Aaron"],ans:1},
  {q:"What is the last book of the Bible?",opts:["Jude","Hebrews","Revelation","Acts"],ans:2},
  {q:"Who was known as the wisest man who ever lived?",opts:["David","Moses","Solomon","Paul"],ans:2},
  {q:"How many days and nights did it rain during the flood?",opts:["20","30","40","50"],ans:2}
];

const resultMessages = [
  { min:0,  max:10, title:"Keep Studying",  verse:'"Study to shew thyself approved unto God." — 2 Timothy 2:15' },
  { min:11, max:18, title:"Good Effort",    verse:'"For the word of God is alive and active." — Hebrews 4:12' },
  { min:19, max:24, title:"Well Done",      verse:'"Your word is a lamp to my feet and a light to my path." — Psalm 119:105' },
  { min:25, max:28, title:"Excellent",      verse:'"Blessed is the one who finds wisdom." — Proverbs 3:13' },
  { min:29, max:30, title:"Bible Champion", verse:'"Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23' }
];

let qIndex=0, qCorrect=0, qWrong=0, qStreak=0, qBestStreak=0;
let qAnswered=false, qTimerInterval=null, qTimeLeft=20;
let shuffledQuestions=[];

function switchQuizTab(tab) {
  document.getElementById('tabQuiz').classList.toggle('active', tab === 'quiz');
  document.getElementById('tabLeaderboard').classList.toggle('active', tab === 'leaderboard');
  document.getElementById('quizPanel').style.display        = tab === 'quiz'        ? 'block' : 'none';
  document.getElementById('leaderboardPanel').style.display = tab === 'leaderboard' ? 'block' : 'none';
  if (tab === 'leaderboard') loadLeaderboard();
}

function startQuiz() {
  shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
  qIndex=0; qCorrect=0; qWrong=0; qStreak=0; qBestStreak=0;
  document.getElementById('quizIntro').style.display  = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizActive').style.display = 'block';
  updateScoreChips(); renderQuestion();
}

function renderQuestion() {
  qAnswered = false; clearInterval(qTimerInterval);
  const q   = shuffledQuestions[qIndex];
  const tot = shuffledQuestions.length;
  document.getElementById('quizQMeta').innerText        = `Question ${qIndex + 1} of ${tot}`;
  document.getElementById('quizQuestion').innerText     = q.q;
  document.getElementById('quizProgressFill').style.width = ((qIndex / tot) * 100) + '%';
  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display  = 'none';
  const opts = document.getElementById('quizOptions'); opts.innerHTML = '';
  q.opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span class="quiz-opt-letter">${['A','B','C','D'][i]}</span>${o}`;
    btn.onclick   = () => answerQuestion(i, btn, q);
    opts.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  qTimeLeft = 20; updateTimerUI();
  qTimerInterval = setInterval(() => {
    qTimeLeft--; updateTimerUI();
    if (qTimeLeft <= 0) { clearInterval(qTimerInterval); if (!qAnswered) timeUp(); }
  }, 1000);
}

function updateTimerUI() {
  const circle = document.getElementById('quizTimerCircle');
  circle.innerText = qTimeLeft;
  circle.classList.toggle('urgent', qTimeLeft <= 5);
}

function timeUp() {
  qAnswered = true; qWrong++; qStreak = 0; updateScoreChips();
  const q = shuffledQuestions[qIndex];
  document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => { b.disabled = true; if (i === q.ans) b.classList.add('correct'); });
  showFeedback(false, "Time's up! The answer was: " + q.opts[q.ans]);
  document.getElementById('quizNextBtn').style.display = 'block';
}

function answerQuestion(chosen, btn, q) {
  if (qAnswered) return; qAnswered = true; clearInterval(qTimerInterval);
  const correct = chosen === q.ans;
  if (correct) { qCorrect++; qStreak++; if (qStreak > qBestStreak) qBestStreak = qStreak; }
  else { qWrong++; qStreak = 0; }
  updateScoreChips();
  document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => { b.disabled = true; if (i === q.ans) b.classList.add('correct'); if (i === chosen && !correct) b.classList.add('wrong'); });
  showFeedback(correct, correct ? ['Correct! Praise God!','That\'s right!','Excellent!','Well done!'][Math.floor(Math.random()*4)] : 'The correct answer is: ' + q.opts[q.ans]);
  document.getElementById('quizNextBtn').style.display = 'block';
}

function showFeedback(correct, msg) {
  const el = document.getElementById('quizFeedback');
  el.style.display = 'block';
  el.className = 'quiz-feedback ' + (correct ? 'correct-fb' : 'wrong-fb');
  el.innerText = msg;
}

function nextQuestion() { qIndex++; if (qIndex >= shuffledQuestions.length) { showResult(); return; } renderQuestion(); }
function updateScoreChips() { document.getElementById('qCorrectCount').innerText = qCorrect; document.getElementById('qWrongCount').innerText = qWrong; document.getElementById('qStreak').innerText = qStreak; }

async function showResult() {
  clearInterval(qTimerInterval);
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('resultNum').innerHTML    = qCorrect + '<span class="result-score-denom">/30</span>';
  document.getElementById('resultCorrect').innerText = qCorrect;
  document.getElementById('resultWrong').innerText   = qWrong;
  document.getElementById('resultBest').innerText    = qBestStreak;
  const msg = resultMessages.find(m => qCorrect >= m.min && qCorrect <= m.max) || resultMessages[0];
  document.getElementById('resultTitle').innerText = msg.title;
  document.getElementById('resultVerse').innerText = msg.verse;
  const savedMsg = document.getElementById('resultSavedMsg');
  if (isLoggedIn && currentMember) {
    try {
      const ref  = db.collection('quizScores').doc(currentMember.uid);
      const snap = await ref.get();
      const prev = snap.exists ? snap.data() : null;
      if (!prev || qCorrect > prev.bestScore) {
        await ref.set({ uid: currentMember.uid, name: currentMember.name, email: currentMember.email, bestScore: qCorrect, totalPct: Math.round((qCorrect/30)*100), plays: (prev ? prev.plays : 0) + 1, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        savedMsg.innerText = prev ? 'New personal best saved! 🎉' : 'Score saved to leaderboard!';
        loadProfileQuizStats();
      } else {
        await ref.update({ plays: firebase.firestore.FieldValue.increment(1) });
        savedMsg.innerText = `Your best is ${prev.bestScore}/30. Keep going!`;
      }
    } catch(e) {}
  } else {
    savedMsg.innerText = 'Sign in to save your score to the leaderboard.';
  }
}

async function loadLeaderboard() {
  const list = document.getElementById('lbList');
  list.innerHTML = '<div class="lb-empty">Loading...</div>';
  try {
    const snap = await db.collection('quizScores').orderBy('bestScore','desc').limit(20).get();
    if (snap.empty) { list.innerHTML = '<div class="lb-empty">No scores yet — be the first to play!</div>'; return; }
    const rankClass = ['r1','r2','r3'];
    const medals    = ['🥇','🥈','🥉'];
    let html = '';
    snap.docs.forEach((doc, i) => {
      const d        = doc.data();
      const initials = d.name ? d.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '??';
      html += `<div class="lb-row"><div class="lb-rank ${rankClass[i]||''}">${medals[i]||(i+1)}</div><div class="lb-avatar">${initials}</div><div style="flex:1"><div class="lb-name">${d.name||'Anonymous'}</div><div class="lb-plays">${d.plays||1} play${(d.plays||1)!==1?'s':''}</div></div><div style="text-align:right"><div class="lb-score-num">${d.bestScore}<span style="font-size:0.8rem;font-weight:300;color:var(--ink-muted)">/30</span></div><div class="lb-score-sub">Best Score</div></div></div>`;
    });
    list.innerHTML = html;
    if (isLoggedIn && currentMember) {
      const myDoc = await db.collection('quizScores').doc(currentMember.uid).get();
      if (myDoc.exists) {
        const d        = myDoc.data();
        const myRank   = snap.docs.findIndex(doc => doc.id === currentMember.uid) + 1;
        const initials = currentMember.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('lbYourPosition').style.display = 'block';
        document.getElementById('lbYourRow').innerHTML = `<div class="lb-rank">${myRank > 0 ? '#'+myRank : '?'}</div><div class="lb-avatar" style="background:var(--gold);color:var(--ink)">${initials}</div><div style="flex:1"><div class="lb-name">${currentMember.name} <span style="font-size:0.6rem;background:var(--forest);color:white;padding:2px 7px;border-radius:2px;letter-spacing:0.08em;font-weight:600">YOU</span></div><div class="lb-plays">${d.plays||1} plays</div></div><div style="text-align:right"><div class="lb-score-num">${d.bestScore}/30</div><div class="lb-score-sub">Your Best</div></div>`;
      }
    }
  } catch(e) { list.innerHTML = '<div class="lb-empty">Could not load leaderboard.</div>'; }
}

function loadQuiz() {
  document.getElementById('quizIntro').style.display  = 'block';
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  switchQuizTab('quiz');
}

// ── WISHLIST ──
function saveWishlist() {
  localStorage.setItem('alc_wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const el = document.getElementById('wishlistCount');
  if (el) el.innerText = wishlist.length;
}

function toggleWishlist(productName) {
  const product = products.find(p => p.name === productName);
  if (!product) return;
  const idx = wishlist.findIndex(w => w.name === productName);
  if (idx === -1) {
    wishlist.push(product);
    showToast(productName + ' added to Wishlist ❤️');
  } else {
    wishlist.splice(idx, 1);
    showToast(productName + ' removed from Wishlist');
  }
  saveWishlist();
  applyStoreFilters(); // re-render cards to update heart icons
}

function clearWishlist() {
  if (!wishlist.length) return;
  wishlist = [];
  saveWishlist();
  renderWishlist();
  showToast('Wishlist cleared');
}

function renderWishlist() {
  const container = document.getElementById('wishlistContainer');
  const label     = document.getElementById('wishlistCountLabel');
  if (!container) return;
  if (label) label.innerText = wishlist.length + ' saved item' + (wishlist.length !== 1 ? 's' : '');
  if (!wishlist.length) {
    container.innerHTML = `<div class="wishlist-empty"><i class="bi bi-heart"></i><h4 class="serif" style="font-size:1.5rem;font-weight:600;margin-bottom:8px">Your wishlist is empty</h4><p style="font-size:0.85rem;margin-bottom:24px">Save items from the store by tapping the ❤️ heart icon</p><button onclick="show('store')" class="btn-primary-g" style="border-radius:2px"><i class="bi bi-bag me-2"></i>Browse Store</button></div>`;
    return;
  }
  container.innerHTML = wishlist.map(p => `
    <div class="wishlist-item">
      <img src="${p.img}" onerror="this.src='https://via.placeholder.com/72?text=Item'">
      <div style="flex:1">
        <div class="wishlist-item-name">${p.name}</div>
        <div style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-top:2px">${p.category}</div>
        <div class="wishlist-item-price" style="margin-top:4px">R${p.price}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        <button onclick="show('store')" style="background:var(--forest);color:white;border:none;border-radius:2px;padding:8px 16px;font-family:'Jost',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap"><i class="bi bi-bag-plus me-1"></i>Add to Cart</button>
        <button onclick="toggleWishlist('${p.name}');renderWishlist()" style="background:transparent;border:1px solid var(--border);color:var(--ink-muted);border-radius:2px;padding:6px 12px;font-family:'Jost',sans-serif;font-size:0.68rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer"><i class="bi bi-trash me-1"></i>Remove</button>
      </div>
    </div>
  `).join('');
}

// ── ORDER TRACKING ──
const ORDER_STATUSES = ['pending_payment', 'confirmed', 'in_progress', 'dispatched', 'delivered'];
const STATUS_LABELS  = ['Pending Payment', 'Confirmed', 'Preparing', 'Dispatched', 'Delivered'];
const STATUS_ICONS   = ['bi-clock', 'bi-check', 'bi-box', 'bi-truck', 'bi-house-check'];

function buildOrderCard(data, docId) {
  const statusIdx = ORDER_STATUSES.indexOf(data.status || 'pending_payment');
  const safeIdx   = statusIdx === -1 ? 0 : statusIdx;
  const date      = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' }) : 'Pending';
  const ref       = docId ? 'ALC-' + docId.substring(0,8).toUpperCase() : '—';
  const items     = (data.items || []);
  const total     = data.total || items.reduce((s,i) => s + Number(i.price||0), 0);
  const payLabels = { eft:'EFT / Bank Transfer', snapscan:'SnapScan', zapper:'Zapper', ozow:'Ozow', payflex:'PayFlex', cash:'Cash on Pickup' };
  const payMethod = payLabels[data.payMethod] || data.payMethod || 'EFT';

  const steps = ORDER_STATUSES.map((s, i) => {
    const cls = i < safeIdx ? 'done' : i === safeIdx ? 'active' : '';
    const icon = i < safeIdx ? 'bi-check-lg' : STATUS_ICONS[i];
    return `<div class="step-item ${cls}"><div class="step-circle"><i class="bi ${icon}"></i></div><div class="step-label">${STATUS_LABELS[i]}</div></div>`;
  }).join('');

  const statusColor = safeIdx === 4 ? '#2d7a4f' : safeIdx >= 2 ? 'var(--forest)' : 'var(--gold)';
  const statusBg    = safeIdx === 4 ? '#f0faf5' : safeIdx >= 2 ? 'rgba(26,61,46,0.08)' : '#fff8e1';
  const statusBorder= safeIdx === 4 ? '#a8d8b9' : safeIdx >= 2 ? 'rgba(26,61,46,0.2)' : '#e6d49a';

  return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-ref">Order #${ref}</div>
          <div class="order-name">${items.map(i=>i.name).join(', ') || 'Order'}</div>
          <div style="font-size:0.78rem;color:var(--ink-muted);margin-top:4px"><i class="bi bi-calendar me-1"></i>${date} &nbsp;·&nbsp; <i class="bi bi-geo-alt me-1"></i>${data.method === 'pickup' ? 'Church Pickup' : 'Delivery'} &nbsp;·&nbsp; ${payMethod}</div>
        </div>
        <div>
          <span style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;border-radius:2px;background:${statusBg};color:${statusColor};border:1px solid ${statusBorder}">${STATUS_LABELS[safeIdx]}</span>
        </div>
      </div>
      <div class="order-stepper">${steps}</div>
      <div class="order-items-list">
        ${items.map(item => `<div class="order-item-row"><span style="font-weight:500">${item.name}</span><div style="display:flex;align-items:center;gap:12px"><span style="font-size:0.75rem;color:var(--ink-muted)">${item.size || ''}</span><span style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:var(--forest)">R${item.price}</span></div></div>`).join('')}
        <div class="order-total-row"><span style="font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-muted)">Total</span><span style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--forest)">R${total}</span></div>
      </div>
      ${data.status !== 'delivered' ? `<div style="margin-top:16px;padding:12px 16px;background:var(--warm);border-radius:2px;font-size:0.82rem;color:var(--ink-muted)"><i class="bi bi-info-circle me-2" style="color:var(--gold)"></i>For order queries, email <strong>finance@anointedlivingchrist.org</strong> with your reference <strong>#${ref}</strong></div>` : ''}
    </div>`;
}

async function loadOrdersPage() {
  const memberPanel  = document.getElementById('memberOrdersPanel');
  const loginPrompt  = document.getElementById('trackLoginPrompt');
  const trackResult  = document.getElementById('trackResult');
  if (!memberPanel || !loginPrompt) return;
  trackResult.style.display = 'none';
  if (isLoggedIn && currentMember) {
    memberPanel.style.display = 'block';
    loginPrompt.style.display = 'none';
    const list = document.getElementById('memberOrdersList');
    list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)"><i class="bi bi-arrow-repeat" style="font-size:1.5rem"></i><p class="mt-2">Loading orders...</p></div>';
    try {
      const snap = await db.collection('orders').where('uid','==',currentMember.uid).orderBy('createdAt','desc').get();
      if (snap.empty) {
        list.innerHTML = `<div class="card-clean text-center" style="padding:48px"><i class="bi bi-box-seam" style="font-size:2.5rem;color:var(--border);display:block;margin-bottom:16px"></i><p style="color:var(--ink-muted);margin-bottom:20px">No orders yet</p><button onclick="show('store')" class="btn-primary-g" style="border-radius:2px"><i class="bi bi-bag me-2"></i>Visit Store</button></div>`;
      } else {
        list.innerHTML = snap.docs.map(doc => buildOrderCard(doc.data(), doc.id)).join('');
      }
    } catch(e) {
      list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)">Could not load orders. Please try again.</div>';
    }
  } else {
    memberPanel.style.display = 'none';
    loginPrompt.style.display = 'block';
  }
}

async function trackOrderByRef() {
  const refInput = document.getElementById('trackRefInput').value.trim().toUpperCase();
  const result   = document.getElementById('trackResult');
  if (!refInput) { showToast('Please enter an order reference', 'error'); return; }
  result.style.display = 'block';
  result.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)"><i class="bi bi-arrow-repeat" style="font-size:1.5rem"></i><p class="mt-2">Searching...</p></div>';
  document.getElementById('trackLoginPrompt').style.display = 'none';
  document.getElementById('memberOrdersPanel').style.display = 'none';
  try {
    // Extract the short ID from reference like ALC-ABCD1234
    const shortId = refInput.replace('ALC-','').toLowerCase();
    const snap = await db.collection('orders').get();
    const match = snap.docs.find(doc => doc.id.substring(0,8).toUpperCase() === shortId.substring(0,8).toUpperCase());
    if (match) {
      result.innerHTML = `<div style="margin-bottom:12px"><div class="section-eyebrow">Result Found</div><h3 class="serif" style="font-size:1.5rem;font-weight:600;margin-bottom:20px">Order Details</h3></div>` + buildOrderCard(match.data(), match.id);
    } else {
      result.innerHTML = `<div class="card-clean text-center" style="padding:40px"><i class="bi bi-search" style="font-size:2rem;color:var(--border);display:block;margin-bottom:12px"></i><p style="color:var(--ink-muted);margin-bottom:6px">No order found for <strong>${refInput}</strong></p><p style="font-size:0.82rem;color:var(--ink-muted)">Check your reference and try again, or email <strong>finance@anointedlivingchrist.org</strong></p></div>`;
    }
  } catch(e) {
    result.innerHTML = '<div style="text-align:center;padding:32px;color:var(--ink-muted)">Could not search orders. Please try again.</div>';
  }
}

// ── MAIN show() function ──
function show(id) {
  document.querySelectorAll('.section').forEach(s => { s.style.display = 'none'; });
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = (id === 'home') ? 'flex' : 'block';
  if (id === 'home') el.style.flexDirection = 'column';
  if (id === 'cart')     displayCart();
  if (id === 'sermons')  renderSermons(sermons);
  if (id === 'store')    loadProducts();
  if (id === 'orders')   loadOrdersPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}