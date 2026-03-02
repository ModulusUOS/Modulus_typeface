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

  /* 한글만 50% 축소 처리 */

  const KOREAN_REGEX = /([\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]+)/g;

  function formatKoreanTextPreserveCaret() {
    if (!typingArea) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const caretOffset = range.startOffset;

    const plainText = typingArea.textContent || '';
    const formattedHTML = plainText.replace(
      KOREAN_REGEX,
      '<span class="korean-char">$1</span>'
    );

    typingArea.innerHTML = formattedHTML;

    // 커서 복구
    placeCaretAtEnd(typingArea);
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ============================= */

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

  typingArea?.addEventListener('input', function () {
    formatKoreanTextPreserveCaret();
    syncTypingPlaceholderState();
  });

  typingArea?.addEventListener('focus', syncTypingPlaceholderState);
  typingArea?.addEventListener('blur', syncTypingPlaceholderState);

  /* ===== 모바일 메뉴 ===== */

  navToggle?.addEventListener('click', function () {
    if (!isMobileViewport()) return;
    const isOpen = nav?.classList.contains('nav-open');
    setMobileMenuState(!isOpen);
  });

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

  /* ===== Pattern Background ===== */

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

  /* ===== 붙여넣기 시 일반 텍스트 유지 ===== */

  typingArea?.addEventListener('paste', function (e) {
    e.preventDefault();
    const plainText =
      e.clipboardData?.getData('text/plain') ||
      window.clipboardData?.getData('Text') ||
      '';

    document.execCommand('insertText', false, plainText);
  });
});
