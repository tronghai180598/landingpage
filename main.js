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
// Dynamic Content Loading
// ===========================
document.addEventListener('DOMContentLoaded', () => {
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
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
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
    if (!navbar) return;

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
                const finalValue = element.textContent.replace('+', '');
                const numericValue = parseInt(finalValue);
                
                if (!isNaN(numericValue)) {
                    let currentValue = 0;
                    const increment = numericValue / 30;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                            if (currentValue >= numericValue) {
                            element.textContent = numericValue + '+';
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
// Video Play Button Interaction
// ===========================
document.querySelectorAll('.play-button-overlay').forEach(button => {
    button.addEventListener('click', () => {
        const videoId = button.getAttribute('data-video');
        const video = document.getElementById(videoId);
        if (!video) return;

        if (video.paused) {
            // Pause all other videos
            document.querySelectorAll('.video-element').forEach(v => {
                if (v !== video) {
                    v.pause();
                    const btn = document.querySelector(`.play-button-overlay[data-video="${v.id}"]`);
                    if (btn) btn.style.opacity = '0.9';
                }
            });

            video.play();
            button.style.opacity = '0';
        } else {
            video.pause();
            button.style.opacity = '0.9';
        }
    });
});

// Optional: show play button again when video ends
document.querySelectorAll('.video-element').forEach(video => {
    video.addEventListener('ended', () => {
        const btn = document.querySelector(`.play-button-overlay[data-video="${video.id}"]`);
        if (btn) btn.style.opacity = '0.9';
    });
});
// ===========================
// Gallery modals open / close
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.clickable-item');
    const modals = document.querySelectorAll('.modal');

    items.forEach(item => {
        const modalId = item.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (!modal) return;

        item.addEventListener('click', () => {
            modal.classList.add('open');
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('open');
            });
        }

        // đóng khi click ra ngoài
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });
});

console.log('All interactive features loaded successfully!');
