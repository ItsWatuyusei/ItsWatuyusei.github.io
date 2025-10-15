if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        const swUrl = './sw.js?v=' + Date.now();
        navigator.serviceWorker.register(swUrl)
            .then(function(registration) {
            })
            .catch(function(registrationError) {
            });
    });
}

class EnhancedLazyLoader {
    constructor() {
        this.imageObserver = null;
        this.contentObserver = null;
        this.preloadQueue = [];
        this.init();
    }

    init() {
        this.setupImageObserver();
        this.setupContentObserver();
        this.setupPreloadQueue();
    }

    setupImageObserver() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => this.imageObserver.observe(img));
    }

    setupContentObserver() {
        this.contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadContent(entry.target);
                    this.contentObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        const contentElements = document.querySelectorAll('.project-card, .skill, .tech-stack-logos img');
        contentElements.forEach(el => this.contentObserver.observe(el));
    }

    setupPreloadQueue() {
        const criticalImages = [
            'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        requestAnimationFrame(() => {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
        
        img.onload = () => {
            requestAnimationFrame(() => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                img.classList.add('loaded');
            });
        };

        img.onerror = () => {
            requestAnimationFrame(() => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                img.classList.add('loaded');
                console.warn('Failed to load image:', img.src);
            });
        };
    }

    loadContent(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        });
    }

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    addToPreloadQueue(src) {
        if (!this.preloadQueue.includes(src)) {
            this.preloadQueue.push(src);
            this.processPreloadQueue();
        }
    }

    async processPreloadQueue() {
        if (this.preloadQueue.length === 0) return;
        
        const src = this.preloadQueue.shift();
        try {
            await this.preloadImage(src);
        } catch (error) {
            console.warn('Failed to preload image:', src);
        }
        
        setTimeout(() => this.processPreloadQueue(), 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const lazyLoader = new EnhancedLazyLoader();
    
    const projectImages = document.querySelectorAll('.project-img[src]');
    projectImages.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('loaded');
            });
        }
    });

    const typewriterText = document.querySelector('.typewriter-text');
    const typewriterRole = document.querySelector('.typewriter-text-role');
    const fullText = typewriterText.getAttribute('data-text');
    const roleText = typewriterRole.getAttribute('data-text');
    let currentIndex = 0;
    let roleIndex = 0;
    typewriterRole.classList.remove('typing');
    
    function typeWriter() {
        if (currentIndex < fullText.length) {
            typewriterText.textContent += fullText.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeWriter, 80);
        } else {
            typewriterText.classList.remove('typing');
            typewriterText.classList.add('completed');
            setTimeout(() => {
                typewriterRole.classList.add('typing');
                setTimeout(() => {
                    typeWriterRole();
                }, 1000);
            }, 500);
        }
    }
    
    function typeWriterRole() {
        if (roleIndex < roleText.length) {
            typewriterRole.textContent += roleText.charAt(roleIndex);
            roleIndex++;
            setTimeout(typeWriterRole, 60);
        } else {
            typewriterRole.classList.remove('typing');
            typewriterRole.classList.add('completed');
        }
    }
    
    setTimeout(() => {
        typewriterText.classList.add('typing');
        typeWriter();
    }, 2000);

    const fadeEls = document.querySelectorAll('.fadein-group .project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadein-visible');
                const projectImages = entry.target.querySelectorAll('img[data-images]');
                projectImages.forEach(img => {
                    try {
                        const images = JSON.parse(img.getAttribute('data-images'));
                        images.forEach(src => lazyLoader.addToPreloadQueue(src));
                    } catch (e) {
                    }
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px 0px'
    });
    
    fadeEls.forEach(el => {
        el.classList.add('fadein');
        observer.observe(el);
    });

    const contactLink = document.getElementById('contact-link');
    const navContactLink = document.getElementById('nav-contact-link');
    const contactModal = document.getElementById('contact-modal');
    const contactModalClose = document.getElementById('contact-modal-close');
    const imageModal = document.getElementById('image-modal');
    const imageModalClose = document.getElementById('image-modal-close');
    const quickSearchModal = document.getElementById('quick-search-modal');
    const quickSearchClose = document.getElementById('quick-search-close');

    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    [contactLink, navContactLink].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(contactModal);
        });
    });

    contactModalClose.addEventListener('click', () => closeModal(contactModal));

    const projectTitles = document.querySelectorAll('.project-title[data-images]');
    const modalImage = document.getElementById('modal-image');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    let galleryImages = [];
    let galleryIndex = 0;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function showGalleryImage(idx, animate = true) {
        if (!galleryImages.length || isTransitioning) return;
        
        isTransitioning = true;
        galleryIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
        
        if (animate) {
            modalImage.classList.remove('image-transition-enter', 'image-transition-enter-active', 'image-transition-exit', 'image-transition-exit-active', 'loading');
            
            modalImage.classList.add('image-transition-exit');
            
            requestAnimationFrame(() => {
                modalImage.classList.add('image-transition-exit-active');
            });
            
            setTimeout(() => {
                modalImage.classList.add('loading');
                modalImage.src = galleryImages[galleryIndex];
                
                modalImage.onload = () => {
                    modalImage.classList.remove('loading');
                    modalImage.classList.remove('image-transition-exit', 'image-transition-exit-active');
                    modalImage.classList.add('image-transition-enter');
                    
                    requestAnimationFrame(() => {
                        modalImage.classList.add('image-transition-enter-active');
                    });
                    
                    setTimeout(() => {
                        modalImage.classList.remove('image-transition-enter', 'image-transition-enter-active');
                        isTransitioning = false;
                        preloadGalleryImages();
                    }, 400);
                };
                
                modalImage.onerror = () => {
                    modalImage.classList.remove('loading', 'image-transition-exit', 'image-transition-exit-active');
                    isTransitioning = false;
                };
            }, 400);
        } else {
            modalImage.classList.remove('image-transition-enter', 'image-transition-enter-active', 'image-transition-exit', 'image-transition-exit-active', 'loading');
            modalImage.src = galleryImages[galleryIndex];
            isTransitioning = false;
        }
        
        const showNav = galleryImages.length > 1;
        galleryPrev.style.display = showNav ? 'flex' : 'none';
        galleryNext.style.display = showNav ? 'flex' : 'none';
    }

    projectTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
            try {
                galleryImages = JSON.parse(this.getAttribute('data-images'));
            } catch {
                galleryImages = [this.getAttribute('data-image')];
            }
            galleryIndex = 0;
            openModal(imageModal);
            showGalleryImage(0, false);
            
            setTimeout(() => {
                preloadGalleryImages();
            }, 100);
        });
    });

    galleryPrev.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
    galleryNext.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
    galleryPrev.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        if (galleryImages.length > 1 && !isTransitioning) showGalleryImage(galleryIndex - 1, true);
    });
    galleryNext.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        if (galleryImages.length > 1 && !isTransitioning) showGalleryImage(galleryIndex + 1, true);
    });

    imageModal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    imageModal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold && !isTransitioning) {
            if (diff > 0) {
                if (galleryImages.length > 1) showGalleryImage(galleryIndex + 1, true);
            } else {
                if (galleryImages.length > 1) showGalleryImage(galleryIndex - 1, true);
            }
        }
    }

    function preloadGalleryImages() {
        if (galleryImages.length <= 1) return;
        
        const nextIndex = (galleryIndex + 1) % galleryImages.length;
        const prevIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
        
        const nextImg = new Image();
        const prevImg = new Image();
        
        nextImg.src = galleryImages[nextIndex];
        prevImg.src = galleryImages[prevIndex];
    }

    imageModal.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !isTransitioning) {
            showGalleryImage(galleryIndex - 1);
        } else if (e.key === 'ArrowRight' && !isTransitioning) {
            showGalleryImage(galleryIndex + 1);
        }
    });

    imageModal.addEventListener('shown', function() {
        modalImage.focus();
    });

    imageModalClose.addEventListener('click', () => closeModal(imageModal));

    const quickSearchInput = document.getElementById('quick-search-input');
    const quickSearchResults = document.getElementById('quick-search-results');
    const sectionsResults = document.getElementById('sections-results');
    const projectsResults = document.getElementById('projects-results');
    const skillsResults = document.getElementById('skills-results');

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openModal(quickSearchModal);
            quickSearchInput.focus();
        }
    });

    quickSearchClose.addEventListener('click', () => closeModal(quickSearchModal));

    quickSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length < 2) {
            requestAnimationFrame(() => {
                quickSearchResults.style.display = 'none';
            });
            return;
        }
        requestAnimationFrame(() => {
            quickSearchResults.style.display = 'block';
        });
        const sections = [
            { name: 'Skills', id: 'skills' },
            { name: 'Projects', id: 'projects' },
            { name: 'Tech Stack', id: 'tech-stack' }
        ];
        const projects = Array.from(projectCards).map(card => ({
            name: card.querySelector('.project-title')?.textContent || '',
            id: card.querySelector('.project-title')?.getAttribute('data-images') || ''
        }));
        const skills = Array.from(document.querySelectorAll('.skill')).map(skill => ({
            name: skill.textContent || '',
            id: skill.textContent || ''
        }));
        const filteredSections = sections.filter(section => 
            section.name.toLowerCase().includes(searchTerm)
        );
        const filteredProjects = projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm)
        );
        const filteredSkills = skills.filter(skill => 
            skill.name.toLowerCase().includes(searchTerm)
        );
        sectionsResults.innerHTML = filteredSections.map(section => 
            `<div class="search-item" onclick="document.getElementById('${section.id}').scrollIntoView({behavior: 'smooth'}); quickSearchModal.style.display='none';">${section.name}</div>`
        ).join('');
        projectsResults.innerHTML = filteredProjects.map(project => 
            `<div class="search-item">${project.name}</div>`
        ).join('');
        skillsResults.innerHTML = filteredSkills.map(skill => 
            `<div class="search-item">${skill.name}</div>`
        ).join('');
    });

    window.addEventListener('click', function(e) {
        if (e.target === contactModal) closeModal(contactModal);
        if (e.target === imageModal) closeModal(imageModal);
        if (e.target === quickSearchModal) closeModal(quickSearchModal);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactModal.style.display === 'flex') closeModal(contactModal);
            if (imageModal.style.display === 'flex') closeModal(imageModal);
            if (quickSearchModal.style.display === 'flex') closeModal(quickSearchModal);
        }
    });

    const darkToggle = document.getElementById('darkmode-toggle');
    const navDarkToggle = document.getElementById('nav-darkmode-toggle');
    const root = document.documentElement;

    function updateMoon() {
        const darkLabel = document.querySelector('.darkmode-label i');
        const navDarkLabel = document.querySelector('.nav-darkmode-label i');
        const iconClass = root.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
        
        if (darkLabel) darkLabel.className = iconClass;
        if (navDarkLabel) navDarkLabel.className = iconClass;
    }

    function toggleDarkMode(checked) {
        if (checked) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        updateMoon();
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (shouldUseDark) {
        root.classList.add('dark');
        darkToggle.checked = true;
        navDarkToggle.checked = true;
    }
    updateMoon();

    [darkToggle, navDarkToggle].forEach(toggle => {
        toggle.addEventListener('change', function() {
            const isChecked = this.checked;
            toggleDarkMode(isChecked);
            darkToggle.checked = isChecked;
            navDarkToggle.checked = isChecked;
        });
    });

    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill') || progressBar;
    let cachedDocumentHeight = 0;
    let cachedWindowHeight = 0;
    let lastScrollPercent = 0;
    
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        if (cachedDocumentHeight === 0 || cachedWindowHeight === 0) {
            const bodyScrollHeight = document.body.scrollHeight;
            const bodyOffsetHeight = document.body.offsetHeight;
            const docClientHeight = document.documentElement.clientHeight;
            const docScrollHeight = document.documentElement.scrollHeight;
            const docOffsetHeight = document.documentElement.offsetHeight;
            const windowHeight = window.innerHeight;
            const bodyClientHeight = document.body.clientHeight;
            
            cachedDocumentHeight = Math.max(
                bodyScrollHeight,
                bodyOffsetHeight,
                docClientHeight,
                docScrollHeight,
                docOffsetHeight
            );
            cachedWindowHeight = windowHeight || docClientHeight || bodyClientHeight;
        }
        
        const scrollableHeight = cachedDocumentHeight - cachedWindowHeight;
        const scrollPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
        const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
        
        if (Math.abs(clampedPercent - lastScrollPercent) > 0.5) {
            lastScrollPercent = clampedPercent;
            progressFill.style.transform = `scaleX(${clampedPercent / 100})`;
        }
    }



    const stickyNav = document.getElementById('sticky-nav');
    const stickyFooter = document.querySelector('.sticky-footer');
    let lastScrollTop = 0;
    let scrollDirection = 'up';

    function updateStickyElements() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const shouldShowNav = scrollTop > 200;
        const isScrollingDown = scrollTop > lastScrollTop;
        const shouldShowFooter = isScrollingDown && scrollTop > 300;
        
        updateProgressBar();
        
        requestAnimationFrame(() => {
            if (shouldShowNav) {
                stickyNav.classList.add('visible');
            } else {
                stickyNav.classList.remove('visible');
            }
            
            if (shouldShowFooter) {
                stickyFooter.classList.add('visible');
            } else {
                stickyFooter.classList.remove('visible');
            }
            
            
            lastScrollTop = scrollTop;
        });
    }

    let scrollTimeout;
    let isScrolling = false;
    function throttledUpdateStickyElements() {
        if (isScrolling) return;
        isScrolling = true;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                updateStickyElements();
                isScrolling = false;
            });
        }, 8);
    }
    
    function invalidateCache() {
        cachedDocumentHeight = 0;
        cachedWindowHeight = 0;
    }
    
    window.addEventListener('scroll', throttledUpdateStickyElements, { passive: true });
    window.addEventListener('resize', () => {
        invalidateCache();
        updateProgressBar();
    }, { passive: true });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const projectCards = document.querySelectorAll('.project-card');
            const currentFocus = document.activeElement;
            let currentIndex = -1;
            projectCards.forEach((card, index) => {
                if (card.contains(currentFocus)) {
                    currentIndex = index;
                }
            });
            if (currentIndex !== -1) {
                let nextIndex;
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % projectCards.length;
                } else {
                    nextIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
                }
                const nextCard = projectCards[nextIndex];
                const link = nextCard.querySelector('.project-link');
                if (link) {
                    link.focus();
                }
            }
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            const hamburgerMenu = document.getElementById('hamburger-menu');
            const mobileNavLinks = document.getElementById('nav-links');
            hamburgerMenu.classList.remove('active');
            mobileNavLinks.classList.remove('active');
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const sectionObserver = new IntersectionObserver((entries) => {
        const elementsToAnimate = [];
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elementsToAnimate.push(entry.target);
            }
        });
        
        if (elementsToAnimate.length > 0) {
            requestAnimationFrame(() => {
                elementsToAnimate.forEach(element => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            });
        }
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    const skillObserver = new IntersectionObserver((entries) => {
        const skillsToAnimate = [];
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsToAnimate.push(entry.target);
            }
        });
        
        if (skillsToAnimate.length > 0) {
            requestAnimationFrame(() => {
                skillsToAnimate.forEach(skill => {
                    skill.style.opacity = '1';
                    skill.style.transform = 'scale(1)';
                });
            });
        }
    }, { threshold: 0.1 });

    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        skill.style.opacity = '0';
        skill.style.transform = 'scale(0.8)';
        skill.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
        skillObserver.observe(skill);
    });

    const techStackObserver = new IntersectionObserver((entries) => {
        const logosToAnimate = [];
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logosToAnimate.push(entry.target);
            }
        });
        
        if (logosToAnimate.length > 0) {
            requestAnimationFrame(() => {
                logosToAnimate.forEach(logo => {
                    logo.style.opacity = '1';
                    logo.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        }
    }, { threshold: 0.1 });

    const techLogos = document.querySelectorAll('.tech-stack-logos img');
    techLogos.forEach((logo, index) => {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8) rotate(-10deg)';
        logo.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        techStackObserver.observe(logo);
        
        const animateLogo = () => {
            logo.classList.remove('clicked');
            requestAnimationFrame(() => {
                logo.classList.add('clicked');
            });
        };
        
        logo.addEventListener('click', animateLogo);
        logo.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                animateLogo();
            }
        });
        logo.setAttribute('tabindex', '0');
        logo.setAttribute('role', 'button');
        logo.setAttribute('aria-label', logo.alt || 'Tech icon');
    });

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavLinks = document.getElementById('nav-links');
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

    const projectSearch = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const projectsPerPage = 6;
    let currentPage = 1;
    let filteredProjects = [];

    function updateFilterButtonsVisibility() {
    const availableTechnologies = new Set();
    
    projectCards.forEach(card => {
        const technologies = card.getAttribute('data-technologies') || '';
        if (technologies) {
            technologies.split(',').forEach(tech => {
                availableTechnologies.add(tech.trim());
            });
        }
    });

    filterBtns.forEach(btn => {
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

    function getVisibleProjects() {
        const searchTerm = projectSearch.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        return Array.from(projectCards).filter(card => {
            const title = card.querySelector('.project-title')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('.project-desc')?.textContent?.toLowerCase() || '';
            const tech = card.querySelector('.project-tech')?.textContent?.toLowerCase() || '';
            const technologies = card.getAttribute('data-technologies') || '';
            
            const matchesSearch = (title && title.includes(searchTerm)) || 
                                (desc && desc.includes(searchTerm)) || 
                                (tech && tech.includes(searchTerm));
            const matchesFilter = activeFilter === 'all' || technologies.includes(activeFilter);
            
            return matchesSearch && matchesFilter;
        });
    }

    function updateProjectVisibility() {
        const cardsToHide = [];
        const cardsToShow = [];
        
        filteredProjects = getVisibleProjects();
        currentPage = 1;
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        
        projectCards.forEach(card => {
            cardsToHide.push(card);
        });
        
        filteredProjects.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                cardsToShow.push(card);
            }
        });
        
        requestAnimationFrame(() => {
            cardsToHide.forEach(card => {
                card.style.display = 'none';
            });
            cardsToShow.forEach(card => {
                card.style.display = 'block';
            });
        });

        const projectsContainer = document.getElementById('projects-container');
        let noProjectsMessage = projectsContainer.querySelector('.no-projects-message');
        
        if (filteredProjects.length === 0 && !noProjectsMessage) {
            noProjectsMessage = document.createElement('div');
            noProjectsMessage.className = 'no-projects-message';
            noProjectsMessage.innerHTML = '<p>No projects found matching your criteria.</p>';
            projectsContainer.appendChild(noProjectsMessage);
        } else if (filteredProjects.length > 0 && noProjectsMessage) {
            noProjectsMessage.remove();
        }

        updateProjectsPagination(totalPages);

        updateFilterButtonsVisibility();
    }

    function renderProjectsPage(page) {
        projectCards.forEach(card => {
            card.style.display = 'none';
        });

        filteredProjects = getVisibleProjects();
        
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        currentPage = page;
        
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        
        const cardsToShow = [];
        filteredProjects.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                cardsToShow.push(card);
            }
        });
        
        requestAnimationFrame(() => {
            cardsToShow.forEach(card => {
                card.style.display = 'block';
            });
        });

        updateProjectsPagination(totalPages);

        updateFilterButtonsVisibility();
        
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const offsetTop = projectsSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    window.renderProjectsPage = renderProjectsPage;

    function updateProjectsPagination(totalPages) {
        const pagination = document.getElementById('projects-pagination');
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        let paginationHTML = '';
        
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="renderProjectsPage(${currentPage - 1})">‹</button>`;
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="renderProjectsPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="renderProjectsPage(${currentPage + 1})">›</button>`;
        }
        
        pagination.innerHTML = paginationHTML;
    }

    const clearSearchBtn = document.getElementById('clear-search');
    
    function toggleClearButton() {
        if (projectSearch.value.trim() !== '') {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }
    
    clearSearchBtn.addEventListener('click', function() {
        projectSearch.value = '';
        projectSearch.focus();
        updateProjectVisibility();
        toggleClearButton();
    });
    
    projectSearch.addEventListener('input', function() {
        updateProjectVisibility();
        toggleClearButton();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateProjectVisibility();
        });
    });

    updateProjectVisibility();
    updateFilterButtonsVisibility();
});

function setupDynamicFooter() {
    const stickyFooter = document.getElementById('sticky-footer');
    const footerLinks = document.querySelector('.footer-links');
    const footerBottom = document.querySelector('.footer-bottom');
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

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    window.addEventListener('scroll', throttle(toggleFooterExpansion, 16));
    
    
    toggleFooterExpansion();
}

setupDynamicFooter(); 