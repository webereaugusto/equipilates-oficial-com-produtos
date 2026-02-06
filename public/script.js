// ==========================================
// EQUIPILATES - ADVANCED SCROLL EXPERIENCE
// ==========================================

let currentScroll = 0;
let targetScroll = 0;
let ease = 0.075;

// ==========================================
// ELASTIC SLIDE ANIMATIONS
// ==========================================
function initElasticAnimations() {
    const slideElements = document.querySelectorAll('.slide-left, .slide-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    slideElements.forEach(el => observer.observe(el));
}

// ==========================================
// FIGMA-STYLE MOTION DESIGN
// ==========================================
function initFigmaMotion() {
    // Reveal animations for all scroll elements
    const revealElements = document.querySelectorAll('[data-scroll-reveal], [data-scroll-scale], [data-scroll-fade]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Magnetic button effect
    const buttons = document.querySelectorAll('.cta-primary, .cta-secondary');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // Ripple effect on click
    const clickables = document.querySelectorAll('.benefit-card, .product-card, .gallery-item, .testimonial-clean, .cta-primary');
    clickables.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Stats reveal animation
    const statsItems = document.querySelectorAll('.stat-item');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.3
    });
    
    statsItems.forEach(item => statsObserver.observe(item));
}

// ==========================================
// PARALLAX SCROLL EFFECT
// ==========================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (inView) {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed * 0.5);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ==========================================
// SMOOTH SCROLL WITH MOMENTUM
// ==========================================
function initSmoothScrollMomentum() {
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.08;
    let isScrolling = false;
    
    function smoothScrollUpdate() {
        targetScroll = window.pageYOffset;
        currentScroll += (targetScroll - currentScroll) * ease;
        
        // Apply parallax effect during smooth scroll
        const diff = targetScroll - currentScroll;
        if (Math.abs(diff) > 0.5) {
            isScrolling = true;
            requestAnimationFrame(smoothScrollUpdate);
        } else {
            currentScroll = targetScroll;
            isScrolling = false;
        }
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            smoothScrollUpdate();
        }
        
        clearTimeout(scrollTimeout);
        document.body.classList.add('is-scrolling');
        
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });
}

// Init all
// ==========================================
// CARROSSEL LINHA CLÁSSICA
// ==========================================
function initClassicaCarousel() {
    const carousel = document.querySelector('.classica-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.classica-carousel-track');
    const slides = carousel.querySelectorAll('.classica-slide');
    const prevBtn = document.querySelector('.classica-prev');
    const nextBtn = document.querySelector('.classica-next');
    const dotsContainer = document.querySelector('.classica-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let slidesPerView = 3;
    let slideWidth = 0;
    let maxIndex = 0;
    let autoplayInterval;
    
    // Calcular slides por visualização baseado na tela
    function calculateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        maxIndex = Math.max(0, slides.length - slidesPerView);
    }
    
    // Calcular largura do slide
    function calculateSlideWidth() {
        // No mobile (1 slide), gap é 0; caso contrário, 30
        const gap = slidesPerView === 1 ? 0 : 30;
        const containerWidth = carousel.offsetWidth;
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
    }
    
    // Obter gap atual
    function getCurrentGap() {
        return slidesPerView === 1 ? 0 : 30;
    }
    
    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('classica-dot');
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Atualizar dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.classica-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const gap = getCurrentGap();
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }
    
    // Próximo slide
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Loop para o início
        }
    }
    
    // Slide anterior
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex); // Loop para o fim
        }
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    }, { passive: true });
    
    // Pausar autoplay no hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Resize handler
    function handleResize() {
        calculateSlidesPerView();
        calculateSlideWidth();
        createDots();
        goToSlide(Math.min(currentIndex, maxIndex));
    }
    
    window.addEventListener('resize', handleResize);
    
    // Inicialização
    calculateSlidesPerView();
    calculateSlideWidth();
    createDots();
    startAutoplay();
}

document.addEventListener('DOMContentLoaded', () => {
    // Funções críticas para o LCP (executar imediatamente)
    initNavigation();
    initHeroSlider();
    
    // Funções de baixa prioridade - adiar para depois do LCP
    // Isso reduz reflow forçado e melhora FCP/LCP
    const initNonCritical = () => {
        initScrollProgress();
        initUpgradeWizard();
        initStickyScroll();
        initHorizontalScroll();
        initTextReveal();
        initImageGridScale();
        initCounters();
        initInnovationCards();
        initSplitText();
        initFormAnimations();
        initSmoothScroll();
        initElasticAnimations();
        initFigmaMotion();
        initParallax();
        initSmoothScrollMomentum();
        initGalleryFilters();
        initFAQAccordion();
    };
    
    // Carrosséis são inicializados só quando visíveis (lazy init)
    const initCarousels = () => {
        initClassicaCarousel();
        initContemporaneaCarousel();
        initTestimonialsSocialCarousel();
    };
    
    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initNonCritical, { timeout: 2000 });
        requestIdleCallback(initCarousels, { timeout: 3000 });
    } else {
        setTimeout(initNonCritical, 100);
        setTimeout(initCarousels, 200);
    }
});

