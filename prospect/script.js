// --- DOM Elements ---
const smartInput = document.getElementById('smartInput');
const extractBtn = document.getElementById('extractBtn');
const businessNameInput = document.getElementById('businessName');
const businessRatingInput = document.getElementById('businessRating');
const whatsappInput = document.getElementById('whatsappNumber');
const demoSelect = document.getElementById('demoSelect');
const scriptSelect = document.getElementById('scriptSelect');
const messagePreview = document.getElementById('messagePreview');
const sendBtn = document.getElementById('sendBtn');
const crmBody = document.getElementById('crmBody');
const emptyCRM = document.getElementById('emptyCRM');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// --- State ---
let currentMessageText = "";
let crmData = JSON.parse(localStorage.getItem('prospect_crm')) || [];

// --- 1. Smart Extraction Logic ---
function extractData(rawText) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let name = '';
    let rating = '5,0'; // default assumption if not found
    let phone = '';

    if (lines.length > 0) {
        // Assume first line is the name
        name = lines[0];
    }
    
    // Find Rating (e.g., "5,0 (64)")
    const ratingMatch = rawText.match(/(\d[.,]\d)\s*\(\d+\)/);
    if (ratingMatch) {
       rating = ratingMatch[1];
    }

    // Find Phone (robust regex for BR phones)
    // Matches (XX) XXXXX-XXXX, XX XXXXX XXXX, etc.
    const phoneMatch = rawText.match(/(?:\+?55\s?)?(?:\(?0?[1-9]{2}\)?)\s?(?:9\d{4}|\d{4})[- ]?\d{4}/);
    if (phoneMatch) {
        let rawPhone = phoneMatch[0].replace(/\D/g, '');
        
        // Fix typical rules
        if (rawPhone.startsWith('00')) rawPhone = rawPhone.substring(2);
        if (rawPhone.startsWith('0') && rawPhone.length > 9) rawPhone = rawPhone.substring(1);
        
        if (!rawPhone.startsWith('55') && (rawPhone.length === 10 || rawPhone.length === 11)) {
            rawPhone = '55' + rawPhone;
        }
        phone = rawPhone;
    }

    return { name, rating, phone };
}

// --- 2. Update Message Preview ---
function updatePreview() {
    const name = businessNameInput.value || "[Nome da Clínica]";
    const rating = businessRatingInput.value || "5,0";
    const phone = whatsappInput.value;
    const demoUrl = demoSelect.value;
    const scriptType = scriptSelect.value;

    let text = "";

    if (scriptType === 'elogio') {
        text = `Olá, equipe do ${name}! Tudo bem?\n\nVi aqui no Google que vocês são muito bem avaliados, com nota ${rating} estrelas. Parabéns pelo excelente trabalho no espaço! ✨\n\nSou especialista em posicionamento de clínicas de estética no Google. Notei o potencial de vocês e percebi que um site premium pode aumentar ainda mais o alcance da clínica. Criamos um modelo focado no nicho de vocês, dêem uma olhada no design de alto padrão:\n${demoUrl}\n\nO que acharam do layout? Faz sentido para o momento de vocês melhorar a captação?`;
    } else {
        text = `Olá, somos a equipe Pixelize! Notamos o excelente trabalho do ${name} e a nota ${rating} no Google.\n\nCriamos um modelo de site focado estritamente em estética avançada para aumentar suas consultas via WhatsApp:\n${demoUrl}\n\nGostariam de entender melhor como implementar esse sistema de vendas na clínica?`;
    }

    currentMessageText = text;
    messagePreview.innerText = text;

    // Enable button if we have a phone
    if (phone && phone.length >= 10) {
        sendBtn.classList.remove('disabled');
    } else {
        sendBtn.classList.add('disabled');
    }
}

// --- 3. Events ---
extractBtn.addEventListener('click', () => {
    const raw = smartInput.value;
    if (!raw) return;

    const extracted = extractData(raw);
    
    businessNameInput.value = extracted.name;
    businessRatingInput.value = extracted.rating;
    whatsappInput.value = extracted.phone;
    
    updatePreview();
});

// Any manual edit on the config inputs updates the preview
[businessNameInput, businessRatingInput, whatsappInput, demoSelect, scriptSelect].forEach(input => {
    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
});

// --- 4. Send & CRM Logic ---
sendBtn.addEventListener('click', () => {
    const phone = whatsappInput.value;
    if (!phone || phone.length < 10) return;

    const encodedText = encodeURIComponent(currentMessageText);
    const link = `https://wa.me/${phone}?text=${encodedText}`;

    // Record in CRM
    const newEntry = {
        id: Date.now().toString(),
        name: businessNameInput.value || "Empresa Desconhecida",
        phone: phone,
        date: new Date().toISOString(),
        status: "contacted" // default
    };
    crmData.unshift(newEntry);
    saveCRM();
    
    // Open WhatsApp natively
    window.open(link, '_blank');
});

function renderCRM() {
    crmBody.innerHTML = '';
    
    if (crmData.length === 0) {
        emptyCRM.classList.remove('hidden');
        return;
    }
    
    emptyCRM.classList.add('hidden');

    crmData.forEach(entry => {
        const d = new Date(entry.date);
        const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td><strong>${entry.name}</strong></td>
            <td>+${entry.phone}</td>
            <td>
                <select class="status-select" data-id="${entry.id}">
                    <option value="contacted" ${entry.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                    <option value="interested" ${entry.status === 'interested' ? 'selected' : ''}>Em Negociação</option>
                    <option value="closed" ${entry.status === 'closed' ? 'selected' : ''}>Fechado</option>
                </select>
            </td>
            <td>
                <a href="https://wa.me/${entry.phone}" target="_blank" class="btn btn-outline btn-sm">Retomar</a>
            </td>
        `;
        crmBody.appendChild(tr);
    });

    // Add listeners to selects
    document.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const val = e.target.value;
            const targetEntry = crmData.find(x => x.id === id);
            if(targetEntry) {
                targetEntry.status = val;
                saveCRM();
            }
        });
    });
}

function saveCRM() {
    localStorage.setItem('prospect_crm', JSON.stringify(crmData));
    renderCRM();
}

clearHistoryBtn.addEventListener('click', () => {
    if(confirm('Tem certeza que deseja apagar todo o histórico de prospecção do seu navegador?')) {
        crmData = [];
        saveCRM();
    }
});

// Init
renderCRM();
updatePreview();
