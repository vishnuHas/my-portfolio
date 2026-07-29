/* ==========================================================================
   VISHNU N — CINEMATIC PORTFOLIO JAVASCRIPT ENGINE
   Preloader | Custom Magnetic Cursor | GSAP Horizontal Pin | Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    initPreloader();
    initCustomCursor();
    initGSAPAnimations();
    initAccordion();
    initProjectModals();
    initNavbarScroll();
    initCTAButtonAnimation();
});

/* --------------------------------------------------------------------------
   1. PRELOADER TICKER SEQUENCE
   -------------------------------------------------------------------------- */
function initPreloader() {
    const counter = document.getElementById('preloader-counter');
    const line = document.getElementById('preloader-line');
    const preloader = document.getElementById('preloader');

    if (!counter || !preloader) return;

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 3;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            
            counter.textContent = '100%';
            if (line) line.style.width = '100%';

            setTimeout(() => {
                preloader.classList.add('finished');
                document.body.classList.remove('is-loading');
                
                // Trigger Hero Entry Animations
                gsap.from('.title-char', {
                    y: 80,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: 'power3.out'
                });
                
                gsap.from('.hero-subtitle, .hero-bio-lead, .hero-header-meta, .hero-metrics-strip', {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.3
                });
            }, 400);
        } else {
            counter.textContent = `${count < 10 ? '0' : ''}${count}%`;
            if (line) line.style.width = `${count}%`;
        }
    }, 40);
}

/* --------------------------------------------------------------------------
   2. CUSTOM RING CURSOR & MAGNETIC PULL
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function render() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(render);
    }
    render();

    const hoverTargets = document.querySelectorAll('a, button, .hover-magnetic, .accordion-header, .open-modal-btn');
    
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => ring.classList.add('active'));
        target.addEventListener('mouseleave', () => {
            ring.classList.remove('active');
            target.style.transform = 'translate(0px, 0px)';
        });

        if (target.classList.contains('hover-magnetic') || target.classList.contains('btn-magnetic')) {
            target.addEventListener('mousemove', (e) => {
                const rect = target.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;

                target.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
            });
        }
    });
}

/* --------------------------------------------------------------------------
   3. GSAP SCROLLTRIGGER ANIMATIONS & HORIZONTAL PROJECT PARALLAX
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
    // 1. GSAP ScrollTrigger Horizontal Pin ONLY for Desktop (>1024px)
    const projectsTrack = document.getElementById('projects-track');
    const projectsSection = document.getElementById('projects');

    if (projectsTrack && projectsSection) {
        ScrollTrigger.matchMedia({
            // Desktop (> 1024px): Smooth GSAP Horizontal Pin
            "(min-width: 1025px)": function() {
                const getScrollAmount = () => {
                    return -(projectsTrack.scrollWidth - window.innerWidth + 80);
                };

                gsap.to(projectsTrack, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectsSection,
                        start: "top top",
                        end: () => `+=${projectsTrack.scrollWidth - window.innerWidth + 400}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });
            },
            // Mobile/Tablet (<= 1024px): Native CSS Touch Scroll (No pinning to prevent scroll lock)
            "(max-width: 1024px)": function() {
                gsap.set(projectsTrack, { clearProps: "all" });
            }
        });
    }

    // 2. Parallax Hero Elements
    gsap.to('#hero-accent-shape', {
        y: 120,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('#hero-parallax-card', {
        y: -40,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 3. Reveal Editorial Text
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
            }
        });
    });

    // 4. Stagger Reveal for 3 Side-by-Side Lanyard ID Cards
    const idCards = gsap.utils.toArray('.lanyard-row-grid .id-card-wrapper');
    if (idCards.length > 0) {
        gsap.from(idCards, {
            y: 70,
            opacity: 0,
            rotation: -3,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.lanyard-row-grid',
                start: 'top 85%',
            }
        });
    }

    // 5. Education Cards Animation
    gsap.utils.toArray('.education-card').forEach(card => {
        gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. ACCORDION EXPAND LIST
   -------------------------------------------------------------------------- */
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            items.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   5. CONTINUOUS BUTTON ANIMATION & SLOW TOP-LINE REVEAL HANDLER
   -------------------------------------------------------------------------- */
