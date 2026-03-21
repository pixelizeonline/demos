document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Close mobile menu if open
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if(mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            }

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Scroll Reveal Animations
    const elementsToReveal = document.querySelectorAll(
        '.service-card, .about-content, .about-image-wrapper, .testimonial-card, .info-item, .contact-map, .section-title, .section-subtitle'
    );
    
    // Add the class upfront
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // trigger slightly before it enters viewport
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => {
        observer.observe(el);
    });
});
