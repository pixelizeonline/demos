document.addEventListener('DOMContentLoaded', () => {

    // --- Image Sequence Canvas Player ---
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const frameCount = 80;
        const images = [];
        let loadedImages = 0;

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            // Pads current integer with leading zeros to 3 digits e.g. 000, 001, 042
            const frameNum = i.toString().padStart(3, '0');
            img.src = `images/dorus/dorus_${frameNum}.jpg`;
            img.onload = () => loadedImages++;
            images.push(img);
        }

        // Draw logic (Equivalent to CSS object-fit: cover)
        let frame = 0;
        function draw() {
            if (images[frame] && images[frame].complete && images[frame].width > 0) {
                const ratio = Math.max(canvas.width / images[frame].width, canvas.height / images[frame].height);
                const w = images[frame].width * ratio;
                const h = images[frame].height * ratio;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(images[frame], (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
            }
        }

        // Loop logic (approx 24 fps)
        let lastTime = 0;
        const fps = 24;
        const interval = 1000 / fps;

        function animateSequence(time) {
            requestAnimationFrame(animateSequence);
            if (time - lastTime >= interval) {
                lastTime = time;
                if (loadedImages > 0) {
                    draw();
                    frame = (frame + 1) % frameCount;
                }
            }
        }

        // Resize handler
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        requestAnimationFrame(animateSequence);
    }

    
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

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if(menuOverlay) menuOverlay.classList.toggle('active');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(menuOverlay) menuOverlay.classList.remove('active');
        });
    });
});
