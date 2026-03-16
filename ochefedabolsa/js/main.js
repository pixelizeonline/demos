document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. STICKY NAVBAR
       ============================================== */
    const navbar = document.getElementById('navbar');
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

});
