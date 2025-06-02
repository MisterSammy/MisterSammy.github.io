// Performance optimized JavaScript for portfolio
// Utility functions for performance
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Intersection Observer for performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Matrix Rain Background Effect - Optimized
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        if (!this.canvas) {
            console.warn('Matrix canvas element not found - matrix effect will not display');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.lastTime = 0;
        this.fps = 30; // Reduced FPS for better performance
        this.fpsInterval = 1000 / this.fps;
        
        this.resize();
        this.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Throttled resize handler
        window.addEventListener('resize', throttle(() => this.resize(), 250));
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / 20);
        this.drops = new Array(this.columns).fill(1);
    }

    init() {
        this.matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+=[]{}|;:,.<>?";
        this.start();
    }

    draw(currentTime) {
        // Control FPS
        if (currentTime - this.lastTime < this.fpsInterval) {
            this.animationId = requestAnimationFrame((time) => this.draw(time));
            return;
        }
        this.lastTime = currentTime;

        // Semi-transparent background for fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Matrix green color
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = '15px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.matrix[Math.floor(Math.random() * this.matrix.length)];
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);

            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame((time) => this.draw(time));
    }

    start() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame((time) => this.draw(time));
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Optimized Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 30; // Reduced for performance
        this.animationId = null;
        this.lastTime = 0;
        this.fps = 60;
        this.fpsInterval = 1000 / this.fps;
        
        this.init();
    }

    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    }

    createParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: Math.random() * 100 + 50
        };
    }

    animate(currentTime = 0) {
        if (currentTime - this.lastTime < this.fpsInterval) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastTime = currentTime;

        // Only animate if particles container exists and is visible
        const container = document.querySelector('.hero');
        if (!container) return;

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            if (particle.life <= 0 || particle.x < 0 || particle.x > window.innerWidth || 
                particle.y < 0 || particle.y > window.innerHeight) {
                this.particles[index] = this.createParticle();
            }
        });

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    html.setAttribute('data-theme', savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    
    if (!mobileToggle || !navCenter) return;
    
    mobileToggle.addEventListener('click', () => {
        navCenter.classList.toggle('mobile-menu-open');
        mobileToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navCenter.classList.remove('mobile-menu-open');
            mobileToggle.classList.remove('active');
        });
    });
}

