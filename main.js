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
            entry.target.classList.add('is-inview');
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
// Video fullscreen (Chrome / Edge / Safari + fallbacks)
// ===========================
function getFullscreenElement() {
    return (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        null
    );
}

function isVideoFullscreen(video) {
    return getFullscreenElement() === video;
}

function exitVideoFullscreen() {
    const el = getFullscreenElement();
    if (!el) return Promise.resolve();
    const p =
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    return p && typeof p.then === 'function' ? p : Promise.resolve();
}

function enterVideoFullscreen(video) {
    if (!video || isVideoFullscreen(video)) return Promise.resolve();

    const prev = getFullscreenElement();
    const enter = () => {
        const req =
            video.requestFullscreen?.call(video) ||
            video.webkitRequestFullscreen?.call(video) ||
            video.msRequestFullscreen?.call(video);
        if (req && typeof req.then === 'function') return req;
        if (typeof video.webkitEnterFullscreen === 'function') {
            video.webkitEnterFullscreen();
            return Promise.resolve();
        }
        return Promise.reject(new Error('Fullscreen not supported'));
    };

    if (prev && prev !== video) {
        const ex =
            document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.msExitFullscreen?.();
        if (ex && typeof ex.then === 'function') {
            return ex.then(() => enter()).catch(() => enter());
        }
    }

    return enter().catch(() => {});
}

function setPlayOverlayVisible(button, visible) {
    if (!button) return;
    if (visible) {
        button.style.opacity = '0.9';
        button.style.pointerEvents = '';
    } else {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
    }
}

// Single click on video area: pause / resume at current time (not fullscreen only).
// Delayed so double-click can still toggle fullscreen without pausing first.
const VIDEO_TOGGLE_CLICK_MS = 280;

// ===========================
// Video Play Buttons
// ===========================
document.querySelectorAll('.play-button-overlay').forEach(button => {
    button.addEventListener('click', () => {
        const video = button.closest('.video-wrapper')?.querySelector('.video-element');
        if (!video) return;

        if (video.paused) {
            document.querySelectorAll('.video-element').forEach(v => {
                if (v !== video) {
                    v.pause();
                    const btn = v.closest('.video-wrapper')?.querySelector('.play-button-overlay');
                    setPlayOverlayVisible(btn, true);
                }
            });

            video
                .play()
                .then(() => enterVideoFullscreen(video))
                .catch(() => {});

            setPlayOverlayVisible(button, false);
        } else {
            video.pause();
            setPlayOverlayVisible(button, true);
        }
    });
});

document.querySelectorAll('.video-element').forEach(video => {
    video.addEventListener('ended', () => {
        const btn = video.closest('.video-wrapper')?.querySelector('.play-button-overlay');
        setPlayOverlayVisible(btn, true);
    });

    // Native controls / keyboard: trusted play only (overlay uses play().then(enter…))
    video.addEventListener('play', (e) => {
        if (!e.isTrusted) return;
        enterVideoFullscreen(video).catch(() => {});
    });
});

document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    let toggleClickTimer = null;

    wrapper.addEventListener('click', (e) => {
        const video = wrapper.querySelector('.video-element');
        if (!video || isVideoFullscreen(video)) return;
        if (e.target.closest('.play-button-overlay')) return;

        clearTimeout(toggleClickTimer);
        toggleClickTimer = setTimeout(() => {
            toggleClickTimer = null;
            const v = wrapper.querySelector('.video-element');
            const btn = wrapper.querySelector('.play-button-overlay');
            if (!v) return;

            if (v.paused) {
                document.querySelectorAll('.video-element').forEach(other => {
                    if (other !== v) {
                        other.pause();
                        const b = other.closest('.video-wrapper')?.querySelector('.play-button-overlay');
                        setPlayOverlayVisible(b, true);
                    }
                });
                v.play().catch(() => {});
                setPlayOverlayVisible(btn, false);
            } else {
                v.pause();
                setPlayOverlayVisible(btn, true);
            }
        }, VIDEO_TOGGLE_CLICK_MS);
    });

    wrapper.addEventListener('dblclick', (e) => {
        clearTimeout(toggleClickTimer);
        toggleClickTimer = null;
        e.preventDefault();
        const video = wrapper.querySelector('.video-element');
        if (!video) return;

        if (isVideoFullscreen(video)) {
            exitVideoFullscreen();
            return;
        }

        const btn = wrapper.querySelector('.play-button-overlay');
        if (video.paused) {
            video
                .play()
                .then(() => enterVideoFullscreen(video))
                .catch(() => {});
            setPlayOverlayVisible(btn, false);
        } else {
            enterVideoFullscreen(video).catch(() => {});
        }
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
