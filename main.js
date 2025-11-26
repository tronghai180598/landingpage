// ===========================
// Smooth Scroll Enhancement
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===========================
// Modal Functionality
// ===========================
function setupModals() {
    // Open modal
    document.querySelectorAll('.clickable-item').forEach(item => {
        item.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', setupModals);

// ===========================
// Author Toggle Functionality
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const authorToggle = document.getElementById('authorToggle');
    const authorContent = document.getElementById('authorContent');
    
    if (authorToggle && authorContent) {
        authorToggle.addEventListener('click', function() {
            const isHidden = authorContent.style.display === 'none';
            
            if (isHidden) {
                authorContent.style.display = 'block';
                authorContent.classList.remove('hidden');
                authorToggle.classList.add('active');
                // Smooth animation
                setTimeout(() => {
                    authorContent.style.opacity = '1';
                }, 10);
            } else {
                authorContent.classList.add('hidden');
                authorToggle.classList.remove('active');
                setTimeout(() => {
                    authorContent.style.display = 'none';
                }, 400);
            }
        });
    }
});

// ===========================
// Scroll Animation for Elements
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and items
document.querySelectorAll('.gallery-item, .video-card, .detail-card, .highlight-item').forEach(el => {
    observer.observe(el);
});

// ===========================
// Video Play Button Interaction
// ===========================
document.querySelectorAll('.play-button-overlay').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const videoId = this.getAttribute('data-video');
        const videoElement = document.getElementById(videoId);
        
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                this.classList.add('hidden');
            } else {
                videoElement.pause();
                this.classList.remove('hidden');
            }
        }
    });
});

// Show play button again when video ends
document.querySelectorAll('.video-element').forEach(video => {
    video.addEventListener('ended', function() {
        const videoId = this.id;
        const button = document.querySelector(`[data-video="${videoId}"]`);
        if (button) {
            button.classList.remove('hidden');
        }
    });
    
    // Show play button when video is paused
    video.addEventListener('pause', function() {
        const videoId = this.id;
        const button = document.querySelector(`[data-video="${videoId}"]`);
        if (button && this.currentTime > 0 && !this.ended) {
            button.classList.remove('hidden');
        }
    });
});

// ===========================
// Dynamic Content Loading
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Add any dynamic content here
    console.log('Landing page loaded successfully!');
});

// ===========================
// Add CSS for Fade In Up Animation
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Mobile Menu Toggle (if needed)
// ===========================
function setupMobileMenu() {
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth <= 768) {
        navbar.style.flexWrap = 'wrap';
    }
}

window.addEventListener('resize', setupMobileMenu);
setupMobileMenu();

// ===========================
// Scroll to Top Button
// ===========================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#003d80';
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#0066cc';
        button.style.transform = 'scale(1)';
    });
}

createScrollToTopButton();

// ===========================
// Navbar Background on Scroll
// ===========================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.1)';
    }
});

// ===========================
// Counter Animation for Stats
// ===========================
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = element.textContent;
                const numericValue = parseInt(finalValue);
                
                if (!isNaN(numericValue)) {
                    let currentValue = 0;
                    const increment = numericValue / 30;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            element.textContent = finalValue;
                            clearInterval(counter);
                        } else {
                            element.textContent = Math.floor(currentValue) + '+';
                        }
                    }, 30);
                }
                
                observerStats.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observerStats.observe(stat));
}

animateCounters();

// ===========================
// Hover Effects for Gallery Items
// ===========================
document.querySelectorAll('.gallery-item, .video-card').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

console.log('All interactive features loaded successfully!');
