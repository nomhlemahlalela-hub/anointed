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