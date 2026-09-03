/* ==========================================================================
   VISHNU N — CLIENT SCRIPT & SCROLLSPY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initGSAPAnimations();
    initBinaryTextDecode();
    initEasterEggModal();
    initTimelineRailNav();
    initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. SCROLLSPY & TIMELINE RAIL ACTIVE TRACKER
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-anchor');
    const mobLinks = document.querySelectorAll('.mobile-nav-link');
    const railIndicators = document.querySelectorAll('.rail-indicator');
    const navbar = document.getElementById('top-navbar');

    function onScroll() {
        const scrollPosition = window.scrollY + 220;

        // Navbar shadow on scroll
        if (window.scrollY > 30) {
            navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.06)';
            navbar.style.padding = '0';
        } else {
            navbar.style.boxShadow = 'none';
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update Top Navbar
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Update Mobile Nav Links
                mobLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Update Left Timeline Rail
                railIndicators.forEach(indicator => {
                    indicator.classList.remove('active');
                    if (indicator.getAttribute('data-target') === sectionId) {
                        indicator.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------------------
   2. GSAP ENTRANCE ANIMATIONS
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Hero Section Reveal
    gsap.from('.eyebrow-text, .hero-main-title, .hero-role-title, .hero-bio-paragraph, .hero-buttons-row', {
        y: 30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
    });

    gsap.from('.hero-prism-wrapper, .floating-experience-card, .floating-code-icon-badge', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
    });

    // About Feature Cards 2x2 Stagger
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.feature-cards-2x2',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Project Cards Stagger
    gsap.from('.project-item-card', {
        scrollTrigger: {
            trigger: '.projects-cards-grid-auto',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // Tech Stack Icon Cards Stagger
    gsap.from('.tech-icon-card', {
        scrollTrigger: {
            trigger: '.skills-cards-row',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out'
    });

    // Experience Cards Stagger
    gsap.from('.exp-item-card', {
        scrollTrigger: {
            trigger: '.experience-cards-grid',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // Contact Glass Banner
    gsap.from('.contact-glass-banner', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    });
}

/* --------------------------------------------------------------------------
   3. BINARY (0 & 1) HOVER SCRAMBLE DECODER
   -------------------------------------------------------------------------- */
function initBinaryTextDecode() {
    const binaryElements = document.querySelectorAll('.binary-decode-text');
    const binaryChars = '01';

    binaryElements.forEach(el => {
        const originalText = el.getAttribute('data-text') || el.textContent.trim();
        el.setAttribute('data-text', originalText);

        function generateBinary(text) {
            return text.split('').map(char => {
                if (char === ' ') return ' ';
                return binaryChars[Math.floor(Math.random() * binaryChars.length)];
            }).join('');
        }

        // Set initial state to 0 and 1
        el.textContent = generateBinary(originalText);
        el.classList.add('binary-encrypted');

        let interval = null;
        let isHovered = false;

        // Subtle ambient bit-flip while idle in binary state
        setInterval(() => {
            if (!isHovered && el.classList.contains('binary-encrypted')) {
                const chars = el.textContent.split('');
                const randomIdx = Math.floor(Math.random() * chars.length);
                if (chars[randomIdx] !== ' ') {
                    chars[randomIdx] = chars[randomIdx] === '0' ? '1' : '0';
                    el.textContent = chars.join('');
                }
            }
        }, 220);

        // Hover in: Matrix decode scramble from 0/1 into real text
        el.addEventListener('mouseenter', () => {
            isHovered = true;
            el.classList.remove('binary-encrypted');
            el.classList.add('binary-decoding');

            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                el.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return binaryChars[Math.floor(Math.random() * binaryChars.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    el.textContent = originalText;
                    el.classList.remove('binary-decoding');
                    el.classList.add('binary-revealed');
                }

                iteration += 1 / 2; // Speed of deciphering
            }, 25);
        });

        // Hover out: Scramble back from real text into 0 and 1
        el.addEventListener('mouseleave', () => {
            isHovered = false;
            el.classList.remove('binary-revealed');
            el.classList.add('binary-decoding');

            let iteration = originalText.length;
            clearInterval(interval);

            interval = setInterval(() => {
                el.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return binaryChars[Math.floor(Math.random() * binaryChars.length)];
                    })
                    .join('');

                if (iteration <= 0) {
                    clearInterval(interval);
                    el.textContent = generateBinary(originalText);
                    el.classList.remove('binary-decoding');
                    el.classList.add('binary-encrypted');
                }

                iteration -= 1 / 2;
            }, 20);
        });
    });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE ERROR (BUG NOT FOUND) EASTER EGG MODAL
   -------------------------------------------------------------------------- */
function initEasterEggModal() {
    const triggerBtn = document.getElementById('interactive-error-trigger');
    const modal = document.getElementById('easter-egg-modal');
    const closeXBtn = document.getElementById('terminal-x-btn');
    const closeDotBtn = document.getElementById('close-terminal-dot');
    const connectLink = document.getElementById('terminal-connect-link');

    if (!triggerBtn || !modal) return;

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    triggerBtn.addEventListener('click', openModal);
    triggerBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    if (closeXBtn) closeXBtn.addEventListener('click', closeModal);
    if (closeDotBtn) closeDotBtn.addEventListener('click', closeModal);
    if (connectLink) connectLink.addEventListener('click', closeModal);

    // Close when clicking on the dark backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}
/* --------------------------------------------------------------------------
   5. TIMELINE RAIL NAVIGATION (CLEAN SMOOTH SCROLL, NO GAME / NO LOCK)
   -------------------------------------------------------------------------- */
function initTimelineRailNav() {
    const indicators = document.querySelectorAll('.left-timeline-rail .rail-indicator');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const targetId = indicator.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   6. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const links = document.querySelectorAll('.mobile-nav-link, .btn-mob-connect');

    if (!menuBtn || !drawer) return;

    function toggleMenu(forceClose = false) {
        const isOpen = forceClose ? false : !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', isOpen);
        menuBtn.classList.toggle('is-active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            toggleMenu(true);
            const targetHref = link.getAttribute('href');
            if (targetHref && targetHref.startsWith('#')) {
                const targetEl = document.querySelector(targetHref);
                if (targetEl) {
                    e.preventDefault();
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            toggleMenu(true);
        }
    });

    // Close if resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && drawer.classList.contains('is-open')) {
            toggleMenu(true);
        }
    }, { passive: true });
}
