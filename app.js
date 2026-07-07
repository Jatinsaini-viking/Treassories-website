/* =========================================================
   ZEVAR — core app logic
   Replace PRODUCTS below with your real catalogue whenever
   you're ready — each item just needs id, name, category,
   price (in rupees, whole number) and a short desc.
   `icon` controls which placeholder graphic is shown until
   you swap in a real photo (see README "Adding your photos").
========================================================= */

const PRODUCTS = [
  { id:'p1',  name:'Antique Gold Temple Necklace', category:'Necklace',    price:1599, icon:'icon-necklace', desc:'Temple-style motifs in an antique gold finish, layered for a festive look. Adjustable thread closure.' },
  { id:'p2',  name:'Kundan Choker Set',             category:'Necklace',    price:1299, icon:'icon-necklace', desc:'Classic kundan choker with matching earrings. Pairs beautifully with sarees and lehengas.' },
  { id:'p3',  name:'Polki Bridal Choker',           category:'Necklace',    price:1999, icon:'icon-necklace', desc:'Statement bridal choker with polki-style stones and pearl drops.' },
  { id:'p4',  name:'Oxidised Silver Jhumka',        category:'Earrings',    price:499,  icon:'icon-earring',  desc:'Traditional oxidised jhumkas with a soft bell chime. Lightweight for all-day wear.' },
  { id:'p5',  name:'Meenakari Jhumar Earrings',     category:'Earrings',    price:599,  icon:'icon-earring',  desc:'Hand-painted meenakari work in jewel tones, finished with a secure hook back.' },
  { id:'p6',  name:'Rose Gold Bangle Set (2 pc)',   category:'Bangles',     price:699,  icon:'icon-bangle',   desc:'Set of two slim rose-gold toned bangles with a brushed matte finish.' },
  { id:'p7',  name:'Kada Bangle, Single',           category:'Bangles',     price:449,  icon:'icon-bangle',   desc:'Bold single kada with a hand-carved floral border.' },
  { id:'p8',  name:'Emerald Kundan Ring',           category:'Rings',       price:349,  icon:'icon-ring',     desc:'Adjustable ring with a kundan-set emerald-green centre stone.' },
  { id:'p9',  name:'Stone Adjustable Ring',         category:'Rings',       price:299,  icon:'icon-ring',     desc:'Everyday adjustable ring with a subtle stone cluster.' },
  { id:'p10', name:'Pearl Drop Maang Tikka',        category:'Maang Tikka', price:399,  icon:'icon-tikka',    desc:'Delicate chain tikka with a pearl and kundan drop, hair-pin fastening.' },
];

const CATEGORIES = [
  { name:'Necklace',    icon:'icon-necklace' },
  { name:'Earrings',    icon:'icon-earring' },
  { name:'Bangles',     icon:'icon-bangle' },
  { name:'Rings',       icon:'icon-ring' },
  { name:'Maang Tikka', icon:'icon-tikka' },
];

/* Shared namespace other files (auth.js, checkout.js) read from */
window.Zevar = {
  products: PRODUCTS,
  cart: [], // [{id, qty}]
  formatPrice(n){ return '₹' + n.toLocaleString('en-IN'); },
  addToCart(id, qty){
    qty = qty || 1;
    const line = window.Zevar.cart.find(l => l.id === id);
    if(line){ line.qty += qty; } else { window.Zevar.cart.push({id, qty}); }
    updateCartUI();
    showToast('Added to bag');
  },
  cartTotal(){
    return window.Zevar.cart.reduce((sum, line) => {
      const p = PRODUCTS.find(p => p.id === line.id);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);
  },
  cartCount(){
    return window.Zevar.cart.reduce((n, l) => n + l.qty, 0);
  }
};

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

/* ---------- generic 3D tilt (mouse-tracked) ---------- */
function attachTilt(el, {max = 8, shineTrigger = null} = {}){
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
  if(shineTrigger){
    el.addEventListener('mouseenter', () => {
      shineTrigger.classList.remove('is-shining'); void shineTrigger.offsetWidth;
      shineTrigger.classList.add('is-shining');
    });
  }
}

/* ---------- hero sparkles ---------- */
function buildSparkles(){
  const host = document.getElementById('heroSparkles');
  const count = 22;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*90 + '%';
    s.style.animationDelay = (Math.random()*3.6).toFixed(2) + 's';
    host.appendChild(s);
  }
}

/* ---------- categories render ---------- */
function renderCategories(){
  const row = document.getElementById('catRow');
  row.innerHTML = CATEGORIES.map(c => `
    <button class="cat-card" data-cat="${c.name}">
      <svg><use href="#${c.icon}"/></svg>
      <span>${c.name}</span>
    </button>
  `).join('');
  row.querySelectorAll('.cat-card').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(`.filter-chip[data-filter="${btn.dataset.cat}"]`)?.click();
      document.getElementById('shop').scrollIntoView({behavior:'smooth'});
    });
  });
}

