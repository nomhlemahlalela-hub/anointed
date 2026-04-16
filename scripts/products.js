// ── PRODUCTS ──
let products = [
  { name:"Long T-Shirt",      price:250, img:"images/Long T-shirt.jpeg",   rating:4.5, sizes:["S","M","L","XL"],  category:"Clothing" },
  { name:"White Jacket",      price:550, img:"images/white jacket.jpeg",   rating:4.0, sizes:["M","L","XL"],      category:"Jackets" },
  { name:"Hat",               price:180, img:"images/Hat.jpeg",            rating:3.5, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Black Jacket",      price:420, img:"images/jacket black.jpeg",   rating:4.8, sizes:["S","M","L","XL"],  category:"Jackets" },
  { name:"Jacket",            price:220, img:"images/bumba jacket 2.jpeg", rating:4.7, sizes:["S","M","L","XL"],  category:"Clothing" },
  { name:"Anointed Socks",    price:150, img:"images/white socks.jpeg",    rating:4.2, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Green Socks",       price:480, img:"images/socks green.jpeg",    rating:4.9, sizes:["One Size"],        category:"Clothing" },
  { name:"Travelling Bag",    price:190, img:"images/bag.jpeg",            rating:4.6, sizes:["One Size"],        category:"Bags & Accessories" },
  { name:"Grace Mug",         price:90,  img:"https://via.placeholder.com/300x240?text=Grace+Mug",       rating:4.3, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Hope Journal",      price:130, img:"https://via.placeholder.com/300x240?text=Hope+Journal",    rating:4.8, sizes:["One Size"], category:"Bags & Accessories" },
  { name:"Salvation T-Shirt", price:260, img:"https://via.placeholder.com/300x240?text=Salvation+Tee",  rating:4.5, sizes:["S","M","L","XL"], category:"Clothing" },
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