/* =========================================================
   ZEVAR — core app logic
   Replace PRODUCTS below with your real catalogue whenever
   you're ready — each item just needs id, name, category,
   price (in rupees, whole number) and a short desc.
   `icon` controls which placeholder graphic is shown until
   you swap in a real photo (see README "Adding your photos").
========================================================= */

const PRODUCTS = [
  { id:'p1',  name:'Kundan Choker Set',                 category:'Necklace',    price:1999, icon:'icon-necklace', desc:'Classic kundan work with a touch of pearl, pairs beautifully with sarees and lehengas.' },
  { id:'p2',  name:'Polki Bridal Necklace',              category:'Necklace',    price:3499, icon:'icon-necklace', desc:'Statement bridal piece with polki-style stones, made for the main event.' },
  { id:'p3',  name:'American Diamond Necklace Set',      category:'Necklace',    price:2299, icon:'icon-necklace', desc:'Sparkling AD stones in a delicate silver-tone finish, comes with matching earrings.' },
  { id:'p4',  name:'Temple Jewellery Necklace',          category:'Necklace',    price:2799, icon:'icon-necklace', desc:'Traditional temple motifs in an antique gold finish, perfect for festive occasions.' },
  { id:'p5',  name:'Pearl Layered Necklace',             category:'Necklace',    price:1499, icon:'icon-necklace', desc:'Multi-layered pearl strands for an elegant, everyday statement look.' },
  { id:'p6',  name:'Jhumka Earrings',                    category:'Earrings',    price:699,  icon:'icon-earring',  desc:'Classic bell-shaped jhumkas with a soft chime, lightweight for all-day wear.' },
  { id:'p7',  name:'Chandbali Earrings',                 category:'Earrings',    price:999,  icon:'icon-earring',  desc:'Crescent-moon silhouette with intricate detailing, a timeless festive pick.' },
  { id:'p8',  name:'American Diamond Stud Earrings',     category:'Earrings',    price:799,  icon:'icon-earring',  desc:'Everyday sparkle with a secure push-back fastening.' },
  { id:'p9',  name:'Kundan Drop Earrings',                category:'Earrings',    price:899,  icon:'icon-earring',  desc:'Elegant kundan drops that catch the light with every movement.' },
  { id:'p10', name:'Pearl Hoop Earrings',                category:'Earrings',    price:749,  icon:'icon-earring',  desc:'Delicate pearls set along a slim hoop, easy to dress up or down.' },
  { id:'p11', name:'Gold-Plated Bangles Set',            category:'Bangles',     price:1299, icon:'icon-bangle',   desc:'Set of stackable gold-plated bangles with a subtle shine.' },
  { id:'p12', name:'Kundan Bangles',                     category:'Bangles',     price:1499, icon:'icon-bangle',   desc:'Kundan-studded bangles for a rich, festive finish.' },
  { id:'p13', name:'Stone Kada',                          category:'Bangles',     price:999,  icon:'icon-bangle',   desc:'Bold single kada with a stone-studded border.' },
  { id:'p14', name:'Adjustable American Diamond Ring',    category:'Rings',       price:699,  icon:'icon-ring',     desc:'Sparkling AD stone on an adjustable band, fits most sizes.' },
  { id:'p15', name:'Kundan Cocktail Ring',                category:'Rings',       price:899,  icon:'icon-ring',     desc:'A statement kundan ring designed to be the centre of attention.' },
  { id:'p16', name:'Pearl Ring',                          category:'Rings',       price:599,  icon:'icon-ring',     desc:'Simple, elegant pearl ring for everyday wear.' },
  { id:'p17', name:'Bridal Maang Tikka',                  category:'Maang Tikka', price:999,  icon:'icon-tikka',    desc:'Delicate chain tikka with a kundan and pearl drop, hair-pin fastening.' },
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
    <button class="cat-card reveal-3d" data-cat="${c.name}">
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
  observeReveal();
}

