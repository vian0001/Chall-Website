/**
 * MONOLITH / ARCHIVE — E-Commerce Client Engine
 * Strict Anti-Emoji Policy: 100% Clean SVG Primitives
 */

// Curated Product Collection
const PRODUCTS = [
  {
    id: 'mn-01',
    sku: 'MN-SH-01',
    title: 'Asymmetric 3-Layer Technical Shell',
    category: 'outerwear',
    price: 485,
    tag: 'Capsule Exclusive',
    stockStatus: '4 units left in Tokyo hub',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85',
    material: '3-Layer Micro-Ripstop ePTFE Membrane (20,000mm Waterproof)',
    details: 'Ergonomic articulated sleeves, storm-flap asymmetric YKK Aquaguard zip enclosure, dual deployable internal sling carry system.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Chalk Grey']
  },
  {
    id: 'mn-04',
    sku: 'MN-TR-04',
    title: 'Waxed Parachute Articulated Cargo',
    category: 'bottoms',
    price: 295,
    tag: 'Bestseller',
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85',
    material: '100% Waxed High-Density Cotton Twill with Fluorocarbon Finish',
    details: 'Expandable 8-pocket ergonomic matrix, Fidlock V-buckle waist adjusters, cinch hem drawcords for variable taper.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx', 'Mud Dark Olive']
  },
  {
    id: 'mn-07',
    sku: 'MN-HD-07',
    title: '520gsm Loopback Heavyweight Pullover',
    category: 'sweats',
    price: 210,
    tag: 'Core Archive',
    stockStatus: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    material: '520gsm Combed Organic Loopback Cotton (Wakayama Knitted)',
    details: 'Seamless double-layered geometric hood, dropped shoulder drape, heavy flatlock stitch seams throughout.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Washed Black', 'Ash White']
  },
  {
    id: 'mn-12',
    sku: 'MN-DN-12',
    title: 'Kuroki Mills 14.5oz Raw Selvedge Denim',
    category: 'bottoms',
    price: 340,
    tag: 'Artisan Crafted',
    stockStatus: 'Limited Edition (250 pairs)',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1200&q=85',
    material: '14.5oz Pure Indigo Selvedge Denim from Kuroki Mill, Okayama',
    details: 'Relaxed wide straight silhouette, custom gunmetal donut hardware, red-line selvedge ticker on outseams.',
    sizes: ['30', '32', '34', '36'],
    colors: ['Deep Raw Indigo']
  },
  {
    id: 'mn-18',
    sku: 'MN-BG-18',
    title: 'Modular 1000D Cordura Harness Rig',
    category: 'accs',
    price: 165,
    tag: 'Utility',
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    material: 'Invista Cordura 1000D Nylon with Hypalon Reinforcements',
    details: 'Fidlock magnetic quick-release snap, internal neoprene padded tablet divider, weather-sealed storm zips.',
    sizes: ['One Size'],
    colors: ['Stealth Black']
  },
  {
    id: 'mn-22',
    sku: 'MN-FW-22',
    title: 'Sculpted Platform Lug-Sole Derby',
    category: 'footwear',
    price: 420,
    tag: 'New Silhouette',
    stockStatus: 'Only 2 Pairs Left in EU 43',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
    altImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
    material: 'Full-Grain Box Calf Leather, Goodyear Welted, Custom Vibram Commando Outsole',
    details: 'Chunky exaggerated squared apron toe, brushed gunmetal eyelets, tonal calf leather inner lining.',
    sizes: ['EU 41', 'EU 42', 'EU 43', 'EU 44'],
    colors: ['Matte Black']
  }
];

// Application State
let cart = JSON.parse(localStorage.getItem('monolith_cart') || '[]');
let activeFilter = 'all';
let searchQuery = '';
let discountApplied = 0;