function initCTAButtonAnimation() {
    const ctaText = document.getElementById('cta-cycling-text');
    const ctaBtn = document.getElementById('contact-cta-btn');
    const navContactBtn = document.getElementById('nav-contact-btn');
    const detailsBox = document.getElementById('contact-details-box');

    if (!ctaText) return;

    const phrases = [
        "EMAIL",
        "PHONE",
        "LINKEDIN",
        "GITHUB"
    ];

    let currentIdx = 0;

    setInterval(() => {
        currentIdx = (currentIdx + 1) % phrases.length;
        
        gsap.to(ctaText, {
            opacity: 0,
            y: -6,
            duration: 0.2,
            onComplete: () => {
                ctaText.textContent = phrases[currentIdx];
                gsap.fromTo(ctaText, 
                    { opacity: 0, y: 6 }, 
                    { opacity: 1, y: 0, duration: 0.2 }
                );
            }
        });
    }, 2000);

    function revealContactBox() {
        if (!detailsBox) return;

        detailsBox.classList.add('revealed');

        setTimeout(() => {
            detailsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            revealContactBox();
        });
    }

    if (navContactBtn) {
        navContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            revealContactBox();
        });
    }
}

/* --------------------------------------------------------------------------
   6. PROJECT SPECS MODAL DIALOG
   -------------------------------------------------------------------------- */
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close');

    if (!modal || !modalBody) return;

    const projectData = {
        'budakatu': {
            title: 'Budakatu-Sante Mobile Platform',
            year: '2026',
            tags: ['Kotlin', 'Jetpack Compose', 'Android Studio', 'GenAI', 'Firebase', 'VTU-MoU'],
            img: 'assets/images/hero_avatar.png',
            summary: 'Dedicated native Android mobile platform built to showcase and support authentic tribal artistry with responsive UI/UX and Firebase full-stack integration.',
            metrics: ['📱 Native Kotlin & Compose', '✨ GenAI Cloud Integration', '🎨 Tribal Artistry Portal'],
            architecture: `
<h4 style="font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary);">Capstone Project Specs & Architecture</h4>
<p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1rem;">Developed during an intensive VTU-MoU partnered internship at MindMatrixEd focusing on modern Android development and Generative AI mobile environments.</p>
<ul style="padding-left:1.2rem; color:var(--text-secondary); line-height:1.65;">
    <li><strong>Android Development:</strong> Built native Android interfaces using Kotlin and Jetpack Compose for declarative UI rendering.</li>
    <li><strong>GenAI Integration:</strong> Utilized Google AI Studio and Cloud Labs to integrate GenAI capabilities in mobile environments.</li>
    <li><strong>Full-Stack Backend:</strong> Firebase Firestore real-time database, authentication, and minimal intuitive user interface.</li>
</ul>`
        },
        'ai-builder': {
            title: 'AI Magic Builder',
            year: '2024',
            tags: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'LLM API', 'WebSockets'],
            img: 'assets/images/project_ai_builder.png',
            summary: 'AI-powered full-stack application leveraging GPT-based APIs to generate production-ready websites across 5+ frameworks with real-time WebSocket code preview.',
            metrics: ['⚡ 60% Dev Acceleration', '📦 5+ Framework Support', '🔄 Real-Time Auto-Save'],
            architecture: `
<h4 style="font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary);">System Architecture & Implementation Specs</h4>
<p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1rem;">Accepts natural language prompts and orchestrates multi-agent LLM prompts to construct structured, multi-file codebases in real time.</p>
<ul style="padding-left:1.2rem; color:var(--text-secondary); line-height:1.65;">
    <li><strong>LLM Engine:</strong> Streams AST code structures via GPT API adapters.</li>
    <li><strong>WebSocket Sync:</strong> Bi-directional real-time code execution, autosave state, and step rollback.</li>
    <li><strong>Interactive Code Editor:</strong> Side-by-side editing and framework switching.</li>
</ul>`
        },
        'mentor-lab': {
            title: 'Mentor Lab Platform',
            year: '2024',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Code Splitting'],
            img: 'assets/images/project_mentor_lab.png',
            summary: 'Engineered student support web platform serving 500+ engineering students with lab material repositories and interactive experiment guides.',
            metrics: ['👥 500+ Student Users', '🚀 95+ Lighthouse Score', '⚡ Sub-second Load Time'],
            architecture: `
<h4 style="font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary);">System Architecture & Performance Specs</h4>
<p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1rem;">Designed for fast access across mobile and desktop devices with static asset caching and responsive UI components.</p>
<ul style="padding-left:1.2rem; color:var(--text-secondary); line-height:1.65;">
    <li><strong>Performance Optimization:</strong> Code splitting, image lazy-loading, and static asset compression achieving 95+ Lighthouse scores.</li>
    <li><strong>Resource Indexing:</strong> Structured lab guide catalog with instant client-side search.</li>
</ul>`
        },
        'sudoku-solver': {
            title: 'Sudoku Solver Automation',
            year: '2023',
            tags: ['Python', 'Flask', 'Selenium', 'Backtracking', 'REST APIs'],
            img: 'assets/images/project_sudoku_solver.png',
            summary: 'Automated real-time Sudoku puzzle solver combining algorithmic backtracking with Selenium browser control and AJAX RESTful backend endpoints.',
            metrics: ['🤖 Real-Time Solving', '⚙️ Selenium Automation', '🔌 RESTful AJAX API'],
            architecture: `
<h4 style="font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary);">Algorithmic & Automation Specs</h4>
<p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1rem;">Integrates puzzle state extraction with an optimized recursive backtracking algorithm to solve 9x9 Sudoku grids automatically in browser sessions.</p>
<ul style="padding-left:1.2rem; color:var(--text-secondary); line-height:1.65;">
    <li><strong>Backtracking Algorithm:</strong> Constraint-satisfaction solver executing in milliseconds.</li>
    <li><strong>Selenium Browser Control:</strong> Automates input simulation and puzzle verification.</li>
</ul>`
        },
        'age-detection': {
            title: 'AI Age Detection System',
            year: '2023',
            tags: ['Python', 'Flask', 'Deep Learning', 'CNN', 'Computer Vision', 'OpenCV'],
            img: 'assets/images/project_age_detection.png',
            summary: 'Deep learning CNN model for real-time facial recognition and age estimation trained on over 10,000+ labeled facial images with interactive visual analytics.',
            metrics: ['📸 10,000+ Images Trained', '🧠 CNN Architecture', '🖥️ Drag-and-Drop Web UI'],
            architecture: `
<h4 style="font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary);">Deep Learning & Computer Vision Specs</h4>
<p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1rem;">Uses Convolutional Neural Networks (CNNs) trained on facial datasets to extract features and classify age demographics with drag-and-drop web analysis.</p>
<ul style="padding-left:1.2rem; color:var(--text-secondary); line-height:1.65;">
    <li><strong>Model Pipeline:</strong> OpenCV face detection bounding box cropping + CNN classification inference.</li>
    <li><strong>Web Dashboard:</strong> Flask API server visualizing real-time confidence scores.</li>
</ul>`
        }
    };

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projKey = btn.dataset.project;
            const data = projectData[projKey];
            if (!data) return;

            modalBody.innerHTML = `
                <div style="margin-bottom:1.5rem;">
                    <span style="font-family:var(--font-mono); color:var(--accent-primary); font-size:0.8rem; font-weight:700;">PROJECT SPECS</span>
                    <h2 style="font-size:1.8rem; margin-top:0.2rem;">${data.title} (${data.year})</h2>
                </div>

                <img src="${data.img}" alt="${data.title}" style="width:100%; border-radius:12px; margin-bottom:1.2rem; border:1px solid var(--border-color);">

                <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.2rem;">
                    ${data.tags.map(t => `<span style="font-family:var(--font-mono); font-size:0.78rem; background:var(--bg-primary); border:1px solid var(--border-color); padding:0.25rem 0.7rem; border-radius:999px;">${t}</span>`).join('')}
                </div>

                <p style="color:var(--text-secondary); margin-bottom:1.2rem; font-size:1.05rem; line-height:1.6;">${data.summary}</p>

                <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem; background:var(--bg-primary); padding:1rem; border-radius:12px; border:1px solid var(--border-color);">
                    ${data.metrics.map(m => `
                        <div style="font-size:0.88rem; font-weight:700; color:var(--text-primary);">
                            ${m}
                        </div>
                    `).join('')}
                </div>

                <div>
                    ${data.architecture}
                </div>

                <div style="margin-top:2rem;">
                    <a href="https://github.com/vishnuHas" target="_blank" rel="noopener" class="btn-panel-action" style="display:inline-block; text-decoration:none;">
                        <i class="fa-brands fa-github"></i> VIEW GITHUB REPOSITORY
                    </a>
                </div>
            `;

            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

/* --------------------------------------------------------------------------
   7. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