/* ---------- product grid render ---------- */
let currentFilter = 'all';
function renderProducts(){
  const grid = document.getElementById('productGrid');
  const list = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  grid.innerHTML = list.map(p => `
    <div class="p-card reveal-3d" data-id="${p.id}">
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
    attachTouchTilt(card, 6);
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
  observeReveal();
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

/* ---------- hero 3D carousel (auto-plays + swipeable, works without a mouse) ---------- */
const HERO_SLIDE_IDS = ['p2', 'p7', 'p12', 'p15', 'p17']; // one flagship piece per category
const HERO_SLIDES = HERO_SLIDE_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
let heroIndex = 0;
let heroTimer = null;

function renderHeroCarousel(){
  const track = document.getElementById('heroSlides');
  const dots = document.getElementById('heroDots');
  track.innerHTML = HERO_SLIDES.map((p, i) => `
    <div class="hero-slide ${i === 0 ? 'is-active' : ''}" data-index="${i}">
      <div class="case-card">
        <div class="case-shine"></div>
        <div class="case-product"><svg class="icon icon-xl"><use href="#${p.icon}"/></svg></div>
        <p class="case-label">${p.name}</p>
        <p class="case-price">${window.Zevar.formatPrice(p.price)}</p>
      </div>
    </div>
  `).join('');
  dots.innerHTML = HERO_SLIDES.map((_, i) => `<button class="hero-dot ${i === 0 ? 'is-active' : ''}" data-i="${i}" aria-label="Show slide ${i + 1}"></button>`).join('');
  dots.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => goToHeroSlide(parseInt(dot.dataset.i, 10)));
  });
}

function goToHeroSlide(i){
  heroIndex = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
  document.querySelectorAll('.hero-slide').forEach(s => {
    s.classList.toggle('is-active', parseInt(s.dataset.index, 10) === heroIndex);
  });
  document.querySelectorAll('.hero-dot').forEach(d => {
    d.classList.toggle('is-active', parseInt(d.dataset.i, 10) === heroIndex);
  });
  const activeCard = document.querySelector('.hero-slide.is-active .case-card');
  if(activeCard){
    activeCard.classList.remove('is-shining');
    void activeCard.offsetWidth;
    activeCard.classList.add('is-shining');
  }
  restartHeroAutoplay();
}

function restartHeroAutoplay(){
  clearInterval(heroTimer);
  heroTimer = setInterval(() => goToHeroSlide(heroIndex + 1), 3800);
}

function initHeroSwipe(){
  const wrap = document.getElementById('heroCase');
  let startX = 0;
  wrap.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
  wrap.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ goToHeroSlide(dx < 0 ? heroIndex + 1 : heroIndex - 1); }
  }, {passive:true});
}

/* ---------- scroll-triggered 3D reveal — animates cards in as you scroll,
   which is what actually shows on a phone (hover effects never fire there) ---------- */
let revealObserver = null;
function observeReveal(root){
  if(!revealObserver){
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }
  (root || document).querySelectorAll('.reveal, .reveal-3d').forEach(el => revealObserver.observe(el));
}

/* ---------- touch-drag tilt for product cards (mirrors the mouse tilt) ---------- */
function attachTouchTilt(el, max = 6){
  el.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    const px = (t.clientX - r.left) / r.width;
    const py = (t.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, {passive:true});
  el.addEventListener('touchend', () => {
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ---------- init ---------- */
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.innerHTML = showing
      ? '<svg class="icon icon-sm"><use href="#icon-eye"/></svg>'
      : '<svg class="icon icon-sm"><use href="#icon-eye-off"/></svg>';
    btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });
});

document.getElementById('yearNow').textContent = new Date().getFullYear();
buildSparkles();
renderCategories();
renderProducts();
updateCartUI();
renderHeroCarousel();
restartHeroAutoplay();
initHeroSwipe();
observeReveal();