// ==========================================
// CARROSSEL LINHA CONTEMPORÂNEA
// ==========================================
function initContemporaneaCarousel() {
    const carousel = document.querySelector('.contemporanea-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.contemporanea-carousel-track');
    const slides = carousel.querySelectorAll('.contemporanea-slide');
    const prevBtn = document.querySelector('.contemporanea-prev');
    const nextBtn = document.querySelector('.contemporanea-next');
    const dotsContainer = document.querySelector('.contemporanea-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let slidesPerView = 3;
    let slideWidth = 0;
    let maxIndex = 0;
    let autoplayInterval;
    
    // Calcular slides por visualização baseado na tela
    function calculateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        maxIndex = Math.max(0, slides.length - slidesPerView);
    }
    
    // Calcular largura do slide
    function calculateSlideWidth() {
        // No mobile (1 slide), gap é 0; caso contrário, 30
        const gap = slidesPerView === 1 ? 0 : 30;
        const containerWidth = carousel.offsetWidth;
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
    }
    
    // Obter gap atual
    function getCurrentGap() {
        return slidesPerView === 1 ? 0 : 30;
    }
    
    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('contemporanea-dot');
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Atualizar dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.contemporanea-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const gap = getCurrentGap();
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }
    
    // Próximo slide
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Loop para o início
        }
    }
    
    // Slide anterior
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex); // Loop para o fim
        }
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    }, { passive: true });
    
    // Pausar autoplay no hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateSlidesPerView();
            calculateSlideWidth();
            createDots();
            goToSlide(Math.min(currentIndex, maxIndex));
        }, 250);
    });
    
    // Init
    calculateSlidesPerView();
    calculateSlideWidth();
    createDots();
    startAutoplay();
}

