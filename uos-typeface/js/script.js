// Main Interactive Typing
document.addEventListener('DOMContentLoaded', function() {
    const typingArea = document.getElementById('typingArea');
    const mainSection = document.querySelector('.main-section');

    // Focus on typing area on load
    setTimeout(() => {
        typingArea.focus();
    }, 500);

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Pattern background animation
    const patternBg = document.getElementById('patternBg');
    if (patternBg) {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = window.innerWidth;
        patternCanvas.height = window.innerHeight;
        const patternCtx = patternCanvas.getContext('2d');
        
        // Draw pattern
        function drawPattern() {
            patternCtx.fillStyle = '#fff';
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * patternCanvas.width;
                const y = Math.random() * patternCanvas.height;
                const width = Math.random() * 100 + 20;
                const height = Math.random() * 200 + 50;
                
                patternCtx.fillRect(x, y, width, height);
            }
        }
        
        drawPattern();
        patternBg.style.backgroundImage = `url(${patternCanvas.toDataURL()})`;
        patternBg.style.backgroundSize = 'cover';
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Concept rows hover effect
    document.querySelectorAll('.concept-row').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(20px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Download button functionality
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // 폰트 파일이 준비되면 이 부분의 주석을 해제하고 경로를 수정하세요
            /*
            e.preventDefault();
            const link = document.createElement('a');
            link.href = 'fonts/UOSTypeface.otf';
            link.download = 'UOSTypeface.otf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            */
            
            // 폰트 파일이 없을 때
            alert('서체 파일이 준비 중입니다.');
            e.preventDefault();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            typingArea.textContent = '';
            updateCircles();
        }
        
        // Escape to blur
        if (e.key === 'Escape') {
            typingArea.blur();
        }
    });

    // Parallax effect on scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const mainHeight = mainSection.offsetHeight;
                
                if (scrolled < mainHeight) {
                    const opacity = 1 - (scrolled / mainHeight) * 0.5;
                    mainSection.style.opacity = opacity;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Prevent typing area from losing contenteditable
    typingArea.addEventListener('blur', function() {
        setTimeout(() => {
            if (document.activeElement !== typingArea) {
                // Keep it editable
            }
        }, 100);
    });

    // Handle paste events to keep text only
    typingArea.addEventListener('paste', function(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
    });
});

// Gallery lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    document.querySelectorAll('.gallery-item-large img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

// Cursor enhancement for main section
document.addEventListener('DOMContentLoaded', function() {
    const mainSection = document.querySelector('.main-section');
    
    mainSection.addEventListener('mousemove', function(e) {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) {
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
                transition: transform 0.2s ease;
            `;
            document.body.appendChild(cursorEl);
        }
    });
});
