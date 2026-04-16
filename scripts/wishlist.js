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