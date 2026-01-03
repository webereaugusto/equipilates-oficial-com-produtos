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
        const gap = 30;
        const containerWidth = carousel.offsetWidth;
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
    }
    
    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('classica-dot');
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
        const gap = 30;
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
    initNavigation();
    initScrollProgress();
    initHeroSlider();
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
    initClassicaCarousel();
    initContemporaneaCarousel();
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
        const gap = 30;
        const containerWidth = carousel.offsetWidth;
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
    }
    
    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxIndex + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('contemporanea-dot');
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
        const gap = 30;
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
    const totalSlides = 4;
    const autoPlayInterval = 5000; // 5 seconds per slide
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
                cta2: { text: 'Conhecer Nossa História', link: '#manifesto' }
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
                tag: 'NEGOCIO E ROI',
                title: ['TRANSFORME SEU SONHO', 'EM UM NEGOCIO DE SUCESSO'],
                description: 'Margens de lucro de ate 62,7% mostram: Pilates pode ser muito rentavel<br/>com os parceiros certos.',
                cta1: { text: 'Monte seu Studio', link: '#wizard' },
                cta2: { text: 'Ver Condicoes de Pagamento', link: buildWhatsAppLink('Ola, gostaria de ver as condicoes de pagamento para equipamentos.') }
            },
            {
                number: '04',
                tag: 'INOVACAO E GARANTIA',
                title: ['EXCELENCIA E INOVACAO', 'EM CADA MOVIMENTO'],
                description: 'Robustez e design avancado com 2 anos de garantia.<br/>Pagamento facilitado em ate 36x direto de fabrica.',
                cta1: { text: 'Ver Linha Contemporanea', link: '#contemporary' },
                cta2: { text: 'Baixar Catalogo', link: buildWhatsAppLink('Ola! Gostaria de receber o catalogo da Equipilates.') }
            }
        ],
        'en': [
            {
                number: '01',
                tag: 'LEADING FACTORY SINCE 2006',
                title: ['PILATES EQUIPMENT', 'PROFESSIONAL FOR YOUR STUDIO'],
                description: 'Classic and Contemporary Lines with 2-year warranty.<br/>Over 30,000 studios equipped in 24+ countries.',
                cta1: { text: 'Request a Quote', link: buildWhatsAppLink('Hello, I would like a quote for Pilates equipment.') },
                cta2: { text: 'Our Story', link: '#manifesto' }
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
                tag: 'BUSINESS AND ROI',
                title: ['TURN YOUR DREAM', 'INTO A SUCCESSFUL STUDIO'],
                description: 'Up to 62.7% margins show Pilates can be highly profitable<br/>with the right partners.',
                cta1: { text: 'Build My Studio', link: '#wizard' },
                cta2: { text: 'Payment Options', link: buildWhatsAppLink('Hello, I would like to see payment options for equipment.') }
            },
            {
                number: '04',
                tag: 'INNOVATION AND WARRANTY',
                title: ['EXCELLENCE AND INNOVATION', 'IN EVERY MOVE'],
                description: 'Robust design with 2-year warranty.<br/>Up to 36 installments direct from factory.',
                cta1: { text: 'See Contemporary Line', link: '#contemporary' },
                cta2: { text: 'Get the Catalog', link: buildWhatsAppLink('Hello! I would like to receive the Equipilates catalog.') }
            }
        ],
        'es': [
            {
                number: '01',
                tag: 'FÁBRICA LÍDER DESDE 2006',
                title: ['EQUIPOS DE PILATES', 'PROFESIONALES PARA SU ESTUDIO'],
                description: 'Línea Clásica y Contemporánea con 2 años de garantía.<br/>Más de 30.000 estudios equipados en 24+ países.',
                cta1: { text: 'Solicitar Cotización', link: buildWhatsAppLink('Hola, quisiera una cotización para equipos de Pilates.') },
                cta2: { text: 'Nuestra Historia', link: '#manifesto' }
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
                tag: 'NEGOCIO Y ROI',
                title: ['CONVIERTE TU SUENO', 'EN UN NEGOCIO EXITOSO'],
                description: 'Margenes de hasta 62,7% muestran que Pilates puede ser rentable<br/>con los socios correctos.',
                cta1: { text: 'Armar mi Estudio', link: '#wizard' },
                cta2: { text: 'Ver Formas de Pago', link: buildWhatsAppLink('Hola, quisiera ver las formas de pago para equipos.') }
            },
            {
                number: '04',
                tag: 'INNOVACION Y GARANTIA',
                title: ['EXCELENCIA E INNOVACION', 'EN CADA MOVIMIENTO'],
                description: 'Robustez y diseno avanzado con 2 anos de garantia.<br/>Hasta 36 cuotas directo de fabrica.',
                cta1: { text: 'Ver Linea Contemporanea', link: '#contemporary' },
                cta2: { text: 'Descargar Catalogo', link: buildWhatsAppLink('Hola! Quisiera recibir el catalogo de Equipilates.') }
            }
        ],
        'de': [
            {
                number: '01',
                tag: 'FÜHRENDE FABRIK SEIT 2006',
                title: ['PILATES-GERÄTE', 'PROFESSIONELL FÜR IHR STUDIO'],
                description: 'Klassische und Zeitgenössische Linien mit 2 Jahren Garantie.<br/>Über 30.000 Studios in 24+ Ländern ausgestattet.',
                cta1: { text: 'Angebot Anfordern', link: buildWhatsAppLink('Hallo, ich möchte ein Angebot für Pilates-Geräte.') },
                cta2: { text: 'Unsere Geschichte', link: '#manifesto' }
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
                tag: 'GESCHAFT UND ROI',
                title: ['VERWANDELN SIE IHREN TRAUM', 'IN EIN ERFOLGREICHES GESCHAFT'],
                description: 'Margen von bis zu 62,7% zeigen, dass Pilates rentabel sein kann<br/>mit den richtigen Partnern.',
                cta1: { text: 'Mein Studio Planen', link: '#wizard' },
                cta2: { text: 'Zahlungsbedingungen Sehen', link: buildWhatsAppLink('Hallo, ich mochte die Zahlungsmoglichkeiten sehen.') }
            },
            {
                number: '04',
                tag: 'INNOVATION UND GARANTIE',
                title: ['EXZELLENZ UND INNOVATION', 'IN JEDER BEWEGUNG'],
                description: 'Robustheit und fortschrittliches Design mit 2 Jahren Garantie.<br/>Bis zu 36 Raten direkt ab Werk.',
                cta1: { text: 'Moderne Linie Sehen', link: '#contemporary' },
                cta2: { text: 'Katalog Herunterladen', link: buildWhatsAppLink('Hallo! Ich mochte den Equipilates-Katalog erhalten.') }
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
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        // Update mobile lang bar buttons
        document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
    }

    function applyI18nStrings(lang) {
        const dict = I18N[lang] || I18N['pt-BR'];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = dict[key];
            if (typeof value === 'string') el.textContent = value;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = dict[key];
            if (typeof value === 'string') el.setAttribute('placeholder', value);
        });
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

        // Add motion classes with stagger for initial load
        setTimeout(() => tag.classList.add('motion-in'), 350);
        setTimeout(() => titleLines[0].classList.add('motion-in'), 520);
        setTimeout(() => titleLines[1].classList.add('motion-in'), 680);
        setTimeout(() => description.classList.add('motion-in'), 830);
        setTimeout(() => ctaContainer.classList.add('motion-in-reverse'), 980);
    }
    
    // Initialize first slide on load
    initFirstSlide();

    // Language switch (desktop)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setCurrentLang(lang);
            applyLangUI(lang);
            applyI18nStrings(lang);
            updateContent(currentIndex, { animate: false });
        });
    });

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
// INTERACTIVE GALLERY FILTERING
// ==========================================
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length === 0 || galleryItems.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });
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
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        
        update();
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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
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
// ==========================================
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    document.querySelectorAll('.feature-item, .innovation-card').forEach(el => {
        const speed = 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

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