/* ---------- product grid render ---------- */
let currentFilter = 'all';
function renderProducts(){
  const grid = document.getElementById('productGrid');
  const list = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  grid.innerHTML = list.map(p => `
    <div class="p-card" data-id="${p.id}">
      <div class="p-visual">
        <div class="p-shine"></div>
        <svg><use href="#${p.icon}"/></svg>
        <span class="p-placeholder-tag">Sample image</span>
      </div>
      <div class="p-info">
        <p class="p-cat">${p.category}</p>
        <p class="p-name">${p.name}</p>
        <div class="p-price-row">
          <span class="p-price">${window.Zevar.formatPrice(p.price)}</span>
          <button class="p-add-btn" data-quickadd="${p.id}" aria-label="Add to bag"><svg class="icon icon-sm"><use href="#icon-plus"/></svg></button>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.p-card').forEach(card => {
    attachTilt(card, {max:6, shineTrigger: card});
    card.addEventListener('click', (e) => {
      if(e.target.closest('[data-quickadd]')) return;
      openQuickView(card.dataset.id);
    });
  });
  grid.querySelectorAll('[data-quickadd]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.Zevar.addToCart(btn.dataset.quickadd, 1);
    });
  });
}

document.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
  chip.classList.add('is-active');
  currentFilter = chip.dataset.filter;
  renderProducts();
});

/* ---------- quick view modal ---------- */
let qvState = { id:null, qty:1 };
function openQuickView(id){
  const p = PRODUCTS.find(p => p.id === id);
  if(!p) return;
  qvState = { id, qty:1 };
  document.getElementById('qvCategory').textContent = p.category;
  document.getElementById('qvTitle').textContent = p.name;
  document.getElementById('qvPrice').textContent = window.Zevar.formatPrice(p.price);
  document.getElementById('qvDesc').textContent = p.desc;
  document.getElementById('qvQty').textContent = '1';
  document.getElementById('qvIcon').innerHTML = `<svg><use href="#${p.icon}"/></svg>`;
  openOverlay('quickViewOverlay');
}
document.getElementById('qvMinus').addEventListener('click', () => {
  qvState.qty = Math.max(1, qvState.qty - 1);
  document.getElementById('qvQty').textContent = qvState.qty;
});
document.getElementById('qvPlus').addEventListener('click', () => {
  qvState.qty += 1;
  document.getElementById('qvQty').textContent = qvState.qty;
});
document.getElementById('qvAddBtn').addEventListener('click', () => {
  if(!qvState.id) return;
  window.Zevar.addToCart(qvState.id, qvState.qty);
  closeOverlay('quickViewOverlay');
});

/* ---------- overlay helpers (shared by all modals/drawers) ---------- */
function openOverlay(id){ document.getElementById(id).classList.add('is-open'); }
function closeOverlay(id){ document.getElementById(id).classList.remove('is-open'); }
document.querySelectorAll('.overlay').forEach(ov => {
  ov.addEventListener('click', (e) => { if(e.target === ov) ov.classList.remove('is-open'); });
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.overlay').classList.remove('is-open'));
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){ document.querySelectorAll('.overlay.is-open').forEach(o => o.classList.remove('is-open')); }
});

/* ---------- cart drawer ---------- */
function updateCartUI(){
  const items = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('cartEmptyMsg');
  const foot = document.getElementById('cartFoot');
  const countBadge = document.getElementById('cartCount');

  countBadge.textContent = window.Zevar.cartCount();

  if(window.Zevar.cart.length === 0){
    emptyMsg.style.display = 'block';
    foot.style.display = 'none';
    items.innerHTML = '';
    items.appendChild(emptyMsg);
    return;
  }
  emptyMsg.style.display = 'none';
  foot.style.display = 'block';

  items.innerHTML = window.Zevar.cart.map(line => {
    const p = PRODUCTS.find(p => p.id === line.id);
    if(!p) return '';
    return `
      <div class="cart-line" data-id="${p.id}">
        <div class="cart-line-visual"><svg><use href="#${p.icon}"/></svg></div>
        <div class="cart-line-info">
          <p class="cart-line-name">${p.name}</p>
          <p class="cart-line-price">${window.Zevar.formatPrice(p.price)}</p>
          <div class="cart-line-qty">
            <button data-dec><svg class="icon icon-sm"><use href="#icon-minus"/></svg></button>
            <span>${line.qty}</span>
            <button data-inc><svg class="icon icon-sm"><use href="#icon-plus"/></svg></button>
          </div>
        </div>
        <button class="cart-line-remove" data-remove aria-label="Remove"><svg class="icon icon-sm"><use href="#icon-trash"/></svg></button>
      </div>
    `;
  }).join('');

  document.getElementById('cartSubtotal').textContent = window.Zevar.formatPrice(window.Zevar.cartTotal());

  items.querySelectorAll('.cart-line').forEach(row => {
    const id = row.dataset.id;
    row.querySelector('[data-inc]').addEventListener('click', () => {
      const line = window.Zevar.cart.find(l => l.id === id); line.qty += 1; updateCartUI();
    });
    row.querySelector('[data-dec]').addEventListener('click', () => {
      const line = window.Zevar.cart.find(l => l.id === id);
      line.qty -= 1;
      if(line.qty <= 0){ window.Zevar.cart = window.Zevar.cart.filter(l => l.id !== id); }
      updateCartUI();
    });
    row.querySelector('[data-remove]').addEventListener('click', () => {
      window.Zevar.cart = window.Zevar.cart.filter(l => l.id !== id);
      updateCartUI();
    });
  });
}

document.getElementById('cartOpenBtn').addEventListener('click', () => openOverlay('cartOverlay'));

/* ---------- nav scroll + mobile menu ---------- */
window.addEventListener('scroll', () => {
  document.getElementById('siteNav').classList.toggle('is-scrolled', window.scrollY > 8);
});
document.getElementById('menuOpenBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('is-open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('is-open'));
});

/* ---------- hero case tilt ---------- */
function initHeroTilt(){
  const hero = document.getElementById('home');
  const card = document.getElementById('caseCard');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 10;
    const ry = (px - 0.5) * 10;
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ---------- init ---------- */
document.getElementById('yearNow').textContent = new Date().getFullYear();
buildSparkles();
renderCategories();
renderProducts();
updateCartUI();
initHeroTilt();
