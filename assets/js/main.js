// ========================================
// MOLFAR — Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // === IMAGES fade-in on load ===
    document.querySelectorAll('img.media-img, .gallery-item img').forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

    // === INFRA card backgrounds (load only if image exists) ===
    document.querySelectorAll('.infra-card[data-bg]').forEach(card => {
        const src = card.dataset.bg;
        if (!src) return;
        const probe = new Image();
        probe.onload = () => {
            card.style.backgroundImage = `url('${src}')`;
            card.classList.add('has-bg');
        };
        probe.src = src;
    });

    // === LOADER ===
    const loader = document.getElementById('loader');
    const hideLoader = () => setTimeout(() => loader?.classList.add('hidden'), 1500);
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader);

    // === LENIS smooth scroll ===
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // === HEADER scrolled state ===
    const header = document.getElementById('header');
    let lastScroll = 0;
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        lastScroll = scroll;
    });

    // === BURGER MENU ===
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    const closeMenu = () => {
        burger?.classList.remove('active');
        nav?.classList.remove('mobile-open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        lenis?.start();
    };

    const openMenu = () => {
        burger?.classList.add('active');
        nav?.classList.add('mobile-open');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        lenis?.stop();
    };

    burger?.addEventListener('click', () => {
        if (nav.classList.contains('mobile-open')) closeMenu();
        else openMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('mobile-open')) closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100 && nav?.classList.contains('mobile-open')) closeMenu();
    });

    // === ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const wasOpen = nav?.classList.contains('mobile-open');
            if (wasOpen) closeMenu();
            // Wait for menu close animation before scrolling
            setTimeout(() => lenis.scrollTo(target, { offset: -80 }), wasOpen ? 350 : 0);
        });
    });

    // === GSAP ===
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Sync ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // Section eyebrows
        gsap.utils.toArray('.section-eyebrow').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Section titles
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power3.out',
                delay: 0.1
            });
        });

        // Lead text
        gsap.utils.toArray('.lead, .muted').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                opacity: 0,
                y: 24,
                duration: 0.9,
                ease: 'power3.out',
                delay: 0.2
            });
        });

        // Investment cards stagger — slide up, no fade (cards always visible)
        gsap.from('.investment-card', {
            scrollTrigger: { trigger: '.investment-grid', start: 'top 90%' },
            y: 24,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Infra cards
        gsap.from('.infra-card', {
            scrollTrigger: { trigger: '.infra-grid', start: 'top 90%' },
            y: 24,
            duration: 0.55,
            stagger: 0.04,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Concept bullets
        gsap.from('.bullet', {
            scrollTrigger: { trigger: '.concept-bullets', start: 'top 90%' },
            x: -14,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Cottage specs / features
        gsap.from('.spec, .cottage-features li', {
            scrollTrigger: { trigger: '.cottage-content', start: 'top 85%' },
            y: 14,
            duration: 0.45,
            stagger: 0.03,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Location stats
        gsap.from('.loc-stat', {
            scrollTrigger: { trigger: '.location-stats', start: 'top 90%' },
            y: 16,
            duration: 0.5,
            stagger: 0.04,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Steps
        gsap.from('.step, .step-arrow', {
            scrollTrigger: { trigger: '.steps', start: 'top 90%' },
            y: 20,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform'
        });

        // Profit bars — animate height via CSS variable
        document.querySelectorAll('.profit-bar').forEach(bar => {
            bar.dataset.targetHeight = bar.style.getPropertyValue('--height');
            bar.style.setProperty('--height', '0%');
        });

        ScrollTrigger.create({
            trigger: '.profit-chart',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                document.querySelectorAll('.profit-bar').forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.setProperty('--height', bar.dataset.targetHeight);
                    }, i * 70);
                });
            }
        });

        gsap.from('.profit-bar', {
            scrollTrigger: { trigger: '.profit-chart', start: 'top 80%' },
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power3.out'
        });

        // FAQ items
        gsap.from('.faq-item', {
            scrollTrigger: { trigger: '.faq-list', start: 'top 80%' },
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out'
        });

        // Concept visual parallax
        gsap.to('.concept-visual', {
            scrollTrigger: {
                trigger: '.concept',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -60,
            ease: 'none'
        });

        // Cottage image parallax
        gsap.to('.cottage-image', {
            scrollTrigger: {
                trigger: '.cottage',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    }

    // === COUNTERS ===
    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.counter);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.innerHTML = decimals > 0
                ? value.toFixed(decimals) + suffix
                : Math.floor(value) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.innerHTML = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
        };
        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

    // === CALCULATOR ===
    const calcAmount = document.getElementById('calcAmount');
    const calcAmountValue = document.getElementById('calcAmountValue');
    const calcMonthly = document.getElementById('calcMonthly');
    const calcTotal = document.getElementById('calcTotal');
    const calcTabs = document.querySelectorAll('.calc-tab');

    let years = 1;
    const annualRate = 0.26;

    const formatMoney = (n) => {
        return Math.round(n).toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';
    };

    const updateCalc = () => {
        if (!calcAmount) return;
        const amount = parseInt(calcAmount.value, 10);
        const annualIncome = amount * annualRate;
        const monthly = annualIncome / 12;
        const total = annualIncome * years;

        calcAmountValue.textContent = amount.toLocaleString('uk-UA').replace(/,/g, ' ') + ' ₴';
        calcMonthly.textContent = formatMoney(monthly);
        calcTotal.textContent = formatMoney(total);
    };

    calcAmount?.addEventListener('input', updateCalc);

    calcTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            calcTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            years = parseInt(tab.dataset.years, 10);
            updateCalc();
        });
    });

    updateCalc();

    // === FAQ — close others when opening one ===
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.removeAttribute('open');
                });
            }
        });
    });

    // === STICKY CTA visibility ===
    const stickyCTA = document.querySelector('.sticky-cta');
    const heroEl = document.querySelector('.hero');
    if (stickyCTA && heroEl) {
        const heroObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.style.opacity = entry.isIntersecting ? '0' : '1';
            stickyCTA.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        });
        heroObserver.observe(heroEl);
    }
});
