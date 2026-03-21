document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scrolled Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Fade-Up Animations ---
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // --- Form Handling ---
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Grab values
        const name = document.getElementById('name').value;
        const type = document.getElementById('eventType').value;
        const guests = document.getElementById('guests').value;
        const date = document.getElementById('eventDate').value;
        
        // WhatsApp Redirect Generation
        const companyPhone = "5521999999999"; 
        
        // Format Date roughly
        const dObj = new Date(date);
        const dateStr = dObj.toLocaleDateString('pt-BR');

        let msg = `Olá! Meu nome é *${name}* e gostaria de um orçamento para levar a experiência da Dorus Burgers para o meu evento.\n\n`;
        msg += `*Tipo de Evento:* ${type}\n`;
        msg += `*Nº de Convidados:* ${guests}\n`;
        msg += `*Data Prevista:* ${dateStr}\n\n`;
        msg += `Podem me passar mais informações de como funciona?`;

        const encodedMsg = encodeURIComponent(msg);
        const waLink = `https://wa.me/${companyPhone}?text=${encodedMsg}`;

        // Change button state momentarily
        const btn = bookingForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = 'Redirecionando para o WhatsApp... <i class="ph-bold ph-spinner"></i>';
        
        setTimeout(() => {
            window.open(waLink, '_blank');
            btn.innerHTML = oldText;
            bookingForm.reset();
        }, 1200);
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    // Note: Due to lack of extensive Mobile Nav HTML structure in boilerplate, 
    // a simple toggle or anchor scroll behavior is acceptable for display purposes.
    // Smooth scrolling is handled via CSS scroll-behavior: smooth.
});
