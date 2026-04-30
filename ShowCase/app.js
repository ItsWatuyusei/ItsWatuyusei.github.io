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
    
    this.init();
  }

  detectLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && this.config.i18n[savedLang]) return savedLang;
    const lang = navigator.language.split('-')[0];
    return this.config.i18n[lang] ? lang : 'en';
  }

  init() {
    this.initTheme();
    this.renderStaticContent();
    setTimeout(() => {
      this.renderProducts();
      this.setupEventListeners();
    }, 800);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  changeLanguage() {
    const newLang = this.currentLang === 'en' ? 'es' : 'en';
    this.currentLang = newLang;
    localStorage.setItem('lang', newLang);
    this.renderStaticContent();
    this.renderProducts();
    this.updateLangSwitcher();
  }

  updateLangSwitcher() {
    const indicator = document.getElementById('langIndicator');
    if (indicator) {
      indicator.textContent = this.currentLang.toUpperCase();
    }
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

    container.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPage = parseInt(btn.dataset.page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.renderProducts();
      });
    });
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
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
      });
    });

    this.setupSecurity();
    this.updateLangSwitcher();

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.changeLanguage());
    }

    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => this.closeProduct());
    }

    window.addEventListener('click', (e) => {
      const modal = document.getElementById('productModal');
      if (e.target === modal) this.closeProduct();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeProduct();
    });
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

    const buyBtn = document.getElementById('buyButton');
    const message = encodeURIComponent(`${t.orderMessage}${p.name[this.currentLang]}`);
    buyBtn.href = `https://wa.me/${this.config.brand.whatsapp}?text=${message}`;
    buyBtn.textContent = t.buy;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeProduct() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setupSecurity() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
    });
  }
}

let bakeryApp;
window.addEventListener('DOMContentLoaded', () => {
  bakeryApp = new BakeryApp();
});
