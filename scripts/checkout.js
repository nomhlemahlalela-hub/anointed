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