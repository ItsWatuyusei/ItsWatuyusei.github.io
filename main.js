class PortfolioHub {
    constructor() {
        this.init();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.soundEnabled = localStorage.getItem('sound') === 'true';
        this.loadingProgress = 0;
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
        this.setupBackToTop();
    }

    setupLoadingScreen() {
        this.simulateLoading();
    }

    simulateLoading() {
        const progressFill = document.getElementById('progress-fill');
        const loadingStats = document.querySelectorAll('.stat');
        
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);
                this.completeLoading();
            }
            
            if (progressFill) {
                progressFill.style.width = `${this.loadingProgress}%`;
            }
            
            const stepIndex = Math.floor((this.loadingProgress / 100) * this.loadingSteps.length);
            if (stepIndex < this.loadingSteps.length && stepIndex !== this.currentStep) {
                this.currentStep = stepIndex;
                this.updateLoadingStats(loadingStats, this.loadingSteps[stepIndex]);
            }
        }, 100);
    }

    updateLoadingStats(stats, text) {
        stats.forEach((stat, index) => {
            if (index === this.currentStep) {
                stat.textContent = text;
                stat.classList.add('active');
            } else if (index < this.currentStep) {
                stat.classList.add('active');
            } else {
                stat.classList.remove('active');
            }
        });
    }

    completeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.transition = 'opacity 1s ease, transform 1s ease';
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(0.95)';
            }
            
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
                
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    mainContent.style.transform = 'translateY(30px)';
                    mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
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
                    }, 300);
                }, 200);
            }, 1000);
        }, 500);
        
        if (this.soundEnabled && this.audioInitialized) {
            this.playSound('complete');
        }
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        const soundToggle = document.getElementById('sound-toggle');
        soundToggle?.addEventListener('click', () => this.toggleSound());

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

        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        this.animateThemeTransition();
        
        if (this.soundEnabled && this.audioInitialized) {
            this.playSound('toggle');
        }
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
        
        if (this.soundEnabled && this.audioInitialized) {
            this.playSound('enable');
        }
    }

    updateSoundIcon() {
        const soundToggle = document.getElementById('sound-toggle');
        const icon = soundToggle?.querySelector('i');
        if (icon) {
            icon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    this.createSoundEffect(audioContext, type);
                }).catch(() => {
                });
            } else {
                this.createSoundEffect(audioContext, type);
            }
        } catch (error) {
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
        this.setupMouseTrail();
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

    setupMouseTrail() {
        let mouseTrail = [];
        const maxTrailLength = 8;

        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (mouseTrail.length > maxTrailLength) {
                mouseTrail.shift();
            }

            if (Math.random() > 0.8) {
                this.createMouseTrailDot(e.clientX, e.clientY);
            }
        });

        // Clean up old trail points
        setInterval(() => {
            const now = Date.now();
            mouseTrail = mouseTrail.filter(point => now - point.time < 1000);
        }, 100);
    }

    createMouseTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'mouse-trail-dot';
        dot.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            opacity: 0.8;
            animation: mouseTrailFade 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(dot);
        
        setTimeout(() => {
            dot.remove();
        }, 1500);
    }

    handleMouseMove(e) {
        // Add subtle parallax effect to version cards
        const versionCards = document.querySelectorAll('.version-card');
        versionCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * 5;
            const rotateY = (x / rect.width) * 5;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key to reset animations
            if (e.key === 'Escape') {
                this.resetAnimations();
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollToSection('features-section');
            }
            
            // Number keys for version selection
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
        // Reset all animations and effects
        document.querySelectorAll('.version-card').forEach(card => {
            card.style.transform = '';
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        // Development mode setup
                        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                            // Auto-update disabled to prevent unwanted refreshes
                        }
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    setupDevelopmentReload(registration) {
        // Development reload disabled to prevent auto-refresh
    }

    setupAudioInitialization() {
        // Initialize audio context on first user interaction
        const initAudio = () => {
            if (this.audioInitialized) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                this.audioInitialized = true;
            } catch (error) {
                console.log('Audio context initialization failed');
            }
        };

        // Add event listeners for user interaction
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, initAudio, { once: true, passive: true });
        });
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

    setupBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (!backToTopButton) return;

        const toggleBackToTop = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            if (scrollTop > windowHeight) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        window.addEventListener('scroll', this.throttle(toggleBackToTop, 16));
        backToTopButton.addEventListener('click', scrollToTop);
        
        toggleBackToTop();
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
        // Global keyboard handling
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.updateResponsiveLayout();
    }

    updateResponsiveLayout() {
        // Adjust layout for different screen sizes
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mobile-specific adjustments
            document.querySelectorAll('.version-card').forEach(card => {
                card.style.transform = '';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const portfolioHub = new PortfolioHub();
    
    const mouseTrailStyle = document.createElement('style');
    mouseTrailStyle.textContent = `
        @keyframes mouseTrailFade {
            0% {
                opacity: 0.8;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
        
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
    document.head.appendChild(mouseTrailStyle);
    
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

