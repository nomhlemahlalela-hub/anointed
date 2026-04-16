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
            icon: 'images/Logo.png.jpeg'
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