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
    const elementsToReveal = document.querySelectorAll('.service-card, .about-content, .about-image-wrapper, .testimonial-card, .info-item, .contact-map, .section-title, .section-subtitle');
    
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
    });

    const revealElements = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50;

        document.querySelectorAll('.reveal').forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealElements);
    
    // Trigger once on load
    revealElements();
});

// --- Proteção Avançada ---
!function(){const _0x1a2b=["\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6B\x65\x79\x64\x6F\x77\x6E","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x6F\x75\x74\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x41\x63\x65\x73\x73\x6F\x20\x62\x6C\x6F\x71\x75\x65\x61\x64\x6F","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x62\x6F\x64\x79"];const _0x3c4d=function(e){e[_0x1a2b[0]]()};document[_0x1a2b[2]](_0x1a2b[1],_0x3c4d);document[_0x1a2b[2]](_0x1a2b[3],function(t){if(t.keyCode===123||(t.ctrlKey&&t.shiftKey&&t.keyCode===73)||(t.ctrlKey&&t.shiftKey&&t.keyCode===74)||(t.ctrlKey&&t.keyCode===85)){_0x3c4d(t);return false;}});setInterval(function(){if(window[_0x1a2b[5]]-window[_0x1a2b[4]]>160||window[_0x1a2b[7]]-window[_0x1a2b[6]]>160){document[_0x1a2b[10]][_0x1a2b[9]]=_0x1a2b[8];}},1000);}();
