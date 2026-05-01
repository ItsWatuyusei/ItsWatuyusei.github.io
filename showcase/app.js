class BakeryApp {
  constructor() {
    if (!window.CONFIG) {
      console.error('FATAL: [FAIL-FAST] window.CONFIG is missing.');
      return;
    }
    this.config = window.CONFIG;
    this.currentLang = this.detectLanguage();
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 9;
    this.promoIndex = 0;
    this.cart = JSON.parse(localStorage.getItem('bakery_cart')) || [];
    
    this.init();
  }

  detectLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && this.config.i18n[savedLang]) return savedLang;

    return 'en';
  }

  init() {
    this.initTheme();
    this.renderStaticContent();
    this.startPromoRotation();
    this.updateCartCount();
    this.setupScrollEffects();
    this.fetchBcvRate();
    setTimeout(() => {
      this.renderProducts();
      this.setupEventListeners();
    }, 800);
  }

  startPromoRotation() {
    this.updatePromo();
    setInterval(() => {
      this.promoIndex = (this.promoIndex + 1) % this.config.i18n[this.currentLang].promos.length;
      this.updatePromo();
    }, 5000);
  }

  updatePromo() {
    const el = document.getElementById('promoText');
    if (el) {
      const promos = this.config.i18n[this.currentLang].promos;

      el.style.animation = 'none';
      el.offsetHeight; 

      el.style.animation = '';
      el.textContent = promos[this.promoIndex];
    }
  }

  async fetchBcvRate() {
    try {
      const res = await fetch(this.config.erp.apiUrl, {
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rate = json?.promedio || json?.venta || json?.valor;
      if (rate && rate > 0) {
        this.config.bcvRate = rate;
        this.updateBcvDisplay();
      }
    } catch (e) {
      // API unreachable — carrito igual funciona sin tasa
      console.warn('[Bs. Rate] Could not fetch rate from API:', e.message);
    }
  }

  updateBcvDisplay() {
    // Update totals if cart drawer is open
    if (document.getElementById('cartDrawer')?.classList.contains('active')) {
      this.renderCart();
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  changeLanguage() {
    const langs = ['en', 'es'];
    const nextIndex = (langs.indexOf(this.currentLang) + 1) % langs.length;
    this.currentLang = langs[nextIndex];
    localStorage.setItem('lang', this.currentLang);
    this.renderStaticContent();
    this.renderProducts();
    this.updateLangSwitcher();
    this.promoIndex = 0;
    this.updatePromo();
  }

  updateLangSwitcher() {
    const indicator = document.getElementById('langIndicator');
    if (indicator) indicator.textContent = this.currentLang.toUpperCase();
  }

  renderStaticContent() {
    const t = this.config.i18n[this.currentLang];
    const searchInput = document.getElementById('searchInput');
    const filterAll = document.getElementById('filterAll');
    const filterSweet = document.getElementById('filterSweet');
    const filterSavory = document.getElementById('filterSavory');

    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    if (filterAll) filterAll.textContent = t.all;
    if (filterSweet) filterSweet.textContent = t.sweet;
    if (filterSavory) filterSavory.textContent = t.savory;
    
    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = `<p>Copyright © <a href="https://itswatuyusei.com" target="_blank" rel="noopener noreferrer">ItsWatuyusei</a></p>`;
    }

    const cartTitle = document.getElementById('cartTitle');
    const totalLabel = document.getElementById('totalLabel');
    const totalBcvLabel = document.getElementById('totalBcvLabel');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartTitle) cartTitle.textContent = t.cartTitle;
    if (totalLabel) totalLabel.textContent = t.total;
    if (totalBcvLabel) totalBcvLabel.textContent = t.totalBcv;
    if (checkoutBtn) checkoutBtn.textContent = t.sendOrder;
  }

  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = this.config.products.filter(p => {
      const matchesCategory = this.currentCategory === 'all' || p.category === this.currentCategory;
      const matchesSearch = p.name[this.currentLang].toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedItems = filtered.slice(start, end);

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="no-results">${this.config.i18n[this.currentLang].noResults}</p>`;
      this.renderPagination(0);
      return;
    }

    grid.innerHTML = paginatedItems.map((p, index) => `
      <div class="product-card" style="animation-delay: ${index * 0.1}s" onclick="bakeryApp.openProduct('${p.id}')">
        <div class="product-image-container">
          <img src="./${p.image}" alt="${p.name[this.currentLang]}" class="product-image" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-category">${this.config.i18n[this.currentLang][p.category]}</div>
          <h3 class="product-name">${p.name[this.currentLang]}</h3>
          <div class="product-price">$${p.price.toFixed(2)}</div>
        </div>
      </div>
    `).join('');

    this.renderPagination(totalPages);
  }

  renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }
    container.innerHTML = html;

  }

  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (themeToggle) {
      themeToggle.replaceWith(themeToggle.cloneNode(true));
      document.getElementById('themeToggle').addEventListener('click', () => {
        this.toggleTheme();
        this.playSound('click');
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.renderProducts();
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.currentPage = 1;
        this.renderProducts();
        this.playSound('tick');
      });
    });

    const paginationContainer = document.getElementById('pagination');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn');
        if (!btn) return;
        const page = parseInt(btn.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.renderProducts();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.playSound('tick');
        }
      });
    }

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.replaceWith(langToggle.cloneNode(true));
      document.getElementById('langToggle').addEventListener('click', () => {
        this.changeLanguage();
        this.playSound('tick');
      });
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.playSound('click');
      });
    }

    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => this.closeProduct());
    }

    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => this.toggleCart(true));
    }

    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
      closeCart.addEventListener('click', () => this.toggleCart(false));
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }

    window.addEventListener('click', (e) => {
      const modal = document.getElementById('productModal');
      const cartOverlay = document.getElementById('cartOverlay');
      if (e.target === modal) this.closeProduct();
      if (e.target === cartOverlay) this.toggleCart(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProduct();
        this.toggleCart(false);
      }
    });

    this.setupSecurity();
  }

  playSound(type) {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  openProduct(id) {
    const p = this.config.products.find(item => item.id === id);
    if (!p) return;

    const modal = document.getElementById('productModal');
    const t = this.config.i18n[this.currentLang];

    document.getElementById('modalImage').src = `./${p.image}`;
    document.getElementById('modalCategory').textContent = t[p.category];
    document.getElementById('modalName').textContent = p.name[this.currentLang];
    document.getElementById('modalDescription').textContent = p.description ? p.description[this.currentLang] : '';
    document.getElementById('modalPrice').textContent = `$${p.price.toFixed(2)}`;

    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.textContent = t.addToCart;
      addToCartBtn.onclick = () => this.addToCart(p);
    }

    const buyBtn = document.getElementById('buyButton');
    if (buyBtn) {
      const message = encodeURIComponent(`${t.orderMessage}${p.name[this.currentLang]}`);
      buyBtn.href = `https://wa.me/${this.config.brand.whatsapp}?text=${message}`;
      buyBtn.textContent = t.buy;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.playSound('pop');
  }

  closeProduct() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.playSound('click');
    }
  }

  addToCart(product) {
    this.cart.push(product);
    localStorage.setItem('bakery_cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.closeProduct();
    this.toggleCart(true);
    this.playSound('tick');
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    localStorage.setItem('bakery_cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.renderCart();
    this.playSound('click');
  }

  toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer || !overlay) return;
    
    if (show) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderCart();
    } else {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  updateCartCount() {
    const btn = document.getElementById('cartToggle');
    const count = document.getElementById('cartCount');
    if (!btn || !count) return;

    const hasItems = this.cart.length > 0;
    btn.classList.toggle('hidden', !hasItems);
    count.textContent = this.cart.length;
  }

  renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const totalBcvEl = document.getElementById('cartTotalBcv');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const t = this.config.i18n[this.currentLang];

    if (this.cart.length === 0) {
      container.innerHTML = `<div class="no-results" style="margin-top: 50%">${t.emptyCart}</div>`;
      totalEl.textContent = '$0.00';
      if (totalBcvEl) totalBcvEl.textContent = 'Bs. —';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;
    let total = 0;
    container.innerHTML = this.cart.map((item, index) => {
      total += item.price;
      return `
        <div class="cart-item">
          <img src="./${item.image}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name[this.currentLang]}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <button class="remove-item" onclick="bakeryApp.removeFromCart(${index})">&times;</button>
        </div>
      `;
    }).join('');

    totalEl.textContent = `$${total.toFixed(2)}`;

    if (this.config.bcvRate) {
      const totalBs = total * this.config.bcvRate;
      if (totalBcvEl) totalBcvEl.textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      if (totalBcvEl) totalBcvEl.textContent = `Bs. —`;
    }
  }

  checkout() {
    const t = this.config.i18n[this.currentLang];
    let total = 0;
    let message = `${t.checkoutMessage}\n\n`;
    
    this.cart.forEach(item => {
      message += `- ${item.name[this.currentLang]} ($${item.price.toFixed(2)})\n`;
      total += item.price;
    });
    
    message += `\n*TOTAL: $${total.toFixed(2)}*`;

    if (this.config.bcvRate) {
      const totalBs = total * this.config.bcvRate;
      message += `\n*TOTAL (VES): Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*`;
    }
    
    const whatsappUrl = `https://wa.me/${this.config.brand.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  setupScrollEffects() {
    const progress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      if (progress) progress.style.width = scrolled + "%";
      
      if (backToTop) {
        if (winScroll > 300) {
          backToTop.classList.add('active');
        } else {
          backToTop.classList.remove('active');
        }
      }
    });
  }

  setupSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (e.keyCode === 123) e.preventDefault();
    });
  }
}

let bakeryApp;
window.addEventListener('DOMContentLoaded', () => {
  bakeryApp = new BakeryApp();
});
