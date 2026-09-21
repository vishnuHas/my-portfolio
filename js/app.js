/* ==========================================================================
   VISHNU N — CLIENT MOTION & PARALLAX ENGINE
   Awwwards-Level GSAP Motion, Parallax & Micro-Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    initFollowerCursor();
    initMagneticPhysics();
    initHeroParallax();
    initKineticTextScrub();
    initProjectCardsParallax();
    init3DCardTilt();
    initScrollSpyAndRail();
    initMobileDrawer();
    initBackToTop();
    initEasterEggModal();
});

/* --------------------------------------------------------------------------
   1. CUSTOM SMOOTH FOLLOWER CURSOR & HOVER SCALING
   -------------------------------------------------------------------------- */
function initFollowerCursor() {
    const follower = document.getElementById('cursor-follower');
    const dot = document.getElementById('cursor-dot');
    if (!follower || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Position the center dot immediately
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth Lerp loop for the outer ring
    function renderCursor() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover scale effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [role="button"], .tilt-card, .skill-pill, .tag-pill');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => follower.classList.remove('is-hovering'));
    });
}

/* --------------------------------------------------------------------------
   2. MAGNETIC MICRO-PHYSICS FOR BUTTONS & ICONS
   -------------------------------------------------------------------------- */
function initMagneticPhysics() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.28;
            const deltaY = (e.clientY - centerY) * 0.28;

            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
            el.style.transition = 'transform 0.4s var(--ease-out-back)';
            setTimeout(() => {
                el.style.transition = '';
            }, 400);
        });
    });
}

/* --------------------------------------------------------------------------
   3. HERO MULTI-LAYER PARALLAX & AMBIENT MESH DRIFT
   -------------------------------------------------------------------------- */
function initHeroParallax() {
    const hero = document.getElementById('home');
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const parallaxLayers = document.querySelectorAll('[data-parallax-depth]');

    if (!hero) return;

    // Mouse movement drift on ambient light orbs
    window.addEventListener('mousemove', (e) => {
        const xRatio = (e.clientX / window.innerWidth) - 0.5;
        const yRatio = (e.clientY / window.innerHeight) - 0.5;

        if (orb1) {
            orb1.style.transform = `translate(${xRatio * 50}px, ${yRatio * 50}px)`;
        }
        if (orb2) {
            orb2.style.transform = `translate(${xRatio * -40}px, ${yRatio * -40}px)`;
        }
    });

    // ScrollTrigger entrance cascade & scroll-parallax
    if (typeof gsap !== 'undefined') {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

        heroTimeline
            .from('.hero-status-capsule', { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
            .from('.eyebrow-text', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
            .from('.hero-main-title', { y: 35, opacity: 0, duration: 1 }, '-=0.4')
            .from('.hero-role-title', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.hero-bio-paragraph', { y: 25, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.hero-buttons-row', { y: 25, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.hero-center-stat-badge', { scale: 0.9, opacity: 0, duration: 0.8 }, '-=0.5')
            .from('.interactive-error-pill', { opacity: 0, duration: 0.6 }, '-=0.4');

        // Scroll parallax scrubbing for hero depth elements
        parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0.1;
            gsap.to(layer, {
                y: () => depth * 220,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
}

/* --------------------------------------------------------------------------
   4. KINETIC TEXT SCRUBBING (ABOUT MANIFESTO)
   -------------------------------------------------------------------------- */
function initKineticTextScrub() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrubWords = document.querySelectorAll('.scrub-word');
    if (!scrubWords.length) return;

    gsap.fromTo(scrubWords, 
        { opacity: 0.18, y: 4 },
        {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#about-kinetic-title',
                start: 'top 80%',
                end: 'bottom 45%',
                scrub: 0.6
            }
        }
    );
}

/* --------------------------------------------------------------------------
   5. PROJECT CARDS PARALLAX DEPTH STAGGER
   -------------------------------------------------------------------------- */
function initProjectCardsParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = document.querySelectorAll('.parallax-card');
    cards.forEach((card, index) => {
        const speed = parseFloat(card.getAttribute('data-speed')) || 1.0;
        const yOffset = (speed - 1.0) * -80;

        gsap.to(card, {
            y: yOffset,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'bottom 15%',
                scrub: 1.2
            }
        });
    });
}

/* --------------------------------------------------------------------------
   6. 3D INTERACTIVE CARD TILT PHYSICS
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.45s var(--ease-out-expo)';
            setTimeout(() => {
                card.style.transition = '';
            }, 450);
        });
    });
}

/* --------------------------------------------------------------------------
   7. SCROLLSPY & TIMELINE RAIL TRACKER
   -------------------------------------------------------------------------- */
function initScrollSpyAndRail() {
    const sections = document.querySelectorAll('.page-section');
    const navAnchors = document.querySelectorAll('.nav-anchor');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const railIndicators = document.querySelectorAll('.rail-indicator');
    const navbar = document.getElementById('top-navbar');

    function onScroll() {
        const scrollPosition = window.scrollY + 200;

        // Navbar floating shadow update
        if (window.scrollY > 40) {
            navbar.style.padding = '0 2rem';
            if (navbar.firstElementChild) {
                navbar.firstElementChild.style.boxShadow = '0 12px 35px rgba(45, 38, 30, 0.1)';
            }
        } else {
            if (navbar.firstElementChild) {
                navbar.firstElementChild.style.boxShadow = '0 8px 30px rgba(45, 38, 30, 0.06)';
            }
        }

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                // Top Navbar Link Sync
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
                });

                // Mobile Drawer Link Sync
                mobileLinks.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
                });

                // Left Timeline Rail Sync
                railIndicators.forEach(ind => {
                    ind.classList.remove('active');
                    if (ind.getAttribute('data-target') === id) ind.classList.add('active');
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Smooth Anchor Scroll for Timeline Rail Indicators
    railIndicators.forEach(ind => {
        ind.addEventListener('click', (e) => {
            const targetId = ind.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   8. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const links = document.querySelectorAll('.mobile-nav-link, .btn-mob-connect');

    if (!btn || !drawer) return;

    function toggle(forceClose = false) {
        const isOpen = forceClose ? false : !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    btn.addEventListener('click', () => toggle());

    links.forEach(l => {
        l.addEventListener('click', () => toggle(true));
    });

    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !btn.contains(e.target) && drawer.classList.contains('is-open')) {
            toggle(true);
        }
    });
}

/* --------------------------------------------------------------------------
   9. BACK TO TOP TRIGGER
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backBtn = document.getElementById('back-to-top-trigger');
    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --------------------------------------------------------------------------
   10. EASTER EGG DIAGNOSTICS MODAL (DEVELOPER TERMINAL)
   -------------------------------------------------------------------------- */
function initEasterEggModal() {
    const trigger = document.getElementById('interactive-error-trigger');
    const modal = document.getElementById('easter-egg-modal');
    const closeDot = document.getElementById('close-terminal-dot');
    const closeX = document.getElementById('terminal-x-btn');
    const connectLink = document.getElementById('terminal-connect-link');

    if (!trigger || !modal) return;

    function openModal() {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    if (closeDot) closeDot.addEventListener('click', closeModal);
    if (closeX) closeX.addEventListener('click', closeModal);
    if (connectLink) connectLink.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
}
