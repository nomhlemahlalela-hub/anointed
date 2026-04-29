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

 function loadNotificationSettings() {
  if (!isLoggedIn || !currentMember) return;
  db.collection('users').doc(currentMember.uid).get().then(doc => {
    if (doc.exists) {
      const d = doc.data();
      // Notifications
      if (document.getElementById('browserNotifications'))
        document.getElementById('browserNotifications').checked = d.browserNotifications || false;
      if (document.getElementById('emailNotifications'))
        document.getElementById('emailNotifications').checked = d.emailNotifications || false;
      if (document.getElementById('eventReminders'))
        document.getElementById('eventReminders').checked = d.eventReminders || false;
      // Personal info
      if (d.phone)  document.getElementById('settingsPhone').value  = d.phone;
      if (d.dob)    document.getElementById('settingsDob').value    = d.dob;
      if (d.gender) document.getElementById('settingsGender').value = d.gender;
      if (d.city)   document.getElementById('settingsCity').value   = d.city;
      // Church info
      if (d.branch)     document.getElementById('settingsBranch').value     = d.branch;
      if (d.ministry)   document.getElementById('settingsMinistry').value   = d.ministry;
      if (d.baptism)    document.getElementById('settingsBaptism').value    = d.baptism;
      if (d.dateJoined) document.getElementById('settingsDateJoined').value = d.dateJoined;
      // Last login
      const lastLogin = auth.currentUser?.metadata?.lastSignInTime;
      if (lastLogin) document.getElementById('lastLoginDisplay').innerText =
        new Date(lastLogin).toLocaleString('en-ZA');
    }
  }).catch(err => console.error('Error loading settings:', err));
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
    // Write to 'members' for backwards compatibility
    await db.collection('members').add({ uid: cred.user.uid, name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    // Write to 'users' (keyed by UID) so the admin panel can find this member
    await db.collection('users').doc(cred.user.uid).set({ uid: cred.user.uid, name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    okMsg.innerText = 'Account created!';
    setTimeout(() => { closeAuthModal(); }, 1200);
    showToast('Welcome to the family, ' + name + '! 🎉');
  } catch(err) { errMsg.innerText = getFriendlyError(err.code); }
}

function getFriendlyError(code) {
  const map = {'auth/user-not-found':'No account found with this email.','auth/wrong-password':'Incorrect password. Please try again.','auth/email-already-in-use':'This email is already registered.','auth/invalid-email':'Please enter a valid email address.','auth/weak-password':'Password must be at least 6 characters.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/invalid-credential':'Incorrect email or password.'};
  return map[code] || 'Something went wrong. Please try again.';
}

// ── UPDATE PERSONAL INFO ──
async function updateProfileSettings() {
  if (!isLoggedIn || !currentMember) return;
  const name   = document.getElementById('settingsName').value.trim();
  const phone  = document.getElementById('settingsPhone').value.trim();
  const dob    = document.getElementById('settingsDob').value;
  const gender = document.getElementById('settingsGender').value;
  const city   = document.getElementById('settingsCity').value.trim();
  const msg    = document.getElementById('personalInfoMsg');
  try {
    if (name) await auth.currentUser.updateProfile({ displayName: name });
    await db.collection('users').doc(currentMember.uid).set({
      name, phone, dob, gender, city,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    currentMember.name = name;
    document.getElementById('profileDisplayName').innerText = name;
    document.getElementById('profileInfoBox').innerHTML =
      `<strong>Name:</strong> ${name}<br>
       <strong>Email:</strong> ${currentMember.email}<br>
       <strong>Phone:</strong> ${phone || '—'}<br>
       <strong>City:</strong> ${city || '—'}<br>
       <strong>Member Since:</strong> 2026`;
    msg.style.color = 'var(--forest)';
    msg.innerText = 'Personal info saved! ✓';
    showToast('Profile updated successfully! 🙏');
    setTimeout(() => msg.innerText = '', 3000);
  } catch(e) {
    msg.style.color = '#c94040';
    msg.innerText = 'Could not save. Please try again.';
  }
}

// ── UPDATE CHURCH INFO ──
async function updateChurchInfo() {
  if (!isLoggedIn || !currentMember) return;
  const branch      = document.getElementById('settingsBranch').value;
  const ministry    = document.getElementById('settingsMinistry').value;
  const baptism     = document.getElementById('settingsBaptism').value;
  const dateJoined  = document.getElementById('settingsDateJoined').value;
  const msg         = document.getElementById('churchInfoMsg');
  try {
    await db.collection('users').doc(currentMember.uid).set({
      branch, ministry, baptism, dateJoined,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    msg.style.color = 'var(--forest)';
    msg.innerText = 'Church info saved! ✓';
    showToast('Church info updated! 🙏');
    setTimeout(() => msg.innerText = '', 3000);
  } catch(e) {
    msg.style.color = '#c94040';
    msg.innerText = 'Could not save. Please try again.';
  }
}

// ── CHANGE PASSWORD ──
async function changePassword() {
  const currentPass = document.getElementById('settingsCurrentPass').value;
  const newPass     = document.getElementById('settingsNewPass').value;
  const confirmPass = document.getElementById('settingsConfirmPass').value;
  const msg         = document.getElementById('passwordMsg');
  if (!currentPass || !newPass || !confirmPass) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please fill in all password fields.'; return;
  }
  if (newPass.length < 6) {
    msg.style.color = '#c94040';
    msg.innerText = 'New password must be at least 6 characters.'; return;
  }
  if (newPass !== confirmPass) {
    msg.style.color = '#c94040';
    msg.innerText = 'New passwords do not match.'; return;
  }
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentMember.email, currentPass
    );
    await auth.currentUser.reauthenticateWithCredential(credential);
    await auth.currentUser.updatePassword(newPass);
    msg.style.color = 'var(--forest)';
    msg.innerText = 'Password changed successfully! ✓';
    showToast('Password updated! 🔒');
    document.getElementById('settingsCurrentPass').value = '';
    document.getElementById('settingsNewPass').value = '';
    document.getElementById('settingsConfirmPass').value = '';
    setTimeout(() => msg.innerText = '', 3000);
  } catch(e) {
    msg.style.color = '#c94040';
    msg.innerText = getFriendlyError(e.code);
  }
}

// ── CHANGE EMAIL ──
async function changeEmail() {
  const newEmail = document.getElementById('settingsNewEmail').value.trim();
  const password = document.getElementById('settingsEmailPass').value;
  const msg      = document.getElementById('emailChangeMsg');
  if (!newEmail || !password) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please enter new email and your password.'; return;
  }
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentMember.email, password
    );
    await auth.currentUser.reauthenticateWithCredential(credential);
    await auth.currentUser.updateEmail(newEmail);
    await db.collection('users').doc(currentMember.uid).set(
      { email: newEmail }, { merge: true }
    );
    currentMember.email = newEmail;
    document.getElementById('profileDisplayEmail').innerText = newEmail;
    msg.style.color = 'var(--forest)';
    msg.innerText = 'Email updated successfully! ✓';
    showToast('Email address updated! ✉️');
    setTimeout(() => msg.innerText = '', 3000);
  } catch(e) {
    msg.style.color = '#c94040';
    msg.innerText = getFriendlyError(e.code);
  }
}