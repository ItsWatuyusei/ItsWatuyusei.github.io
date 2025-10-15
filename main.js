class PortfolioHub {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.soundEnabled = localStorage.getItem('sound') !== 'false';
        this.loadingProgress = 0;
        this.init();
        this.loadingSteps = [
            'Initializing...',
            'Loading Assets...',
            'Preparing Experience...',
            'Ready!'
        ];
        this.currentStep = 0;
    }

    init() {
        this.setupLoadingScreen();
        this.setupEventListeners();
        this.setupTheme();
        this.setupScrollAnimations();
        this.setupParticleEffects();
        this.setupKeyboardShortcuts();
        this.setupServiceWorker();
        this.setupAudioInitialization();
        this.setupProgressBar();
        this.setupStickyNav();
        this.setupStickyFooter();
        this.setupContactModal();
        this.setupHamburgerMenu();
        this.setupTypewriter();
        this.updateSoundIcon();
    }

    setupLoadingScreen() {
        const loadingStats = document.querySelectorAll('.loading-stats .stat');
        if (loadingStats.length > 0 && this.loadingSteps && this.loadingSteps.length > 0) {
            this.currentStep = 0;
            this.updateLoadingStats(loadingStats, this.loadingSteps[0]);
        }
        
        this.simulateLoading();
    }

    simulateLoading() {
        const progressFill = document.getElementById('progress-fill');
        const loadingStats = document.querySelectorAll('.loading-stats .stat');
        
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 8;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);
                if (this.loadingSteps && this.loadingSteps.length > 0) {
                    this.currentStep = this.loadingSteps.length - 1;
                    this.updateLoadingStats(loadingStats, this.loadingSteps[this.currentStep]);
                }
                setTimeout(() => {
                    this.completeLoading();
                }, 1000);
            }
            
            if (progressFill) {
                progressFill.style.width = `${this.loadingProgress}%`;
            }
            
            if (this.loadingSteps && this.loadingSteps.length > 0) {
                const stepIndex = Math.floor((this.loadingProgress / 100) * this.loadingSteps.length);
                if (stepIndex < this.loadingSteps.length && stepIndex !== this.currentStep) {
                    this.currentStep = stepIndex;
                    this.updateLoadingStats(loadingStats, this.loadingSteps[this.currentStep]);
                }
            }
        }, 150);
    }

    updateLoadingStats(stats, text) {
        if (!stats || !text) return;
        
        stats.forEach((stat, index) => {
            if (!stat) return;
            
            if (index === this.currentStep) {
                stat.textContent = text;
                stat.classList.add('active');
                stat.style.opacity = '1';
                stat.style.display = 'block';
                stat.style.visibility = 'visible';
                stat.style.position = 'relative';
                stat.style.zIndex = '1';
            } else {
                stat.classList.remove('active');
                stat.style.opacity = '0';
                stat.style.display = 'none';
                stat.style.visibility = 'hidden';
            }
        });
    }

    completeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const loadingStats = document.querySelectorAll('.loading-stats .stat');
        
        if (this.loadingSteps && this.loadingSteps.length > 0) {
            this.currentStep = this.loadingSteps.length - 1;
            this.updateLoadingStats(loadingStats, this.loadingSteps[this.currentStep]);
        }
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.95) translateY(-30px)';
            }
            
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
                
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    mainContent.style.transform = 'translateY(50px)';
                    mainContent.style.transition = 'opacity 1s ease, transform 1s ease';
                    mainContent.style.position = 'relative';
                    mainContent.style.zIndex = '10';
                    mainContent.style.minHeight = '100vh';
                }
                
                setTimeout(() => {
                    if (mainContent) {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'translateY(0)';
                    }
                    
                    setTimeout(() => {
                        if (loadingScreen) {
                            loadingScreen.remove();
                        }
                    }, 500);
                }, 400);
            }, 1200);
        }, 500);
        
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        const navSoundToggle = document.getElementById('nav-sound-toggle');
        navSoundToggle?.addEventListener('click', () => this.toggleSound());
        
        document.addEventListener('click', () => {
            if (this.soundEnabled && this.audioNeedsUserGesture) {
                this.initializeAudio();
            }
        }, { once: true });

        document.querySelectorAll('.version-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleVersionNavigation(e);
            });
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateSoundIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        this.animateThemeTransition();
        
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    animateThemeTransition() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('sound', this.soundEnabled.toString());
        this.updateSoundIcon();
        
        if (this.soundEnabled) {
            this.initializeAudio();
            this.playSound('enable');
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
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.audioInitialized = true;
                this.audioNeedsUserGesture = false;
            } catch (error) {
                return;
            }
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.createSoundEffect(this.audioContext, type);
            }).catch(() => {
            });
        } else {
            this.createSoundEffect(this.audioContext, type);
        }
    }

    createSoundEffect(audioContext, type) {
        const frequencies = {
            'toggle': [440, 554],
            'complete': [523, 659, 784],
            'enable': [261, 329, 392],
            'hover': [440]
        };
        
        const freq = frequencies[type] || [440];
        
        if (Array.isArray(freq)) {
            freq.forEach((f, index) => {
                setTimeout(() => {
                    try {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        
                        osc.frequency.setValueAtTime(f, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                        
                        osc.start(audioContext.currentTime);
                        osc.stop(audioContext.currentTime + 0.3);
                    } catch (error) {
                    }
                }, index * 100);
            });
        }
    }

    handleVersionNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const version = link.dataset.version;
        
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);
        
        if (this.soundEnabled && this.audioInitialized) {
            this.playSound('hover');
        }
        
        this.showVersionTransition(version, link.href);
    }

    showVersionTransition(version, url) {
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'version-transition';
        transitionOverlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">
                    <img src="https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115" alt="ItsWatuyusei" />
                </div>
                <h2>Loading ${version.toUpperCase()} Portfolio</h2>
                <div class="transition-progress">
                    <div class="transition-fill"></div>
                </div>
                <p>Preparing your experience...</p>
            </div>
        `;
        
        const transitionStyle = document.createElement('style');
        transitionStyle.textContent = `
            .version-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                animation: fadeIn 0.5s ease forwards;
            }
            
            .transition-content {
                text-align: center;
                max-width: 400px;
                padding: var(--space-xl);
            }
            
            .transition-logo {
                width: 80px;
                height: 80px;
                margin: 0 auto var(--space-lg);
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid var(--primary);
                animation: pulse 2s infinite;
            }
            
            .transition-logo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .transition-content h2 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: var(--space-lg);
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .transition-progress {
                width: 100%;
                height: 4px;
                background: var(--bg-glass);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: var(--space-md);
            }
            
            .transition-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary), var(--secondary));
                border-radius: 2px;
                width: 0%;
                animation: progressFill 2s ease forwards;
            }
            
            .transition-content p {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes progressFill {
                to { width: 100%; }
            }
        `;
        
        document.head.appendChild(transitionStyle);
        document.body.appendChild(transitionOverlay);
        
        setTimeout(() => {
            window.location.href = url;
        }, 2500);
    }

    handleScroll() {
        this.updateFloatingShapes();
        this.updateScrollAnimations();
    }

    updateFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        const scrollSpeed = 0.5;
        const scrollY = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = scrollSpeed * (index + 1) * 0.1;
            const yPos = -(scrollY * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
        });
    }

    updateScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
    }

    setupScrollAnimations() {
        document.querySelectorAll('.feature-card, .version-card, .stat-item').forEach(el => {
            el.classList.add('fade-in');
        });
    }

    setupParticleEffects() {
        this.createFloatingParticles();
    }

    createFloatingParticles() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 20;
                const randomY = (Math.random() - 0.5) * 20;
                shape.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            }, 3000 + index * 1000);
        });
    }



    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resetAnimations();
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollToSection('features-section');
            }
            
            if (e.key === '1') {
                document.querySelector('[data-version="v1"]')?.click();
            }
            if (e.key === '2') {
                document.querySelector('[data-version="v2"]')?.click();
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(`.${sectionId}`);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    resetAnimations() {
        document.querySelectorAll('.version-card').forEach(card => {
            card.style.transform = '';
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                        }
                    })
                    .catch(registrationError => {
                    });
            });
        }
    }

    setupDevelopmentReload(registration) {
    }

    setupAudioInitialization() {
        this.audioContext = null;
        this.audioInitialized = false;
        this.audioNeedsUserGesture = true;
        
    }
    
    initializeAudio() {
        if (!this.audioContext && this.soundEnabled) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.audioInitialized = true;
                this.audioNeedsUserGesture = false;
            } catch (error) {
            }
        }
    }

    setupProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        
        if (!progressFill) return;

        const updateProgressBar = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressFill.style.width = Math.min(scrollPercent, 100) + '%';
        };

        window.addEventListener('scroll', this.throttle(updateProgressBar, 16));
        
        updateProgressBar();
    }


    setupStickyNav() {
        const stickyNav = document.getElementById('sticky-nav');
        const navDarkmodeToggle = document.getElementById('nav-darkmode-toggle');
        
        if (!stickyNav) return;

        const toggleStickyNav = () => {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > 100) {
                stickyNav.classList.add('visible');
            } else {
                stickyNav.classList.remove('visible');
            }
        };

        const handleNavDarkmodeToggle = () => {
            if (navDarkmodeToggle) {
                const isDark = navDarkmodeToggle.checked;
                this.currentTheme = isDark ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                localStorage.setItem('theme', this.currentTheme);
                this.updateThemeIcon();
                this.animateThemeTransition();
                
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('toggle');
                }
            }
        };

        window.addEventListener('scroll', this.throttle(toggleStickyNav, 16));
        
        if (navDarkmodeToggle) {
            navDarkmodeToggle.addEventListener('change', handleNavDarkmodeToggle);
            navDarkmodeToggle.checked = this.currentTheme === 'dark';
        }
        
        toggleStickyNav();
    }

    setupStickyFooter() {
        const stickyFooter = document.getElementById('sticky-footer');
        const footerLinks = document.getElementById('footer-links');
        const footerBottom = document.getElementById('footer-bottom');
        if (!stickyFooter || !footerLinks || !footerBottom) return;

        const toggleFooterExpansion = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (documentHeight > windowHeight + 200 && scrollTop + windowHeight >= documentHeight - 50) {
                stickyFooter.classList.add('expanded');
                footerLinks.classList.add('visible');
                footerBottom.classList.add('visible');
            } else {
                stickyFooter.classList.remove('expanded');
                footerLinks.classList.remove('visible');
                footerBottom.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', this.throttle(toggleFooterExpansion, 16));
        
        toggleFooterExpansion();
    }

    setupHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const mobileNavLinks = document.getElementById('nav-links');
        
        if (!hamburgerMenu || !mobileNavLinks) return;

        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !mobileNavLinks.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            });
        });

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

    handleKeyboard(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    handleResize() {
        this.updateResponsiveLayout();
    }

    updateResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.querySelectorAll('.version-card').forEach(card => {
                card.style.transform = '';
            });
        }
    }

    setupContactModal() {
        const contactLink = document.getElementById('nav-contact-link');
        const contactModal = document.getElementById('contact-modal');
        const contactModalClose = document.getElementById('contact-modal-close');

        function openModal(modal) {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modal) {
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }

        if (contactLink && contactModal) {
            contactLink.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(contactModal);
            });
        }

        if (contactModalClose && contactModal) {
            contactModalClose.addEventListener('click', () => closeModal(contactModal));
        }

        if (contactModal) {
            window.addEventListener('click', function(e) {
                if (e.target === contactModal) closeModal(contactModal);
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (contactModal.classList.contains('visible')) closeModal(contactModal);
                }
            });
        }
    }

    setupTypewriter() {
        const typewriterText = document.querySelector('.typewriter-text');
        const typewriterSubtitle = document.querySelector('.typewriter-subtitle');
        
        if (!typewriterText || !typewriterSubtitle) return;
        
        const fullText = typewriterText.getAttribute('data-text');
        const subtitleText = typewriterSubtitle.getAttribute('data-text');
        let currentIndex = 0;
        let subtitleIndex = 0;
        
        typewriterSubtitle.classList.remove('typing');
        
        const typeText = () => {
            if (currentIndex < fullText.length) {
                typewriterText.textContent += fullText.charAt(currentIndex);
                currentIndex++;
                setTimeout(typeText, 100);
            } else {
                typewriterText.classList.remove('typing');
                typewriterText.classList.add('completed');
                setTimeout(() => {
                    typewriterSubtitle.classList.add('typing');
                    setTimeout(() => {
                        typeSubtitle();
                    }, 1000);
                }, 1000);
            }
        };
        
        const typeSubtitle = () => {
            if (subtitleIndex < subtitleText.length) {
                typewriterSubtitle.textContent += subtitleText.charAt(subtitleIndex);
                subtitleIndex++;
                setTimeout(typeSubtitle, 50);
            } else {
                typewriterSubtitle.classList.remove('typing');
                typewriterSubtitle.classList.add('completed');
            }
        };
        
        setTimeout(() => {
            typewriterText.classList.add('typing');
            typeText();
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const portfolioHub = new PortfolioHub();
    
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary) !important;
            outline-offset: 2px !important;
        }
        
        .version-card {
            transition: transform 0.3s ease;
        }
        
        .version-card:hover {
            transform: translateY(-10px) scale(1.02) !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(dynamicStyles);
    
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
            }, 0);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.version-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    document.querySelectorAll('button, .version-link').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
        });
    });
});

