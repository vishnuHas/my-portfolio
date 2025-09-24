// Animate dashboard entrance
gsap.from(".dashboard-container", {
  opacity: 0,
  y: 60,
  duration: 1.2,
  ease: "power4.out"
});

// Animate cards with stagger
gsap.from(".card", {
  opacity: 0,
  y: 30,
  stagger: 0.12,
  duration: 0.7,
  ease: "power2.out",
  delay: 0.4
});

// Animate project cards glow on hover
document.querySelectorAll('.project-card, .project-card-right').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      boxShadow: "0 0 32px 6px #ffb86c55, 0 2px 24px #4f8cff22",
      scale: 1.06,
      duration: 0.25,
      ease: "power2.out"
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      boxShadow: "0 2px 16px rgba(255,184,108,0.07)",
      scale: 1,
      duration: 0.25,
      ease: "power2.out"
    });
  });
});

// Animate skill icons bounce on hover
document.querySelectorAll('.skill-icons .icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    gsap.to(icon, {
      scale: 1.18,
      rotate: -10,
      boxShadow: "0 8px 28px #4f8cff33",
      duration: 0.23
    });
  });
  icon.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      scale: 1,
      rotate: 0,
      boxShadow: "0 2px 10px rgba(79,140,255,0.13)",
      duration: 0.23
    });
  });
});

// Download button pulse
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('mouseenter', () => {
    gsap.to(downloadBtn, { scale: 1.09, duration: 0.2, background: "linear-gradient(90deg, #ff5eab, #ffb86c)" });
  });
  downloadBtn.addEventListener('mouseleave', () => {
    gsap.to(downloadBtn, { scale: 1, duration: 0.2, background: "linear-gradient(90deg, #ffb86c, #ff5eab)" });
  });
}

// Social icons rotate
document.querySelectorAll('.social-links .icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    gsap.to(icon, { rotate: 18, duration: 0.2 });
  });
  icon.addEventListener('mouseleave', () => {
    gsap.to(icon, { rotate: 0, duration: 0.2 });
  });
});
