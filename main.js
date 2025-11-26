// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===========================
// Author Toggle
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const authorToggle = document.getElementById('authorToggle');
    const authorContent = document.getElementById('authorContent');
    
    if (authorToggle && authorContent) {
        // start opened
        authorContent.style.maxHeight = authorContent.scrollHeight + 'px';

        authorToggle.addEventListener('click', function() {
            const isOpen = authorToggle.classList.contains('open');

            if (isOpen) {
                authorContent.style.maxHeight = '0px';
                authorToggle.classList.remove('open');
            } else {
                authorContent.style.maxHeight = authorContent.scrollHeight + 'px';
                authorToggle.classList.add('open');
            }
        });
    }
});

// ===========================
// Scroll animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            entry.target.style.opacity = '1';
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
});

// ===========================
// Navbar shadow on scroll
// ===========================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 80, 168, 0.18)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 80, 168, 0.12)';
    }
});

// ===========================
// Scroll to Top Button
// ===========================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '↑';

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
        button.style.backgroundColor = '#00356f';
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#0050a8';
        button.style.transform = 'scale(1)';
    });
}

createScrollToTopButton();

// ===========================
// Counters for stats
// ===========================
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetStr = el.getAttribute('data-target') || '0';
                const target = parseInt(targetStr, 10);
                if (isNaN(target)) return;

                let currentValue = 0;
                const increment = target / 40;

                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= target) {
                        el.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(currentValue) + '+';
                    }
                }, 30);

                observerStats.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observerStats.observe(stat));
}

animateCounters();

// ===========================
// Video Play Buttons
// ===========================
document.querySelectorAll('.play-button-overlay').forEach(button => {
    button.addEventListener('click', () => {
        const videoId = button.getAttribute('data-video');
        const video = document.getElementById(videoId);
        if (!video) return;

        if (video.paused) {
            // pause other videos
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

// show play button again when video ended
document.querySelectorAll('.video-element').forEach(video => {
    video.addEventListener('ended', () => {
        const btn = document.querySelector(`.play-button-overlay[data-video="${video.id}"]`);
        if (btn) btn.style.opacity = '0.9';
    });
});

// ===========================
// Gallery Modals
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

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });
});

console.log('Landing page for UAV stand loaded successfully.');