// ==========================================
// HERO AUTO SLIDER WITH FADE
// ==========================================
function initHeroSlider() {
    const hero = document.querySelector('.hero');
    const bgItems = document.querySelectorAll('.bg-item');
    const navDots = document.querySelectorAll('.nav-dot');
    const contentNumber = document.querySelector('.content-number');
    
    let currentIndex = 0;
    const totalSlides = 3;  // Reduzido de 4 para 3 para melhorar performance
    const autoPlayInterval = 9000; // 9 seconds per slide
    let autoPlayTimer = null;
    
    const WHATSAPP_NUMBER = '5521967329318';
    function buildWhatsAppLink(text) {
        const msg = encodeURIComponent(text);
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    }

    // Language + copy (embedded to work even on file://)
    const HERO_COPY = {
        'pt-BR': [
            {
                number: '01',
                tag: 'FÁBRICA LÍDER DESDE 2006',
                title: ['EQUIPAMENTOS DE PILATES', 'PROFISSIONAIS PARA SEU ESTÚDIO'],
                description: 'Linha Clássica e Contemporânea com 2 anos de garantia.<br/>Mais de 30.000 estúdios equipados em 24+ países.',
                cta1: { text: 'Solicitar Orçamento', link: buildWhatsAppLink('Olá, vim pelo site da Equipilates e gostaria de solicitar um orçamento.') },
                cta2: { text: 'Veja Mais', link: '#diferencial' }
            },
            {
                number: '02',
                tag: 'LINHA CLASSICA',
                title: ['FIDELIDADE TOTAL', 'AO LEGADO DE JOSEPH PILATES'],
                description: 'Equipamentos desenvolvidos rigorosamente nas medidas originais.<br/>O padrao ouro para o metodo classico.',
                cta1: { text: 'Ver Linha Classica', link: '#classic' },
                cta2: { text: 'Falar com Consultor', link: buildWhatsAppLink('Ola, quero entender a Linha Classica para meu estudio.') }
            },
            {
                number: '03',
                tag: 'LÍDER GLOBAL',
                title: ['A MAIOR FÁBRICA', 'DE PILATES DA AMÉRICA LATINA'],
                description: 'Desde 2006 exportando para 24+ países. Fábrica própria de 5.000m²<br/>com tecnologia de ponta em Resende-RJ.',
                cta1: { text: 'Veja Mais', link: '#diferencial' },
                cta2: { text: 'Falar com Especialista', link: buildWhatsAppLink('Olá, gostaria de conhecer mais sobre a Equipilates.') }
            }
        ],
        'en': [
            {
                number: '01',
                tag: 'LEADING FACTORY SINCE 2006',
                title: ['PILATES EQUIPMENT', 'PROFESSIONAL FOR YOUR STUDIO'],
                description: 'Classic and Contemporary Lines with 2-year warranty.<br/>Over 30,000 studios equipped in 24+ countries.',
                cta1: { text: 'Request a Quote', link: buildWhatsAppLink('Hello, I would like a quote for Pilates equipment.') },
                cta2: { text: 'See More', link: '#diferencial' }
            },
            {
                number: '02',
                tag: 'CLASSIC LINE',
                title: ['FULL FIDELITY', 'TO JOSEPH PILATES LEGACY'],
                description: 'Built strictly to the original measurements.<br/>The gold standard for classical method.',
                cta1: { text: 'See Classic Line', link: '#classic' },
                cta2: { text: 'Talk to a Consultant', link: buildWhatsAppLink('Hello, I want to understand the Classic Line for my studio.') }
            },
            {
                number: '03',
                tag: 'GLOBAL LEADER',
                title: ['THE LARGEST PILATES', 'FACTORY IN LATIN AMERICA'],
                description: 'Exporting to 24+ countries since 2006. Own 5,000m² factory<br/>with cutting-edge technology in Brazil.',
                cta1: { text: 'See More', link: '#diferencial' },
                cta2: { text: 'Talk to an Expert', link: buildWhatsAppLink('Hello, I would like to learn more about Equipilates.') }
            }
        ],
        'es': [
            {
                number: '01',
                tag: 'FÁBRICA LÍDER DESDE 2006',
                title: ['EQUIPOS DE PILATES', 'PROFESIONALES PARA SU ESTUDIO'],
                description: 'Línea Clásica y Contemporánea con 2 años de garantía.<br/>Más de 30.000 estudios equipados en 24+ países.',
                cta1: { text: 'Solicitar Cotización', link: buildWhatsAppLink('Hola, quisiera una cotización para equipos de Pilates.') },
                cta2: { text: 'Ver Más', link: '#diferencial' }
            },
            {
                number: '02',
                tag: 'LINEA CLASICA',
                title: ['FIDELIDAD TOTAL', 'AL LEGADO DE JOSEPH PILATES'],
                description: 'Equipos desarrollados estrictamente con medidas originales.<br/>El estandar de oro para el metodo clasico.',
                cta1: { text: 'Ver Linea Clasica', link: '#classic' },
                cta2: { text: 'Hablar con un Asesor', link: buildWhatsAppLink('Hola, quiero entender la Linea Clasica para mi estudio.') }
            },
            {
                number: '03',
                tag: 'LÍDER GLOBAL',
                title: ['LA MAYOR FÁBRICA', 'DE PILATES DE LATINOAMÉRICA'],
                description: 'Exportando a 24+ países desde 2006. Fábrica propia de 5.000m²<br/>con tecnología de punta en Brasil.',
                cta1: { text: 'Ver Más', link: '#diferencial' },
                cta2: { text: 'Hablar con Experto', link: buildWhatsAppLink('Hola, me gustaría conocer más sobre Equipilates.') }
            }
        ],
        'de': [
            {
                number: '01',
                tag: 'FÜHRENDE FABRIK SEIT 2006',
                title: ['PILATES-GERÄTE', 'PROFESSIONELL FÜR IHR STUDIO'],
                description: 'Klassische und Zeitgenössische Linien mit 2 Jahren Garantie.<br/>Über 30.000 Studios in 24+ Ländern ausgestattet.',
                cta1: { text: 'Angebot Anfordern', link: buildWhatsAppLink('Hallo, ich möchte ein Angebot für Pilates-Geräte.') },
                cta2: { text: 'Mehr Sehen', link: '#diferencial' }
            },
            {
                number: '02',
                tag: 'KLASSISCHE LINIE',
                title: ['TOTALE TREUE', 'ZUM VERMACHTNIS VON JOSEPH PILATES'],
                description: 'Gerate streng nach Originalmassen entwickelt.<br/>Der Goldstandard fur die klassische Methode.',
                cta1: { text: 'Klassische Linie Sehen', link: '#classic' },
                cta2: { text: 'Mit Berater Sprechen', link: buildWhatsAppLink('Hallo, ich mochte die Klassische Linie verstehen.') }
            },
            {
                number: '03',
                tag: 'GLOBALER MARKTFÜHRER',
                title: ['DIE GRÖSSTE PILATES-', 'FABRIK IN LATEINAMERIKA'],
                description: 'Seit 2006 in 24+ Länder exportierend. Eigene 5.000m² Fabrik<br/>mit modernster Technologie in Brasilien.',
                cta1: { text: 'Mehr Sehen', link: '#diferencial' },
                cta2: { text: 'Mit Experten Sprechen', link: buildWhatsAppLink('Hallo, ich möchte mehr über Equipilates erfahren.') }
            }
        ]
    };

    function getCurrentLang() {
        return localStorage.getItem('eq_lang') || 'pt-BR';
    }

    function setCurrentLang(lang) {
        localStorage.setItem('eq_lang', lang);
    }

    function getSlidesForLang(lang) {
        return HERO_COPY[lang] || HERO_COPY['pt-BR'];
    }

    function applyLangUI(lang) {
        // Update desktop lang buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                const label = btn.dataset.label || btn.textContent?.trim() || '';
                const toggle = document.querySelector('.lang-toggle');
                const toggleLabel = toggle?.querySelector('.lang-toggle-label');
                if (toggleLabel) toggleLabel.textContent = label;
            }
        });
        // Update mobile lang bar buttons
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
    }

    function applyI18nStrings(lang) {
        // Always use changeLanguage from i18n.js which loads JSON files
        if (typeof window.changeLanguage === 'function') {
            window.changeLanguage(lang);
        }
    }

    // i18n translations are loaded from i18n.js
    // const I18N is defined there
    
    function updateContent(index, opts = { animate: true }) {
        const lang = getCurrentLang();
        const slides = getSlidesForLang(lang);
        const slide = slides[index];
        
        // Update number with modern animation
        contentNumber.style.opacity = '0';
        contentNumber.style.transform = 'scale(0.8) rotate(-10deg)';
        setTimeout(() => {
            contentNumber.textContent = slide.number;
            contentNumber.style.opacity = '1';
            contentNumber.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        // Get elements
        const tag = document.querySelector('.content-tag');
        const titleLines = document.querySelectorAll('.title-line');
        const description = document.querySelector('.content-description');
        const ctaContainer = document.querySelector('.content-cta');
        const ctas = document.querySelectorAll('.content-cta a');
        
        // Update content immediately (used on first load / language switch)
        const applyText = () => {
            tag.textContent = slide.tag;
            titleLines[0].textContent = slide.title[0];
            titleLines[1].textContent = slide.title[1];
            description.innerHTML = slide.description;
            ctas[0].innerHTML = `<span>${slide.cta1.text}</span><div class="btn-arrow">&rarr;</div>`;
            ctas[0].href = slide.cta1.link;
            ctas[0].setAttribute('target', slide.cta1.link.startsWith('http') ? '_blank' : '_self');
            ctas[0].setAttribute('rel', slide.cta1.link.startsWith('http') ? 'noopener' : '');
            ctas[1].textContent = slide.cta2.text;
            ctas[1].href = slide.cta2.link;
            ctas[1].setAttribute('target', slide.cta2.link.startsWith('http') ? '_blank' : '_self');
            ctas[1].setAttribute('rel', slide.cta2.link.startsWith('http') ? 'noopener' : '');
        };

        if (!opts.animate) {
            applyText();
            return;
        }

        // Remove motion-in class to reset
        tag.classList.remove('motion-in');
        titleLines.forEach(line => line.classList.remove('motion-in'));
        description.classList.remove('motion-in');
        ctaContainer.classList.remove('motion-in-reverse');

        // Trigger reflow to restart animation
        void tag.offsetWidth;

        setTimeout(() => {
            applyText();

            // Add motion classes with stagger
            setTimeout(() => tag.classList.add('motion-in'), 100);
            setTimeout(() => titleLines[0].classList.add('motion-in'), 200);
            setTimeout(() => titleLines[1].classList.add('motion-in'), 350);
            setTimeout(() => description.classList.add('motion-in'), 500);
            setTimeout(() => ctaContainer.classList.add('motion-in-reverse'), 650);
        }, 260);
    }
    
    function goToSlide(index) {
        if (index === currentIndex || index < 0 || index >= totalSlides) return;
        
        // Remove active from current slide
        bgItems[currentIndex].classList.remove('active');
        navDots[currentIndex].classList.remove('active');
        
        // Add active to new slide
        bgItems[index].classList.add('active');
        navDots[index].classList.add('active');
        
        currentIndex = index;
        updateContent(index);
        
        // Reset auto-play timer
        resetAutoPlay();
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        }, autoPlayInterval);
    }
    
    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(prev);
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const next = (currentIndex + 1) % totalSlides;
            goToSlide(next);
        }
    });
    
    // Touch support - swipe left/right
    let touchStartX = 0;
    let touchEndX = 0;
    
    hero.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay(); // Stop auto-play on touch
    }, { passive: true });
    
    hero.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next slide
                const next = (currentIndex + 1) % totalSlides;
                goToSlide(next);
            } else {
                // Swipe right - prev slide
                const prev = (currentIndex - 1 + totalSlides) % totalSlides;
                goToSlide(prev);
            }
        } else {
            startAutoPlay(); // Resume auto-play if no swipe
        }
    }, { passive: true });
    
    // Click on dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Navigation arrows
    const prevBtn = document.querySelector('.hero-arrow-prev');
    const nextBtn = document.querySelector('.hero-arrow-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(prev);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = (currentIndex + 1) % totalSlides;
            goToSlide(next);
        });
    }
    
    // Initialize first slide content with animations
    function initFirstSlide() {
        const lang = getCurrentLang();
        applyLangUI(lang);
        applyI18nStrings(lang);
        updateContent(0, { animate: false });

        const tag = document.querySelector('.content-tag');
        const titleLines = document.querySelectorAll('.title-line');
        const description = document.querySelector('.content-description');
        const ctaContainer = document.querySelector('.content-cta');

        // LCP FIX: Conteúdo já está visível via CSS
        // Apenas preparamos as classes para animações de transição entre slides
        // Adicionamos animate-ready após 2s para permitir transições futuras
        setTimeout(() => {
            tag.classList.add('animate-ready', 'motion-in');
            titleLines[0].classList.add('animate-ready', 'motion-in');
            titleLines[1].classList.add('animate-ready', 'motion-in');
            description.classList.add('animate-ready', 'motion-in');
            ctaContainer.classList.add('motion-in-reverse');
        }, 2000);
    }
    
    // Initialize first slide on load
    initFirstSlide();

    // Language switch (desktop - dropdown)
    const langDropdown = document.querySelector('.lang-dropdown');
    const langToggle = langDropdown?.querySelector('.lang-toggle');
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setCurrentLang(lang);
            applyLangUI(lang);
            applyI18nStrings(lang);
            updateContent(currentIndex, { animate: false });
            if (langDropdown && langDropdown.classList.contains('open')) {
                langDropdown.classList.remove('open');
                langToggle?.setAttribute('aria-expanded', 'false');
            }
        });
    });

    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = langDropdown.classList.toggle('open');
            langToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', (event) => {
            if (!langDropdown.contains(event.target)) {
                if (langDropdown.classList.contains('open')) {
                    langDropdown.classList.remove('open');
                    langToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Language switch (mobile app-style bar)
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setCurrentLang(lang);
            applyLangUI(lang);
            applyI18nStrings(lang);
            updateContent(currentIndex, { animate: false });
        });
    });

    // Hide mobile lang bar on scroll
    const mobileLangBar = document.querySelector('.mobile-lang-bar');
    if (mobileLangBar) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const handleLangBarScroll = () => {
            const currentScrollY = window.scrollY;
            // Hide after scrolling 80px
            if (currentScrollY > 80) {
                mobileLangBar.classList.add('hidden');
            } else {
                mobileLangBar.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleLangBarScroll);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Start auto-play on load
    startAutoPlay();
    
    // Pause auto-play when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
}

