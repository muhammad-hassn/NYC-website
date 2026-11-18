/**
 * NEYC CONSULTING — Production Demo Script
 * Vanilla JavaScript (clean, accessible, performant)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header Elevation ---
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer .btn');

  const openMobileMenu = () => {
    mobileToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- 3. Scroll Reveal via IntersectionObserver ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion or no IntersectionObserver, display immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 4. Accessible FAQ Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for a clean single-open accordion experience
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support for Accordion
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const triggers = Array.from(document.querySelectorAll('.accordion-trigger'));
        const currentIndex = triggers.indexOf(trigger);
        const nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % triggers.length 
          : (currentIndex - 1 + triggers.length) % triggers.length;
        triggers[nextIndex]?.focus();
      }
    });
  });

  // --- 5. Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --- 6. Modal System (Erstgespräch / Impressum / Datenschutz) ---
  let previousActiveElement = null;

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    previousActiveElement = document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  // Wire up CTA buttons to open Contact Modal
  const consultationTriggers = document.querySelectorAll('[data-open-modal="contact-modal"]');
  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('contact-modal');
    });
  });

  // Legal modal triggers
  const impressumTrigger = document.querySelector('[data-open-modal="impressum-modal"]');
  if (impressumTrigger) {
    impressumTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('impressum-modal');
    });
  }

  const datenschutzTrigger = document.querySelector('[data-open-modal="datenschutz-modal"]');
  if (datenschutzTrigger) {
    datenschutzTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('datenschutz-modal');
    });
  }

  // Close modal when clicking close button or backdrop
  const allModals = document.querySelectorAll('.modal-overlay');
  allModals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  // --- 7. Consultation Form Demo Submission ---
  const contactForm = document.getElementById('consultation-form');
  const formSuccessBanner = document.getElementById('form-success-banner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Wird gesendet...';
      }

      // Simulate prompt confirmation
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Anfrage absenden';
        }
        contactForm.reset();
        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'block';
          formSuccessBanner.setAttribute('tabindex', '-1');
          formSuccessBanner.focus();
        }
      }, 700);
    });
  }

  // --- 8. Smooth Scroll for in-page anchors with offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});

