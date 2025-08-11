// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Course Swapping Functionality (Mobile Only)
class CourseSwapper {
    constructor() {
        this.courseCards = document.querySelectorAll('.course-card');
        this.courseDots = document.querySelectorAll('.course-dot');
        this.prevBtn = document.querySelector('.course-prev');
        this.nextBtn = document.querySelector('.course-next');
        this.currentCourse = 0;
        
        if (this.courseCards.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Add click events to navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevCourse());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextCourse());
        }
        
        // Add click events to dots
        this.courseDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToCourse(index));
        });
        
        // Add touch/swipe functionality
        this.addTouchSupport();
        
        // Initialize first course
        this.showCourse(0);
    }

    addTouchSupport() {
        const coursesContainer = document.querySelector('.courses-grid');
        if (!coursesContainer) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isSwiping = false;

        // Touch start
        coursesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });

        // Touch move
        coursesContainer.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if it's a horizontal swipe (more horizontal than vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isSwiping = true;
                e.preventDefault(); // Prevent default only when swiping
            }
        }, { passive: false });

        // Touch end
        coursesContainer.addEventListener('touchend', (e) => {
            if (!isSwiping || !startX || !endX) return;
            
            const diffX = startX - endX;
            const minSwipeDistance = 50;
            
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // Swipe left - go to next course
                    this.nextCourse();
                } else {
                    // Swipe right - go to previous course
                    this.prevCourse();
                }
            }
            
            // Reset values
            startX = 0;
            startY = 0;
            endX = 0;
            endY = 0;
            isSwiping = false;
        }, { passive: true });
    }
    
    showCourse(courseIndex) {
        // Hide all courses
        this.courseCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.courseDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected course
        this.courseCards[courseIndex].classList.add('active');
        this.courseDots[courseIndex].classList.add('active');
        
        this.currentCourse = courseIndex;
        
        // Update button states
        this.updateButtonStates();
    }
    
    nextCourse() {
        const nextIndex = (this.currentCourse + 1) % this.courseCards.length;
        this.showCourse(nextIndex);
    }
    
    prevCourse() {
        const prevIndex = this.currentCourse === 0 ? this.courseCards.length - 1 : this.currentCourse - 1;
        this.showCourse(prevIndex);
    }
    
    goToCourse(courseIndex) {
        this.showCourse(courseIndex);
    }
    
    updateButtonStates() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentCourse === 0 ? '0.5' : '1';
            this.prevBtn.style.cursor = this.currentCourse === 0 ? 'not-allowed' : 'pointer';
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentCourse === this.courseCards.length - 1 ? '0.5' : '1';
            this.nextBtn.style.cursor = this.currentCourse === this.courseCards.length - 1 ? 'not-allowed' : 'pointer';
        }
    }
}

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Hero Slider Functionality
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        // Add click event to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Start automatic sliding
        this.startAutoSlide();
        
        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }
    
    goToSlide(slideIndex) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Hide/Show on Scroll
let lastScrollTop = 0;
let scrollThreshold = 10;

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide navbar when scrolling down, show when scrolling up
    if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = currentScrollTop;
    }
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider
    new HeroSlider();
    
    // Observe elements for fade-in animation
    const elementsToAnimate = document.querySelectorAll(
        '.about-card, .importance-card, .course-card, .target-card, .contact-card, .stat-item'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Initialize counter animation
    initCounterAnimation();
    

});



// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2500; // 2.5 seconds for smoother animation
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = '+' + Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = '+' + target.toLocaleString();
                        // Add a subtle bounce effect when animation completes
                        counter.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            counter.style.transform = 'scale(1)';
                        }, 150);
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.3 }); // Trigger earlier for better UX
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Parallax Effect for Hero Section
function handleParallaxScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Button Click Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Form Validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
initLazyLoading();

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #007bff, #0066ff);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Main Consolidated Scroll Event Listener
function handleAllScroll() {
    handleNavbarScroll();
    handleParallaxScroll();
    
    // Scroll to top button visibility
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
}

// Performance optimization: Debounce scroll events
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

// Single scroll event listener with debouncing
const debouncedScrollHandler = debounce(handleAllScroll, 10);

// Add scroll event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', debouncedScrollHandler);

});

// Scroll to Section Function for Arrow
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Importance Card Enhancement
function initImportanceCards() {
    const importanceCards = document.querySelectorAll('.importance-card');
    
    importanceCards.forEach(card => {
        // Add keyboard support for accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.add('keyboard-active');
                setTimeout(() => {
                    card.classList.remove('keyboard-active');
                }, 2000);
            }
        });
        
        // Add focus styles for accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `معلومات عن: ${card.querySelector('h3').textContent}`);
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                // Show success message
                showFormMessage('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.', 'success');
                
                // Reset form
                this.reset();
                
                // In a real application, you would send the form data to a server here
                console.log('Form submitted successfully');
            }
        });
        
        // Add real-time validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error state
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        isValid = false;
    }
    
    // Validate email format
    if (field.type === 'email' && value && !isValidEmail(value)) {
        field.classList.add('error');
        isValid = false;
    }
    
    // Validate phone format (basic validation)
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        field.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - allows digits, spaces, dashes, and plus sign
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/[\s\-\(\)]/g, '').length >= 8;
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Style the message
    messageElement.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        text-align: center;
        font-weight: 600;
        ${type === 'success' ? 
            'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
            'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    // Insert message after the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Initialize importance cards when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Initialize course swapper (mobile only)
    new CourseSwapper();
    
    initImportanceCards();
    initCounterAnimation();
    initContactForm();
});

