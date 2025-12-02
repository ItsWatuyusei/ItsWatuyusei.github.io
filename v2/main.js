class ModernPortfolio {
    constructor() {
        const hubTheme = localStorage.getItem('theme');
        const v2Theme = localStorage.getItem('v2-darkMode');
        
        if (hubTheme && !v2Theme) {
            const isDark = hubTheme === 'dark';
            localStorage.setItem('v2-darkMode', isDark.toString());
            this.isDarkMode = isDark;
        } else {
            this.isDarkMode = v2Theme === null ? false : v2Theme === 'true';
        }
        
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.soundEnabled = localStorage.getItem('v2-sound') !== 'false';
        this.audioContext = null;
        this.audioInitialized = false;
        this.audioNeedsUserGesture = true;
        this.prevBtnHandler = null;
        this.nextBtnHandler = null;
        this.wheelHandler = null;
        this.init();
    }

    init() {
        this.setupI18n();
        this.setupTheme();
        this.setupNavigation();
        this.setupProgressBar();
        this.setupHero();
        this.setupSkills();
        this.setupProjects();
        this.setupModals();
        this.setupAnimations();
        this.setupServiceWorker();
        this.setupFooter();
        this.setupAudioInitialization();
        this.setupSoundToggle();
        this.updateSoundIcon();
        this.randomizeTechPositions();
    }

    setupI18n() {
        if (typeof i18n === 'undefined') {
            setTimeout(() => this.setupI18n(), 100);
            return;
        }
        
        i18n.init();
        this.updateLanguageSelector();
        
        setTimeout(() => {
            if (typeof i18n !== 'undefined') {
                i18n.updatePage();
            }
        }, 200);
        
        const languageToggle = document.getElementById('nav-language-toggle');
        
        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.heroTimeouts) {
                    this.heroTimeouts.forEach(timeout => clearTimeout(timeout));
                    this.heroTimeouts = [];
                }
                const currentLang = i18n.getLanguage();
                const newLang = currentLang === 'eng' ? 'spn' : 'eng';
                i18n.setLanguage(newLang);
                this.updateLanguageSelector();
                setTimeout(() => {
                    if (typeof i18n !== 'undefined') {
                        i18n.updatePage();
                        this.generateDynamicFilters();
                    }
                    this.setupHero();
                }, 100);
                
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('toggle');
                }
            });
        }
    }

    updateLanguageSelector() {
        if (typeof i18n === 'undefined') return;
        
        const languageText = document.getElementById('nav-language-text');
        if (languageText) {
            languageText.textContent = i18n.getLanguage() === 'eng' ? 'ENG' : 'ESP';
        }
    }

    setupTheme() {
        const toggle = document.getElementById('nav-darkmode-toggle');
        if (toggle) {
            if (this.isDarkMode) {
                document.documentElement.classList.remove('light-theme');
                document.body.classList.remove('light-theme');
                toggle.checked = false;
            } else {
                document.documentElement.classList.add('light-theme');
                document.body.classList.add('light-theme');
                toggle.checked = true;
            }
            
            toggle.addEventListener('change', (e) => {
                const isLightMode = e.target.checked;
                this.isDarkMode = !isLightMode;

                localStorage.setItem('v2-darkMode', this.isDarkMode.toString());
                localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

                if (isLightMode) {
                    document.documentElement.classList.add('light-theme');
                    document.body.classList.add('light-theme');
                } else {
                    document.documentElement.classList.remove('light-theme');
                    document.body.classList.remove('light-theme');
                }
                
                this.updateNavBackground();
                
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('toggle');
                }
            });
        }
    }

    updateNavBackground() {
        const nav = document.getElementById('sticky-nav');
        if (nav) {
            const isLightMode = document.documentElement.classList.contains('light-theme');
            const scrollY = window.scrollY;
            
            requestAnimationFrame(() => {
                if (scrollY > 100) {
                    nav.classList.add('visible');
                    nav.style.cssText = `
                        background: ${isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)'};
                        backdrop-filter: blur(20px);
                    `;
                } else {
                    nav.classList.remove('visible');
                    nav.style.cssText = `
                        background: ${isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)'};
                        backdrop-filter: blur(20px);
                    `;
                }
            });
        }
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger-menu');
        const navLinks = document.getElementById('nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                if (this.soundEnabled) {
                    this.playSound('toggle');
                }
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        const nav = document.getElementById('sticky-nav');
        if (nav) {
            let lastScrollY = window.scrollY;
            let ticking = false;

            const updateNav = () => {
                const currentScrollY = window.scrollY;
                const isLightMode = document.documentElement.classList.contains('light-theme');
                
                requestAnimationFrame(() => {
                    if (currentScrollY > 100) {
                        nav.classList.add('visible');
                        nav.style.cssText = `
                            background: ${isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)'};
                            backdrop-filter: blur(20px);
                        `;
                    } else {
                        nav.classList.remove('visible');
                        nav.style.cssText = `
                            background: ${isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)'};
                            backdrop-filter: blur(20px);
                        `;
                    }
                });
                
                lastScrollY = currentScrollY;
                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateNav);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick, { passive: true });
        }
    }

    setupProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        
        if (progressFill) {
            const updateProgressBar = () => {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrollPercent = (scrollTop / scrollHeight) * 100;
                    
                    progressFill.style.width = Math.min(scrollPercent, 100) + '%';
                });
            };

            let ticking = false;
            const throttledUpdate = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateProgressBar();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', throttledUpdate, { passive: true });
            
            updateProgressBar();
        }
    }

    setupHero() {
        if (this.heroTimeouts) {
            this.heroTimeouts.forEach(timeout => clearTimeout(timeout));
            this.heroTimeouts = [];
        } else {
            this.heroTimeouts = [];
        }
        
        const typewriter = document.querySelector('.typewriter');
        if (typewriter) {
            typewriter.classList.remove('typing', 'completed');
            typewriter.textContent = '';
            
            let text = typewriter.dataset.text;
            
            if (typeof i18n !== 'undefined' && typewriter.hasAttribute('data-i18n-typewriter')) {
                text = i18n.t(typewriter.getAttribute('data-i18n-typewriter'), 'v2');
            }
            
            if (!text) return;
            
            let index = 0;
            let isStopped = false;
            
            const type = () => {
                if (isStopped) return;
                
                if (index < text.length) {
                    typewriter.textContent = text.substring(0, index + 1);
                    index++;
                    const timeout = setTimeout(type, 100);
                    this.heroTimeouts.push(timeout);
                } else {
                    const timeout1 = setTimeout(() => {
                        if (isStopped) return;
                        index = 0;
                        typewriter.textContent = '';
                        const timeout2 = setTimeout(() => {
                            if (!isStopped) {
                                type();
                            }
                        }, 500);
                        this.heroTimeouts.push(timeout2);
                    }, 2000);
                    this.heroTimeouts.push(timeout1);
                }
            };
            
            const initialTimeout = setTimeout(() => {
                if (!isStopped) {
                    typewriter.classList.add('typing');
                    type();
                }
            }, 1000);
            this.heroTimeouts.push(initialTimeout);
        }

    }

    setupSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const progressBar = entry.target.querySelector('.skill-progress');
                if (!progressBar) return;
                if (progressBar.dataset.animated === 'true') {
                    obs.unobserve(entry.target);
                    return;
                }

                const finalWidth = progressBar.getAttribute('data-final-width') || progressBar.style.width || '0%';
                progressBar.setAttribute('data-final-width', finalWidth);
                progressBar.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        progressBar.style.width = finalWidth;
                        progressBar.dataset.animated = 'true';
                        obs.unobserve(entry.target);
                    }, 100);
                });
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => observer.observe(item));
    }

    updateScrollStep() {
        const firstCard = document.querySelector('.project-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const gap = window.innerWidth <= 768 ? 16 : 20;
            this.scrollStep = cardWidth + gap;
        } else {
            this.scrollStep = window.innerWidth <= 768 ? 296 : 340;
        }
    }

    setupProjectsSlider() {
        const projectsTrack = document.querySelector('.projects-track');
        const sliderContainer = document.querySelector('.projects-slider-container');
        if (!projectsTrack || !sliderContainer) return;

        this.originalCards = Array.from(projectsTrack.children);
        this.currentScrollPosition = 0;
        this.updateScrollStep();
        
        this.generateDynamicFilters();
        
        projectsTrack.classList.add('filtered');
        sliderContainer.classList.add('show-nav');
        this.filterProjects(this.originalCards, 'all', '');
        
        projectsTrack.addEventListener('mouseenter', () => {
            projectsTrack.style.animationPlayState = 'paused';
        });

        projectsTrack.addEventListener('mouseleave', () => {
            if (!projectsTrack.classList.contains('filtered')) {
                projectsTrack.style.animationPlayState = 'running';
            }
        });

        window.addEventListener('resize', () => {
            this.updateScrollStep();
        });

        this.setupSliderNavigation();
    }

    setupSliderNavigation() {
        const projectsTrack = document.querySelector('.projects-track');
        const sliderContainer = document.querySelector('.projects-slider-container');
        const prevBtn = document.getElementById('slider-nav-prev');
        const nextBtn = document.getElementById('slider-nav-next');
        
        if (!projectsTrack || !sliderContainer || !prevBtn || !nextBtn) return;

        if (this.prevBtnHandler) {
            prevBtn.removeEventListener('click', this.prevBtnHandler);
        }
        if (this.nextBtnHandler) {
            nextBtn.removeEventListener('click', this.nextBtnHandler);
        }
        if (this.wheelHandler) {
            sliderContainer.removeEventListener('wheel', this.wheelHandler);
        }

        const updateNavButtons = () => {
            const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
            const isAllFilter = this.currentFilter === 'all';
            
            if (isAllFilter) {
                prevBtn.disabled = false;
                prevBtn.style.opacity = '1';
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
            } else {
                if (this.currentScrollPosition <= 0) {
                    prevBtn.disabled = true;
                    prevBtn.style.opacity = '0.3';
                } else {
                    prevBtn.disabled = false;
                    prevBtn.style.opacity = '1';
                }
                
                if (this.currentScrollPosition >= maxScroll - 10) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.3';
                } else {
                    nextBtn.disabled = false;
                    nextBtn.style.opacity = '1';
                }
            }
        };

        this.prevBtnHandler = () => {
            if (this.soundEnabled && this.audioInitialized) {
                this.playSound('hover');
            }
            
            const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
            const isAllFilter = this.currentFilter === 'all';
            
            if (isAllFilter) {
                if (this.currentScrollPosition <= 0) {
                    this.currentScrollPosition = maxScroll;
                } else {
                    this.currentScrollPosition = Math.max(0, this.currentScrollPosition - this.scrollStep);
                }
            } else {
                this.currentScrollPosition = Math.max(0, this.currentScrollPosition - this.scrollStep);
            }
            
            projectsTrack.style.transform = `translateX(-${this.currentScrollPosition}px)`;
            projectsTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(updateNavButtons, 400);
        };

        this.nextBtnHandler = () => {
            if (this.soundEnabled && this.audioInitialized) {
                this.playSound('hover');
            }
            
            const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
            const isAllFilter = this.currentFilter === 'all';
            
            if (isAllFilter) {
                if (this.currentScrollPosition >= maxScroll - 10) {
                    this.currentScrollPosition = 0;
                } else {
                    this.currentScrollPosition = Math.min(maxScroll, this.currentScrollPosition + this.scrollStep);
                }
            } else {
                this.currentScrollPosition = Math.min(maxScroll, this.currentScrollPosition + this.scrollStep);
            }
            
            projectsTrack.style.transform = `translateX(-${this.currentScrollPosition}px)`;
            projectsTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(updateNavButtons, 400);
        };

        this.wheelHandler = (e) => {
            if (projectsTrack.classList.contains('filtered')) {
                e.preventDefault();
                const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
                const isAllFilter = this.currentFilter === 'all';
                const delta = e.deltaY > 0 ? this.scrollStep : -this.scrollStep;
                
                if (isAllFilter) {
                    this.currentScrollPosition = this.currentScrollPosition + delta;
                    if (this.currentScrollPosition < 0) {
                        this.currentScrollPosition = maxScroll;
                    } else if (this.currentScrollPosition > maxScroll) {
                        this.currentScrollPosition = 0;
                    }
                } else {
                    this.currentScrollPosition = Math.max(0, Math.min(maxScroll, this.currentScrollPosition + delta));
                }
                
                projectsTrack.style.transform = `translateX(-${this.currentScrollPosition}px)`;
                projectsTrack.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(updateNavButtons, 300);
            }
        };

        prevBtn.addEventListener('click', this.prevBtnHandler);
        nextBtn.addEventListener('click', this.nextBtnHandler);
        sliderContainer.addEventListener('wheel', this.wheelHandler, { passive: false });

        this.setupTouchSwipe(projectsTrack, sliderContainer, updateNavButtons);

        setTimeout(updateNavButtons, 100);
    }

    setupTouchSwipe(projectsTrack, sliderContainer, updateNavButtons) {
        if (!projectsTrack || !sliderContainer) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchCurrentY = 0;
        let isDragging = false;
        let isHorizontalSwipe = false;
        let initialScrollTop = 0;
        const swipeThreshold = 10;
        const minSwipeDistance = 50;

        const handleTouchStart = (e) => {
            if (this.currentFilter !== 'all') return;
            
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchCurrentX = touchStartX;
            touchCurrentY = touchStartY;
            isDragging = true;
            isHorizontalSwipe = false;
            initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            projectsTrack.style.transition = 'none';
        };

        const handleTouchMove = (e) => {
            if (!isDragging || this.currentFilter !== 'all') return;
            
            touchCurrentX = e.touches[0].clientX;
            touchCurrentY = e.touches[0].clientY;
            
            const deltaX = Math.abs(touchCurrentX - touchStartX);
            const deltaY = Math.abs(touchCurrentY - touchStartY);
            
            if (!isHorizontalSwipe && deltaX > swipeThreshold && deltaX > deltaY) {
                isHorizontalSwipe = true;
            }
            
            if (isHorizontalSwipe && deltaX > deltaY) {
                e.preventDefault();
                const deltaXMovement = touchCurrentX - touchStartX;
                const currentTransform = this.currentScrollPosition - deltaXMovement;
                const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
                
                projectsTrack.style.transform = `translateX(-${Math.max(0, Math.min(maxScroll, currentTransform))}px)`;
            } else if (!isHorizontalSwipe && deltaY > swipeThreshold) {
                isDragging = false;
                projectsTrack.style.transition = '';
                projectsTrack.style.transform = `translateX(-${this.currentScrollPosition}px)`;
            }
        };

        const handleTouchEnd = (e) => {
            if (!isDragging || this.currentFilter !== 'all') {
                isDragging = false;
                return;
            }
            
            isDragging = false;
            projectsTrack.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const deltaX = touchCurrentX - touchStartX;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            
            if (isHorizontalSwipe && Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
                const maxScroll = projectsTrack.scrollWidth - sliderContainer.offsetWidth;
                
                if (deltaX > 0) {
                    if (this.currentScrollPosition <= 0) {
                        this.currentScrollPosition = maxScroll;
                    } else {
                        this.currentScrollPosition = Math.max(0, this.currentScrollPosition - this.scrollStep);
                    }
                } else {
                    if (this.currentScrollPosition >= maxScroll - 10) {
                        this.currentScrollPosition = 0;
                    } else {
                        this.currentScrollPosition = Math.min(maxScroll, this.currentScrollPosition + this.scrollStep);
                    }
                }
                
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
            }
            
            projectsTrack.style.transform = `translateX(-${this.currentScrollPosition}px)`;
            setTimeout(updateNavButtons, 400);
            
            isHorizontalSwipe = false;
        };

        projectsTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        projectsTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        projectsTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
        projectsTrack.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }

    generateDynamicFilters() {
        const filterContainer = document.getElementById('projects-filter');
        if (!filterContainer) return;

        const allTechnologies = new Set();
        this.originalCards.forEach(card => {
            const technologies = card.dataset.technologies.split(',');
            technologies.forEach(tech => allTechnologies.add(tech.trim()));
        });

        const getFilterLabel = (tech) => {
            if (typeof i18n !== 'undefined') {
                return i18n.t(`filters.${tech}`, 'v2');
            }
            const fallback = {
                'all': 'All',
                'cpp': 'C++',
                'cms': 'CMS',
                'dotnet': '.NET',
                'ecommerce': 'E-commerce',
                'flutter': 'Flutter',
                'javascript': 'JavaScript',
                'python': 'Python'
            };
            return fallback[tech] || tech;
        };

        const allButton = filterContainer.querySelector('[data-filter="all"]');
        if (allButton && typeof i18n !== 'undefined') {
            allButton.textContent = i18n.t('filters.all', 'v2');
        }
        filterContainer.innerHTML = '';
        if (allButton) {
            filterContainer.appendChild(allButton);
        }

        const v1FilterOrder = ['cpp', 'cms', 'dotnet', 'ecommerce', 'flutter', 'javascript', 'python'];
        
        v1FilterOrder.forEach(tech => {
            if (allTechnologies.has(tech)) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.filter = tech;
                button.textContent = getFilterLabel(tech);
                filterContainer.appendChild(button);
            }
        });
    }

    setupProjects() {
        this.setupProjectsSlider();
        
        const searchInput = document.getElementById('projects-search');
        const searchClear = document.getElementById('search-clear');

        this.currentFilter = 'all';
        this.currentSearch = '';
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase().trim();
                if (searchClear) {
                    if (this.currentSearch.length > 0) {
                        searchClear.style.display = 'block';
                    } else {
                        searchClear.style.display = 'none';
                    }
                }
                this.filterProjects(this.originalCards, this.currentFilter, this.currentSearch);
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.currentSearch = '';
                searchClear.style.display = 'none';
                this.filterProjects(this.originalCards, this.currentFilter, this.currentSearch);
            });
        }

        const filterContainer = document.getElementById('projects-filter');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    this.currentFilter = e.target.dataset.filter;
                    this.filterProjects(this.originalCards, this.currentFilter, this.currentSearch);
                }
            });
        }
    }

    filterProjects(projectCards, filter, search) {
        const projectsTrack = document.querySelector('.projects-track');
        if (!projectsTrack) return;

        const sliderContainer = document.querySelector('.projects-slider-container');
        if (filter !== 'all' && sliderContainer) {
            sliderContainer.classList.remove('show-nav');
        }

        const fragment = document.createDocumentFragment();
        let visibleCards = [];
        const isFiltered = filter !== 'all' || search !== '';

        this.originalCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const technologies = card.dataset.technologies.toLowerCase();
            
            const matchesFilter = filter === 'all' || technologies.includes(filter);
            
            const matchesSearch = search === '' || 
                title.includes(search) || 
                description.includes(search) || 
                technologies.includes(search);
            
            if (matchesFilter && matchesSearch) {
                const cardCopy = card.cloneNode(true);
                cardCopy.style.cssText = 'display: block; opacity: 1; transform: translateY(0);';
                fragment.appendChild(cardCopy);
                visibleCards.push(cardCopy);
            }
        });

        if (visibleCards.length > 1) {
            visibleCards.forEach(card => {
                const clone = card.cloneNode(true);
                fragment.appendChild(clone);
            });
        }

        requestAnimationFrame(() => {
            projectsTrack.innerHTML = '';
            projectsTrack.appendChild(fragment);
            
            const sliderContainer = document.querySelector('.projects-slider-container');
            
            if (visibleCards.length <= 1) {
                projectsTrack.classList.add('filtered');
                if (sliderContainer) {
                    sliderContainer.classList.remove('show-nav');
                }
                this.currentScrollPosition = 0;
                projectsTrack.style.transform = 'translateX(0)';
            } else if (filter === 'all') {
                projectsTrack.classList.add('filtered');
                if (sliderContainer) {
                    sliderContainer.classList.add('show-nav');
                }
                this.currentScrollPosition = 0;
                projectsTrack.style.transform = 'translateX(0)';
                setTimeout(() => {
                    this.setupSliderNavigation();
                }, 100);
            } else {
                projectsTrack.classList.remove('filtered');
                if (sliderContainer) {
                    sliderContainer.classList.remove('show-nav');
                }
                this.currentScrollPosition = 0;
                
                projectsTrack.style.removeProperty('transform');
                projectsTrack.style.removeProperty('transition');
                projectsTrack.style.removeProperty('animation');
                
                setTimeout(() => {
                    projectsTrack.style.animation = 'none';
                    void projectsTrack.offsetWidth;
                    projectsTrack.style.removeProperty('animation');
                }, 50);
            }
            
            this.showNoResultsMessage(visibleCards, filter, search);
        });
    }

    showNoResultsMessage(visibleCards, filter, search) {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (visibleCards.length === 0) {
            const projectsSlider = document.querySelector('.projects-slider');
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            projectsSlider.appendChild(noResultsMessage);
        }
    }

    setupModals() {
        const contactBtn = document.getElementById('contact-link');
        const navContactBtn = document.getElementById('nav-contact-link');
        const contactModal = document.getElementById('contact-modal');
        const contactClose = document.getElementById('contact-modal-close');

        const hideHubSpotPromotional = () => {
            const formFrame = document.querySelector('.hs-form-frame');
            if (!formFrame) return;
            
            const promotionalSelectors = [
                '.hs-poweredby',
                '.hs-poweredby-wrapper',
                '.hs-poweredby-container',
                '[class*="poweredby"]',
                '[class*="hs-poweredby"]',
                '[id*="poweredby"]',
                '[id*="hs-poweredby"]',
                '.hs-form-poweredby',
                '.hs-form-footer',
                '.hs-form-poweredby-container',
                'iframe[src*="poweredby"]'
            ];
            
            promotionalSelectors.forEach(selector => {
                const elements = formFrame.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.height = '0';
                    el.style.margin = '0';
                    el.style.padding = '0';
                    el.style.overflow = 'hidden';
                });
            });
            
            const allDivs = formFrame.querySelectorAll('div');
            allDivs.forEach(div => {
                const text = div.textContent || '';
                if (text.includes('Create your own free forms') || 
                    text.includes('powered by') || 
                    text.includes('HubSpot') && div.querySelector('a')) {
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                    div.style.height = '0';
                    div.style.margin = '0';
                    div.style.padding = '0';
                    div.style.overflow = 'hidden';
                }
            });
        };

        const openContactModal = () => {
            contactModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                contactModal.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                hideHubSpotPromotional();
                const observer = new MutationObserver(() => {
                    hideHubSpotPromotional();
                });
                const formFrame = document.querySelector('.hs-form-frame');
                if (formFrame) {
                    observer.observe(formFrame, {
                        childList: true,
                        subtree: true
                    });
                }
            }, 500);
        };

        const closeContactModal = () => {
            contactModal.style.opacity = '0';
            setTimeout(() => {
                contactModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.soundEnabled) {
                    this.playSound('click');
                }
                openContactModal();
            });
        }

        if (navContactBtn) {
            navContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.soundEnabled) {
                    this.playSound('click');
                }
                openContactModal();
            });
        }

        if (contactClose) {
            contactClose.addEventListener('click', closeContactModal);
        }

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });

        const imageModal = document.getElementById('image-modal');
        const imageClose = document.getElementById('image-modal-close');
        const modalImage = document.getElementById('modal-image');
        const galleryPrev = document.getElementById('gallery-prev');
        const galleryNext = document.getElementById('gallery-next');

        const openImageModal = (images) => {
            this.currentImages = JSON.parse(images);
            this.currentImageIndex = 0;
            showCurrentImage();
            
            const showNav = this.currentImages.length > 1;
            if (galleryPrev) galleryPrev.style.display = showNav ? 'flex' : 'none';
            if (galleryNext) galleryNext.style.display = showNav ? 'flex' : 'none';
            
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                imageModal.style.opacity = '1';
            }, 10);
        };

        const closeImageModal = () => {
            imageModal.style.opacity = '0';
            setTimeout(() => {
                imageModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        const showCurrentImage = () => {
            if (this.currentImages.length > 0) {
                modalImage.src = this.currentImages[this.currentImageIndex];
                modalImage.alt = `Project Screenshot ${this.currentImageIndex + 1}`;
                
                const showNav = this.currentImages.length > 1;
                if (galleryPrev) galleryPrev.style.display = showNav ? 'flex' : 'none';
                if (galleryNext) galleryNext.style.display = showNav ? 'flex' : 'none';
            }
        };

        const showNextImage = () => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
            showCurrentImage();
        };

        const showPrevImage = () => {
            this.currentImageIndex = this.currentImageIndex === 0 
                ? this.currentImages.length - 1 
                : this.currentImageIndex - 1;
            showCurrentImage();
        };

        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-gallery')) {
                e.preventDefault();
                e.stopPropagation();
                if (this.soundEnabled) {
                    this.playSound('click');
                }
                const button = e.target.closest('.view-gallery');
                const images = button.dataset.images;
                if (images) {
                    try {
                        const imageArray = JSON.parse(images);
                        if (Array.isArray(imageArray) && imageArray.length > 0) {
                            window.currentGalleryImages = imageArray;
                            window.currentGalleryIndex = 0;
                            openImageModal(images);
                        }
                    } catch (error) {
                    }
                } else {
                }
            }
        });

        if (imageClose) {
            imageClose.addEventListener('click', closeImageModal);
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', showNextImage);
        }

        if (galleryPrev) {
            galleryPrev.addEventListener('click', showPrevImage);
        }

        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    closeImageModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (imageModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                } else if (e.key === 'Escape') {
                    closeImageModal();
                }
            }
            
            if (contactModal.style.display === 'flex' && e.key === 'Escape') {
                closeContactModal();
            }
        });
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.skill-item, .project-card, .tech-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/v2/sw.js')
                    .then(registration => {
                    })
                    .catch(registrationError => {
                    });
            });
        }
    }

    setupFooter() {
        const footer = document.getElementById('sticky-footer');
        const footerLinks = document.getElementById('footer-links');
        const footerBottom = document.getElementById('footer-bottom');
        
        if (!footer) return;

        let ticking = false;

        const updateFooter = () => {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollBottom = documentHeight - (scrollTop + windowHeight);

                if (scrollBottom <= 100) {
                    footer.classList.add('expanded');
                    setTimeout(() => {
                        if (footerLinks) footerLinks.classList.add('visible');
                        if (footerBottom) footerBottom.classList.add('visible');
                    }, 150);
                } else {
                    footer.classList.remove('expanded');
                    if (footerLinks) footerLinks.classList.remove('visible');
                    if (footerBottom) footerBottom.classList.remove('visible');
                }
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateFooter);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        
        updateFooter();
    }

    createParticles() {
        if (window.innerWidth <= 768) return;
        
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;

        const particleCount = 20;
        
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 15 + 20) + 's';
            particle.style.opacity = '0.3';
            
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);
    }

    randomizeTechPositions() {
        const techCircles = document.querySelectorAll('.tech-circle');
        const isMobile = window.innerWidth <= 768;
        
        requestAnimationFrame(() => {
            techCircles.forEach((circle, index) => {
                const randomTop = Math.random() * 96 + 2;
                const randomLeft = Math.random() * 96 + 2;
                const randomSize = isMobile ? (Math.random() * 20 + 40) : (Math.random() * 40 + 40);
                const randomIconSize = isMobile ? (Math.random() * 10 + 20) : (Math.random() * 15 + 25);
                
                circle.style.cssText = `
                    top: ${randomTop}%;
                    left: ${randomLeft}%;
                    width: ${randomSize}px;
                    height: ${randomSize}px;
                    opacity: 0;
                    transition: opacity ${isMobile ? '0.5s' : '1s'} ease-in-out;
                `;
                
                const icon = circle.querySelector('img');
                if (icon) {
                    icon.style.cssText = `
                        width: ${randomIconSize}px;
                        height: ${randomIconSize}px;
                    `;
                }
                
                setTimeout(() => {
                    circle.style.opacity = '0.6';
                }, isMobile ? (index * 100 + 300) : (index * 200 + 500));
            });
        });
    }

    setupAudioInitialization() {
        this.audioContext = null;
        this.audioInitialized = false;
        this.audioNeedsUserGesture = true;
    }

    initializeAudio() {
        return new Promise((resolve) => {
            try {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (this.audioContext.state === 'suspended') {
                    return this.audioContext.resume().then(() => {
                        this.audioInitialized = true;
                        this.audioNeedsUserGesture = false;
                        resolve(true);
                    }).catch(() => {
                        this.audioInitialized = false;
                        resolve(false);
                    });
                }

                this.audioInitialized = true;
                this.audioNeedsUserGesture = false;
                resolve(true);
            } catch (error) {
                this.audioInitialized = false;
                resolve(false);
            }
        });
    }

    setupSoundToggle() {
        const navSoundToggle = document.getElementById('nav-sound-toggle');
        navSoundToggle?.addEventListener('click', () => this.toggleSound());

        document.addEventListener('click', () => {
            if (this.audioNeedsUserGesture) {
                this.initializeAudio();
            }
        });

        document.addEventListener('keydown', () => {
            if (this.audioNeedsUserGesture) {
                this.initializeAudio();
            }
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('v2-sound', this.soundEnabled.toString());
        this.updateSoundIcon();

        if (this.soundEnabled) {
            this.initializeAudio().then((success) => {
                if (success) {
                    this.playSound('enable');
                }
            });
        }
    }

    updateSoundIcon() {
        const navSoundToggle = document.getElementById('nav-sound-toggle');
        const navIcon = navSoundToggle?.querySelector('i');

        if (navIcon) {
            navIcon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        if (!this.audioContext) {
            this.initializeAudio().then((success) => {
                if (success) {
                    this.createSoundEffect(this.audioContext, type);
                }
            });
            return;
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                if (this.audioInitialized) {
                    this.createSoundEffect(this.audioContext, type);
                }
            });
            return;
        }

        if (this.audioInitialized) {
            this.createSoundEffect(this.audioContext, type);
        }
    }

    createSoundEffect(audioContext, type) {
        try {
            const frequencies = {
                'hover': [800, 900],
                'click': [600, 700, 800],
                'toggle': [500, 600, 700, 800],
                'enable': [400, 500, 600, 700, 800],
                'success': [523.25, 659.25, 783.99]
            };

            const freqArray = frequencies[type] || frequencies['hover'];

            freqArray.forEach((f, index) => {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();

                    osc.connect(gain);
                    gain.connect(audioContext.destination);

                    osc.frequency.setValueAtTime(f, audioContext.currentTime);
                    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                    osc.start(audioContext.currentTime);
                    osc.stop(audioContext.currentTime + 0.3);
                }, index * 50);
            });
        } catch (error) {
        }
    }
}

