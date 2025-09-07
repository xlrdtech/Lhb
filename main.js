// ===== L7S Hero Beast Gateway - Main JavaScript =====

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 L7S Hero Beast Gateway Loaded');
    
    // Initialize all components
    initScrollAnimations();
    initButtonEffects();
    initVideoOptimization();
    initAnalytics();
    initAccessibility();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('User prefers reduced motion - skipping animations');
        return;
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.offer-card, .content-card, .section-title');
    animateElements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(el);
    });
}

// ===== BUTTON EFFECTS =====
function initButtonEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-btn, .offer-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track button clicks
            trackButtonClick(this);
            
            // Add ripple effect
            createRipple(e, this);
        });

        // Add hover sound effect (optional)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Create ripple effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// ===== VIDEO OPTIMIZATION =====
function initVideoOptimization() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        
        if (iframe) {
            // Add loading optimization
            iframe.setAttribute('loading', 'lazy');
            
            // Handle video load events
            iframe.addEventListener('load', function() {
                console.log('📹 Video loaded successfully');
                container.classList.add('video-loaded');
            });

            // Add play button overlay for mobile optimization
            if (window.innerWidth <= 768) {
                addVideoPlayButton(container);
            }
        }
    });
}

// Add custom play button for mobile
function addVideoPlayButton(container) {
    const playButton = document.createElement('div');
    playButton.classList.add('video-play-button');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    
    // Style the play button
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        background: rgba(10, 132, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    playButton.addEventListener('click', function() {
        this.style.display = 'none';
        // Focus on iframe to start video
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.focus();
        }
    });
    
    container.appendChild(playButton);
}

// ===== ANALYTICS & TRACKING =====
function initAnalytics() {
    // Track page load
    console.log('📊 Beast Gateway Analytics Initialized');
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track scroll milestones
            if (scrollPercent >= 25 && scrollPercent < 50) {
                trackEvent('scroll', '25_percent');
            } else if (scrollPercent >= 50 && scrollPercent < 75) {
                trackEvent('scroll', '50_percent');
            } else if (scrollPercent >= 75 && scrollPercent < 100) {
                trackEvent('scroll', '75_percent');
            } else if (scrollPercent >= 100) {
                trackEvent('scroll', '100_percent');
            }
        }
    }, 250));

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('engagement', 'time_on_page', timeOnPage);
    });
}

// Track button clicks
function trackButtonClick(button) {
    const buttonText = button.textContent.trim();
    const buttonType = Array.from(button.classList).find(cls => 
        ['primary', 'secondary', 'accent', 'outline', 'ghost'].includes(cls)
    ) || 'unknown';
    
    console.log(`🎯 Button clicked: ${buttonText} (${buttonType})`);
    trackEvent('cta_click', buttonType, buttonText);
}

// Generic event tracking function
function trackEvent(category, action, label = '', value = 0) {
    // Log to console for development
    console.log(`📈 Event: ${category} | ${action} | ${label} | ${value}`);
    
    // Here you would integrate with your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    
    // Google Analytics 4 example:
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Custom analytics example:
    if (window.customAnalytics) {
        window.customAnalytics.track(category, action, label, value);
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.cta-btn, .offer-btn, .offer-card');
    
    interactiveElements.forEach(element => {
        // Add tabindex if not already present
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event listeners
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add ARIA labels where needed
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe && !iframe.hasAttribute('title')) {
            iframe.setAttribute('title', 'Beast Gateway Introduction Video');
        }
    });

    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.setAttribute('data-focused', 'true');
        });
        
        element.addEventListener('blur', function() {
            this.removeAttribute('data-focused');
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`⚡ Page load time: ${loadTime}ms`);
        trackEvent('performance', 'page_load_time', '', loadTime);
    }
    
    // Log paint metrics if available
    if (window.performance && window.performance.getEntriesByType) {
        const paintEntries = window.performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
            trackEvent('performance', entry.name, '', Math.round(entry.startTime));
        });
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
    trackEvent('error', 'javascript_error', e.error.message);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    trackEvent('error', 'promise_rejection', e.reason);
});

// ===== DEVELOPMENT HELPERS =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected');
    
    // Add development helpers
    window.beastGateway = {
        trackEvent,
        debounce,
        throttle,
        isInViewport
    };
    
    // Add visual debugging
    console.log(`
    🦁 L7S Hero Beast Gateway Debug Info:
    - Hostname: ${window.location.hostname}
    - User Agent: ${navigator.userAgent}
    - Screen: ${screen.width}x${screen.height}
    - Viewport: ${window.innerWidth}x${window.innerHeight}
    - Reduced Motion: ${window.matchMedia('(prefers-reduced-motion: reduce)').matches}
    `);
}

console.log('✨ Beast Gateway JavaScript fully loaded and optimized!');