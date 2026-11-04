/* ══════════════════════════════════════════
   WatchHub — Main JavaScript
   ══════════════════════════════════════════ */

// ───── CART STATE ─────
let cart = JSON.parse(localStorage.getItem('wh_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('wh_wishlist') || '[]');

function saveCart() { localStorage.setItem('wh_cart', JSON.stringify(cart)); updateCartBadge(); }
function saveWishlist() { localStorage.setItem('wh_wishlist', JSON.stringify(wishlist)); updateWishlistBadge(); }

// ───── ADD TO CART ─────
function addToCart(id, name, price, emoji) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, emoji, qty: 1 });
  }
  saveCart();
  showToast(`🛒 ${name} cart mein add ho gaya!`, 'success');
}

// ───── REMOVE FROM CART ─────
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  if (typeof renderCart === 'function') renderCart();
}

// ───── UPDATE QTY ─────
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); if (typeof renderCart === 'function') renderCart(); }
}

// ───── WISHLIST TOGGLE ─────
function toggleWishlist(id, name, price, emoji, btn) {
  const idx = wishlist.findIndex(i => i.id === id);
  if (idx === -1) {
    wishlist.push({ id, name, price, emoji });
    if (btn) { btn.classList.add('active'); btn.textContent = '❤️'; }
    showToast(`❤️ ${name} wishlist mein add hua!`, 'success');
  } else {
    wishlist.splice(idx, 1);
    if (btn) { btn.classList.remove('active'); btn.textContent = '🤍'; }
    showToast(`💔 ${name} wishlist se remove hua`);
  }
  saveWishlist();
}

// ───── BADGE UPDATES ─────
function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}
function updateWishlistBadge() {
  document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = wishlist.length);
}

// ───── TOAST ─────
let toastContainer;
function showToast(msg, type = 'info') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${msg}</span>`;
  toastContainer.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

// ───── SEARCH ─────
function handleSearch(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    const q = document.getElementById('searchInput')?.value?.trim();
    if (q) window.location.href = `products.html?q=${encodeURIComponent(q)}`;
  }
}

// ───── INIT ─────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateWishlistBadge();

  // Wishlist button states
  document.querySelectorAll('.wishlist-btn[data-id]').forEach(btn => {
    const id = btn.dataset.id;
    if (wishlist.find(i => i.id === id)) {
      btn.classList.add('active');
      btn.textContent = '❤️';
    }
  });

  // Search input
  const si = document.getElementById('searchInput');
  if (si) {
    si.addEventListener('keydown', handleSearch);
  }
  document.getElementById('searchBtn')?.addEventListener('click', handleSearch);

  // Mobile menu toggle
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.toggle('open');
  });
});

// ───── CART TOTAL ─────
function getCartTotal() {
  return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}

// ───── FORMAT PRICE ─────
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

