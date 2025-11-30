// Main Interactive Typing with Canvas Circles
document.addEventListener('DOMContentLoaded', function() {
    const typingArea = document.getElementById('typingArea');
    const canvas = document.getElementById('circleCanvas');
    const ctx = canvas.getContext('2d');
    const mainSection = document.querySelector('.main-section');
    
    let circles = [];
    let isMouseOver = false;
    let animationFrame;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Circle class
    class Circle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = Math.random() * 15 + 10;
            this.opacity = 0;
            this.growing = true;
        }

        update() {
            if (isMouseOver) {
                if (this.growing) {
                    this.radius += 1;
                    this.opacity += 0.05;
                    if (this.radius >= this.maxRadius) {
                        this.growing = false;
                        this.opacity = 1;
                    }
                }
            } else {
                this.radius -= 1;
                this.opacity -= 0.05;
                if (this.radius <= 0) {
                    this.radius = 0;
                    this.opacity = 0;
                }
            }
        }

        draw() {
            if (this.radius > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }
    }

    // Get text positions
    function getTextPositions() {
        const text = typingArea.textContent || '';
        const lines = text.split('\n');
        const positions = [];
        
        const style = window.getComputedStyle(typingArea);
        const fontSize = parseInt(style.fontSize);
        const lineHeight = fontSize * 1.1;
        const padding = parseInt(style.padding);
        
        lines.forEach((line, lineIndex) => {
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char.trim() === '') continue;
                
                // Approximate position
                const x = padding + (i * fontSize * 0.6) + Math.random() * fontSize * 0.3;
                const y = padding + (lineIndex * lineHeight) + fontSize * 0.4 + Math.random() * fontSize * 0.2;
                
                positions.push({ x, y });
            }
        });
        
        return positions;
    }

    // Update circles based on text
    function updateCircles() {
        const positions = getTextPositions();
        const targetCount = positions.length;
        
        // Add new circles if needed
        while (circles.length < targetCount) {
            const pos = positions[circles.length];
            circles.push(new Circle(pos.x, pos.y));
        }
        
        // Remove excess circles
        while (circles.length > targetCount) {
            circles.pop();
        }
        
        // Update positions for existing circles
        circles.forEach((circle, i) => {
            if (positions[i]) {
                circle.targetX = positions[i].x;
                circle.targetY = positions[i].y;
            }
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        circles.forEach(circle => {
            circle.update();
            circle.draw();
        });
        
        animationFrame = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Update circles on typing
    typingArea.addEventListener('input', updateCircles);

    // Mouse events
    mainSection.addEventListener('mouseenter', function() {
        isMouseOver = true;
    });

    mainSection.addEventListener('mouseleave', function() {
        isMouseOver = false;
    });

    // Focus on typing area on load
    setTimeout(() => {
        typingArea.focus();
    }, 500);

    // Initial circle update
    updateCircles();

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
