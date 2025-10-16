class ModernPortfolio {
    constructor() {
        // Get dark mode preference from localStorage, default to true (dark mode)
        const storedTheme = localStorage.getItem('darkMode');
        this.isDarkMode = storedTheme === null ? true : storedTheme === 'true';
        this.currentImageIndex = 0;
        this.currentImages = [];
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
        this.createParticles();
    }

    setupTheme() {
        const toggle = document.getElementById('nav-darkmode-toggle');
        if (toggle) {
            // Initialize theme based on stored preference
            if (this.isDarkMode) {
                document.body.classList.remove('light-theme');
                toggle.checked = false; // Moon icon for dark mode
            } else {
                document.body.classList.add('light-theme');
                toggle.checked = true; // Sun icon for light mode
            }
            
            toggle.addEventListener('change', (e) => {
                const isLightMode = e.target.checked;
                this.isDarkMode = !isLightMode;
                
                // Update localStorage
                localStorage.setItem('darkMode', this.isDarkMode.toString());
                
                // Update body class
                if (isLightMode) {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
                
                // Update nav background based on current scroll position
                this.updateNavBackground();
            });
        }
    }

    updateNavBackground() {
        const nav = document.getElementById('sticky-nav');
        if (nav) {
            const isLightMode = document.body.classList.contains('light-theme');
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                if (isLightMode) {
                    nav.style.background = 'rgba(255, 255, 255, 0.95)';
                } else {
                    nav.style.background = 'rgba(10, 10, 10, 0.95)';
                }
            } else {
                if (isLightMode) {
                    nav.style.background = 'rgba(255, 255, 255, 0.8)';
                } else {
                    nav.style.background = 'rgba(10, 10, 10, 0.8)';
                }
            }
            nav.style.backdropFilter = 'blur(20px)';
        }
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger-menu');
        const navLinks = document.getElementById('nav-links');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Sticky navigation
        const nav = document.getElementById('sticky-nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                const isLightMode = document.body.classList.contains('light-theme');
                if (window.scrollY > 100) {
                    if (isLightMode) {
                        nav.style.background = 'rgba(255, 255, 255, 0.95)';
                    } else {
                        nav.style.background = 'rgba(10, 10, 10, 0.95)';
                    }
                    nav.style.backdropFilter = 'blur(20px)';
                } else {
                    if (isLightMode) {
                        nav.style.background = 'rgba(255, 255, 255, 0.8)';
                    } else {
                        nav.style.background = 'rgba(10, 10, 10, 0.8)';
                    }
                    nav.style.backdropFilter = 'blur(20px)';
                }
            });
        }
    }

    setupProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        
        if (progressFill) {
            const updateProgressBar = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                
                progressFill.style.width = Math.min(scrollPercent, 100) + '%';
            };

            // Throttle scroll events for better performance
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
            
            // Initial update
            updateProgressBar();
        }
    }

    setupHero() {
        // Typewriter effect
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

        // Floating animation for cards
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }

    setupSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        // Animate skill bars on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0%';
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 100);
                    }
                }
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => observer.observe(item));
    }

    setupProjectsSlider() {
        const projectsTrack = document.querySelector('.projects-track');
        if (!projectsTrack) return;

        // Store original cards
        this.originalCards = Array.from(projectsTrack.children);
        
        // Generate dynamic filters
        this.generateDynamicFilters();
        
        // Clone all project cards to create seamless loop
        this.originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            projectsTrack.appendChild(clone);
        });

        // Setup hover pause functionality
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

        // Get all unique technologies from projects
        const allTechnologies = new Set();
        this.originalCards.forEach(card => {
            const technologies = card.dataset.technologies.split(',');
            technologies.forEach(tech => allTechnologies.add(tech.trim()));
        });

        // Create filter buttons for each technology
        const technologyLabels = {
            'ecommerce': 'E-commerce',
            'cms': 'CMS',
            'php': 'PHP',
            'javascript': 'JavaScript',
            'cpp': 'C++',
            'dotnet': '.NET',
            'flutter': 'Flutter',
            'python': 'Python'
        };

        // Clear existing filters (except "All")
        const allButton = filterContainer.querySelector('[data-filter="all"]');
        filterContainer.innerHTML = '';
        filterContainer.appendChild(allButton);

        // Add technology filters
        Array.from(allTechnologies).sort().forEach(tech => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.filter = tech;
            button.textContent = technologyLabels[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
            filterContainer.appendChild(button);
        });
    }

    setupProjects() {
        this.setupProjectsSlider();
        
        const searchInput = document.getElementById('projects-search');
        const searchClear = document.getElementById('search-clear');

        this.currentFilter = 'all';
        this.currentSearch = '';

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase().trim();
                
                // Show/hide clear button
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

        // Clear search functionality
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.currentSearch = '';
                searchClear.style.display = 'none';
                this.filterProjects(this.originalCards, this.currentFilter, this.currentSearch);
            });
        }

        // Filter functionality - use event delegation for dynamic buttons
        const filterContainer = document.getElementById('projects-filter');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    // Remove active class from all buttons
                    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
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

        // Clear existing clones
        const clones = projectsTrack.querySelectorAll('.project-card:nth-child(n+' + (this.originalCards.length + 1) + ')');
        clones.forEach(clone => clone.remove());

        let visibleCards = [];

        this.originalCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const technologies = card.dataset.technologies.toLowerCase();
            
            // Check if project matches filter
            const matchesFilter = filter === 'all' || technologies.includes(filter);
            
            // Check if project matches search
            const matchesSearch = search === '' || 
                title.includes(search) || 
                description.includes(search) || 
                technologies.includes(search);
            
            // Show/hide project based on both filter and search
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCards.push(card);
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });

        // Clone visible cards for seamless loop
        visibleCards.forEach(card => {
            const clone = card.cloneNode(true);
            projectsTrack.appendChild(clone);
        });

        // Show "No projects found" message if needed
        this.showNoResultsMessage(visibleCards, filter, search);
    }

    showNoResultsMessage(visibleCards, filter, search) {
        // Remove existing no results message
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
        // Contact modal
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
                openContactModal();
            });
        }

        if (navContactBtn) {
            navContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openContactModal();
            });
        }

        if (contactClose) {
            contactClose.addEventListener('click', closeContactModal);
        }

        // Close modal when clicking outside
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });

        // Image gallery modal
        const viewGalleryButtons = document.querySelectorAll('.view-gallery');
        const imageModal = document.getElementById('image-modal');
        const imageClose = document.getElementById('image-modal-close');
        const modalImage = document.getElementById('modal-image');
        const galleryPrev = document.getElementById('gallery-prev');
        const galleryNext = document.getElementById('gallery-next');

        console.log('Gallery elements found:', {
            buttons: viewGalleryButtons.length,
            modal: !!imageModal,
            close: !!imageClose,
            image: !!modalImage,
            prev: !!galleryPrev,
            next: !!galleryNext
        });

        const openImageModal = (images) => {
            console.log('Opening image modal with images:', images);
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
            console.log('Closing image modal');
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
                console.log('Showing image:', this.currentImages[this.currentImageIndex]);
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

        viewGalleryButtons.forEach((button, index) => {
            console.log(`Setting up gallery button ${index}:`, button);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Gallery button clicked:', button);
                const images = button.dataset.images;
                console.log('Images data:', images);
                if (images) {
                    try {
                        const imageArray = JSON.parse(images);
                        if (Array.isArray(imageArray) && imageArray.length > 0) {
                            // Store images globally for navigation
                            window.currentGalleryImages = imageArray;
                            window.currentGalleryIndex = 0;
                            openImageModal(images);
                        }
                    } catch (error) {
                        console.error('Error parsing images:', error);
                    }
                } else {
                    console.error('No images data found');
                }
            });
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

        // Close image modal when clicking outside
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    closeImageModal();
                }
            });
        }

        // Keyboard navigation
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
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements for animation
        document.querySelectorAll('.skill-item, .project-card, .tech-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/v2/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    createParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation delay
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
}

// Global functions for modal control
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

// Global functions for gallery navigation (used by HTML onclick)
function openImageGallery(images) {
    // This function is kept for backward compatibility but should not be used
    // The gallery now uses event listeners with data-attributes
    console.warn('openImageGallery called via onclick - this should use event listeners instead');
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernPortfolio();
    
    // Add click outside to close image modal
    document.addEventListener('click', (e) => {
        const imageModal = document.getElementById('image-modal');
        if (imageModal && e.target === imageModal) {
            closeImageGallery();
        }
    });
    
    // Add keyboard navigation for image gallery
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

// Add CSS animations
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