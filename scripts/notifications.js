// ── NOTIFICATION SYSTEM ──
async function toggleBrowserNotifications() {
  const btn = document.getElementById('browserNotifBtn');

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showToast('Browser notifications are already enabled!');
      btn.innerHTML = '<i class="bi bi-bell-fill me-1"></i>Enabled';
      btn.className = 'btn-submit';
      scheduleEventNotifications();
      notifyNewProducts();
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

        // Schedule a test notification and initialize alerts
        setTimeout(() => {
          new Notification('Anointed in Living Christ', {
            body: 'Notifications are now enabled! You\'ll be notified about upcoming events and new products.',
            icon: 'images/Logo.png.jpeg'
          });
          scheduleEventNotifications();
          notifyNewProducts();
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

const ALC_NOTIFICATION_HISTORY_KEY = 'alc_notification_history';

function getNotificationHistory() {
  try {
    return new Set(JSON.parse(localStorage.getItem(ALC_NOTIFICATION_HISTORY_KEY) || '[]'));
  } catch (e) {
    return new Set();
  }
}

function saveNotificationHistory(history) {
  localStorage.setItem(ALC_NOTIFICATION_HISTORY_KEY, JSON.stringify(Array.from(history)));
}

function hasNotificationBeenSent(key) {
  return getNotificationHistory().has(key);
}

function markNotificationSent(key) {
  const history = getNotificationHistory();
  history.add(key);
  saveNotificationHistory(history);
}

function showBrowserNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }
  const notification = new Notification(title, options);
  notification.onclick = () => window.focus();
  return true;
}

function updateEmailPreferences() {
  const enabled = document.getElementById('emailNotifications').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`Email notifications ${status}!`);

  if (isLoggedIn) {
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

function updateProductNotifications() {
  const enabled = document.getElementById('productNotifications').checked;
  const status = enabled ? 'enabled' : 'disabled';
  showToast(`New product alerts ${status}!`);

  if (isLoggedIn) {
    db.collection('users').doc(currentMember.uid).update({
      productNotifications: enabled
    });
  }
}

function parseEventDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const normalized = value.trim().replace(/-/g, '/');
    const parsed = new Date(`${normalized}T09:00:00`);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function scheduleEventNotifications() {
  const eventCheckbox = document.getElementById('eventReminders');
  if (!eventCheckbox || !eventCheckbox.checked) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  let upcoming = [];
  if (typeof events !== 'undefined' && Array.isArray(events)) {
    upcoming = events;
  } else if (Array.isArray(window._alcEvents)) {
    upcoming = window._alcEvents;
  }

  const now = new Date();
  upcoming.forEach(event => {
    const eventDate = parseEventDate(event.date);
    if (!eventDate || eventDate < now) return;

    const title = event.title || event.name || 'Upcoming Event';
    const time = event.time || '';
    const location = event.location || event.venue || '';
    const bodyParts = [];
    if (time) bodyParts.push(time);
    if (location) bodyParts.push(location);
    const body = bodyParts.join(' · ');
    const reminderTime = new Date(eventDate.getTime() - 3600000);
    const delay = reminderTime.getTime() - now.getTime();
    const key = `event-reminder:${title}:${event.date}`;

    if (hasNotificationBeenSent(key)) return;

    const sendNotification = () => {
      if (showBrowserNotification(`Upcoming Event: ${title}`, { body: body || 'Don’t miss this upcoming event!', icon: '/favicon.ico' })) {
        markNotificationSent(key);
      }
    };

    if (delay <= 0 && eventDate.getTime() - now.getTime() <= 3600000) {
      sendNotification();
    } else if (delay > 0 && delay <= 86400000) {
      setTimeout(sendNotification, delay);
    }
  });
}

function notifyNewProducts() {
  const productCheckbox = document.getElementById('productNotifications');
  if (!productCheckbox || !productCheckbox.checked) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const productList = typeof products !== 'undefined' && Array.isArray(products) ? products : [];
  productList.forEach((product, idx) => {
    const isNew = product.isNew || product.newProduct || idx === 0;
    if (!isNew) return;

    const key = `new-product:${product.name}`;
    if (hasNotificationBeenSent(key)) return;

    const body = `Just added to the store for R${product.price}.`;
    const icon = product.img || '/favicon.ico';
    if (showBrowserNotification(`New product available: ${product.name}`, { body, icon })) {
      markNotificationSent(key);
    }
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
        document.getElementById('productNotifications').checked = data.productNotifications || false;
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

window.addEventListener('load', function() {
  setTimeout(() => {
    scheduleEventNotifications();
    notifyNewProducts();
  }, 200);
});