// Main JavaScript File — Aurelia Tradisia
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');

  function initNavigation() {
    if (mobileMenu) {
      mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });
    }
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        mobileMenu?.classList.remove('active');
      });
    });
    window.addEventListener('scroll', handleNavbarScroll);
  }

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }

  function initBackToTop() {
    if (!backToTopBtn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm));
      if (!validate(data)) return;
      const btn = contactForm.querySelector('button[type="submit"]');
      const txt = btn.textContent;
      btn.textContent = 'Sending...'; btn.disabled = true;
      setTimeout(() => {
        notify('Message sent! We’ll get back to you soon.', 'success');
        contactForm.reset();
        btn.textContent = txt; btn.disabled = false;
      }, 1200);
    });
  }

  function validate({ name = '', email = '', subject = '', message = '' }) {
    if (!name.trim()) return notify('Please enter your name.', 'error'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return notify('Enter a valid email.', 'error'), false;
    if (!subject.trim()) return notify('Please enter a subject.', 'error'), false;
    if (!message.trim()) return notify('Please enter your message.', 'error'), false;
    return true;
  }

  function notify(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" aria-label="Close">&times;</button>
      </div>`;
    document.body.appendChild(n);
    if (!document.querySelector('#notification-styles')) {
      const s = document.createElement('style');
      s.id = 'notification-styles';
      s.textContent = `
        .notification{position:fixed;top:20px;right:20px;padding:16px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);z-index:10000;max-width:400px;transform:translateX(100%);transition:.3s}
        .notification.show{transform:translateX(0)}
        .notification-success{background:#10b981;color:#fff}.notification-error{background:#ef4444;color:#fff}.notification-info{background:#3b82f6;color:#fff}
        .notification-content{display:flex;justify-content:space-between;align-items:center}
        .notification-close{background:none;border:none;color:inherit;font-size:20px;cursor:pointer;margin-left:12px}
      `;
      document.head.appendChild(s);
    }
    setTimeout(() => n.classList.add('show'), 50);
    const t = setTimeout(() => remove(n), 5000);
    n.querySelector('.notification-close').addEventListener('click', () => { clearTimeout(t); remove(n); });
  }

  function remove(n) { n.classList.remove('show'); setTimeout(() => n.remove(), 250); }

  function initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('loading'));
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('section').forEach(s => obs.observe(s));
  }

  function initLazyLoading() {
    const imgs = document.querySelectorAll('img[data-src]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const img = en.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(i => io.observe(i));
  }

  function trackEvent(name, data = {}) {
    if (typeof gtag !== 'undefined') gtag('event', name, data);
    console.log('track', name, data);
  }

  document.addEventListener('click', e => {
    if (e.target.matches('.btn')) {
      trackEvent('button_click', {
        text: e.target.textContent.trim(),
        location: e.target.closest('section')?.id || 'global'
      });
    }
  });

  function init() {
    initNavigation();
    initBackToTop();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initLazyLoading();
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
