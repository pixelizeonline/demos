document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuOpen = document.getElementById('mobileMenuOpen');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const toggleMenu = (isOpen) => {
        mobileNav.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    mobileMenuOpen.addEventListener('click', () => toggleMenu(true));
    mobileMenuClose.addEventListener('click', () => toggleMenu(false));

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Simple AOS Implementation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => observer.observe(el));

    // Smooth Scroll for local links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
