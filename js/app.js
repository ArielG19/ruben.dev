/**
 * Rubén Pérez Portfolio — NeoVision Interactive Engine
 * Modular Vanilla ES6+ (GitHub Pages Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavigation();
  initScrollAnimations();
  initStatsCounter();
  initServicesCarousel();
  initProjectFilter();
  initProjectModal();
  initCopyEmail();
  initContactForm();
  initBackToTop();
  initCardTilt();
  initCopyrightYear();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('ruben_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('ruben_portfolio_theme', currentTheme);
    updateThemeIcon(currentTheme);
    showToast(currentTheme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado');
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-moon';
      themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
    } else {
      themeIcon.className = 'fas fa-sun';
      themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
    }
  }
}

/* ==========================================================================
   2. Header & Navigation (Scroll States, Active Links & Mobile Drawer)
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  // Sticky header background shift on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const isExpanded = navMenu.classList.contains('mobile-active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu on nav link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 160;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

    if (navLink) {
      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
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
   4. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number-count');
  let hasAnimated = false;

  function runCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeProgress * target);

        stat.textContent = `${currentCount}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsSection = statNumbers[0].closest('section') || statNumbers[0];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. Projects Filtering
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-cyber-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

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
   6. Project Lightbox Modal
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

  function openModal(data) {
    modalTitle.textContent = data.title || 'Proyecto';
    modalCat.textContent = data.category || '';
    modalDesc.textContent = data.desc || '';
    modalImg.src = data.image || 'img/workspace_setup.png';
    modalImg.alt = data.title || 'Detalle del Proyecto';

    if (modalLiveLink) {
      if (data.live && data.live !== '#') {
        modalLiveLink.href = data.live;
        modalLiveLink.style.display = 'inline-flex';
        const isGithub = data.live.includes('github.com');
        modalLiveLink.innerHTML = isGithub
          ? '<span>Ver en GitHub</span> <i class="fab fa-github"></i>'
          : '<span>Visitar Sitio Web</span> <i class="fas fa-external-link-alt"></i>';
      } else {
        modalLiveLink.style.display = 'none';
      }
    }

    if (modalTech) {
      modalTech.innerHTML = '';
      if (data.tech) {
        const techs = data.tech.split(',').map(t => t.trim());
        techs.forEach(t => {
          const span = document.createElement('span');
          span.textContent = t;
          modalTech.appendChild(span);
        });
      }
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind click on preview buttons
  document.querySelectorAll('.btn-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.project-cyber-card') || btn;
      
      const data = {
        title: parentCard.getAttribute('data-title'),
        category: parentCard.getAttribute('data-cat-label') || parentCard.getAttribute('data-category'),
        desc: parentCard.getAttribute('data-desc'),
        tech: parentCard.getAttribute('data-tech'),
        image: parentCard.getAttribute('data-image'),
        live: parentCard.getAttribute('data-live')
      };

      openModal(data);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Copy Email & Toast System
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

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   8. Contact Form
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
   9. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. Interactive 3D Card Tilt Effect
   ========================================================================== */
function initCardTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (window.innerWidth < 992) return; // Disable on touch devices

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   11. Services Horizontal Carousel Controls & Auto-Slide
   ========================================================================== */
function initServicesCarousel() {
  const prevBtn = document.getElementById('srv-prev');
  const nextBtn = document.getElementById('srv-next');
  const track = document.getElementById('services-track');

  if (!track || !prevBtn || !nextBtn) return;

  function getScrollAmount() {
    const firstCard = track.querySelector('.service-cyber-card');
    return firstCard ? firstCard.offsetWidth + 32 : 360;
  }

  function scrollNext() {
    const scrollAmount = getScrollAmount();
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScrollLeft - 25) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function scrollPrev() {
    const scrollAmount = getScrollAmount();
    if (track.scrollLeft <= 25) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  nextBtn.addEventListener('click', () => {
    scrollNext();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    scrollPrev();
    resetAutoSlide();
  });

  // Auto-desplazamiento suave cada 3.8 segundos
  let autoSlideTimer = setInterval(scrollNext, 3800);

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(scrollNext, 3800);
  }

  // Pausar auto-desplazamiento al pasar el ratón o tocar
  track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  track.addEventListener('mouseleave', () => resetAutoSlide());
  track.addEventListener('touchstart', () => clearInterval(autoSlideTimer), { passive: true });
  track.addEventListener('touchend', () => resetAutoSlide(), { passive: true });
}

/* ==========================================================================
   12. Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