// Smooth Scrolling with performance optimization
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Optimized Skill Bar Animation with Intersection Observer
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Use CSS transition for smooth animation
                requestAnimationFrame(() => {
                    progressBar.style.width = width + '%';
                });
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Typing Effect for Hero Terminal
function initTypingEffect() {
    const terminalText = document.querySelector('.terminal-text');
    if (!terminalText) return;
    
    const originalContent = terminalText.innerHTML;
    
    // Parse the content into segments (text and HTML tags)
    const segments = [];
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContent;
    
    function parseNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Split text by lines but keep them as separate segments
            const lines = node.textContent.split('\n');
            lines.forEach((line, index) => {
                if (line.trim()) {
                    // Split each line into characters
                    for (let char of line) {
                        segments.push({ type: 'char', content: char });
                    }
                }
                // Add line break after each line except the last
                if (index < lines.length - 1) {
                    segments.push({ type: 'break', content: '\n' });
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Add opening tag
            segments.push({ 
                type: 'html', 
                content: '<' + node.tagName.toLowerCase() + 
                    (node.className ? ' class="' + node.className + '"' : '') + '>' 
            });
            
            // Parse children
            for (let child of node.childNodes) {
                parseNode(child);
            }
            
            // Add closing tag
            segments.push({ 
                type: 'html', 
                content: '</' + node.tagName.toLowerCase() + '>' 
            });
        }
    }
    
    // Parse all child nodes
    for (let child of tempDiv.childNodes) {
        parseNode(child);
    }
    
    // Clear terminal and start typing animation
    terminalText.innerHTML = '';
    let currentSegment = 0;
    
    function typeNextSegment() {
        if (currentSegment >= segments.length) return;
        
        const segment = segments[currentSegment];
        
        if (segment.type === 'char') {
            terminalText.innerHTML += segment.content;
            currentSegment++;
            setTimeout(typeNextSegment, 30);
        } else if (segment.type === 'break') {
            terminalText.innerHTML += segment.content;
            currentSegment++;
            setTimeout(typeNextSegment, 100);
        } else if (segment.type === 'html') {
            terminalText.innerHTML += segment.content;
            currentSegment++;
            setTimeout(typeNextSegment, 50);
        }
    }
    
    // Start typing with delay
    setTimeout(typeNextSegment, 500);
}

// Optimized Parallax Effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Glitch Effect for specific elements
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.text-gradient');
    const phpDeveloperElement = document.querySelector('.php-developer-text');
    
    const addGlitch = (element, intensity = 1) => {
        // More intense glitch with multiple layered effects
        const glitchVariations = [
            `
                ${4 * intensity}px 0 #ff007f,
                ${-4 * intensity}px 0 #00ffff,
                0 ${4 * intensity}px #00ff41,
                ${2 * intensity}px ${2 * intensity}px #ff3366,
                ${-2 * intensity}px ${-2 * intensity}px #33ccff
            `,
            `
                ${6 * intensity}px 0 #ff0066,
                ${-6 * intensity}px 0 #0099ff,
                0 ${6 * intensity}px #66ff00,
                ${3 * intensity}px ${-3 * intensity}px #ff6600,
                ${-3 * intensity}px ${3 * intensity}px #cc00ff
            `,
            `
                ${8 * intensity}px 0 #ff3399,
                ${-8 * intensity}px 0 #33ccff,
                0 ${8 * intensity}px #99ff33,
                ${4 * intensity}px ${4 * intensity}px #ff9933,
                ${-4 * intensity}px ${-4 * intensity}px #9933ff
            `,
            // Extra intense variation for PHP Developer
            `
                ${10 * intensity}px 0 #ff0044,
                ${-10 * intensity}px 0 #0044ff,
                0 ${10 * intensity}px #44ff00,
                ${5 * intensity}px ${-5 * intensity}px #ff4400,
                ${-5 * intensity}px ${5 * intensity}px #4400ff,
                ${2 * intensity}px ${8 * intensity}px #ff8800,
                ${-2 * intensity}px ${-8 * intensity}px #8800ff
            `
        ];
        
        const randomVariation = glitchVariations[Math.floor(Math.random() * glitchVariations.length)];
        
        // Apply intense glitch effect
        element.style.textShadow = randomVariation;
        element.style.animation = `glitch-shake ${0.15 / intensity}s ease-in-out`;
        
        // Add random text transform for extra chaos
        const transforms = [
            `skewX(${5 * intensity}deg)`, 
            `skewX(${-5 * intensity}deg)`, 
            `scaleY(${1 + 0.1 * intensity})`, 
            `scaleY(${1 - 0.1 * intensity})`,
            `rotate(${2 * intensity}deg)`,
            `rotate(${-2 * intensity}deg)`
        ];
        const randomTransform = transforms[Math.floor(Math.random() * transforms.length)];
        element.style.transform = randomTransform;
        
        // Random duration between 100-400ms for varied effect, shorter for higher intensity
        const duration = (100 + Math.random() * 300) / intensity;
        
        setTimeout(() => {
            element.style.textShadow = 'none';
            element.style.animation = '';
            element.style.transform = '';
        }, duration);
    };
    
    // Much more frequent glitch effect - 30% chance every 800ms
    const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7 && glitchElements.length > 0) {
            const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
            const intensity = randomElement === phpDeveloperElement ? 1.5 : 1;
            addGlitch(randomElement, intensity);
        }
    }, 800);
    
    // Additional aggressive glitch specifically for "PHP Developer" every 2 seconds
    const phpDeveloperGlitch = setInterval(() => {
        if (phpDeveloperElement) {
            addGlitch(phpDeveloperElement, 2); // Double intensity for PHP Developer
        }
    }, 2000);
    
    // Extra random bursts of glitches for PHP Developer every 5-8 seconds
    const phpBurstGlitch = setInterval(() => {
        if (phpDeveloperElement && Math.random() > 0.3) {
            // Rapid-fire glitch burst
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    addGlitch(phpDeveloperElement, 1.8);
                }, i * 150);
            }
        }
    }, 5000 + Math.random() * 3000);
    
    // Clean up intervals when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(glitchInterval);
            clearInterval(phpDeveloperGlitch);
            clearInterval(phpBurstGlitch);
        }
    });
}

// Optimized Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const start = Date.now();
                
                const updateCounter = () => {
                    const elapsed = Date.now() - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(target * easeOutQuart);
                    
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.project-card, .case-study-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
    });
}

// Navigation scroll effect
function initNavScrollEffect() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    let ticking = false;
    
    const updateNav = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.style.background = 'color-mix(in oklch, var(--color-base-100) 98%, transparent)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'color-mix(in oklch, var(--color-base-100) 95%, transparent)';
            nav.style.backdropFilter = 'blur(10px)';
        }
        
        ticking = false;
    };
    
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle first
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize all effects with performance considerations
    if ('IntersectionObserver' in window) {
        // Only initialize if IntersectionObserver is supported
        animateSkillBars();
        animateCounters();
    }
    
    // Initialize other features
    initSmoothScrolling();
    initTypingEffect();
    initGlitchEffect();
    initCardEffects();
    initNavScrollEffect();
    
    // Initialize background effects - Matrix effect always runs
    new MatrixRain();
    
    // Initialize particle system and parallax only if not on mobile for performance
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        new ParticleSystem();
        initParallaxEffect();
    }
    
    // Add loading animation
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
    
    // Service Worker registration for caching (if you want to add PWA features)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // navigator.serviceWorker.register('/sw.js'); // Uncomment if you add a service worker
        });
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    // Cancel any running animations
    const matrixCanvas = document.getElementById('matrix-bg');
    if (matrixCanvas && matrixCanvas.matrixRain) {
        matrixCanvas.matrixRain.stop();
    }
}); 