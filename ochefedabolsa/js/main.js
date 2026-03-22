document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. STICKY NAVBAR & MOBILE MENU
       ============================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle Mobile Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflowY = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflowY = 'auto';
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==============================================
       2. MARKET TICKER
       ============================================== */
    const tickers = [
        { sym: 'IBOV', price: '128.430', change: '+1.2%' },
        { sym: 'NASDAQ', price: '16.320', change: '+0.8%' },
        { sym: 'S&P500', price: '5.140', change: '+0.5%' },
        { sym: 'BTC/USD', price: '68.240', change: '+2.4%' },
        { sym: 'ETH/USD', price: '3.890', change: '-0.2%' },
        { sym: 'PETR4', price: '38.45', change: '+1.5%' },
        { sym: 'VALE3', price: '64.20', change: '-1.1%' },
        { sym: 'ITUB4', price: '34.80', change: '+0.4%' }
    ];

    function createTickerHTML(items) {
        return items.map(t => {
            const isNegative = t.change.startsWith('-');
            return `
                <div class="ticker-item">
                    <span class="ticker-symbol">${t.sym}</span>
                    <span class="ticker-price">${t.price}</span>
                    <span class="ticker-change ${isNegative ? 'negative' : ''}">${t.change}</span>
                </div>
            `;
        }).join('');
    }

    const tickerHTML = createTickerHTML([...tickers, ...tickers]); // Duplicate for enough width
    document.getElementById('market-ticker').innerHTML = tickerHTML;
    document.getElementById('market-ticker-clone').innerHTML = tickerHTML;

    /* ==============================================
       3. INTERACTIVE SIMULATOR (COMPOUND INTEREST)
       ============================================== */
    const capitalInput = document.getElementById('capital');
    const aporteInput = document.getElementById('aporte');
    const tempoInput = document.getElementById('tempo');
    const taxaInput = document.getElementById('taxa');
    
    const tempoVal = document.getElementById('tempo-val');
    const taxaVal = document.getElementById('taxa-val');
    
    const resultPatrimonio = document.getElementById('resultado-patrimonio');
    const resultRenda = document.getElementById('resultado-renda');
    const chartContainer = document.getElementById('sim-chart-container');

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function updateSimulator() {
        const P = parseFloat(capitalInput.value) || 0;
        const PMT = parseFloat(aporteInput.value) || 0;
        const years = parseInt(tempoInput.value) || 0;
        const annualRate = parseFloat(taxaInput.value) || 0;
        
        // Update Labels
        tempoVal.textContent = years;
        taxaVal.textContent = annualRate;

        // Calculate Monthly Rate
        const r = (annualRate / 100) / 12;
        const n = years * 12;

        let finalValue = 0;

        if (r === 0) {
            finalValue = P + (PMT * n);
        } else {
            // Compound interest formula for initial principal + recurring contributions
            const compoundPrincipal = P * Math.pow(1 + r, n);
            const compoundAportes = PMT * ((Math.pow(1 + r, n) - 1) / r);
            finalValue = compoundPrincipal + compoundAportes;
        }

        // Estimativa de renda passiva (Safe withdrawal rate of ~6% a.a. => 0.5% a.m.)
        const rendaMensal = finalValue * 0.005;

        // Update DOM
        resultPatrimonio.textContent = formatCurrency(finalValue);
        resultRenda.textContent = formatCurrency(rendaMensal);

        // Update Chart (Generating simplified bars)
        chartContainer.innerHTML = '';
        const dataPoints = Math.min(years, 20); // show max 20 bars to avoid clutter
        const step = Math.ceil(years / dataPoints);
        
        let maxValue = finalValue;
        
        for (let i = 1; i <= years; i += step) {
            const months = i * 12;
            let val = P * Math.pow(1 + r, months) + PMT * ((Math.pow(1 + r, months) - 1) / r);
            
            // Only draw up to max height 100%
            const heightPercent = (val / maxValue) * 100;
            const bar = document.createElement('div');
            bar.className = 'sim-bar';
            bar.style.height = `${Math.max(5, heightPercent)}%`;
            chartContainer.appendChild(bar);
        }
    }

    // Attach Event Listeners
    [capitalInput, aporteInput, tempoInput, taxaInput].forEach(input => {
        input.addEventListener('input', updateSimulator);
    });

    // Initial Calc
    updateSimulator();

    /* ==============================================
       4. SCROLL REVEAL ANIMATIONS
       ============================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==============================================
       5. SCARCITY TIMER
       ============================================== */
    let hours = 5;
    let mins = 42;
    let secs = 18;

    const elHours = document.getElementById('t-hours');
    const elMins = document.getElementById('t-mins');
    const elSecs = document.getElementById('t-secs');

    setInterval(() => {
        secs--;
        if (secs < 0) {
            secs = 59;
            mins--;
            if (mins < 0) {
                mins = 59;
                hours--;
                if (hours < 0) {
                    hours = 23; // Loop for demo purposes
                }
            }
        }

        if(elHours) elHours.textContent = hours.toString().padStart(2, '0');
        if(elMins) elMins.textContent = mins.toString().padStart(2, '0');
        if(elSecs) elSecs.textContent = secs.toString().padStart(2, '0');
    }, 1000);

    /* ==============================================
       6. THEME TOGGLES
       ============================================== */
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==============================================
       7. FAQ ACCORDION LOGIC
       ============================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            const question = item.querySelector('.faq-question');
            
            // Toggle current (it starts without style.maxHeight, so we check if it has a non-zero pixel value)
            const isCurrentlyOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
            
            // Close all others
            faqItems.forEach(other => {
                other.querySelector('.faq-answer').style.maxHeight = '0px';
                other.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                other.querySelector('.faq-question').style.color = 'var(--text-primary)';
            });
            
            // If it wasn't open, open it
            if (!isCurrentlyOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(45deg)';
                question.style.color = 'var(--primary)';
            }
        });
    });

});

// --- Proteção Avançada ---
!function(){const _0x1a2b=["\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6B\x65\x79\x64\x6F\x77\x6E","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x6F\x75\x74\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x41\x63\x65\x73\x73\x6F\x20\x62\x6C\x6F\x71\x75\x65\x61\x64\x6F","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x62\x6F\x64\x79"];const _0x3c4d=function(e){e[_0x1a2b[0]]()};document[_0x1a2b[2]](_0x1a2b[1],_0x3c4d);document[_0x1a2b[2]](_0x1a2b[3],function(t){if(t.keyCode===123||(t.ctrlKey&&t.shiftKey&&t.keyCode===73)||(t.ctrlKey&&t.shiftKey&&t.keyCode===74)||(t.ctrlKey&&t.keyCode===85)){_0x3c4d(t);return false;}});setInterval(function(){if(window[_0x1a2b[5]]-window[_0x1a2b[4]]>160||window[_0x1a2b[7]]-window[_0x1a2b[6]]>160){document[_0x1a2b[10]][_0x1a2b[9]]=_0x1a2b[8];}},1000);}();