function openContactModal(event) {
    event.preventDefault();
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            contactModal.style.opacity = '1';
        }, 10);
    }
}

function closeContactModal() {
    const contactModal = document.getElementById('contact-modal');
    if (contactModal) {
        contactModal.style.opacity = '0';
        setTimeout(() => {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

function openImageGallery(images) {
}

function closeImageGallery() {
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        imageModal.style.opacity = '0';
        setTimeout(() => {
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

function nextGalleryImage() {
    if (window.currentGalleryImages && window.currentGalleryImages.length > 1) {
        window.currentGalleryIndex = (window.currentGalleryIndex + 1) % window.currentGalleryImages.length;
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.src = window.currentGalleryImages[window.currentGalleryIndex];
        }
    }
}

function prevGalleryImage() {
    if (window.currentGalleryImages && window.currentGalleryImages.length > 1) {
        window.currentGalleryIndex = window.currentGalleryIndex === 0 
            ? window.currentGalleryImages.length - 1 
            : window.currentGalleryIndex - 1;
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.src = window.currentGalleryImages[window.currentGalleryIndex];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new ModernPortfolio();
    
    document.addEventListener('click', (e) => {
        const imageModal = document.getElementById('image-modal');
        if (imageModal && e.target === imageModal) {
            closeImageGallery();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        const imageModal = document.getElementById('image-modal');
        if (imageModal && imageModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevGalleryImage();
            } else if (e.key === 'ArrowRight') {
                nextGalleryImage();
            } else if (e.key === 'Escape') {
                closeImageGallery();
            }
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);