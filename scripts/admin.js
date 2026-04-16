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