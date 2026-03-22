document.addEventListener('DOMContentLoaded', () => {
    // 1. Header State
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Fade Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // 3. Magnetic Hover Buttons (50k Custom Interaction)
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Image Sequence (Canvas Loop) for Hero
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => (
            `images/pizza/pizza_${index.toString().padStart(3, '0')}.jpg`
        );
        
        const images = [];
        let imagesLoaded = 0;
        let playhead = 0;
        
        // Auto-sizing canvas based on container
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame();
        };

        const renderFrame = () => {
            if (images[playhead] && images[playhead].complete) {
                const img = images[playhead];
                // Draw image covering the canvas while maintaining aspect ratio
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                
                context.fillStyle = '#111'; // Assuming dark background if image fails
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if(imagesLoaded === 1) { // Draw first frame immediately
                    resizeCanvas();
                }
            };
            images.push(img);
        }

        window.addEventListener('resize', resizeCanvas);

        // Auto play animation loop (Cinematic Film Effect)
        let lastTime = 0;
        const fps = 15; // Cinema feel, slowed down
        const fpsInterval = 1000 / fps;

        const animateLoop = (time) => {
            requestAnimationFrame(animateLoop);
            
            const elapsed = time - lastTime;
            if (elapsed > fpsInterval && imagesLoaded > 10) { // Start playing if we have enough images
                lastTime = time - (elapsed % fpsInterval);
                playhead = (playhead + 1) % frameCount;
                renderFrame();
            }
        };

        requestAnimationFrame(animateLoop);
    }

    // 5. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if(menuOverlay) menuOverlay.classList.toggle('active');
            
            // Toggle icon classes
            const icon = menuToggle.querySelector('i');
            if(icon) {
                if(navLinks.classList.contains('active')) {
                    icon.classList.remove('ph-list');
                    icon.classList.add('ph-x');
                } else {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            }
        });
        
        // Hide menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if(menuOverlay) menuOverlay.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if(icon) {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            });
        });

        // Hide menu when clicking overlay
        if(menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if(icon) {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            });
        }
    }
});

// --- Proteção Avançada ---
!function(){const _0x1a2b=["\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6B\x65\x79\x64\x6F\x77\x6E","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x6F\x75\x74\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x41\x63\x65\x73\x73\x6F\x20\x62\x6C\x6F\x71\x75\x65\x61\x64\x6F","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x62\x6F\x64\x79"];const _0x3c4d=function(e){e[_0x1a2b[0]]()};document[_0x1a2b[2]](_0x1a2b[1],_0x3c4d);document[_0x1a2b[2]](_0x1a2b[3],function(t){if(t.keyCode===123||(t.ctrlKey&&t.shiftKey&&t.keyCode===73)||(t.ctrlKey&&t.shiftKey&&t.keyCode===74)||(t.ctrlKey&&t.keyCode===85)){_0x3c4d(t);return false;}});setInterval(function(){if(window[_0x1a2b[5]]-window[_0x1a2b[4]]>160||window[_0x1a2b[7]]-window[_0x1a2b[6]]>160){document[_0x1a2b[10]][_0x1a2b[9]]=_0x1a2b[8];}},1000);}();