// SVG Icons (Strict Anti-Emoji Compliance)
const ICONS = {
  cart: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`,
  close: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>`,
  arrowRight: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  check: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  plus: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`,
  minus: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>`,
  trash: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  search: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
  eye: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`,
  shield: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
};

// DOM Elements
const catalogGrid = document.getElementById('catalogGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountBadges = document.querySelectorAll('.cart-count-badge');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartShippingEl = document.getElementById('cartShipping');
const cartTotalEl = document.getElementById('cartTotal');
const quickModal = document.getElementById('quickModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const toastEl = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Toast Notification
let toastTimeout = null;
function triggerToast(message) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toastEl.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
  toastEl.classList.add('opacity-100', 'translate-y-0');
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('opacity-100', 'translate-y-0');
    toastEl.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
  }, 2600);
}

// Render Catalog Items
function renderCatalog() {
  const filtered = PRODUCTS.filter(p => {
    const matchesCat = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    catalogGrid.innerHTML = `
      <div class="col-span-full py-24 text-center border border-dashed border-zinc-800 rounded-2xl">
        <p class="font-mono-custom text-xs uppercase tracking-widest text-zinc-500 mb-2">Query Unmatched</p>
        <h4 class="text-xl font-medium text-zinc-300">No architectural objects match current filter.</h4>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-xs font-mono-custom uppercase tracking-wider text-zinc-400 hover:text-white rounded-md btn-tactile">
          Reset Catalog Filters
        </button>
      </div>
    `;
    return;
  }

  // Staggered Asymmetric Masonry Structure (Design Variance: 8)
  catalogGrid.innerHTML = filtered.map((product, idx) => {
    // Alternate sizing on large viewports for varied layout
    const isHeroic = idx === 0 || idx === 3;
    const colSpan = isHeroic ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1 lg:col-span-1';

    return `
      <article class="${colSpan} group relative flex flex-col justify-between border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-600/80 transition-all duration-300 rounded-xl overflow-hidden">
        <!-- Visual Presentation Frame -->
        <div class="relative w-full overflow-hidden aspect-[4/5] bg-zinc-950">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            class="w-full h-full object-cover object-center filter grayscale contrast-[1.05] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
            loading="lazy"
          />
          
          <!-- SKU Tag Badge -->
          <div class="absolute top-4 left-4 flex items-center gap-2">
            <span class="px-2.5 py-1 text-[10px] font-mono-custom font-semibold tracking-wider uppercase bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700/60 rounded">
              ${product.sku}
            </span>
            ${product.tag ? `
              <span class="px-2.5 py-1 text-[10px] font-mono-custom font-semibold tracking-wider uppercase bg-[#dcf836] text-black rounded">
                ${product.tag}
              </span>
            ` : ''}
          </div>

          <!-- Quick Preview Button Hover Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center p-4">
            <button 
              onclick="openQuickView('${product.id}')"
              class="px-5 py-2.5 bg-zinc-100 hover:bg-white text-black font-mono-custom text-xs font-semibold uppercase tracking-wider rounded-lg shadow-xl flex items-center gap-2 btn-tactile"
            >
              ${ICONS.eye}
              <span>Inspect Object</span>
            </button>
          </div>
        </div>

        <!-- Technical Metadata & Action Bar -->
        <div class="p-6 flex flex-col justify-between flex-1 border-t border-zinc-800/80">
          <div>
            <div class="flex items-baseline justify-between mb-1.5">
              <span class="text-[11px] font-mono-custom uppercase tracking-widest text-zinc-500">${product.category}</span>
              <span class="text-sm font-mono-custom font-semibold text-[#dcf836]">$${product.price}.00</span>
            </div>
            
            <h3 class="text-lg font-bold tracking-tight text-zinc-100 group-hover:text-[#dcf836] transition-colors duration-200">
              ${product.title}
            </h3>

            <p class="mt-2 text-xs text-zinc-400 font-sans-custom line-clamp-2 leading-relaxed">
              ${product.material}
            </p>
          </div>

          <!-- Bottom Action Row -->
          <div class="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-[11px] font-mono-custom text-zinc-500">
              <span class="w-1.5 h-1.5 rounded-full bg-[#dcf836] perpetual-pulse"></span>
              <span>${product.stockStatus}</span>
            </div>

            <button 
              onclick="addToCart('${product.id}', '${product.sizes[0]}')" 
              class="px-3.5 py-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-mono-custom uppercase tracking-wider rounded flex items-center gap-2 btn-tactile"
            >
              <span>Acquire</span>
              ${ICONS.arrowRight}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Quick View Modal System
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Modal Gallery -->
      <div class="relative aspect-[4/5] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
        <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover" />
        <div class="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-lg border border-zinc-800 text-[11px] font-mono-custom text-zinc-400">
          Fabrication: ${product.material}
        </div>
      </div>

      <!-- Specs & Action -->
      <div class="flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded">
              ${product.sku}
            </span>
            <span class="text-xl font-mono-custom font-bold text-[#dcf836]">
              $${product.price}.00
            </span>
          </div>

          <h2 class="text-2xl font-bold tracking-tight text-white mb-3">
            ${product.title}
          </h2>

          <p class="text-sm text-zinc-300 leading-relaxed mb-6">
            ${product.details}
          </p>

          <!-- Specifications List -->
          <div class="border-t border-zinc-800 py-4 space-y-2 text-xs font-mono-custom">
            <div class="flex justify-between text-zinc-400">
              <span>Category</span>
              <span class="text-zinc-200 capitalize">${product.category}</span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>Colorway</span>
              <span class="text-zinc-200">${product.colors.join(' / ')}</span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>Availability</span>
              <span class="text-[#dcf836]">${product.stockStatus}</span>
            </div>
          </div>

          <!-- Sizing Matrix -->
          <div class="mt-4 mb-8">
            <label class="block text-xs font-mono-custom uppercase tracking-widest text-zinc-400 mb-2.5">
              Select Dimension / Scale
            </label>
            <div class="flex flex-wrap gap-2.5" id="modalSizeGroup">
              ${product.sizes.map((s, idx) => `
                <button 
                  type="button" 
                  onclick="selectModalSize(this, '${s}')" 
                  class="size-pill px-4 py-2 text-xs font-mono-custom rounded-md border transition-all ${idx === 0 ? 'bg-white text-black border-white font-bold' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'}"
                  data-size="${s}"
                >
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Add to Cart CTA -->
        <button 
          id="modalAddBtn"
          onclick="submitModalCart('${product.id}')"
          class="w-full py-4 bg-[#dcf836] hover:bg-[#e4ff4d] text-black font-mono-custom text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 btn-tactile shadow-lg"
        >
          ${ICONS.cart}
          <span>Add to Requisition — $${product.price}.00</span>
        </button>
      </div>
    </div>
  `;

  quickModal.classList.remove('hidden');
  setTimeout(() => {
    modalBackdrop.classList.remove('opacity-0');
    modalContent.parentElement.classList.remove('opacity-0', 'scale-95');
  }, 10);
}

let selectedModalSize = null;
function selectModalSize(btn, size) {
  document.querySelectorAll('#modalSizeGroup .size-pill').forEach(b => {
    b.className = 'size-pill px-4 py-2 text-xs font-mono-custom rounded-md border transition-all bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600';
  });
  btn.className = 'size-pill px-4 py-2 text-xs font-mono-custom rounded-md border transition-all bg-white text-black border-white font-bold';
  selectedModalSize = size;
}

function submitModalCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const size = selectedModalSize || product.sizes[0];
  addToCart(productId, size);
  closeModal();
}

function closeModal() {
  modalBackdrop.classList.add('opacity-0');
  modalContent.parentElement.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    quickModal.classList.add('hidden');
    selectedModalSize = null;
  }, 250);
}

