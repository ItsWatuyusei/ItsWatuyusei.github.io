if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
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
            'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115',
            'https://ik.imagekit.io/ItsWatuyusei/Image/BitelFibra/bitelfibra00.png?updatedAt=1752006146778'
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
        
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        };

        img.onerror = () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
            console.warn('Failed to load image:', img.src);
        };
    }

    loadContent(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
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

    // Typewriter functionality
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

    // Fade in animations
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

    // Modal management
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

    // Contact modal events
    [contactLink, navContactLink].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(contactModal);
        });
    });

    contactModalClose.addEventListener('click', () => closeModal(contactModal));

    // Image gallery functionality
    const projectTitles = document.querySelectorAll('.project-title[data-images]');
    const modalImage = document.getElementById('modal-image');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    let galleryImages = [];
    let galleryIndex = 0;

    function showGalleryImage(idx, animate = true) {
        if (!galleryImages.length) return;
        galleryIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
        if (animate) {
            modalImage.classList.remove('fadein-img');
            void modalImage.offsetWidth;
            modalImage.classList.add('fadein-img');
        }
        modalImage.src = galleryImages[galleryIndex];
        const showNav = galleryImages.length > 1;
        galleryPrev.style.display = showNav ? 'inline-block' : 'none';
        galleryNext.style.display = showNav ? 'inline-block' : 'none';
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
        });
    });

    galleryPrev.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
    galleryNext.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
    galleryPrev.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        if (galleryImages.length > 1) showGalleryImage(galleryIndex - 1, true);
    });
    galleryNext.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        if (galleryImages.length > 1) showGalleryImage(galleryIndex + 1, true);
    });

    imageModal.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            showGalleryImage(galleryIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showGalleryImage(galleryIndex + 1);
        }
    });

    imageModal.addEventListener('shown', function() {
        modalImage.focus();
    });

    imageModalClose.addEventListener('click', () => closeModal(imageModal));

    // Quick search modal
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
            quickSearchResults.style.display = 'none';
            return;
        }
        quickSearchResults.style.display = 'block';
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

    // Global modal close events
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

    // Dark mode functionality
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

    // Initialize dark mode
    if (localStorage.getItem('theme') === 'dark') {
        root.classList.add('dark');
        darkToggle.checked = true;
        navDarkToggle.checked = true;
    }
    updateMoon();

    // Dark mode event listeners
    [darkToggle, navDarkToggle].forEach(toggle => {
        toggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    });

    // Progress bar functionality
    const progressBar = document.getElementById('progress-bar');
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
        const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
        progressBar.style.width = clampedPercent + '%';
    }

    // Back to top functionality
    const backToTopBtn = document.getElementById('back-to-top');
    function updateBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Sticky navigation functionality
    const stickyNav = document.getElementById('sticky-nav');
    const stickyFooter = document.querySelector('.sticky-footer');
    let lastScrollTop = 0;
    let scrollDirection = 'up';

    function updateStickyElements() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update progress bar
        updateProgressBar();
        
        // Update back to top button
        updateBackToTop();
        
        // Update sticky navigation
        if (scrollTop > 200) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
        
        // Update scroll direction
        if (scrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        
        // Update sticky footer
        if (scrollDirection === 'down' && scrollTop > 300) {
            stickyFooter.classList.add('visible');
        } else if (scrollDirection === 'up' || scrollTop < 300) {
            stickyFooter.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    }

    // Consolidated scroll event listener
    window.addEventListener('scroll', updateStickyElements, { passive: true });
    window.addEventListener('resize', updateProgressBar, { passive: true });

    // Keyboard navigation
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

    // Smooth scrolling for navigation links
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
        });
    });

    // Section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Skills animations
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, { threshold: 0.1 });

    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        skill.style.opacity = '0';
        skill.style.transform = 'scale(0.8)';
        skill.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
        skillObserver.observe(skill);
    });

    // Tech stack animations
    const techStackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    }, { threshold: 0.1 });

    const techLogos = document.querySelectorAll('.tech-stack-logos img');
    techLogos.forEach((logo, index) => {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8) rotate(-10deg)';
        logo.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        techStackObserver.observe(logo);
        
        // Logo click animations
        const animateLogo = () => {
            logo.classList.remove('clicked');
            void logo.offsetWidth;
            logo.classList.add('clicked');
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

    // Mobile navigation
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavLinks = document.getElementById('nav-links');
    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavLinks.classList.toggle('active');
    });

    // Project search and filtering
    const projectSearch = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function updateProjectVisibility() {
        const searchTerm = projectSearch.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let visibleProjects = 0;

        projectCards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('.project-desc')?.textContent?.toLowerCase() || '';
            const tech = card.querySelector('.project-tech')?.textContent?.toLowerCase() || '';
            const technologies = card.getAttribute('data-technologies') || '';
            
            const matchesSearch = (title && title.includes(searchTerm)) || 
                                (desc && desc.includes(searchTerm)) || 
                                (tech && tech.includes(searchTerm));
            const matchesFilter = activeFilter === 'all' || technologies.includes(activeFilter);
            
            const shouldShow = matchesSearch && matchesFilter;
            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) visibleProjects++;
        });

        // Show/hide no projects message
        const projectsContainer = document.getElementById('projects-container');
        let noProjectsMessage = projectsContainer.querySelector('.no-projects-message');
        
        if (visibleProjects === 0 && !noProjectsMessage) {
            noProjectsMessage = document.createElement('div');
            noProjectsMessage.className = 'no-projects-message';
            noProjectsMessage.innerHTML = '<p>No projects found matching your criteria.</p>';
            projectsContainer.appendChild(noProjectsMessage);
        } else if (visibleProjects > 0 && noProjectsMessage) {
            noProjectsMessage.remove();
        }
    }

    projectSearch.addEventListener('input', updateProjectVisibility);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateProjectVisibility();
        });
    });

    // Pagination functionality
    const projectsPerPage = 6;
    let currentPage = 1;
    const totalProjects = projectCards.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    function renderProjectsPage(page) {
        const startIndex = (page - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        projectCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function updateProjectsPagination() {
        const pagination = document.getElementById('projects-pagination');
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        pagination.style.display = 'flex';
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="currentPage = ${i}; renderProjectsPage(${i}); updateProjectsPagination();">${i}</button>`;
        }
        pagination.innerHTML = paginationHTML;
    }

    renderProjectsPage(currentPage);
    updateProjectsPagination();
}); 
