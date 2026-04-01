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
// (marquee removed — titles wrap to 2 lines via CSS line-clamp)
// ===========================

function debounce(fn, ms) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), ms);
    };
}


// ===========================
// Navbar shadow + scroll-to-top: one passive scroll listener, rAF-throttled, class toggles (no per-frame style writes)
// ===========================
function setupScrollChrome() {
    const navbar = document.querySelector('.navbar');
    const scrollBtn = document.getElementById('scrollToTop');
    if (!navbar && !scrollBtn) return;

    let navScrolled = false;
    let btnVisible = false;
    let rafId = 0;

    function syncScrollChrome() {
        rafId = 0;
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const nextNav = y > 50;
        const nextBtn = y > 300;

        if (navbar && nextNav !== navScrolled) {
            navScrolled = nextNav;
            navbar.classList.toggle('is-scrolled', navScrolled);
        }
        if (scrollBtn && nextBtn !== btnVisible) {
            btnVisible = nextBtn;
            scrollBtn.classList.toggle('is-visible', btnVisible);
        }
    }

    function onScroll() {
        if (!rafId) {
            rafId = requestAnimationFrame(syncScrollChrome);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    syncScrollChrome();
}

// ===========================
// Scroll to Top Button
// ===========================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Наверх');

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createScrollToTopButton();
setupScrollChrome();

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
// Video — pause others when one starts playing
// ===========================
document.querySelectorAll('.video-element').forEach(video => {
    video.addEventListener('play', () => {
        document.querySelectorAll('.video-element').forEach(other => {
            if (other !== video) other.pause();
        });
    });
});

// ===========================
// Gallery Modals
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // ===========================
    // Mobile hamburger menu
    // ===========================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('is-open');
            navLinks.classList.toggle('is-open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('is-open');
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

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

// ===========================
// Horizontal Carousel
// ===========================
function initCarousel({ trackId, prevId, nextId, dotsId }) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsWrap = dotsId ? document.getElementById(dotsId) : null;

    if (!track || !prevBtn || !nextBtn) return;

    const GAP = 22; // matches 1.4rem gap in CSS

    function getSlideWidth() {
        const first = track.firstElementChild;
        return first ? first.offsetWidth + GAP : 300;
    }

    // Build dot indicators
    function buildDots() {
        if (!dotsWrap) return;
        const slides = track.children;
        dotsWrap.innerHTML = '';
        Array.from(slides).forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', `Слайд ${i + 1}`);
            btn.addEventListener('click', () => {
                track.scrollTo({ left: i * getSlideWidth(), behavior: 'smooth' });
            });
            dotsWrap.appendChild(btn);
        });
    }

    function syncDots() {
        if (!dotsWrap) return;
        const idx = Math.round(track.scrollLeft / getSlideWidth());
        Array.from(dotsWrap.children).forEach((d, i) =>
            d.classList.toggle('active', i === idx)
        );
    }

    function syncButtons() {
        prevBtn.disabled = track.scrollLeft < 8;
        nextBtn.disabled =
            track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }

    prevBtn.addEventListener('click', () =>
        track.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' })
    );

    nextBtn.addEventListener('click', () =>
        track.scrollBy({ left: getSlideWidth(), behavior: 'smooth' })
    );

    track.addEventListener('scroll', () => {
        syncDots();
        syncButtons();
    }, { passive: true });

    buildDots();
    syncButtons();

    window.addEventListener('resize', debounce(() => {
        syncDots();
        syncButtons();
    }, 120));
}

document.addEventListener('DOMContentLoaded', () => {
    initCarousel({ trackId: 'uavTrack',     prevId: 'uavPrev',     nextId: 'uavNext',     dotsId: 'uavDots' });
    initCarousel({ trackId: 'galleryTrack', prevId: 'galleryPrev', nextId: 'galleryNext', dotsId: 'galleryDots' });
});