// ==========================================
// CUSTOM CURSOR
// ==========================================

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let lastScroll = 0;
    
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Hamburger menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu when clicking on overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            closeMenu();
        });
    }
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Hide nav on scroll down, show on scroll up
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        
        // Add/remove scrolled class based on hero section position
        if (currentScroll > heroHeight * 0.8) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            nav.classList.add('hidden');
            // Close menu if open when scrolling
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// INTERACTIVE GALLERY FILTERING (Dinâmico via Supabase)
// ==========================================
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.getElementById('btnLoadMore');
    
    if (!galleryGrid) return;
    
    // Configurações
    const INITIAL_ITEMS = 8;
    const ITEMS_PER_LOAD = 8;
    let visibleCount = INITIAL_ITEMS;
    let currentFilter = 'all';
    
    // Supabase config (chaves públicas - seguras para frontend)
    const SUPABASE_URL = 'https://hijmbsxcvcugnmkvldgl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpam1ic3hjdmN1Z25ta3ZsZGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzk1MzUsImV4cCI6MjA4NDI1NTUzNX0.Q4Hy-K8RxhVDCarj_ojD5ILb11iO4Jk7KC-5fYlrTh0';
    
    // Mapeamento de slug de categoria para classe de filtro
    const categoryMap = {
        'linha-classica': { filterClass: 'classica', label: 'LINHA CLÁSSICA' },
        'linha-contemporanea': { filterClass: 'contemporanea', label: 'LINHA CONTEMPORÂNEA' },
        'acessorios': { filterClass: 'acessorios', label: 'ACESSÓRIOS' }
    };
    
    // Fallback de imagens estáticas locais para produtos sem foto no Supabase
    var staticImageMap = {
        'arm-chair': 'images/linha-classic/arm-chair.webp',
        'bench-mat': 'images/linha-classic/bench-mat.webp',
        'cadillac-aluminum': 'images/linha-classic/cadillac aluminio.webp',
        'electric-chair': 'images/linha-classic/electric chair.webp',
        'guilotina-aluminum': 'images/linha-classic/guilhotina.webp',
        'ladder-barrel-classico': 'images/linha-classic/lader barrel.webp',
        'mat-classico': 'images/linha-classic/mat.webp',
        'mat-portatil': 'images/linha-classic/mat portatil.webp',
        'reformer-86-aluminum': 'images/linha-classic/reformer aluminium.webp',
        'reformer-torre-aluminum': 'images/linha-classic/reformer aluminium.webp',
        'ladder-barrel': 'images/linha-contemporanea/ladder-barrel.webp',
        'prancha-de-molas': 'images/linha-contemporanea/prancha-de-molas.webp',
        'reformer': 'images/linha-contemporanea/reformer.webp',
        'reformer-torre': 'images/linha-contemporanea/reformer-torre.webp',
        'step-chair': 'images/linha-contemporanea/step-chair.webp'
    };
    
    // Fisher-Yates shuffle
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    var galleryRendered = false;
    
    // Buscar produtos do Supabase e renderizar
    async function loadGalleryFromSupabase() {
        try {
            // Verificar se Supabase SDK carregou
            if (typeof supabase === 'undefined' || !supabase.createClient) {
                console.warn('Supabase SDK não carregado, tentando novamente...');
                setTimeout(loadGalleryFromSupabase, 200);
                return;
            }
            
            var sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            // Buscar produtos ativos com categoria
            var prodResult = await sb
                .from('products')
                .select('id, title, slug, category:categories(name, slug)')
                .eq('is_active', true)
                .order('order_index');
            
            if (prodResult.error) throw prodResult.error;
            var products = prodResult.data || [];
            
            // Buscar imagens dos produtos
            var imgResult = await sb
                .from('product_images')
                .select('product_id, url, is_primary')
                .order('order_index');
            
            if (imgResult.error) throw imgResult.error;
            var images = imgResult.data || [];
            
            // Mapear imagem principal por produto
            var imageMap = {};
            images.forEach(function(img) {
                if (!imageMap[img.product_id] || img.is_primary) {
                    imageMap[img.product_id] = img.url;
                }
            });
            
            // Limpar skeletons
            galleryGrid.innerHTML = '';
            
            // Embaralhar produtos
            var shuffled = shuffleArray(products);
            
            // Gerar cards HTML
            shuffled.forEach(function(product) {
                var catSlug = product.category ? product.category.slug : '';
                var catInfo = categoryMap[catSlug] || { filterClass: 'outros', label: catSlug.toUpperCase() };
                var imgUrl = imageMap[product.id] || staticImageMap[product.slug];
                if (!imgUrl) return; // Pular se sem nenhuma imagem
                
                var item = document.createElement('a');
                item.href = '/produtos/' + product.slug;
                item.className = 'gallery-item ' + catInfo.filterClass;
                item.innerHTML = 
                    '<div class="gallery-img-wrapper">' +
                        '<img src="' + imgUrl + '" alt="Equipamentos de Pilates - ' + product.title + ' Equipilates" loading="lazy">' +
                        '<div class="gallery-overlay">' +
                            '<span class="gallery-cat">' + catInfo.label + '</span>' +
                            '<h3 class="gallery-title">' + product.title + '</h3>' +
                        '</div>' +
                    '</div>';
                
                galleryGrid.appendChild(item);
            });
            
            // Inicializar filtros e visibilidade
            galleryRendered = true;
            setupFiltersAndVisibility();
            
            // Cache no sessionStorage para próxima visita
            try {
                sessionStorage.setItem('gallery_cache', JSON.stringify({
                    products: shuffled,
                    imageMap: imageMap,
                    timestamp: Date.now()
                }));
            } catch(e) { /* silenciar erros de storage */ }
            
        } catch (err) {
            console.error('Erro ao carregar galeria:', err);
            // Só mostrar erro se não tiver conteúdo já renderizado (cache)
            if (!galleryRendered) {
                galleryGrid.innerHTML = '<p style="text-align:center;color:#999;grid-column:1/-1;padding:40px 0;">Erro ao carregar produtos. Tente recarregar a página.</p>';
            }
        }
    }
    
    // Renderizar do cache
    function renderFromCache(cached) {
        galleryGrid.innerHTML = '';
        galleryRendered = true;
        
        cached.products.forEach(function(product) {
            var catSlug = product.category ? product.category.slug : '';
            var catInfo = categoryMap[catSlug] || { filterClass: 'outros', label: catSlug.toUpperCase() };
            var imgUrl = cached.imageMap[product.id] || staticImageMap[product.slug];
            if (!imgUrl) return; // Pular se sem nenhuma imagem
            
            var item = document.createElement('a');
            item.href = '/produtos/' + product.slug;
            item.className = 'gallery-item ' + catInfo.filterClass;
            item.innerHTML = 
                '<div class="gallery-img-wrapper">' +
                    '<img src="' + imgUrl + '" alt="Equipamentos de Pilates - ' + product.title + ' Equipilates" loading="lazy">' +
                    '<div class="gallery-overlay">' +
                        '<span class="gallery-cat">' + catInfo.label + '</span>' +
                        '<h3 class="gallery-title">' + product.title + '</h3>' +
                    '</div>' +
                '</div>';
            
            galleryGrid.appendChild(item);
        });
        
        setupFiltersAndVisibility();
    }
    
    // Configurar filtros e visibilidade
    function setupFiltersAndVisibility() {
        // Re-buscar botão no DOM (pode ter sido substituído)
        var currentLoadMoreBtn = document.getElementById('btnLoadMore');
        
        // Obter itens filtrados
        function getFilteredItems() {
            var currentItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
            return currentItems.filter(function(item) {
                if (currentFilter === 'all') return true;
                return item.classList.contains(currentFilter);
            });
        }
        
        // Atualizar visibilidade
        function updateGalleryVisibility() {
            var filteredItems = getFilteredItems();
            var allItems = galleryGrid.querySelectorAll('.gallery-item');
            
            // Remover mensagem de vazio anterior, se existir
            var emptyMsg = galleryGrid.querySelector('.gallery-empty-msg');
            if (emptyMsg) emptyMsg.remove();
            
            allItems.forEach(function(item) {
                item.classList.add('gallery-hidden');
                item.classList.remove('gallery-reveal');
            });
            
            // Se não há produtos nesta categoria, mostrar mensagem
            if (filteredItems.length === 0) {
                var msg = document.createElement('p');
                msg.className = 'gallery-empty-msg';
                msg.textContent = 'Sem produtos ativos no momento';
                galleryGrid.appendChild(msg);
            }
            
            filteredItems.forEach(function(item, index) {
                if (index < visibleCount) {
                    item.classList.remove('gallery-hidden');
                }
            });
            
            if (currentLoadMoreBtn) {
                if (filteredItems.length === 0 || visibleCount >= filteredItems.length) {
                    currentLoadMoreBtn.classList.add('hidden');
                } else {
                    currentLoadMoreBtn.classList.remove('hidden');
                }
            }
        }
        
        // Carregar mais
        function loadMoreItems() {
            var filteredItems = getFilteredItems();
            var previousCount = visibleCount;
            visibleCount = Math.min(visibleCount + ITEMS_PER_LOAD, filteredItems.length);
            
            filteredItems.forEach(function(item, index) {
                if (index >= previousCount && index < visibleCount) {
                    item.classList.remove('gallery-hidden');
                    item.classList.add('gallery-reveal');
                }
            });
            
            if (currentLoadMoreBtn && visibleCount >= filteredItems.length) {
                currentLoadMoreBtn.classList.add('hidden');
            }
        }
        
        // Inicializar
        visibleCount = INITIAL_ITEMS;
        updateGalleryVisibility();
        
        // Event listener para "Carregar mais" (clonar para limpar listeners antigos)
        if (currentLoadMoreBtn && currentLoadMoreBtn.parentNode) {
            var newBtn = currentLoadMoreBtn.cloneNode(true);
            currentLoadMoreBtn.parentNode.replaceChild(newBtn, currentLoadMoreBtn);
            currentLoadMoreBtn = newBtn;
            newBtn.addEventListener('click', loadMoreItems);
        }
        
        // Limpar e re-registrar listeners dos filtros
        filterBtns.forEach(function(btn) {
            if (!btn || !btn.parentNode) return;
            var newFilterBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newFilterBtn, btn);
        });
        // Re-buscar filtros após clonagem
        var freshFilterBtns = document.querySelectorAll('.filter-btn');
        freshFilterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                freshFilterBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                visibleCount = INITIAL_ITEMS;
                updateGalleryVisibility();
            });
        });
    }
    
    // Verificar cache (válido por 5 minutos)
    try {
        var cached = sessionStorage.getItem('gallery_cache');
        if (cached) {
            cached = JSON.parse(cached);
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
                renderFromCache(cached);
                // Atualizar em background silenciosamente
                loadGalleryFromSupabase();
                return;
            }
        }
    } catch(e) { /* sem cache, carrega normalmente */ }
    
    // Carregar do Supabase
    loadGalleryFromSupabase();
}

