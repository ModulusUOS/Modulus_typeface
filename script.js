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

  /* 영문만 1.5배 확대(한글 기준 1em). */
  const KOREAN_CHAR_REGEX = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;
  const LATIN_CHAR_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

  /* 커서 위치를 텍스트 오프셋(문자 수)으로 저장 */
  function getCaretOffset(el) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return 0;
    const range = sel.getRangeAt(0);
    const pre = document.createRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.endContainer, range.endOffset);
    return pre.toString().length;
  }

  /* 텍스트 오프셋으로 커서를 복원 */
  function setCaretOffset(el, offset) {
    const sel = window.getSelection();
    const range = document.createRange();
    let remaining = offset;
    let found = false;

    function traverse(node) {
      if (found) return;
      if (node.nodeType === Node.TEXT_NODE) {
        if (remaining <= node.length) {
          range.setStart(node, remaining);
          range.setEnd(node, remaining);
          found = true;
        } else {
          remaining -= node.length;
        }
      } else {
        for (const child of node.childNodes) {
          traverse(child);
          if (found) return;
        }
      }
    }

    traverse(el);
    if (!found) {
      range.selectNodeContents(el);
      range.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  function formatMixedText() {
    if (!typingArea) return;

    const caretOffset = getCaretOffset(typingArea);
    const plainText = typingArea.textContent || '';
    const formattedHTML = plainText
      .split('')
      .map((char) => {
        if (KOREAN_CHAR_REGEX.test(char)) return `<span class=\"korean-char\">${char}</span>`;
        if (LATIN_CHAR_REGEX.test(char)) return `<span class=\"latin-char\">${char}</span>`;
        return char;
      })
      .join('');

    typingArea.innerHTML = formattedHTML;
    setCaretOffset(typingArea, caretOffset);
  }

  function scheduleMixedFormat() {
    if (!typingArea) return;
    setTimeout(() => {
      requestAnimationFrame(() => {
        formatMixedText();
        syncTypingPlaceholderState();
      });
    }, 0);
  }

  let isComposing = false;
  
  typingArea?.addEventListener('compositionstart', () => {
    isComposing = true;
    typingArea.classList.remove('is-empty');
  });

  typingArea?.addEventListener('compositionend', () => {
    isComposing = false;
    scheduleMixedFormat();
  });

  typingArea?.addEventListener('input', function (event) {
    if (isComposing || event.isComposing) return;
    formatMixedText();
    syncTypingPlaceholderState();
  });

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

  /* ===== 드래그 중 I-빔 커서 방지 ===== */
  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('#typingArea')) {
      document.body.classList.add('is-dragging');
    }
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('is-dragging');
  });

  /* ===== 붙여넣기 일반 텍스트 유지 ===== */

  typingArea?.addEventListener('paste', function (e) {
    e.preventDefault();
    const plainText =
      e.clipboardData?.getData('text/plain') ||
      window.clipboardData?.getData('Text') ||
      '';
    document.execCommand('insertText', false, plainText);
  });
});
