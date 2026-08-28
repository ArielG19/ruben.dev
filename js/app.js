/**
 * Ruben Perez Portfolio - Modern Interactive JS
 * GitHub Pages Compatible (Pure Vanilla ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initThemeSwitcher();
  initNavigation();
  initTypewriter();
  initStatsCounter();
  initProjectFilter();
  initProjectModal();
  initCopyEmail();
  initContactForm();
  initScrollAnimations();
  initBackToTop();
  initCardTilt();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('ruben_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default to dark mode
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('ruben_portfolio_theme', currentTheme);
    updateThemeIcon(currentTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
    icon.setAttribute('title', 'Cambiar a modo claro');
  } else {
    icon.className = 'fas fa-moon';
    icon.setAttribute('title', 'Cambiar a modo oscuro');
  }
}

/* ==========================================================================
   2. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
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
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const isExpanded = navLinks.classList.contains('mobile-active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking a link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      if (correspondingLink) correspondingLink.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const targetElement = document.getElementById('typewriter-text');
  if (!targetElement) return;

  const words = [
    'Desarrollador Front-End',
    'Especialista Angular & WordPress',
    'Creador de Plugins WordPress',
    'Conectores & Skills (Claude / ChatGPT)',
    'Maquetador Responsive & CSS',
    'Especialista SEO & Performance'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      targetElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      targetElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   4. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = Math.max(Math.floor(duration / target), 30);

          const timer = setInterval(() => {
            count += 1;
            stat.textContent = count + suffix;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

/* ==========================================================================
   5. Projects Filtering
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
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
  const closeBtn = document.getElementById('modal-close');
  const previewBtns = document.querySelectorAll('.btn-preview');

  if (!modal) return;

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (!card) return;

      const title = card.querySelector('.project-title')?.textContent || 'Proyecto';
      const category = card.querySelector('.project-category')?.textContent || 'Desarrollo Web';
      const description = card.getAttribute('data-description') || 'Descripción del proyecto.';
      const imgSrc = card.querySelector('.project-img')?.getAttribute('src') || '';
      const techList = card.getAttribute('data-tech') || 'HTML, CSS, JS';
      const liveUrl = card.getAttribute('data-live') || '#';

      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-category').textContent = category;
      document.getElementById('modal-description').textContent = description;
      document.getElementById('modal-image').setAttribute('src', imgSrc);
      document.getElementById('modal-image').setAttribute('alt', title);
      
      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = techList.split(',').map(tech => 
        `<span class="tech-badge">${tech.trim()}</span>`
      ).join('');

      const liveBtn = document.getElementById('modal-live-link');
      if (liveUrl && liveUrl !== '#') {
        liveBtn.href = liveUrl;
        liveBtn.style.display = 'inline-flex';
      } else {
        liveBtn.style.display = 'none';
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
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
   7. Copy Email Toast Notification
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'perez10ariel@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('¡Correo copiado al portapapeles! 📋');
    }).catch(err => {
      console.error('Error al copiar correo:', err);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   8. Contact Form Validation & Submission Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showFormStatus('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando mensaje...';

    // Send email via FormSubmit AJAX service directly to perez10ariel@gmail.com
    fetch('https://formsubmit.co/ajax/perez10ariel@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        Nombre: nameInput.value.trim(),
        Email: emailInput.value.trim(),
        Mensaje: messageInput.value.trim(),
        _subject: '🚀 ¡Nuevo mensaje desde tu portafolio ruben.dev!'
      })
    })
    .then(response => response.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showFormStatus('¡Mensaje enviado con éxito! Te responderé lo antes posible a tu correo. 🚀', 'success');
      form.reset();
    })
    .catch(error => {
      console.error('Error enviando formulario:', error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showFormStatus('Hubo un inconveniente al enviar. Puedes escribirme directamente a perez10ariel@gmail.com', 'error');
    });
  });
}

function showFormStatus(msg, type) {
  const formStatus = document.getElementById('form-status');
  if (!formStatus) return;

  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';

  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 5000);
}

/* ==========================================================================
   9. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
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
   11. Interactive 3D Card Tilt Effect (Vanilla JS)
   ========================================================================== */
function initCardTilt() {
  // Only activate on devices that support hover (prevents interfering with touch devices)
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltElements = document.querySelectorAll('.project-card, .avatar-card');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle dynamic tilt degrees (max 6deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      setTimeout(() => {
        card.style.transform = '';
      }, 180);
    });
  });
}

