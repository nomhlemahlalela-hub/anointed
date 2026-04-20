// ── MAIN show() function ──
function show(id) {
  document.querySelectorAll('.section').forEach(s => { s.style.display = 'none'; });
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = (id === 'home') ? 'flex' : 'block';
  if (id === 'home')         el.style.flexDirection = 'column';
  if (id === 'cart')         displayCart();
  if (id === 'sermons')      renderSermons(sermons);
  if (id === 'store')        loadProducts();
  if (id === 'orders')       loadOrdersPage();
  if (id === 'leaders')      loadLeaders();
  if (id === 'constitution') { initConstitution(); constSwitchLang('en'); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── INIT ──
loadDailyVerse();
checkLiveStatus();
loadLeaders();