// ==========================================
// UPGRADE WIZARD (MVP)
// ==========================================
function initUpgradeWizard() {
    const form = document.getElementById('upgradeWizard');
    if (!form) return;

    const spaceEl = document.getElementById('wiz-space');
    const goalEl = document.getElementById('wiz-goal');
    const currentEl = document.getElementById('wiz-current');
    const resultEl = document.getElementById('wizardResult');
    const leadEl = document.getElementById('wizardLead');
    const secondaryBtn = document.getElementById('wizardSecondaryCta');
    const mailtoBtn = document.getElementById('wizardMailtoCta');

    const WHATSAPP_NUMBER = '5521967329318';
    const wa = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    const kitBySpace = {
        'Ate 25m2': ['Reformer', 'Chair', 'Acessorios'],
        '25-40m2': ['Reformer', 'Cadillac (ou Tower)', 'Chair'],
        '40-70m2': ['2x Reformers', 'Cadillac', 'Chair + acessorios'],
        '70m2+': ['3-4x Reformers', 'Cadillac', 'Barrels + acessorios']
    };

    function recommend(space, goal, current) {
        const base = kitBySpace[space] || ['Reformer', 'Cadillac', 'Chair'];
        let focus = '';
        if (/reabilita|fisioterapia/i.test(goal)) focus = 'Foco em reabilitacao: priorize Cadillac + acessorios terapeuticos.';
        if (/reduzir manuten/i.test(goal)) focus = 'Upgrade para reduzir manutencao: avalie troca de molas, estofamento e revisao de componentes.';
        if (/contempor/i.test(goal)) focus = 'Linha contemporanea: layout moderno, robustez e design avancado para performance e experiencia premium.';
        if (/capacidade/i.test(goal)) focus = 'Expansao: mais estacoes = mais horarios e melhor previsibilidade de agenda.';

        const currentStr = (current || '').trim();
        const currentNote = currentStr ? `Equipamentos atuais: ${currentStr}` : 'Equipamentos atuais: nao informado';
        return {
            kitTitle: 'Sugestao inicial de kit (ponto de partida):',
            kit: base,
            focus,
            note: currentNote
        };
    }

    function setResultHtml(rec) {
        resultEl.classList.add('active');
        resultEl.innerHTML = `
            <strong>${rec.kitTitle}</strong>
            <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:10px;">
                ${rec.kit.map(i => `<span style="display:inline-flex; padding:8px 12px; border-radius:999px; background: rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.08); font-weight:700; font-size:13px;">${i}</span>`).join('')}
            </div>
            <div style="margin-top:12px; color:#2b2b2b; font-size:14px; line-height:1.7;">${rec.focus || ''}</div>
            <div style="margin-top:10px; color:#404040; font-size:13px;">${rec.note}</div>
        `;
    }

    function buildMessage(space, goal, current, rec) {
        return [
            'Ola, vim pelo site da Equipilates e quero ajuda para planejar meu upgrade.',
            '',
            `Espaco: ${space}`,
            `Objetivo: ${goal}`,
            `Equipamentos atuais: ${(current || 'nao informado').trim() || 'nao informado'}`,
            '',
            `Sugestao inicial (site): ${rec.kit.join(', ')}.`,
            'Podem me orientar com kit ideal e layout?'
        ].join('\n');
    }

    secondaryBtn?.addEventListener('click', () => {
        leadEl.hidden = !leadEl.hidden ? true : false;
        if (!leadEl.hidden) {
            leadEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    mailtoBtn?.addEventListener('click', () => {
        const space = spaceEl.value;
        const goal = goalEl.value;
        const current = currentEl.value;
        if (!space || !goal) return;
        const rec = recommend(space, goal, current);
        const name = (document.getElementById('wiz-name')?.value || '').trim();
        const email = (document.getElementById('wiz-email')?.value || '').trim();
        const subject = encodeURIComponent('Equipilates | Upgrade do estudio - dados do Wizard');
        const body = encodeURIComponent([
            name ? `Nome: ${name}` : '',
            email ? `Email: ${email}` : '',
            '',
            buildMessage(space, goal, current, rec)
        ].filter(Boolean).join('\n'));
        window.location.href = `mailto:email@equipilates.com.br?subject=${subject}&body=${body}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const space = spaceEl.value;
        const goal = goalEl.value;
        const current = currentEl.value;
        if (!space || !goal) return;

        const rec = recommend(space, goal, current);
        setResultHtml(rec);

        const link = wa(buildMessage(space, goal, current, rec));
        window.open(link, '_blank', 'noopener');
    });
}

// ==========================================
// SCROLL PROGRESS
// ==========================================
function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progress.style.width = scrolled + '%';
    });
}

// Parallax for slide backgrounds
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const activeSlide = hero.querySelector('.hero-slide.active .slide-bg img');
        if (activeSlide) {
            activeSlide.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
        }
    }
});

// ==========================================
// STICKY SCROLL EFFECTS
// ==========================================
function initStickyScroll() {
    const sections = document.querySelectorAll('.sticky-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate split chars
                const splitChars = entry.target.querySelectorAll('.split-chars');
                splitChars.forEach(el => animateSplitChars(el));
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
}

function animateSplitChars(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    const text = element.textContent;
    element.textContent = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100px) rotate(10deg)';
        span.style.transition = `all 0.6s cubic-bezier(0.75, 0, 0.27, 1) ${index * 0.03}s`;
        element.appendChild(span);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0) rotate(0)';
            });
        });
    });
}

// ==========================================
// HORIZONTAL SCROLL
// ==========================================
function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-scroll');
    if (!section) return;
    
    const content = document.querySelector('.horizontal-content');
    
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const scrollPercentage = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        
        if (rect.top < 0 && rect.bottom > window.innerHeight) {
            const maxScroll = content.scrollWidth - window.innerWidth;
            const scrollAmount = scrollPercentage * maxScroll;
            content.style.transform = `translateX(-${scrollAmount}px)`;
        }
    });
}

// ==========================================
// TEXT REVEAL
// ==========================================
function initTextReveal() {
    const reveals = document.querySelectorAll('[data-scroll-reveal]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    reveals.forEach(el => observer.observe(el));
}

// ==========================================
// IMAGE GRID SCALE
// ==========================================
function initImageGridScale() {
    const items = document.querySelectorAll('[data-scroll-scale]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'scale(0.8)';
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.75, 0, 0.27, 1)';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    items.forEach(item => observer.observe(item));
}

// ==========================================
// COUNTERS
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.dataset.suffix || '';
        const separator = counter.dataset.separator || '';
        const duration = 1500;
        
        // Start from 85% of target - only count last few numbers
        const startValue = Math.floor(target * 0.85);
        const range = target - startValue;
        const startTime = performance.now();
        
        const formatNumber = (num) => {
            if (separator && num >= 1000) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            }
            return num.toString();
        };
        
        // Show start value immediately
        counter.textContent = formatNumber(startValue) + suffix;
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth finish
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (easeOutQuart * range));
            
            counter.textContent = formatNumber(currentValue) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = formatNumber(target) + suffix;
            }
        };
        
        requestAnimationFrame(update);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// INNOVATION CARDS FADE
// ==========================================
function initInnovationCards() {
    const cards = document.querySelectorAll('[data-scroll-fade]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(card => observer.observe(card));
}

// ==========================================
// SPLIT TEXT ANIMATION
// ==========================================
function initSplitText() {
    const elements = document.querySelectorAll('.split-text');
    
    elements.forEach(el => {
        const lines = el.querySelectorAll('.line');
        
        lines.forEach((line, index) => {
            const span = document.createElement('span');
            span.textContent = line.textContent;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(100%)';
            line.textContent = '';
            line.appendChild(span);
        });
    });
}

// ==========================================
// FORM ANIMATIONS
// ==========================================
function initFormAnimations() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(10px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.querySelector('span').textContent;
        
        btn.querySelector('span').textContent = 'ENVIANDO...';
        btn.disabled = true;
        btn.style.transform = 'scale(0.95)';
        
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        btn.querySelector('span').textContent = 'ENVIADO Ô£ô';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            form.reset();
            btn.querySelector('span').textContent = originalText;
            btn.disabled = false;
            btn.style.transform = 'scale(1)';
            btn.style.background = '';
        }, 3000);
    });
}

// ==========================================
// SMOOTH SCROLL TO ANCHOR
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Verifica se o href ATUAL ainda começa com # (pode ter mudado dinamicamente)
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // Se não começar com #, deixa o comportamento padrão (ex: abrir WhatsApp)
        });
    });
}

// ==========================================
// PARALLAX ON SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax backgrounds
    document.querySelectorAll('.sticky-bg').forEach(bg => {
        const section = bg.closest('.sticky-section');
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        
        if (progress >= 0 && progress <= 1) {
            bg.style.transform = `scale(1.1) translateY(${progress * 100}px)`;
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR FADE IN
// ==========================================
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            entry.target.style.transition = 'all 1s cubic-bezier(0.75, 0, 0.27, 1)';
            
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            });
            
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(el => fadeObserver.observe(el));

// ==========================================
// MOUSE MOVE PARALLAX
// Parallax effect removed per user request

// ==========================================
// DUPLICATE TESTIMONIALS FOR INFINITE SCROLL
// ==========================================
const testimonialTrack = document.querySelector('.testimonials-track');
if (testimonialTrack) {
    const clone = testimonialTrack.cloneNode(true);
    testimonialTrack.parentElement.appendChild(clone);
}

// ==========================================
// IMAGE LAZY LOAD
// ==========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// PERFORMANCE: RAF THROTTLE
// ==========================================
let rafPending = false;
window.addEventListener('scroll', () => {
    if (!rafPending) {
        requestAnimationFrame(() => {
            rafPending = false;
        });
        rafPending = true;
    }
}, { passive: true });

// ==========================================
// LOADING ANIMATION
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// 3D TILT CARDS
// ==========================================
document.querySelectorAll('.innovation-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
document.querySelectorAll('.submit-btn, .nav-menu a').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log('%c EQUIPILATES ', 'font-size: 50px; font-weight: bold; background: linear-gradient(135deg, #00F5FF, #FF00FF); padding: 20px; color: white;');
console.log('%c­ƒÜÇ Website desenvolvido com tecnologia de ponta', 'font-size: 16px; color: #00F5FF;');
console.log('%c­ƒÆ£ Scroll experience by EquiPilates', 'font-size: 14px; color: #FF00FF;');

// ==========================================
// DEBUG MODE
// ==========================================
if (window.location.search.includes('debug')) {
    document.body.style.outline = '2px solid red';
    console.log('Debug mode enabled');
    
    document.querySelectorAll('section').forEach((section, index) => {
        const label = document.createElement('div');
        label.textContent = `Section ${index + 1}`;
        label.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            padding: 10px;
            font-size: 12px;
            z-index: 10000;
        `;
        section.style.position = 'relative';
        section.appendChild(label);
    });
}

// ==========================================
// CARROSSEL TESTIMONIALS SOCIAL STYLE
// ==========================================
function initTestimonialsSocialCarousel() {
    const wrapper = document.querySelector('.testimonials-social-wrapper');
    if (!wrapper) return;
    
    const track = wrapper.querySelector('.testimonials-social-track');
    const cards = wrapper.querySelectorAll('.testimonial-social-card');
    const dotsContainer = document.querySelector('.testimonials-social-dots');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    let cardsPerView = 3;
    let cardWidth = 0;
    let maxIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000;
    
    // Calcular cards por visualização baseado na tela
    function calculateCardsPerView() {
        if (window.innerWidth >= 1024) {
            cardsPerView = 3;
        } else if (window.innerWidth >= 768) {
            cardsPerView = 2;
        } else {
            cardsPerView = 1;
        }
        maxIndex = Math.max(0, cards.length - cardsPerView);
    }
    
    // Calcular largura do card
    function calculateCardWidth() {
        const gap = 30;
        const containerWidth = wrapper.offsetWidth;
        cardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
        
        // Aplicar largura aos cards
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });
    }
    
    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Atualizar dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const gap = 30;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }
    
    // Próximo slide
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }
    
    // Slide anterior
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(maxIndex);
        }
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Não pausar no hover - autoplay contínuo
    
    // Touch/Swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoplay();
    }, { passive: true });
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateCardsPerView();
            calculateCardWidth();
            createDots();
            goToSlide(Math.min(currentIndex, maxIndex));
        }, 250);
    });
    
    // Inicialização
    calculateCardsPerView();
    calculateCardWidth();
    createDots();
    startAutoplay();
}

// ==========================================
// FAQ ACCORDION
// ==========================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Se não estava ativo, abre o clicado
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

