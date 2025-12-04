class PortfolioHub {
    constructor() {
        try {
            if (typeof document === 'undefined' || typeof window === 'undefined') {
                console.warn('PortfolioHub: DOM not ready');
                return;
            }
            
            this.currentTheme = localStorage.getItem('theme') || 'light';
            this.soundEnabled = localStorage.getItem('sound') !== 'false';
            this.loadingProgress = 0;
            this.audioContext = null;
            this.audioInitialized = false;
            this.audioNeedsUserGesture = true;
            this.loadingSteps = [
                'Initializing...',
                'Loading Assets...',
                'Preparing Experience...',
                'Ready!'
            ];
            this.currentStep = 0;
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.init();
                });
            } else {
                this.init();
            }
        } catch (e) {
            console.error('Error in PortfolioHub constructor:', e);
        }
    }

    init() {
        try {
            this.setupI18n();
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
            this.setupSaasModal();
            this.setupHamburgerMenu();
            this.setupTypewriter();
            this.updateSoundIcon();
            
            setTimeout(() => {
                this.updateSaasDescription();
            }, 200);
            
            setTimeout(() => {
                this.randomizeShapePositions();
            }, 500);
        } catch (e) {
            console.error('Error initializing PortfolioHub:', e);
        }
    }

    setupI18n() {
        if (typeof i18n === 'undefined') {
            setTimeout(() => this.setupI18n(), 100);
            return;
        }
        
        i18n.init();
        this.updateLanguageSelector();
        
        const languageToggle = document.getElementById('nav-language-toggle');
        
        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.typewriterTimeouts) {
                    this.typewriterTimeouts.forEach(timeout => clearTimeout(timeout));
                    this.typewriterTimeouts = [];
                }
                const currentLang = i18n.getLanguage();
                const newLang = currentLang === 'eng' ? 'spn' : 'eng';
                i18n.setLanguage(newLang);
                this.updateLanguageSelector();
                setTimeout(() => {
                    this.setupTypewriter();
                    this.updateSaasDescription();
                }, 150);
                
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

    setupLoadingScreen() {
        const loadingStats = document.querySelectorAll('.loading-stats .stat');
        if (loadingStats.length > 0 && this.loadingSteps && this.loadingSteps.length > 0) {
            this.currentStep = 0;
            this.updateLoadingStats(loadingStats, this.loadingSteps[0]);
        }
        
        this.simulateLoading();
    }

    simulateLoading() {
        const progressFill = document.getElementById('progress-fill-loading');
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
                progressFill.style.transform = `scaleX(${this.loadingProgress / 100})`;
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
                    
                    this.setupProgressBar();
                    
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
            if (this.audioNeedsUserGesture) {
                this.initializeAudio();
            }
        }, { once: true });
        
        document.addEventListener('touchstart', () => {
            if (this.audioNeedsUserGesture) {
                this.initializeAudio();
            }
        }, { once: true });

        document.querySelectorAll('.version-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleVersionNavigation(e);
            });
            link.addEventListener('mouseenter', () => {
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
            });
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        this.setupGeneralButtonSounds();
    }

    setupTheme() {
        try {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            this.updateThemeIcon();
            this.updateSoundIcon();
        } catch (e) {
            return;
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        this.animateThemeTransition();
        
    }

    updateThemeIcon() {
        try {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        } catch (e) {
            return;
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
            this.initializeAudio().then((success) => {
                if (success) {
                    setTimeout(() => {
                        this.playSound('enable');
                    }, 150);
                }
            });
        }
    }

    updateSoundIcon() {
        try {
            const navSoundToggle = document.getElementById('nav-sound-toggle');
            if (!navSoundToggle) return;
            const navIcon = navSoundToggle.querySelector('i');
            if (navIcon) {
                navIcon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        } catch (e) {
            return;
        }
    }

    randomizeShapePositions() {
        const floatingShapes = document.querySelector('.floating-shapes');
        if (!floatingShapes) {
            setTimeout(() => this.randomizeShapePositions(), 100);
            return;
        }
        
        floatingShapes.innerHTML = '';
        
        const shapeTypes = ['circle', 'square', 'triangle'];
        const numShapes = 24;
        
        const positions = [
            { top: '5%', left: '8%' },
            { top: '15%', left: '35%' },
            { top: '25%', left: '65%' },
            { top: '35%', left: '15%' },
            { top: '45%', left: '85%' },
            { top: '55%', left: '5%' },
            { top: '65%', left: '45%' },
            { top: '75%', left: '75%' },
            { top: '85%', left: '25%' },
            { top: '95%', left: '55%' },
            { top: '10%', left: '90%' },
            { top: '30%', left: '50%' },
            { top: '50%', left: '10%' },
            { top: '70%', left: '80%' },
            { top: '90%', left: '40%' },
            { top: '20%', left: '20%' },
            { top: '40%', left: '60%' },
            { top: '60%', left: '30%' },
            { top: '80%', left: '70%' },
            { top: '12%', left: '75%' },
            { top: '32%', left: '25%' },
            { top: '52%', left: '85%' },
            { top: '72%', left: '15%' },
            { top: '92%', left: '65%' }
        ];
        
        for (let i = 0; i < numShapes; i++) {
            const shape = document.createElement('div');
            const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const randomSize = Math.random() * 80 + 15;
            const position = positions[i] || { 
                top: Math.random() * 90 + 5 + '%', 
                left: Math.random() * 90 + 5 + '%' 
            };
            const randomDelay = Math.random() * 25;
            const randomDuration = Math.random() * 15 + 20;
            
            shape.className = `shape ${randomType}`;
            shape.style.top = position.top;
            shape.style.left = position.left;
            shape.style.animationDelay = '-' + randomDelay + 's';
            shape.style.animationDuration = randomDuration + 's';
            
            if (randomType === 'triangle') {
                const triangleSize = randomSize / 2;
                shape.style.borderLeftWidth = triangleSize + 'px';
                shape.style.borderRightWidth = triangleSize + 'px';
                shape.style.borderBottomWidth = (triangleSize * 1.7) + 'px';
            } else {
                shape.style.width = randomSize + 'px';
                shape.style.height = randomSize + 'px';
            }
            
            floatingShapes.appendChild(shape);
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
                setTimeout(() => {
                    this.createSoundEffect(this.audioContext, type);
                }, 50);
            }).catch(() => {
                return;
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
                <h2><span class="loading-text">Loading</span> <span class="portfolio-text">Portfolio ${version.toUpperCase()}</span></h2>
                <div class="transition-progress">
                    <div class="transition-fill"></div>
                </div>
                <p>Preparing your experience...</p>
            </div>
        `;
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        const isDarkMode = currentTheme === 'dark';
        const bgColor = isDarkMode ? '#0a0a0a' : '#ffffff';
        const bgSecondary = isDarkMode ? '#111111' : '#f8fafc';
        const textColor = isDarkMode ? '#a1a1aa' : '#1a202c';
        const loadingTextColor = isDarkMode ? '#f0f0f0' : '#000000';
        
        const transitionStyle = document.createElement('style');
        transitionStyle.textContent = `
            .version-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, ${bgColor}, ${bgSecondary});
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
                display: inline-block;
                white-space: nowrap;
            }
            
            .loading-text {
                color: ${loadingTextColor};
                display: inline;
            }
            
            .portfolio-text {
                background: linear-gradient(135deg, var(--primary-light), var(--accent));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: inline;
            }
            
            .transition-progress {
                width: 280px;
                height: 4px;
                background: ${isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'};
                border-radius: var(--radius-full);
                overflow: hidden;
                margin: var(--space-md) auto;
                position: relative;
                box-shadow: ${isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
            }
            
            .transition-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-light), var(--accent));
                border-radius: var(--radius-full);
                width: 100%;
                transform: scaleX(0);
                transform-origin: left;
                animation: progressFillScale 2s ease forwards;
            }
            
            .transition-content p {
                color: ${textColor};
                font-size: 0.875rem;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes progressFillScale {
                to { transform: scaleX(1); }
            }
        `;
        
        document.head.appendChild(transitionStyle);
        document.body.appendChild(transitionOverlay);
        
        if (version === 'v1') {
            const v1Theme = currentTheme === 'dark' ? 'dark' : 'light';
            localStorage.setItem('v1-theme', v1Theme);
        } else if (version === 'v2') {
            const v2DarkMode = currentTheme === 'dark' ? 'true' : 'false';
            localStorage.setItem('v2-darkMode', v2DarkMode);
        }
        
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
        
        elements.forEach(el => {
            if (el) {
                observer.observe(el);
                el.classList.add('visible');
            }
        });
    }

    setupScrollAnimations() {
        document.querySelectorAll('.stat-item').forEach(el => {
            if (el) {
                el.classList.add('fade-in');
            }
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
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                return this.audioContext.resume().then(() => {
                    this.audioInitialized = true;
                    this.audioNeedsUserGesture = false;
                    return true;
                }).catch(() => {
                    this.audioInitialized = false;
                    return false;
                });
            } else {
                this.audioInitialized = true;
                this.audioNeedsUserGesture = false;
                return Promise.resolve(true);
            }
        } catch (error) {
            this.audioInitialized = false;
            return Promise.resolve(false);
        }
    }

    setupProgressBar() {
        const progressFill = document.getElementById('progress-fill-main');
        const progressBar = document.getElementById('progress-bar');
        
        if (!progressFill || !progressBar) {
            return;
        }

        progressBar.style.display = 'block';
        progressBar.style.opacity = '1';
        progressBar.style.visibility = 'visible';
        progressFill.style.transform = 'scaleX(0)';

        const updateProgressBar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            
            const bodyScrollHeight = document.body.scrollHeight;
            const bodyOffsetHeight = document.body.offsetHeight;
            const docClientHeight = document.documentElement.clientHeight;
            const docScrollHeight = document.documentElement.scrollHeight;
            const docOffsetHeight = document.documentElement.offsetHeight;
            const windowHeight = window.innerHeight;
            const bodyClientHeight = document.body.clientHeight;
            
            const documentHeight = Math.max(
                bodyScrollHeight,
                bodyOffsetHeight,
                docClientHeight,
                docScrollHeight,
                docOffsetHeight
            );
            const windowHeightFinal = windowHeight || docClientHeight || bodyClientHeight;
            
            const scrollableHeight = documentHeight - windowHeightFinal;
            const scrollPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
            const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
            
            progressFill.style.transform = `scaleX(${clampedPercent / 100})`;
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
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                );
                
                const scrollBottom = documentHeight - (scrollTop + windowHeight);
                const threshold = 150;
                
                if (documentHeight > windowHeight && scrollBottom <= threshold) {
                    stickyFooter.classList.add('expanded');
                    setTimeout(() => {
                        footerLinks.classList.add('visible');
                        footerBottom.classList.add('visible');
                    }, 50);
                } else {
                    stickyFooter.classList.remove('expanded');
                    footerLinks.classList.remove('visible');
                    footerBottom.classList.remove('visible');
                }
            });
        };

        window.addEventListener('scroll', this.throttle(toggleFooterExpansion, 16), { passive: true });
        window.addEventListener('resize', this.throttle(toggleFooterExpansion, 16), { passive: true });
        
        toggleFooterExpansion();
    }

    setupHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const mobileNavLinks = document.getElementById('nav-links');
        
        if (!hamburgerMenu || !mobileNavLinks) return;

        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');

            const expanded = hamburgerMenu.classList.contains('active');
            try {
                hamburgerMenu.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            } catch (e) {}
            try {
                mobileNavLinks.setAttribute('aria-hidden', expanded ? 'false' : 'true');
            } catch (e) {}

            if (this.soundEnabled && this.audioInitialized) {
                this.playSound('toggle');
            }
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
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
            }.bind(this));
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
            if (!modal) return;
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }

        if (contactLink && contactModal) {
            contactLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
                openModal(contactModal);
            }.bind(this));
        }

        if (contactModalClose && contactModal) {
            contactModalClose.addEventListener('click', () => {
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
                closeModal(contactModal);
            });
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

    setupSaasModal() {
        const openSaasModal = document.getElementById('open-saas-modal');
        const saasModal = document.getElementById('saas-modal');
        const saasModalClose = document.getElementById('saas-modal-close');
        const saasUnifiedLicense = document.getElementById('saas-unified-license');

        this.updateSaasDescription();
        this.randomizeSaasCards();

        const openModal = (modal) => {
            if (!modal) return;
            this.randomizeSaasCards();
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = (modal) => {
            if (!modal) return;
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        };

        if (openSaasModal && saasModal) {
            openSaasModal.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
                openModal(saasModal);
            }.bind(this));
        }

        if (saasModalClose && saasModal) {
            saasModalClose.addEventListener('click', () => {
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
                closeModal(saasModal);
            });
        }

        if (saasUnifiedLicense) {
            const contactModal = document.getElementById('contact-modal');
            saasUnifiedLicense.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.soundEnabled && this.audioInitialized) {
                    this.playSound('hover');
                }
                closeModal(saasModal);
                setTimeout(() => {
                    if (contactModal) {
                        contactModal.classList.add('visible');
                        document.body.style.overflow = 'hidden';
                    }
                }, 300);
            }.bind(this));
        }

        if (saasModal) {
            window.addEventListener('click', function(e) {
                if (e.target === saasModal) closeModal(saasModal);
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (saasModal.classList.contains('visible')) closeModal(saasModal);
                }
            });
        }
    }

    randomizeSaasCards() {
        try {
            const saasGrid = document.querySelector('.saas-grid');
            if (!saasGrid) return;

            const cards = Array.from(saasGrid.querySelectorAll('.saas-card'));
            if (cards.length === 0) return;

            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }

            cards.forEach(card => saasGrid.appendChild(card));
        } catch (e) {
            console.error('Error randomizing SaaS cards:', e);
        }
    }

    updateSaasDescription() {
        try {
            const saasDescription = document.querySelector('.saas-cta-description');
            
            if (!saasDescription) {
                setTimeout(() => this.updateSaasDescription(), 100);
                return;
            }

            const currentLang = typeof i18n !== 'undefined' ? i18n.getLanguage() : 'eng';
            
            let descriptionText = '';
            
            if (currentLang === 'spn') {
                descriptionText = 'Soluciones de software profesionales con opciones de licencia flexibles. Descubre nuestros productos disponibles y obtén la licencia que se adapte a tus necesidades.';
            } else {
                descriptionText = 'Professional software solutions with flexible licensing options. Discover our available products and get the license that fits your needs.';
            }
            
            if (saasDescription) {
                saasDescription.textContent = descriptionText;
            }
        } catch (e) {
            console.error('Error updating SaaS description:', e);
        }
    }

    setupGeneralButtonSounds() {
        document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
            if (!button.closest('footer') && !button.closest('.logo-container')) {
                button.addEventListener('mouseenter', () => {
                    if (this.soundEnabled && this.audioInitialized) {
                        this.playSound('hover');
                    }
                });
            }
        });
        
        document.querySelectorAll('a:not(.version-link):not(.nav-link):not(.logo-link)').forEach(link => {
            if (!link.closest('footer')) {
                link.addEventListener('mouseenter', () => {
                    if (this.soundEnabled && this.audioInitialized) {
                        this.playSound('hover');
                    }
                });
            }
        });
    }

    setupTypewriter() {
        if (this.typewriterTimeouts) {
            this.typewriterTimeouts.forEach(timeout => clearTimeout(timeout));
            this.typewriterTimeouts = [];
        } else {
            this.typewriterTimeouts = [];
        }
        
        const typewriterText = document.querySelector('.typewriter-text');
        const typewriterSubtitle = document.querySelector('.typewriter-subtitle');
        
        if (!typewriterText || !typewriterSubtitle) return;
        
        typewriterText.classList.remove('typing', 'completed');
        typewriterSubtitle.classList.remove('typing', 'completed');
        
        typewriterText.textContent = '';
        typewriterSubtitle.textContent = '';
        
        let fullText = typewriterText.getAttribute('data-text');
        let subtitleText = typewriterSubtitle.getAttribute('data-text');
        
        if (typeof i18n !== 'undefined') {
            if (typewriterText.hasAttribute('data-i18n-typewriter')) {
                fullText = i18n.t(typewriterText.getAttribute('data-i18n-typewriter'));
            }
            if (typewriterSubtitle.hasAttribute('data-i18n-typewriter')) {
                subtitleText = i18n.t(typewriterSubtitle.getAttribute('data-i18n-typewriter'));
            }
        }
        
        if (!fullText || !subtitleText) return;
        
        let currentIndex = 0;
        let subtitleIndex = 0;
        let isStopped = false;
        
        const typeText = () => {
            if (isStopped || !typewriterText) return;
            if (currentIndex < fullText.length) {
                typewriterText.textContent = fullText.substring(0, currentIndex + 1);
                currentIndex++;
                const timeout = setTimeout(typeText, 100);
                this.typewriterTimeouts.push(timeout);
            } else {
                if (typewriterText) {
                    typewriterText.classList.remove('typing');
                    typewriterText.classList.add('completed');
                }
                const timeout1 = setTimeout(() => {
                    if (isStopped) return;
                    if (typewriterSubtitle) {
                        typewriterSubtitle.classList.add('typing');
                        const timeout2 = setTimeout(() => {
                            if (!isStopped) {
                                typeSubtitle();
                            }
                        }, 1000);
                        this.typewriterTimeouts.push(timeout2);
                    }
                }, 1000);
                this.typewriterTimeouts.push(timeout1);
            }
        };
        
        const typeSubtitle = () => {
            if (isStopped || !typewriterSubtitle) return;
            if (subtitleIndex < subtitleText.length) {
                typewriterSubtitle.textContent = subtitleText.substring(0, subtitleIndex + 1);
                subtitleIndex++;
                const timeout = setTimeout(typeSubtitle, 50);
                this.typewriterTimeouts.push(timeout);
            } else {
                if (typewriterSubtitle) {
                    typewriterSubtitle.classList.remove('typing');
                    typewriterSubtitle.classList.add('completed');
                }
            }
        };
        
        const initialTimeout = setTimeout(() => {
            if (!isStopped && typewriterText) {
                typewriterText.classList.add('typing');
                typeText();
            }
        }, 1500);
        this.typewriterTimeouts.push(initialTimeout);
    }
}

(function() {
    function initializePortfolioHub() {
        try {
            if (typeof document === 'undefined') {
                return;
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializePortfolioHub);
                return;
            }
            
            const portfolioHub = new PortfolioHub();
            
            setTimeout(() => {
                if (portfolioHub && typeof portfolioHub.randomizeShapePositions === 'function') {
                    portfolioHub.randomizeShapePositions();
                }
            }, 1000);
        } catch (e) {
            console.error('Error initializing PortfolioHub:', e);
        }
    }
    
    if (typeof window !== 'undefined') {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initializePortfolioHub();
        } else {
            window.addEventListener('load', initializePortfolioHub);
            document.addEventListener('DOMContentLoaded', initializePortfolioHub);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    
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


