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

document.addEventListener('DOMContentLoaded', function() {
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
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => {
        el.classList.add('fadein');
        observer.observe(el);
    });
    const contactLink = document.getElementById('contact-link');
    const contactModal = document.getElementById('contact-modal');
    const contactModalClose = document.getElementById('contact-modal-close');
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    contactModalClose.addEventListener('click', function() {
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    window.addEventListener('click', function(e) {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    const projectTitles = document.querySelectorAll('.project-title[data-image]');
    const imageModal = document.getElementById('image-modal');
    const imageModalClose = document.getElementById('image-modal-close');
    const modalImage = document.getElementById('modal-image');
    projectTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            modalImage.src = imageSrc;
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    imageModalClose.addEventListener('click', function() {
        imageModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactModal.style.display === 'flex') {
                contactModal.style.display = 'none';
                document.body.style.overflow = '';
            }
            if (imageModal.style.display === 'flex') {
                imageModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });
    const darkToggle = document.getElementById('darkmode-toggle');
    const root = document.documentElement;
    function updateMoon() {
        const darkLabel = document.querySelector('.darkmode-label i');
        const navDarkLabel = document.querySelector('.nav-darkmode-label i');
        if (darkLabel) {
            if (root.classList.contains('dark')) {
                darkLabel.className = 'fas fa-sun';
            } else {
                darkLabel.className = 'fas fa-moon';
            }
        }
        if (navDarkLabel) {
            if (root.classList.contains('dark')) {
                navDarkLabel.className = 'fas fa-sun';
            } else {
                navDarkLabel.className = 'fas fa-moon';
            }
        }
    }
    if (localStorage.getItem('theme') === 'dark') {
        root.classList.add('dark');
        darkToggle.checked = true;
    }
    updateMoon();
    darkToggle.addEventListener('change', function() {
        if (this.checked) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        updateMoon();
    });
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
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('resize', updateProgressBar, { passive: true });
    updateProgressBar();
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
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
    const stickyNav = document.getElementById('sticky-nav');
    const stickyFooter = document.querySelector('.sticky-footer');
    const navContactLink = document.getElementById('nav-contact-link');
    const navDarkToggle = document.getElementById('nav-darkmode-toggle');
    let lastScrollTop = 0;
    let scrollDirection = 'up';
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 200) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
        if (scrollTop > lastScrollTop) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        if (scrollDirection === 'down' && scrollTop > 300) {
            stickyFooter.classList.add('visible');
        } else if (scrollDirection === 'up' || scrollTop < 300) {
            stickyFooter.classList.remove('visible');
        }
        lastScrollTop = scrollTop;
    }, { passive: true });
    navContactLink.addEventListener('click', function(e) {
        e.preventDefault();
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    navDarkToggle.addEventListener('change', function() {
        if (this.checked) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        updateMoon();
    });
    if (localStorage.getItem('theme') === 'dark') {
        navDarkToggle.checked = true;
    }
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
    });
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavLinks = document.getElementById('nav-links');
    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavLinks.classList.toggle('active');
    });
    const projectSearch = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    projectSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let visibleProjects = 0;
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('.project-desc')?.textContent?.toLowerCase() || '';
            const tech = card.querySelector('.project-tech')?.textContent?.toLowerCase() || '';
            const matches = (title && title.includes(searchTerm)) || (desc && desc.includes(searchTerm)) || (tech && tech.includes(searchTerm));
            card.style.display = matches ? 'block' : 'none';
            if (matches) visibleProjects++;
        });
        const projectsContainer = document.getElementById('projects-container');
        let noProjectsMessage = projectsContainer.querySelector('.no-projects-message');
        if (visibleProjects === 0 && searchTerm.length > 0) {
            if (!noProjectsMessage) {
                noProjectsMessage = document.createElement('div');
                noProjectsMessage.className = 'no-projects-message';
                noProjectsMessage.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No Projects Found</h3>
                    <p>No projects match your search criteria.</p>
                    <div class="filter-suggestion">Try different keywords or browse all projects.</div>
                `;
                projectsContainer.appendChild(noProjectsMessage);
            }
            noProjectsMessage.style.display = 'block';
        } else {
            if (noProjectsMessage) {
                noProjectsMessage.style.display = 'none';
            }
        }
    });
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            let visibleProjects = 0;
            projectCards.forEach(card => {
                const technologies = card.getAttribute('data-technologies');
                if (filter === 'all') {
                    card.style.display = 'block';
                    visibleProjects++;
                } else if (technologies && technologies.includes(filter)) {
                    card.style.display = 'block';
                    visibleProjects++;
                } else {
                    card.style.display = 'none';
                }
            });
            const projectsContainer = document.getElementById('projects-container');
            let noProjectsMessage = projectsContainer.querySelector('.no-projects-message');
            if (visibleProjects === 0) {
                if (!noProjectsMessage) {
                    noProjectsMessage = document.createElement('div');
                    noProjectsMessage.className = 'no-projects-message';
                    noProjectsMessage.innerHTML = `
                        <i class="fas fa-search"></i>
                        <h3>No Projects Available</h3>
                        <p>No projects found with the selected technology filter.</p>
                        <div class="filter-suggestion">Try selecting a different filter or browse all projects.</div>
                    `;
                    projectsContainer.appendChild(noProjectsMessage);
                }
                noProjectsMessage.style.display = 'block';
            } else {
                if (noProjectsMessage) {
                    noProjectsMessage.style.display = 'none';
                }
            }
        });
    });
    const quickSearchModal = document.getElementById('quick-search-modal');
    const quickSearchInput = document.getElementById('quick-search-input');
    const quickSearchClose = document.getElementById('quick-search-close');
    const sectionsResults = document.getElementById('sections-results');
    const projectsResults = document.getElementById('projects-results');
    const skillsResults = document.getElementById('skills-results');
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            quickSearchModal.style.display = 'flex';
            quickSearchInput.focus();
        }
        if (e.key === 'Escape' && quickSearchModal.style.display === 'flex') {
            quickSearchModal.style.display = 'none';
        }
    });
    quickSearchClose.addEventListener('click', function() {
        quickSearchModal.style.display = 'none';
    });
    quickSearchModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    quickSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length < 2) {
            sectionsResults.innerHTML = '';
            projectsResults.innerHTML = '';
            skillsResults.innerHTML = '';
            return;
        }
        const sections = [
            { title: 'Skills', desc: 'View my technical skills', href: '#skills' },
            { title: 'Projects', desc: 'Browse my projects', href: '#projects' },
            { title: 'Tech Stack', desc: 'See my technology stack', href: '#tech-stack' }
        ];
        const projects = Array.from(projectCards).map(card => ({
            title: card.querySelector('.project-title').textContent,
            desc: card.querySelector('.project-desc').textContent,
            href: '#projects'
        }));
        const skills = Array.from(document.querySelectorAll('.skill')).map(skill => ({
            title: skill.textContent,
            desc: 'Technical skill',
            href: '#skills'
        }));
        const filteredSections = sections.filter(s => 
            s.title.toLowerCase().includes(searchTerm) || s.desc.toLowerCase().includes(searchTerm)
        );
        const filteredProjects = projects.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm)
        );
        const filteredSkills = skills.filter(s => 
            s.title.toLowerCase().includes(searchTerm)
        );
        sectionsResults.innerHTML = filteredSections.map(s => `
            <div class="search-item" onclick="document.querySelector('${s.href}').scrollIntoView({behavior: 'smooth'}); quickSearchModal.style.display='none';">
                <div class="search-item-title">${s.title}</div>
                <div class="search-item-desc">${s.desc}</div>
            </div>
        `).join('');
        projectsResults.innerHTML = filteredProjects.map(p => `
            <div class="search-item" onclick="document.querySelector('${p.href}').scrollIntoView({behavior: 'smooth'}); quickSearchModal.style.display='none';">
                <div class="search-item-title">${p.title}</div>
                <div class="search-item-desc">${p.desc}</div>
            </div>
        `).join('');
        skillsResults.innerHTML = filteredSkills.map(s => `
            <div class="search-item" onclick="document.querySelector('${s.href}').scrollIntoView({behavior: 'smooth'}); quickSearchModal.style.display='none';">
                <div class="search-item-title">${s.title}</div>
                <div class="search-item-desc">${s.desc}</div>
            </div>
        `).join('');
    });
    const navLinksMobile = document.querySelectorAll('.nav-link');
    navLinksMobile.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900) {
                hamburgerMenu.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        });
    });
}); 
