document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // 2. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    // 3. Header Background on Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'rgba(255, 255, 255, 0.7)';
        }
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navLinks.classList.contains('active')) {
                    menuToggle.click(); // Close mobile menu
                }
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 🔒 5. CAMADA DE SEGURANÇA PIXELIZE (Anti-Fuxico)
    const _0xPxz = ['contextmenu', 'ctrlKey', 'shiftKey', 'preventDefault', 'keyCode', 'keydown'];
    
    // Bloqueia clique direito
    document.addEventListener(_0xPxz[0], e => e[_0xPxz[3]]());

    // Bloqueia teclas de inspeção
    document.onkeydown = function(e) {
        // F12
        if (e.keyCode == 123) return false;
        
        // Ctrl+Shift+I (Inspeção)
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'i'.charCodeAt(0))) return false;
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'j'.charCodeAt(0))) return false;
        
        // Ctrl+U (Ver Código Fonte)
        if (e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0) || e.keyCode == 'u'.charCodeAt(0))) return false;
        
        // Ctrl+S (Salvar)
        if (e.ctrlKey && (e.keyCode == 'S'.charCodeAt(0) || e.keyCode == 's'.charCodeAt(0))) return false;
    };

    // Detecção por redimensionamento de janela (DevTools Aberto)
    let threshold = 160;
    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            // Ação silenciosa ou log fake se quiser
            console.log('%cPixelize Security: Protected Content', 'color: red; font-size: 20px; font-weight: bold;');
        }
    };
    window.addEventListener('resize', checkDevTools);
    
});
