/* ========================================================================
   TREVOR TECHNOLOGIES WLL — Global JavaScript
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initScrollToTop();
  initSmoothScroll();
  initDropdowns();
  initContactForm();
  initCarousels();
});

/* ========================================================================
   1. NAVBAR — Sticky + Scroll Effects
   ======================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ========================================================================
   2. MOBILE MENU
   ======================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-overlay');
  const navbar = document.querySelector('.navbar');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (navbar) navbar.classList.toggle('menu-open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      if (navbar) navbar.classList.remove('menu-open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close on link click (mobile)
  navLinks.querySelectorAll('.nav-link:not(.dropdown-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        if (navbar) navbar.classList.remove('menu-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ========================================================================
   3. SCROLL ANIMATIONS (Intersection Observer)
   ======================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll, .animate-fade-left, .animate-fade-right, .animate-scale');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ========================================================================
   4. COUNTER ANIMATIONS
   ======================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

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

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ========================================================================
   5. SCROLL TO TOP
   ======================================================================== */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================================================================
   6. SMOOTH SCROLL
   ======================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 100;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });
}

/* ========================================================================
   7. DROPDOWN MENUS (Mobile)
   ======================================================================== */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  });
}

/* ========================================================================
   8. CONTACT FORM
   ======================================================================== */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'var(--accent-red)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    // Email validation
    const email = form.querySelector('[type="email"]');
    if (email && email.value && !isValidEmail(email.value)) {
      isValid = false;
      email.style.borderColor = 'var(--accent-red)';
    }

    if (isValid) {
      // Show success
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent Successfully!';
      btn.style.background = 'var(--accent-green)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================================================
   9. HERO PARTICLES
   ======================================================================== */
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (5 + Math.random() * 6) + 's';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// Init particles when page loads
window.addEventListener('load', createParticles);

/* ========================================================================
   10. MOBILE CAROUSEL NAVIGATION (Arrows)
   ======================================================================== */
function initCarousels() {
  const grids = document.querySelectorAll('.services-grid');
  grids.forEach(grid => {
    const parent = grid.parentElement;
    const prevBtn = parent.querySelector('.carousel-nav-btn.prev');
    const nextBtn = parent.querySelector('.carousel-nav-btn.next');

    if (!prevBtn || !nextBtn) return;

    nextBtn.addEventListener('click', () => {
      const card = grid.querySelector('.service-card');
      if (!card) return;
      const scrollAmount = card.offsetWidth + 16; // Card width + gap
      grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const card = grid.querySelector('.service-card');
      if (!card) return;
      const scrollAmount = card.offsetWidth + 16; // Card width + gap
      grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  });
}
