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