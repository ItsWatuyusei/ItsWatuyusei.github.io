class ProfessionalPortfolio {
    constructor() {
        this.init();
        this.setupParticleSystem();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupInteractions();
    }

    init() {
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupSkillAnimations();
        this.setupProjectFilter();
        this.setupCounterAnimations();
        this.setupTypewriter();
        this.setupModal();
        this.setupContactModal();
        this.setupStickyElements();
        this.setupProgressBar();
        this.setupPerformanceOptimizations();
    }

    // ===== PARTICLE SYSTEM =====
    setupParticleSystem() {
        this.particleCanvas = document.getElementById('particle-canvas');
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animateParticles();
    }

    resizeCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: this.getRandomColor(),
                life: Math.random() * 200 + 100,
                maxLife: 300
            });
        }
    }

    getRandomColor() {
        const colors = ['#2563eb', '#7c3aed', '#06b6d4', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        }, 250));
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }
            
            // Apply friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.particleCanvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.particleCanvas.height) particle.vy *= -1;
            
            // Respawn if dead
            if (particle.life <= 0) {
                particle.x = Math.random() * this.particleCanvas.width;
                particle.y = Math.random() * this.particleCanvas.height;
                particle.life = particle.maxLife;
            }
            
            // Draw particle
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
            this.particleCtx.fill();
            
            // Add subtle glow
            this.particleCtx.shadowColor = particle.color;
            this.particleCtx.shadowBlur = 8;
            this.particleCtx.fill();
            this.particleCtx.shadowBlur = 0;
        });
        
        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(() => this.animateParticles());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.15;
                    this.particleCtx.beginPath();
                    this.particleCtx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.particleCtx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.particleCtx.strokeStyle = '#2563eb';
                    this.particleCtx.globalAlpha = opacity;
                    this.particleCtx.lineWidth = 1;
                    this.particleCtx.stroke();
                }
            }
        }
    }

    // ===== NAVIGATION SYSTEM =====
    setupNavigation() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollTop = 0;
        
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        this.setupActiveNavigation();
        this.bindNavScrollEvents();
        
        // Hero contact button
        const heroContactBtn = document.getElementById('heroContactBtn');
        if (heroContactBtn) {
            heroContactBtn.addEventListener('click', () => {
                this.openContactModal();
            });
        }
    }

    bindNavScrollEvents() {
        const updateNavbar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show navbar when scrolling down after 200px (like v1)
            const shouldShowNav = scrollTop > 200;
            
            if (shouldShowNav) {
                this.navbar.classList.remove('hidden');
                this.navbar.classList.add('visible');
            } else {
                this.navbar.classList.add('hidden');
                this.navbar.classList.remove('visible');
            }
            
            // Add scroll effect for visual feedback
            if (scrollTop > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScrollTop = scrollTop;
        };

        let rafId = null;
        let isScrolling = false;
        
        const handleScroll = () => {
            if (!isScrolling) {
                rafId = requestAnimationFrame(() => {
                    updateNavbar();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ===== THEME TOGGLE =====
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(themeToggle, savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolioTheme', newTheme);
            this.updateThemeIcon(themeToggle, newTheme);
            
            // Add smooth transition
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    updateThemeIcon(toggle, theme) {
        const icon = toggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ===== SCROLL EFFECTS =====
    setupScrollEffects() {
        this.setupParallaxScrolling();
        this.setupScrollAnimations();
        this.setupNavbarScroll();
    }

    setupParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('.floating-icon, .avatar-glow');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.1 * (index + 1);
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.skill-category, .project-card, .contact-item, .feature-item');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(element);
        });
    }

    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', this.throttle(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }
            
            lastScrollY = currentScrollY;
        }, 16));
    }

    // ===== SKILL ANIMATIONS =====
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const level = skillBar.getAttribute('data-level') || '0';
                    skillBar.style.width = level + '%';
                }
            });
        }, observerOptions);

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ===== PROJECT FILTER =====
    setupProjectFilter() {
        this.projectSearch = document.getElementById('project-search');
        this.projectCards = document.querySelectorAll('.project-card');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearSearchBtn = document.getElementById('clear-search');
        this.pagination = document.getElementById('projects-pagination');
        
        this.projectsPerPage = 6;
        this.currentPage = 1;
        this.filteredProjects = [];
        
        this.updateFilterButtonsVisibility();
        this.bindFilterEvents();
        this.updateProjectVisibility();
    }

    bindFilterEvents() {
        // Search functionality
        this.projectSearch.addEventListener('input', () => {
            this.updateProjectVisibility();
            this.toggleClearButton();
        });
        
        // Clear search
        this.clearSearchBtn.addEventListener('click', () => {
            this.projectSearch.value = '';
            this.projectSearch.focus();
            this.updateProjectVisibility();
            this.toggleClearButton();
        });
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateProjectVisibility();
            });
        });
    }

    updateFilterButtonsVisibility() {
        const availableTechnologies = new Set();
        
        this.projectCards.forEach(card => {
            const technologies = card.getAttribute('data-technologies') || '';
            if (technologies) {
                technologies.split(',').forEach(tech => {
                    availableTechnologies.add(tech.trim());
                });
            }
        });

        this.filterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                btn.classList.remove('hidden');
                return;
            }
            
            if (availableTechnologies.has(filterValue)) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
                
                if (btn.classList.contains('active')) {
                    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                    if (allBtn) {
                        allBtn.classList.add('active');
                    }
                }
            }
        });
    }

    getVisibleProjects() {
        const searchTerm = this.projectSearch.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        return Array.from(this.projectCards).filter(card => {
            const title = card.querySelector('.project-title')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('.project-description')?.textContent?.toLowerCase() || '';
            const tech = card.querySelector('.project-tech')?.textContent?.toLowerCase() || '';
            const technologies = card.getAttribute('data-technologies') || '';
            
            const matchesSearch = (title && title.includes(searchTerm)) || 
                                (desc && desc.includes(searchTerm)) || 
                                (tech && tech.includes(searchTerm));
            const matchesFilter = activeFilter === 'all' || technologies.includes(activeFilter);
            
            return matchesSearch && matchesFilter;
        });
    }

    updateProjectVisibility() {
        const cardsToHide = [];
        const cardsToShow = [];
        
        this.filteredProjects = this.getVisibleProjects();
        this.currentPage = 1;
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        
        this.projectCards.forEach(card => {
            cardsToHide.push(card);
        });
        
        this.filteredProjects.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                cardsToShow.push(card);
            }
        });
        
        requestAnimationFrame(() => {
            cardsToHide.forEach(card => {
                card.classList.add('project-hidden');
            });
            
            setTimeout(() => {
                cardsToShow.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('project-hidden');
                        card.classList.add('project-visible');
                    }, index * 100);
                });
            }, 50);
        });
        
        this.updatePagination(totalPages);
        this.updateFilterButtonsVisibility();
    }

    toggleClearButton() {
        if (this.projectSearch.value.length > 0) {
            this.clearSearchBtn.style.display = 'flex';
        } else {
            this.clearSearchBtn.style.display = 'none';
        }
    }

    // ===== MODAL SYSTEM =====
    setupModal() {
        this.imageModal = document.getElementById('imageModal');
        this.imageModalClose = document.getElementById('image-modal-close');
        this.modalImage = document.getElementById('modal-image');
        this.galleryPrev = document.getElementById('gallery-prev');
        this.galleryNext = document.getElementById('gallery-next');
        
        this.galleryImages = [];
        this.galleryIndex = 0;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.projectData = {
            bitelfibra: {
                title: 'BitelFibra E-commerce Platform',
                images: [
                    'https://ik.imagekit.io/ItsWatuyusei/Image/BitelFibra/bitelfibra00.png?updatedAt=1752006146778',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/BitelFibra/bitelfibra01.png?updatedAt=1752006146778',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/BitelFibra/bitelfibra02.png?updatedAt=1752006146778',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/BitelFibra/bitelfibra03.png?updatedAt=1752006146778'
                ],
                description: 'Comprehensive e-commerce platform for fiber optic internet plans with integrated payment systems and advanced product management.',
                tech: ['HTML', 'PHP', 'WooCommerce', 'WordPress'],
                features: [
                    'Advanced product catalog with filtering',
                    'Integrated payment gateway',
                    'User account management',
                    'Order tracking system',
                    'Admin dashboard',
                    'Mobile responsive design'
                ]
            },
            raffles: {
                title: 'RafflesSystem Platform',
                images: [
                    'https://ik.imagekit.io/ItsWatuyusei/Image/RafflesSystem/rafflesSystem00.png?updatedAt=1758383651390',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/RafflesSystem/rafflesSystem01.png?updatedAt=1758383651390',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/RafflesSystem/rafflesSystem02.png?updatedAt=1758383651390'
                ],
                description: 'Advanced raffle management system with comprehensive admin panel, digital ticket distribution, and secure payment processing.',
                tech: ['PHP', 'JavaScript', 'MySQL', 'HTML/CSS'],
                features: [
                    'Digital ticket generation',
                    'Secure payment processing',
                    'Real-time winner selection',
                    'Admin panel management',
                    'User registration system',
                    'Statistics and reporting'
                ]
            },
            muemulator: {
                title: 'MU Online Emulator',
                images: [
                    'https://ik.imagekit.io/ItsWatuyusei/Image/MuEmulator/MuEmulator01.png?updatedAt=1760388198601',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/MuEmulator/MuEmulator02.png?updatedAt=1760388198601',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/MuEmulator/MuEmulator03.png?updatedAt=1760388198601'
                ],
                description: 'Custom MMORPG server emulator with advanced features including Lua scripting, 3D camera system, and real-time user tracking.',
                tech: ['C++', 'Lua', 'DirectX', 'Visual Studio'],
                features: [
                    'Lua scripting system',
                    '3D camera implementation',
                    'Real-time user tracking',
                    'Custom game mechanics',
                    'Database integration',
                    'Multi-player support'
                ]
            },
            muservereasy: {
                title: 'MuServerEasy Application',
                images: [
                    'https://ik.imagekit.io/ItsWatuyusei/Image/MuServerEasy/MuServerEasy02.png?updatedAt=1760383658945',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/MuServerEasy/MuServerEasy01.png?updatedAt=1760383658945'
                ],
                description: 'Professional Windows application for MU Online server configuration with dual licensing system and multilingual support.',
                tech: ['C#', '.NET 8.0', 'Windows Forms', 'SQL Server'],
                features: [
                    'Server configuration wizard',
                    'Dual licensing system',
                    'Multilingual interface',
                    'Database management',
                    'User authentication',
                    'Configuration backup'
                ]
            },
            cms: {
                title: 'Custom CMS Platform',
                images: [
                    'https://ik.imagekit.io/ItsWatuyusei/Image/ItsWatuyusei%20-%20Custom%20CMS/customcs00.png?updatedAt=1752643865011',
                    'https://ik.imagekit.io/ItsWatuyusei/Image/ItsWatuyusei%20-%20Custom%20CMS/customcs01.png?updatedAt=1752643865011'
                ],
                description: 'Fully functional custom content management system with advanced admin panel for content and product management.',
                tech: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS'],
                features: [
                    'Content management system',
                    'Product catalog management',
                    'User role management',
                    'SEO optimization',
                    'Responsive admin panel',
                    'File upload system'
                ]
            },
            launchermu: {
                title: 'LauncherMU Game Launcher',
                images: [],
                description: 'Advanced game launcher with WebView2 integration, automatic update system, and customizable interface with drag & drop.',
                tech: ['C#', 'WPF', '.NET 4.8', 'WebView2'],
                features: [
                    'WebView2 integration',
                    'Automatic update system',
                    'Customizable interface',
                    'Drag & drop functionality',
                    'Game file management',
                    'News and announcements'
                ]
            }
        };
        
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Open modal events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-btn[data-action="view"]')) {
                e.preventDefault();
                const imagesData = e.target.closest('.project-btn').getAttribute('data-images');
                if (imagesData) {
                    try {
                        this.galleryImages = JSON.parse(imagesData);
                    } catch {
                        this.galleryImages = [imagesData];
                    }
                    this.galleryIndex = 0;
                    this.showGalleryImage(0, false);
                    this.openImageModal();
                }
            }
        });
        
        // Close modal events
        this.imageModalClose.addEventListener('click', () => this.closeImageModal());
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) this.closeImageModal();
        });
        
        // Navigation events
        this.galleryPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.galleryImages.length > 1 && !this.isTransitioning) {
                this.showGalleryImage(this.galleryIndex - 1, true);
            }
        });
        
        this.galleryNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.galleryImages.length > 1 && !this.isTransitioning) {
                this.showGalleryImage(this.galleryIndex + 1, true);
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.imageModal.style.display === 'flex') {
                if (e.key === 'Escape') this.closeImageModal();
                if (e.key === 'ArrowLeft' && !this.isTransitioning) {
                    this.showGalleryImage(this.galleryIndex - 1, true);
                }
                if (e.key === 'ArrowRight' && !this.isTransitioning) {
                    this.showGalleryImage(this.galleryIndex + 1, true);
                }
            }
        });
        
        // Touch events for mobile
        this.imageModal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.imageModal.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    openImageModal() {
        // Store current scroll position
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        this.imageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Preload next and previous images
        this.preloadImages();
    }

    closeImageModal() {
        this.imageModal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        if (this.scrollPosition !== undefined) {
            window.scrollTo(0, this.scrollPosition);
        }
    }

    showGalleryImage(idx, animate = false) {
        if (!this.galleryImages.length || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.galleryIndex = ((idx % this.galleryImages.length) + this.galleryImages.length) % this.galleryImages.length;
        
        if (animate) {
            this.modalImage.style.opacity = '0';
            
            setTimeout(() => {
                this.modalImage.src = this.galleryImages[this.galleryIndex];
                
                this.modalImage.onload = () => {
                    this.modalImage.style.opacity = '1';
                    this.isTransitioning = false;
                };
                
                this.modalImage.onerror = () => {
                    this.modalImage.style.opacity = '1';
                    this.isTransitioning = false;
                };
            }, 300);
        } else {
            this.modalImage.src = this.galleryImages[this.galleryIndex];
            this.isTransitioning = false;
        }
        
        const showNav = this.galleryImages.length > 1;
        this.galleryPrev.style.display = showNav ? 'flex' : 'none';
        this.galleryNext.style.display = showNav ? 'flex' : 'none';
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold && !this.isTransitioning) {
            if (diff > 0) {
                if (this.galleryImages.length > 1) this.showGalleryImage(this.galleryIndex + 1, true);
            } else {
                if (this.galleryImages.length > 1) this.showGalleryImage(this.galleryIndex - 1, true);
            }
        }
    }

    preloadImages() {
        if (this.galleryImages.length <= 1) return;
        
        const nextIndex = (this.galleryIndex + 1) % this.galleryImages.length;
        const prevIndex = (this.galleryIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        
        const nextImg = new Image();
        const prevImg = new Image();
        
        nextImg.src = this.galleryImages[nextIndex];
        prevImg.src = this.galleryImages[prevIndex];
    }

    updateModalWithImages() {
        if (!this.currentImages || this.currentImages.length === 0) return;
        
        // Update gallery
        this.modalGallery.innerHTML = '';
        this.currentImages.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Project image ${index + 1}`;
            img.className = 'gallery-image';
            img.style.display = index === this.currentImageIndex ? 'block' : 'none';
            this.modalGallery.appendChild(img);
        });
        
        // Update title
        this.modalTitle.textContent = 'Project Gallery';
        
        // Update info section
        const modalInfo = document.getElementById('modalInfo');
        if (modalInfo) {
            modalInfo.innerHTML = `
                <div class="modal-info">
                    <h4 class="info-title">Project Images</h4>
                    <p class="info-description">Browse through the project gallery</p>
                    <div class="info-tech">
                        <span class="tech-tag">Gallery</span>
                    </div>
                </div>
            `;
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModalContent() {
        this.modalTitle.textContent = this.currentProject.title;
        
        // Update gallery
        this.modalGallery.innerHTML = '';
        if (this.currentProject.images.length > 0) {
            this.currentProject.images.forEach((imageSrc, index) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = this.currentProject.title;
                img.className = 'gallery-image';
                if (index === this.currentImageIndex) img.classList.add('active');
                this.modalGallery.appendChild(img);
            });
        } else {
            const placeholder = document.createElement('div');
            placeholder.innerHTML = '<i class="fas fa-image" style="font-size: 4rem; color: var(--gray-400);"></i>';
            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 300px; color: var(--gray-400);';
            this.modalGallery.appendChild(placeholder);
        }
        
        // Update info
        this.modalInfo.innerHTML = `
            <h3 class="info-title">${this.currentProject.title}</h3>
            <p class="info-description">${this.currentProject.description}</p>
            
            <div class="info-tech">
                <h4>Technologies Used</h4>
                <div class="project-tech">
                    ${this.currentProject.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="info-tech">
                <h4>Key Features</h4>
                <ul class="info-features">
                    ${this.currentProject.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
        
        this.updateNavigation();
    }

    updateNavigation() {
        const totalImages = this.currentImages ? this.currentImages.length : (this.currentProject ? this.currentProject.images.length : 0);
        this.modalCounter.textContent = `${this.currentImageIndex + 1} / ${totalImages}`;
        
        this.prevBtn.disabled = this.currentImageIndex === 0;
        this.nextBtn.disabled = this.currentImageIndex === totalImages - 1;
        
        // Update active image
        const images = this.modalGallery.querySelectorAll('.gallery-image');
        images.forEach((img, index) => {
            img.classList.toggle('active', index === this.currentImageIndex);
            img.style.display = index === this.currentImageIndex ? 'block' : 'none';
        });
    }

    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            this.updateNavigation();
            if (this.currentImages) {
                this.updateModalWithImages();
            }
        }
    }

    nextImage() {
        const maxIndex = this.currentImages ? this.currentImages.length - 1 : (this.currentProject ? this.currentProject.images.length - 1 : 0);
        if (this.currentImageIndex < maxIndex) {
            this.currentImageIndex++;
            this.updateNavigation();
            if (this.currentImages) {
                this.updateModalWithImages();
            }
        }
    }

    // ===== CONTACT MODAL =====
    setupContactModal() {
        this.contactModal = document.getElementById('contactModal');
        this.contactModalClose = document.getElementById('contactModalClose');
        
        this.bindContactModalEvents();
    }

    bindContactModalEvents() {
        // Open modal events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-secondary') && e.target.closest('.btn-secondary').textContent.includes('Get In Touch')) {
                e.preventDefault();
                this.openContactModal();
            }
        });
        
        // Close modal events
        this.contactModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeContactModal();
        });
        
        this.contactModal.addEventListener('click', (e) => {
            if (e.target === this.contactModal) {
                this.closeContactModal();
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.contactModal.style.display === 'flex') {
                this.closeContactModal();
            }
        });
    }

    openContactModal() {
        // Store current scroll position
        this.contactScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        this.contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.contactScrollPosition}px`;
        document.body.style.width = '100%';
        
        // Focus on first input when modal opens
        setTimeout(() => {
            const firstInput = this.contactModal.querySelector('input, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    closeContactModal() {
        this.contactModal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        if (this.contactScrollPosition !== undefined) {
            window.scrollTo(0, this.contactScrollPosition);
        }
    }

    // ===== STICKY FOOTER =====
    setupStickyElements() {
        this.stickyFooter = document.getElementById('stickyFooter');
        this.lastScrollTop = 0;
        this.scrollDirection = 'up';
        
        this.setupStickyFooter();
        this.bindScrollEvents();
    }

    setupStickyFooter() {
        // Footer expansion logic
        this.toggleFooterExpansion = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const footerHeight = this.stickyFooter.offsetHeight;
            
            // Show expanded footer when near bottom of page
            if (documentHeight > windowHeight + footerHeight && scrollTop + windowHeight >= documentHeight - footerHeight - 20) {
                this.stickyFooter.classList.add('expanded');
                
                setTimeout(() => {
                    const footerLinks = this.stickyFooter.querySelector('.footer-links');
                    const footerBottom = this.stickyFooter.querySelector('.footer-bottom');
                    if (footerLinks) footerLinks.classList.add('visible');
                    if (footerBottom) footerBottom.classList.add('visible');
                }, 150);
            } else {
                this.stickyFooter.classList.remove('expanded');
                
                const footerLinks = this.stickyFooter.querySelector('.footer-links');
                const footerBottom = this.stickyFooter.querySelector('.footer-bottom');
                if (footerLinks) footerLinks.classList.remove('visible');
                if (footerBottom) footerBottom.classList.remove('visible');
            }
        };
    }

    bindScrollEvents() {
        let rafId = null;
        let isScrolling = false;
        
        const updateStickyElements = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Sticky Footer Logic - more refined
            const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;
            const shouldShowFooter = scrollTop > 200;
            
            if (shouldShowFooter && !isNearBottom) {
                this.stickyFooter.classList.add('visible');
            } else if (isNearBottom) {
                // Hide regular footer when near bottom, expanded footer will show
                this.stickyFooter.classList.remove('visible');
            } else {
                this.stickyFooter.classList.remove('visible');
            }
            
            // Update footer expansion
            this.toggleFooterExpansion();
            
            this.lastScrollTop = scrollTop;
        };
        
        const handleScroll = () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    updateStickyElements();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', () => {
            this.toggleFooterExpansion();
        }, { passive: true });
        
        // Initial call
        this.toggleFooterExpansion();
    }


    // ===== PROGRESS BAR =====
    setupProgressBar() {
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        
        if (!this.progressBar || !this.progressFill) return;
        
        this.bindProgressEvents();
    }

    bindProgressEvents() {
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            // Clamp between 0 and 100
            const progress = Math.min(Math.max(scrollPercent, 0), 100);
            
            this.progressFill.style.width = `${progress}%`;
        };

        let rafId = null;
        const handleScroll = () => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                updateProgress();
                rafId = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        
        // Initial call
        updateProgress();
    }

    // ===== COUNTER ANIMATIONS =====
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // ===== ANIMATIONS =====
    setupAnimations() {
        this.setupHoverEffects();
        this.setupFloatingIcons();
        this.setupTechHover();
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.project-card, .skill-category, .contact-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupFloatingIcons() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        
        floatingIcons.forEach((icon, index) => {
            const delay = index * 0.5;
            icon.style.animation = `float 6s ease-in-out infinite ${delay}s`;
        });
    }

    setupTechHover() {
        const techItems = document.querySelectorAll('.tech-item');
        
        techItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.1)';
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });
    }

    // ===== INTERACTIONS =====
    setupInteractions() {
        this.setupSmoothScrolling();
        this.setupKeyboardShortcuts();
        this.setupButtonEffects();
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Toggle theme with Ctrl+T
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                document.getElementById('themeToggle').click();
            }
            
            // Navigate sections with arrow keys
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const sections = ['hero', 'about', 'skills', 'projects'];
                const currentSection = this.getCurrentSection();
                const currentIndex = sections.indexOf(currentSection);
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % sections.length;
                } else {
                    nextIndex = (currentIndex - 1 + sections.length) % sections.length;
                }
                
                const targetElement = document.getElementById(sections[nextIndex]);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 200;
        
        for (let section of sections) {
            if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
                return section.id;
            }
        }
        return 'hero';
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn, .filter-btn, .social-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.transition = 'all 0.2s ease';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        this.throttleScroll();
        this.debounceResize();
        this.optimizeAnimations();
        this.setupLazyLoading();
    }

    throttleScroll() {
        let ticking = false;
        
        const updateScroll = () => {
            // Scroll-based animations here
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        });
    }

    debounceResize() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 250);
        });
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('low-performance');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('animations-paused');
            } else {
                document.body.classList.remove('animations-paused');
            }
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ===== UTILITY METHODS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setupTypewriter() {
        const typewriter1 = document.getElementById('typewriter1');
        const typewriter2 = document.getElementById('typewriter2');
        const typewriter3 = document.getElementById('typewriter3');
        const typewriterDescription = document.getElementById('typewriterDescription');
        const typewriterAbout = document.getElementById('typewriterAbout');
        
        if (!typewriter1 || !typewriter2 || !typewriter3 || !typewriterDescription) return;
        
        const text1 = typewriter1.textContent;
        const text2 = typewriter2.textContent;
        const text3 = typewriter3.textContent;
        const descriptionText = typewriterDescription.textContent;
        const aboutText = typewriterAbout ? typewriterAbout.textContent : '';
        
        typewriter1.textContent = '';
        typewriter2.textContent = '';
        typewriter3.textContent = '';
        typewriterDescription.textContent = '';
        if (typewriterAbout) typewriterAbout.textContent = '';
        
        const typeText = (element, text, speed = 100, delay = 0) => {
            setTimeout(() => {
                let i = 0;
                const timer = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(timer);
                        setTimeout(() => {
                            element.style.borderRight = 'none';
                        }, 1000);
                    }
                }, speed);
            }, delay);
        };
        
        typeText(typewriter1, text1, 100, 500);
        typeText(typewriter2, text2, 100, 2000);
        typeText(typewriter3, text3, 100, 3500);
        typeText(typewriterDescription, descriptionText, 50, 5000);
        if (typewriterAbout) typeText(typewriterAbout, aboutText, 40, 7000);
    }

    updatePagination(totalPages) {
        if (totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        }
        
        this.pagination.style.display = 'flex';
        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn prev-btn" data-page="${this.currentPage - 1}">‹</button>`;
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<button class="pagination-btn page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn next-btn" data-page="${this.currentPage + 1}">›</button>`;
        }
        
        this.pagination.innerHTML = paginationHTML;
        
        // Bind pagination events
        this.pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page) {
                    this.renderProjectsPage(page);
                }
            });
        });
    }

    renderProjectsPage(page) {
        this.currentPage = page;
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        
        // Hide all cards first
        this.projectCards.forEach(card => {
            card.classList.add('project-hidden');
        });
        
        setTimeout(() => {
            this.filteredProjects.forEach((card, index) => {
                if (index >= startIndex && index < endIndex) {
                    setTimeout(() => {
                        card.classList.remove('project-hidden');
                        card.classList.add('project-visible');
                    }, (index - startIndex) * 100);
                }
            });
        }, 50);
        
        this.updatePagination(totalPages);
        this.updateFilterButtonsVisibility();
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

class ProfessionalEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupColorCycling();
        this.setupSubtleAnimations();
        this.setupGradientEffects();
    }

    setupColorCycling() {
        const root = document.documentElement;
        let hue = 0;
        
        setInterval(() => {
            hue = (hue + 0.5) % 360;
            root.style.setProperty('--primary-hue', hue);
        }, 100);
    }

    setupSubtleAnimations() {
        const elements = document.querySelectorAll('.project-card, .skill-category');
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }

    setupGradientEffects() {
        const gradientElements = document.querySelectorAll('.btn-primary, .hero-badge');
        
        gradientElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.background = 'linear-gradient(135deg, #1d4ed8, #7c3aed)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.background = '';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalPortfolio();
    new ProfessionalEffects();
    document.body.classList.add('portfolio-loaded');
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
        });
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
            })
            .catch(error => {
            });
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
    }
    
    .portfolio-loaded {
        animation: portfolioBoot 1s ease-out forwards;
    }
    
    @keyframes portfolioBoot {
        0% {
            opacity: 0;
            filter: brightness(0.8);
        }
        100% {
            opacity: 1;
            filter: brightness(1);
        }
    }
    
    .low-performance * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .animations-paused * {
        animation-play-state: paused !important;
    }
    
    .nav-link.active {
        color: var(--primary);
    }
    
    .nav-link.active::after {
        width: 80%;
    }
`;
document.head.appendChild(style);