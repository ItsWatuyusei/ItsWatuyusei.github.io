class I18n {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = {
            eng: {
                hub: {
                    nav: {
                        features: 'Features',
                        versions: 'Versions',
                        links: 'Links',
                        contact: 'Contact'
                    },
                    hero: {
                        title: 'Choose Your Experience',
                        subtitle: 'Discover two unique portfolio styles: the original classic design and a modern version that uses the latest web technology.'
                    },
                    version: {
                        v1: {
                            title: 'Classic Portfolio',
                            description: 'Clean, professional portfolio with comprehensive project showcase, advanced search functionality, and detailed tech stack presentation. Perfect for traditional portfolio browsing.',
                            features: {
                                gallery: 'Project Gallery',
                                search: 'Advanced Search',
                                tech: 'Tech Stack',
                                responsive: 'Responsive'
                            },
                            link: 'Explore Classic'
                        },
                        v2: {
                            title: 'Modern Portfolio',
                            description: 'Revolutionary portfolio experience with glassmorphism design, interactive skill progress bars, dynamic tech background, and modern project slider. Showcases the future of web development.',
                            features: {
                                glassmorphism: 'Glassmorphism',
                                progress: 'Skill Progress',
                                background: 'Dynamic Background',
                                modern: 'Modern UI'
                            },
                            link: 'Experience Modern',
                            badge: 'NEW'
                        }
                    },
                    stats: {
                        technologies: 'Technologies',
                        projects: 'Projects',
                        years: 'Years Experience'
                    },
                    features: {
                        title: 'Why Choose This Hub?',
                        subtitle: 'Experience the evolution of web development',
                        fullstack: {
                            title: 'Full Stack Development',
                            description: 'Complete web solutions from frontend to backend, delivering end-to-end applications with modern technologies.'
                        },
                        innovative: {
                            title: 'Innovative Solutions',
                            description: 'Creative problem-solving approach that transforms complex challenges into elegant, user-friendly applications.'
                        },
                        responsive: {
                            title: 'Responsive Design',
                            description: 'Perfect experience across all devices, from mobile to desktop and beyond with adaptive layouts.'
                        },
                        modern: {
                            title: 'Modern Technology',
                            description: 'Cutting-edge tools and frameworks to build fast, scalable, and maintainable applications with the latest industry standards.'
                        }
                    },
                    loading: {
                        title: 'Loading',
                        portfolio: 'Portfolio',
                        preparing: 'Preparing your experience...',
                        initializing: 'Initializing...',
                        loadingAssets: 'Loading Assets...',
                        preparingExperience: 'Preparing Experience...',
                        ready: 'Ready!'
                    },
                    footer: {
                        copyright: 'Copyright ©',
                        fullStack: 'Full Stack Developer'
                    }
                },
                v1: {
                    nav: {
                        hub: 'Hub',
                        skills: 'Skills',
                        projects: 'Projects',
                        techStack: 'Tech Stack',
                        links: 'Links',
                        contact: 'Contact'
                    },
                    hero: {
                        subtitle: 'Developer with 8+ years of experience building scalable applications and software solutions.',
                        role: 'Full Stack Developer',
                        links: 'Links',
                        contact: 'Contact'
                    },
                    sections: {
                        skills: 'Skills',
                        projects: 'Featured Projects',
                        techStack: 'Tech Stack'
                    },
                    search: {
                        placeholder: 'Search projects...',
                        sections: 'Sections',
                        projects: 'Projects',
                        skills: 'Skills'
                    },
                    filters: {
                        all: 'All',
                        cpp: 'C++',
                        cms: 'CMS',
                        dotnet: '.NET',
                        ecommerce: 'E-commerce',
                        flutter: 'Flutter',
                        javascript: 'JavaScript',
                        python: 'Python',
                        php: 'PHP',
                        react: 'React',
                        wordpress: 'WordPress'
                    },
                    project: {
                        viewDetails: 'View Details',
                        close: 'Close',
                        previous: 'Previous',
                        next: 'Next',
                        technologies: 'Technologies',
                        category: 'Category',
                        description: 'Description'
                    },
                    footer: {
                        fullStack: 'Full Stack Developer'
                    }
                },
                v2: {
                    nav: {
                        hub: 'Hub',
                        skills: 'Skills',
                        projects: 'Projects',
                        contact: 'Contact'
                    },
                    hero: {
                        badge: 'Available for Projects',
                        role: 'Full Stack Developer',
                        description: 'Developer with 8+ years of experience building scalable applications and software solutions.',
                        viewLinks: 'View Links',
                        getInTouch: 'Get in Touch'
                    },
                    sections: {
                        skills: {
                            title: 'Skills & Expertise',
                            subtitle: 'Technologies I work with'
                        },
                        projects: {
                            title: 'Featured Projects',
                            subtitle: 'A selection of my recent work'
                        }
                    },
                    search: {
                        placeholder: 'Search...'
                    },
                    filters: {
                        all: 'All',
                        cpp: 'C++',
                        cms: 'CMS',
                        dotnet: '.NET',
                        ecommerce: 'E-commerce',
                        flutter: 'Flutter',
                        javascript: 'JavaScript',
                        python: 'Python',
                        php: 'PHP',
                        react: 'React',
                        wordpress: 'WordPress'
                    },
                    project: {
                        viewDetails: 'View Details',
                        close: 'Close',
                        previous: 'Previous',
                        next: 'Next',
                        technologies: 'Technologies',
                        category: 'Category',
                        description: 'Description'
                    },
                    footer: {
                        fullStack: 'Full Stack Developer'
                    }
                }
            },
            spn: {
                hub: {
                    nav: {
                        features: 'Características',
                        versions: 'Versiones',
                        links: 'Enlaces',
                        contact: 'Contacto'
                    },
                    hero: {
                        title: 'Elige Tu Experiencia',
                        subtitle: 'Descubre dos estilos únicos de portafolio: el diseño clásico original y una versión moderna que utiliza la última tecnología web.'
                    },
                    version: {
                        v1: {
                            title: 'Portafolio Clásico',
                            description: 'Portafolio limpio y profesional con muestra completa de proyectos, funcionalidad de búsqueda avanzada y presentación detallada de tecnologías. Perfecto para navegación tradicional de portafolios.',
                            features: {
                                gallery: 'Galería de Proyectos',
                                search: 'Búsqueda Avanzada',
                                tech: 'Stack Tecnológico',
                                responsive: 'Responsive'
                            },
                            link: 'Explorar Clásico'
                        },
                        v2: {
                            title: 'Portafolio Moderno',
                            description: 'Experiencia revolucionaria de portafolio con diseño glassmorphism, barras de progreso de habilidades interactivas, fondo tecnológico dinámico y slider moderno de proyectos. Muestra el futuro del desarrollo web.',
                            features: {
                                glassmorphism: 'Glassmorphism',
                                progress: 'Progreso de Habilidades',
                                background: 'Fondo Dinámico',
                                modern: 'UI Moderna'
                            },
                            link: 'Experimentar Moderno',
                            badge: 'NUEVO'
                        }
                    },
                    stats: {
                        technologies: 'Tecnologías',
                        projects: 'Proyectos',
                        years: 'Años de Experiencia'
                    },
                    features: {
                        title: '¿Por Qué Elegir Este Hub?',
                        subtitle: 'Experimenta la evolución del desarrollo web',
                        fullstack: {
                            title: 'Desarrollo Full Stack',
                            description: 'Soluciones web completas desde frontend hasta backend, entregando aplicaciones de extremo a extremo con tecnologías modernas.'
                        },
                        innovative: {
                            title: 'Soluciones Innovadoras',
                            description: 'Enfoque creativo de resolución de problemas que transforma desafíos complejos en aplicaciones elegantes y fáciles de usar.'
                        },
                        responsive: {
                            title: 'Diseño Responsive',
                            description: 'Experiencia perfecta en todos los dispositivos, desde móvil hasta escritorio y más allá con diseños adaptativos.'
                        },
                        modern: {
                            title: 'Tecnología Moderna',
                            description: 'Herramientas y frameworks de vanguardia para construir aplicaciones rápidas, escalables y mantenibles con los últimos estándares de la industria.'
                        }
                    },
                    loading: {
                        title: 'Cargando',
                        portfolio: 'Portafolio',
                        preparing: 'Preparando tu experiencia...',
                        initializing: 'Inicializando...',
                        loadingAssets: 'Cargando Recursos...',
                        preparingExperience: 'Preparando Experiencia...',
                        ready: '¡Listo!'
                    },
                    footer: {
                        copyright: 'Copyright ©',
                        fullStack: 'Desarrollador Full Stack'
                    }
                },
                v1: {
                    nav: {
                        hub: 'Hub',
                        skills: 'Habilidades',
                        projects: 'Proyectos',
                        techStack: 'Stack Tecnológico',
                        links: 'Enlaces',
                        contact: 'Contacto'
                    },
                    hero: {
                        subtitle: 'Desarrollador con más de 8 años de experiencia construyendo aplicaciones y soluciones de software escalables.',
                        role: 'Desarrollador Full Stack',
                        links: 'Enlaces',
                        contact: 'Contacto'
                    },
                    sections: {
                        skills: 'Habilidades',
                        projects: 'Proyectos Destacados',
                        techStack: 'Stack Tecnológico'
                    },
                    search: {
                        placeholder: 'Buscar proyectos...',
                        sections: 'Secciones',
                        projects: 'Proyectos',
                        skills: 'Habilidades'
                    },
                    filters: {
                        all: 'Todos',
                        cpp: 'C++',
                        cms: 'CMS',
                        dotnet: '.NET',
                        ecommerce: 'E-commerce',
                        flutter: 'Flutter',
                        javascript: 'JavaScript',
                        python: 'Python',
                        php: 'PHP',
                        react: 'React',
                        wordpress: 'WordPress'
                    },
                    project: {
                        viewDetails: 'Ver Detalles',
                        close: 'Cerrar',
                        previous: 'Anterior',
                        next: 'Siguiente',
                        technologies: 'Tecnologías',
                        category: 'Categoría',
                        description: 'Descripción'
                    },
                    footer: {
                        fullStack: 'Desarrollador Full Stack'
                    }
                },
                v2: {
                    nav: {
                        hub: 'Hub',
                        skills: 'Habilidades',
                        projects: 'Proyectos',
                        contact: 'Contacto'
                    },
                    hero: {
                        badge: 'Disponible para Proyectos',
                        role: 'Desarrollador Full Stack',
                        description: 'Desarrollador con más de 8 años de experiencia construyendo aplicaciones y soluciones de software escalables.',
                        viewLinks: 'Ver Enlaces',
                        getInTouch: 'Contactar'
                    },
                    sections: {
                        skills: {
                            title: 'Habilidades y Experiencia',
                            subtitle: 'Tecnologías con las que trabajo'
                        },
                        projects: {
                            title: 'Proyectos Destacados',
                            subtitle: 'Una selección de mi trabajo reciente'
                        }
                    },
                    search: {
                        placeholder: 'Buscar...'
                    },
                    filters: {
                        all: 'Todos',
                        cpp: 'C++',
                        cms: 'CMS',
                        dotnet: '.NET',
                        ecommerce: 'E-commerce',
                        flutter: 'Flutter',
                        javascript: 'JavaScript',
                        python: 'Python',
                        php: 'PHP',
                        react: 'React',
                        wordpress: 'WordPress'
                    },
                    project: {
                        viewDetails: 'Ver Detalles',
                        close: 'Cerrar',
                        previous: 'Anterior',
                        next: 'Siguiente',
                        technologies: 'Tecnologías',
                        category: 'Categoría',
                        description: 'Descripción'
                    },
                    footer: {
                        fullStack: 'Desarrollador Full Stack'
                    }
                }
            }
        };
    }

    detectLanguage() {
        const stored = localStorage.getItem('language');
        if (stored && (stored === 'eng' || stored === 'spn')) {
            return stored;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('es') ? 'spn' : 'eng';
    }

    setLanguage(lang) {
        if (lang === 'eng' || lang === 'spn') {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.setAttribute('lang', lang === 'eng' ? 'en' : 'es');
            this.updatePage();
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    t(key, version = 'hub') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        if (version !== 'hub') {
            value = value[version];
        } else {
            value = value.hub;
        }
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return typeof value === 'string' ? value : key;
    }

    updatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const version = element.getAttribute('data-i18n-version') || 'hub';
            const text = this.t(key, version);
            
            if (!text || text === key) {
                return;
            }
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = text;
            } else if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        });

        const typewriterElements = document.querySelectorAll('[data-i18n-typewriter]');
        typewriterElements.forEach(element => {
            const key = element.getAttribute('data-i18n-typewriter');
            const version = element.getAttribute('data-i18n-version') || 'hub';
            const text = this.t(key, version);
            
            if (element.hasAttribute('data-text')) {
                element.setAttribute('data-text', text);
            }
        });
    }

    init() {
        const lang = this.currentLanguage === 'eng' ? 'en' : 'es';
        document.documentElement.setAttribute('lang', lang);
        this.updatePage();
    }
}

const i18n = new I18n();

