/**
 * Rubén Pérez Portfolio — Interactive Engine
 * Vanilla ES6+ (GitHub Pages Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavigation();
  initScrollAnimations();
  initProjectFilter();
  initProjectModal();
  initCopyEmail();
  initContactForm();
  initBackToTop();
  initCopyrightYear();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeToggleBtn) return;

  // The theme is already applied by the inline script in <head> (before first paint)
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    try { localStorage.setItem('ruben_portfolio_theme', currentTheme); } catch (e) {}
    updateThemeIcon(currentTheme);
    showToast(currentTheme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado');
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    themeToggleBtn.setAttribute('title', label);
    themeToggleBtn.setAttribute('aria-label', label);
  }
}

/* ==========================================================================
   2. Header & Navigation (Scroll States, Active Links & Mobile Drawer)
   Smooth anchor scrolling is handled natively by CSS (scroll-behavior +
   scroll-padding-top), so no JS is needed for it.
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  // Cache section → link pairs once instead of querying the DOM on every scroll
  const sectionLinks = Array.from(document.querySelectorAll('section[id]'))
    .map(section => ({
      section,
      link: document.querySelector(`.nav-link[href="#${section.id}"]`)
    }))
    .filter(item => item.link);

  let activeLink = document.querySelector('.nav-link.active');
  let ticking = false;

  function onScrollFrame() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', y > 450);

    const probe = y + 160;
    for (const { section, link } of sectionLinks) {
      if (probe >= section.offsetTop && probe < section.offsetTop + section.offsetHeight) {
        if (link !== activeLink) {
          if (activeLink) {
            activeLink.classList.remove('active');
            activeLink.removeAttribute('aria-current');
          }
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
          activeLink = link;
        }
        break;
      }
    }
    ticking = false;
  }

  // One rAF-throttled scroll handler for header, active link and back-to-top
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
  onScrollFrame();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    const setMenuOpen = (open) => {
      navMenu.classList.toggle('mobile-active', open);
      document.documentElement.classList.toggle('menu-open', open);
      mobileToggle.setAttribute('aria-expanded', open);
      mobileToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      mobileToggle.innerHTML = open
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    };

    mobileToggle.addEventListener('click', () => {
      setMenuOpen(!navMenu.classList.contains('mobile-active'));
    });

    // Close mobile menu on nav link click
    links.forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    // Close on outside click or Escape
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-active') &&
          !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
        setMenuOpen(false);
        mobileToggle.focus();
      }
    });

    // Reset when resizing back to the desktop layout
    window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => {
      if (e.matches) setMenuOpen(false);
    });
  }
}

/* ==========================================================================
   3. Scroll Entrance Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   4. Projects Filtering (counts are computed from the cards themselves)
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-cyber-card');

  filterBtns.forEach(btn => {
    const filterValue = btn.getAttribute('data-filter');
    const count = filterValue === 'all'
      ? projectCards.length
      : Array.from(projectCards).filter(c => c.getAttribute('data-category') === filterValue).length;
    const label = btn.textContent.replace(/\s*\(\d+\)\s*$/, '').trim();
    btn.textContent = `${label} (${count})`;
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Project Lightbox Modal (with focus management)
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCat = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalLiveLink = document.getElementById('modal-live-link');

  if (!modal) return;

  let lastFocused = null;
  // While closed the dialog is only transparent, so `inert` keeps it out of the Tab order
  modal.inert = true;

  function openModal(data) {
    modalTitle.textContent = data.title || 'Proyecto';
    modalCat.textContent = data.category || '';
    // data-desc comes from our own static markup (trusted), it may contain <p>/<strong>
    modalDesc.innerHTML = data.desc || '';
    modalImg.src = data.image || 'img/workspace_setup.webp';
    modalImg.alt = data.title || 'Detalle del Proyecto';

    if (modalLiveLink) {
      if (data.live && data.live !== '#') {
        modalLiveLink.href = data.live;
        modalLiveLink.style.display = 'inline-flex';
        const isGithub = data.live.includes('github.com');
        modalLiveLink.innerHTML = isGithub
          ? '<span>Ver en GitHub</span> <i class="fab fa-github" aria-hidden="true"></i>'
          : '<span>Visitar Sitio Web</span> <i class="fas fa-external-link-alt" aria-hidden="true"></i>';
      } else {
        modalLiveLink.style.display = 'none';
      }
    }

    if (modalTech) {
      modalTech.innerHTML = '';
      if (data.tech) {
        data.tech.split(',').map(t => t.trim()).forEach(t => {
          const span = document.createElement('span');
          span.textContent = t;
          modalTech.appendChild(span);
        });
      }
    }

    lastFocused = document.activeElement;
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  // Keep keyboard focus inside the dialog while it is open
  function trapFocus(e) {
    const focusables = Array.from(
      modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.project-cyber-card') || btn;

      openModal({
        title: parentCard.getAttribute('data-title'),
        category: parentCard.getAttribute('data-cat-label') || parentCard.getAttribute('data-category'),
        desc: parentCard.getAttribute('data-desc'),
        tech: parentCard.getAttribute('data-tech'),
        image: parentCard.getAttribute('data-image'),
        live: parentCard.getAttribute('data-live')
      });
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'Tab') trapFocus(e);
  });
}

/* ==========================================================================
   6. Copy Email & Toast System
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'perez10ariel@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('¡Correo copiado al portapapeles!');
    }).catch(() => {
      showToast('Email: ' + email);
    });
  });
}

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  // Restart the timer so a second toast isn't hidden early by the first one
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. Contact Form (opens the visitor's mail client)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    const subject = encodeURIComponent(`Nuevo mensaje de contacto: ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    window.location.href = `mailto:perez10ariel@gmail.com?subject=${subject}&body=${body}`;

    showToast(`¡Gracias ${name}! Abriendo tu cliente de correo...`);
    form.reset();
  });
}

/* ==========================================================================
   8. Floating Back to Top Button (visibility handled in initNavigation)
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ==========================================================================
   9. Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