// Shopping Cart Core
function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIdx = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIdx > -1) {
    cart[existingIdx].qty += 1;
  } else {
    cart.push({
      id: product.id,
      sku: product.sku,
      title: product.title,
      price: product.price,
      size: size,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  triggerToast(`Allocated to Cart: ${product.title} [Size: ${size}]`);
}

function updateCartQty(idx, delta) {
  if (cart[idx]) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1);
    }
  }
  saveCart();
  renderCart();
}

function removeFromCart(idx) {
  if (cart[idx]) {
    const title = cart[idx].title;
    cart.splice(idx, 1);
    saveCart();
    renderCart();
    triggerToast(`Removed from Cart: ${title}`);
  }
}

function saveCart() {
  localStorage.setItem('monolith_cart', JSON.stringify(cart));
}

function renderCart() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  cartCountBadges.forEach(b => {
    b.textContent = totalCount;
    b.classList.toggle('opacity-0', totalCount === 0);
  });

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8">
        <div class="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
          ${ICONS.cart}
        </div>
        <p class="font-mono-custom text-xs uppercase tracking-widest text-zinc-500 mb-1">Requisition Ledger Empty</p>
        <p class="text-xs text-zinc-600 max-w-[24ch]">No technical garments or objects currently buffered.</p>
      </div>
    `;
    cartSubtotalEl.textContent = '$0.00';
    cartShippingEl.textContent = '$0.00';
    cartTotalEl.textContent = '$0.00';
    return;
  }

  // Render Items
  cartItemsContainer.innerHTML = cart.map((item, idx) => `
    <div class="flex gap-4 p-4 border-b border-zinc-800/80 bg-zinc-950/40 rounded-lg">
      <img src="${item.image}" alt="${item.title}" class="w-16 h-20 object-cover rounded bg-zinc-900 border border-zinc-800" />
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <h4 class="text-xs font-bold text-zinc-200 line-clamp-1">${item.title}</h4>
            <button onclick="removeFromCart(${idx})" class="text-zinc-500 hover:text-red-400 p-1">
              ${ICONS.trash}
            </button>
          </div>
          <div class="flex gap-2 text-[10px] font-mono-custom text-zinc-500 mt-1">
            <span>SKU: ${item.sku}</span>
            <span>Size: ${item.size}</span>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center border border-zinc-800 rounded bg-zinc-900">
            <button onclick="updateCartQty(${idx}, -1)" class="p-1 text-zinc-400 hover:text-white">
              ${ICONS.minus}
            </button>
            <span class="px-2 text-xs font-mono-custom">${item.qty}</span>
            <button onclick="updateCartQty(${idx}, 1)" class="p-1 text-zinc-400 hover:text-white">
              ${ICONS.plus}
            </button>
          </div>
          <span class="text-xs font-mono-custom font-semibold text-zinc-200">
            $${item.price * item.qty}.00
          </span>
        </div>
      </div>
    </div>
  `).join('');

  // Math
  const rawSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = rawSubtotal * discountApplied;
  const subtotal = rawSubtotal - discountAmount;
  const shipping = subtotal > 350 || subtotal === 0 ? 0 : 25;
  const total = subtotal + shipping;

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartShippingEl.textContent = shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// Drawer Open/Close
function toggleCart(open) {
  if (open) {
    cartDrawer.classList.remove('pointer-events-none');
    cartBackdrop.classList.remove('opacity-0');
    cartDrawer.querySelector('.drawer-panel').classList.remove('translate-x-full');
  } else {
    cartBackdrop.classList.add('opacity-0');
    cartDrawer.querySelector('.drawer-panel').classList.add('translate-x-full');
    setTimeout(() => {
      cartDrawer.classList.add('pointer-events-none');
    }, 350);
  }
}

// Promo Code Verification
function applyPromo() {
  const input = document.getElementById('promoInput');
  const code = input.value.trim().toUpperCase();
  if (code === 'ARCHIVE15') {
    discountApplied = 0.15;
    triggerToast('Special Allocation Code Accepted: 15% Deduced');
    renderCart();
  } else {
    triggerToast('Invalid or expired archive code.');
  }
}

// Simulated Checkout
function checkoutOrder() {
  if (cart.length === 0) {
    triggerToast('Ledger is empty. Select objects first.');
    return;
  }
  triggerToast('Transmission Received. Initializing dispatch verification...');
  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
    toggleCart(false);
    triggerToast('Order Confirmed. Dispatch telemetry dispatched to client.');
  }, 1800);
}

// Filtering & Search
function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isTarget = btn.dataset.filter === cat;
    btn.className = isTarget ? 
      'filter-btn px-4 py-2 text-xs font-mono-custom uppercase tracking-wider rounded-md border bg-[#dcf836] text-black border-[#dcf836] font-bold btn-tactile' : 
      'filter-btn px-4 py-2 text-xs font-mono-custom uppercase tracking-wider rounded-md border bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white btn-tactile';
  });
  renderCatalog();
}

function resetFilters() {
  activeFilter = 'all';
  searchQuery = '';
  const searchInp = document.getElementById('catalogSearch');
  if (searchInp) searchInp.value = '';
  setFilter('all');
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderCart();

  // Search input
  const searchInput = document.getElementById('catalogSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Filter pills
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Cart triggers
  document.querySelectorAll('.trigger-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleCart(true));
  });
  document.getElementById('closeCartBtn').addEventListener('click', () => toggleCart(false));
  cartBackdrop.addEventListener('click', () => toggleCart(false));

  // Modal triggers
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Esc key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      toggleCart(false);
    }
  });
});
