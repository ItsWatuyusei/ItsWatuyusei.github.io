class ModernPortfolio {
    constructor() {
        const storedTheme = localStorage.getItem('v2-darkMode');
        this.isDarkMode = storedTheme === null ? false : storedTheme === 'true';
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.soundEnabled = localStorage.getItem('v2-sound') !== 'false';
        this.audioContext = null;
        this.audioInitialized = false;
        this.audioNeedsUserGesture = true;
        this.init();
    }

    init() {
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

    setupTheme() {
        const toggle = document.getElementById('nav-darkmode-toggle');
        if (toggle) {
            if (this.isDarkMode) {
                document.body.classList.remove('light-theme');
                toggle.checked = false;
            } else {
                document.body.classList.add('light-theme');
                toggle.checked = true;
            }
            
            toggle.addEventListener('change', (e) => {
                const isLightMode = e.target.checked;
                this.isDarkMode = !isLightMode;
                
                localStorage.setItem('v2-darkMode', this.isDarkMode.toString());
                
                if (isLightMode) {
                    document.body.classList.add('light-theme');
                } else {
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
            const isLightMode = document.body.classList.contains('light-theme');
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
                const isLightMode = document.body.classList.contains('light-theme');
                
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
        const typewriter = document.querySelector('.typewriter');
        if (typewriter) {
            const text = typewriter.dataset.text;
            let index = 0;
            
            const type = () => {
                if (index < text.length) {
                    typewriter.textContent = text.slice(0, index + 1);
                    index++;
                    setTimeout(type, 100);
                } else {
                    setTimeout(() => {
                        index = 0;
                        typewriter.textContent = '';
                        setTimeout(type, 500);
                    }, 2000);
                }
            };
            
            setTimeout(type, 1000);
        }

    }

    setupSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0%';
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                progressBar.style.width = width;
                            }, 100);
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => observer.observe(item));
    }

    setupProjectsSlider() {
        const projectsTrack = document.querySelector('.projects-track');
        if (!projectsTrack) return;

        this.originalCards = Array.from(projectsTrack.children);
        
        this.generateDynamicFilters();
        
        this.filterProjects(this.originalCards, 'all', '');

        projectsTrack.addEventListener('mouseenter', () => {
            projectsTrack.style.animationPlayState = 'paused';
        });

        projectsTrack.addEventListener('mouseleave', () => {
            projectsTrack.style.animationPlayState = 'running';
        });
    }

    generateDynamicFilters() {
        const filterContainer = document.getElementById('projects-filter');
        if (!filterContainer) return;

        const allTechnologies = new Set();
        this.originalCards.forEach(card => {
            const technologies = card.dataset.technologies.split(',');
            technologies.forEach(tech => allTechnologies.add(tech.trim()));
        });

        const technologyLabels = {
            'cpp': 'C++',
            'cms': 'CMS',
            'dotnet': '.NET',
            'ecommerce': 'E-commerce',
            'flutter': 'Flutter',
            'javascript': 'JavaScript',
            'python': 'Python'
        };

        const allButton = filterContainer.querySelector('[data-filter="all"]');
        filterContainer.innerHTML = '';
        filterContainer.appendChild(allButton);

        const v1FilterOrder = ['cpp', 'cms', 'dotnet', 'ecommerce', 'flutter', 'javascript', 'python'];
        
        v1FilterOrder.forEach(tech => {
            if (allTechnologies.has(tech)) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.filter = tech;
                button.textContent = technologyLabels[tech];
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

        if (visibleCards.length > 0 && (!isFiltered || visibleCards.length > 1)) {
            visibleCards.forEach(card => {
                const clone = card.cloneNode(true);
                fragment.appendChild(clone);
            });
        }

        requestAnimationFrame(() => {
            projectsTrack.innerHTML = '';
            projectsTrack.appendChild(fragment);
            
            if (isFiltered && visibleCards.length <= 1) {
                projectsTrack.classList.add('filtered');
            } else {
                projectsTrack.classList.remove('filtered');
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

        const openContactModal = () => {
            contactModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                contactModal.style.opacity = '1';
            }, 10);
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
        
        requestAnimationFrame(() => {
            techCircles.forEach((circle, index) => {
                const randomTop = Math.random() * 96 + 2;
                const randomLeft = Math.random() * 96 + 2;
                const randomDelay = Math.random() * 15 + 5;
                const randomSize = Math.random() * 40 + 40;
                const randomIconSize = Math.random() * 15 + 25;
                
                circle.style.cssText = `
                    top: ${randomTop}%;
                    left: ${randomLeft}%;
                    animation-delay: -${randomDelay}s;
                    width: ${randomSize}px;
                    height: ${randomSize}px;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
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
                }, index * 200 + 500);
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