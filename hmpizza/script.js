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
});
