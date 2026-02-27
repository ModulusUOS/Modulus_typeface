document.addEventListener('DOMContentLoaded', function () {
  const typingArea = document.getElementById('typingArea');
  const mainSection = document.querySelector('.main-section');
  const patternBg = document.getElementById('patternBg');
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;
  const getTypingPlainText = () =>
    (typingArea?.textContent || '').replace(/\u200B/g, '').replace(/\u00A0/g, ' ').trim();

  function syncTypingPlaceholderState() {
    if (!typingArea) return;
    const isEmpty = getTypingPlainText().length === 0;
    typingArea.classList.toggle('is-empty', isEmpty);
  }

  function setMobileMenuState(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-open', open && isMobileViewport());
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }

  function closeMobileMenu() {
    setMobileMenuState(false);
  }

  syncTypingPlaceholderState();
  typingArea?.addEventListener('input', syncTypingPlaceholderState);
  typingArea?.addEventListener('focus', syncTypingPlaceholderState);
  typingArea?.addEventListener('blur', syncTypingPlaceholderState);

  // Mobile menu toggle
  navToggle?.addEventListener('click', function () {
    if (!isMobileViewport()) return;
    const isOpen = nav?.classList.contains('nav-open');
    setMobileMenuState(!isOpen);
  });

  // Smooth scroll for navigation
  navLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      closeMobileMenu();
    });
  });

  document.addEventListener('click', function (e) {
    if (!isMobileViewport() || !nav?.classList.contains('nav-open')) return;
    if (!(e.target instanceof Node)) return;
    if (nav.contains(e.target) || navMenu?.contains(e.target)) return;
    closeMobileMenu();
  });

  window.addEventListener('resize', function () {
    if (!isMobileViewport()) closeMobileMenu();
  });

  // Pattern background image generation
  if (patternBg) {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    let resizeTimer = null;

    function drawPattern() {
      if (!patternCtx) return;

      patternCanvas.width = window.innerWidth;
      patternCanvas.height = window.innerHeight;
      patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      patternCtx.fillStyle = '#fff';

      for (let i = 0; i < 50; i += 1) {
        const x = Math.random() * patternCanvas.width;
        const y = Math.random() * patternCanvas.height;
        const width = Math.random() * 100 + 20;
        const height = Math.random() * 200 + 50;
        patternCtx.fillRect(x, y, width, height);
      }

      patternBg.style.backgroundImage = `url(${patternCanvas.toDataURL()})`;
      patternBg.style.backgroundSize = 'cover';
    }

    drawPattern();

    window.addEventListener('resize', function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(drawPattern, 160);
    });
  }

  // Intersection Observer for section reveal
  const sections = document.querySelectorAll('.section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(50px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(section);
    });
  } else {
    sections.forEach((section) => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    });
  }

  // Concept row hover only on pointer devices
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.concept-row').forEach((row) => {
      row.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(20px)';
      });
      row.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
      });
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (typingArea) {
        typingArea.textContent = '';
        syncTypingPlaceholderState();
      }
    }

    if (e.key === 'Escape') {
      closeMobileMenu();
      typingArea?.blur();
    }
  });

  // Main section opacity on scroll
  if (mainSection) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        window.requestAnimationFrame(function () {
          const scrolled = window.pageYOffset;
          const mainHeight = mainSection.offsetHeight;
          if (mainHeight > 0) {
            const progress = Math.min(scrolled / mainHeight, 1);
            mainSection.style.opacity = String(1 - progress * 0.5);
          }
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  }

  // Keep pasted content plain text in contenteditable
  typingArea?.addEventListener('paste', function (e) {
    e.preventDefault();
    const plainText =
      e.clipboardData?.getData('text/plain') ||
      window.clipboardData?.getData('Text') ||
      '';

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      typingArea.textContent = `${typingArea.textContent || ''}${plainText}`;
      syncTypingPlaceholderState();
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(plainText);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    syncTypingPlaceholderState();
  });

  // Custom cursor for pointer devices
  if (mainSection && window.matchMedia('(pointer: fine)').matches) {
    const cursorEl = document.createElement('div');
    cursorEl.className = 'custom-cursor';
    cursorEl.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.2s ease;
    `;
    document.body.appendChild(cursorEl);

    mainSection.addEventListener('mousemove', function (e) {
      cursorEl.style.opacity = '1';
      cursorEl.style.left = `${e.clientX}px`;
      cursorEl.style.top = `${e.clientY}px`;
    });

    mainSection.addEventListener('mouseleave', function () {
      cursorEl.style.opacity = '0';
    });
  }
});
