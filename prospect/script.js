// --- Logic & State ---
let currentMessageText = "";
let crmData = JSON.parse(localStorage.getItem('prospect_crm_v3')) || [];
let queueData = JSON.parse(localStorage.getItem('prospect_queue_v3')) || [];

// DOM Elements Queue & Dashboard
const smartInput = document.getElementById('smartInput');
const queueBtn = document.getElementById('queueBtn');
const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queueCount');
const dailySendsLabel = document.getElementById('dailySends');
const goalProgress = document.getElementById('goalProgress');
const statsNegotiating = document.getElementById('statsNegotiating');
const statsClosed = document.getElementById('statsClosed');

// DOM Elements Active Form
const businessNameInput = document.getElementById('businessName');
const businessNicheInput = document.getElementById('businessNiche');
const businessRatingInput = document.getElementById('businessRating');
const whatsappInput = document.getElementById('whatsappNumber');
const demoSelect = document.getElementById('demoSelect');
const scriptSelect = document.getElementById('scriptSelect');
const messagePreview = document.getElementById('messagePreview');
const sendBtn = document.getElementById('sendBtn');
const skipBtn = document.getElementById('skipBtn');

// DOM Elements CRM
const crmBody = document.getElementById('crmBody');
const emptyCRM = document.getElementById('emptyCRM');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const objectionBtns = document.querySelectorAll('.btn-objection');


// --- Helper: Success Toast ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="ph-bold ph-info"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- 1. Smart Extraction Logic ---
function extractDataBulk(rawText) {
    // Split by markers like "Rotas" or "Website" but preserve the separators for better card logic
    // We split by a pattern that marks the end of a card or the start of a new one
    // In G-Maps text, "Rotas" is almost always the last text in a listing card.
    const blocks = rawText.split(/Rotas/i).filter(b => b.trim().length > 5);
    const prospects = [];

    blocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 1) return;

        let name = 'Negócio sem Nome';
        let rating = '5,0';
        let phone = '';
        let hasWebsite = block.toLowerCase().includes('website');

        // Look for the rating pattern: 5,0(198)
        const ratingMatch = block.match(/(\d[.,]\d)\s*\(\d+\)/);
        if (ratingMatch) {
            rating = ratingMatch[1];
            // Name is usually the line right BEFORE the rating line
            const ratingLineIndex = lines.findIndex(l => l.includes(ratingMatch[0]));
            if (ratingLineIndex > 0) {
                // If the previous line is just a quote or button, go back one more
                let nameIdx = ratingLineIndex - 1;
                while (nameIdx >= 0 && (lines[nameIdx].startsWith('"') || lines[nameIdx] === 'Compartilhar')) {
                    nameIdx--;
                }
                if (nameIdx >= 0) name = lines[nameIdx];
            } else {
                name = lines[0];
            }
        } else {
            name = lines[0]; // fallback
        }

        // Phone Match: Brazilian formats
        const phoneMatch = block.match(/(?:\+?55\s?)?(?:\(?0?[1-9]{2}\)?)\s?(?:9\d{4}|\d{4})[- ]?\d{4}/);
        if (phoneMatch) {
            let rawPhone = phoneMatch[0].replace(/\D/g, '');
            if (rawPhone.startsWith('00')) rawPhone = rawPhone.substring(2);
            if (rawPhone.startsWith('0') && rawPhone.length > 9) rawPhone = rawPhone.substring(1);
            if (!rawPhone.startsWith('55') && (rawPhone.length === 10 || rawPhone.length === 11)) {
                rawPhone = '55' + rawPhone;
            }
            phone = rawPhone;
        }

        // Logic check: only add if it has phone (user request)
        if (!phone) return;

        // Check if already in queue or CRM
        const isDuplicate = queueData.some(q => q.phone === phone) || crmData.some(c => c.phone === phone);
        if (isDuplicate) return;

        // Guess niche
        let niche = "clínica";
        const nameLower = name.toLowerCase();
        if (nameLower.includes("salão") || nameLower.includes("studio") || nameLower.includes("beleza")) niche = "salão";
        else if (nameLower.includes("odontologia") || nameLower.includes("odonto")) niche = "clínica odontológica";
        else if (nameLower.includes("fisioterapia") || nameLower.includes("fisio")) niche = "clínica de fisioterapia";
        
        prospects.push({ id: Date.now() + Math.random().toString(), name, rating, phone, niche, hasWebsite });
    });

    return prospects;
}

// --- 2. Queue Management ---
queueBtn.addEventListener('click', () => {
    const raw = smartInput.value;
    if (!raw.trim()) return;
    
    const extractedList = extractDataBulk(raw);
    
    if (extractedList.length === 0) {
        showToast("Nenhum novo prospecto com telefone encontrado.", "warning");
    } else {
        queueData.push(...extractedList);
        saveQueue();
        smartInput.value = ''; // clear
        showToast(`${extractedList.length} prospects adicionados à fila!`);
    }
});

function saveQueue() {
    localStorage.setItem('prospect_queue_v3', JSON.stringify(queueData));
    renderQueue();
    loadActiveProspect();
}

function renderQueue() {
    queueCount.innerText = queueData.length;
    queueList.innerHTML = '';
    
    if (queueData.length === 0) {
        queueList.innerHTML = '<li class="empty"><i class="ph ph-mask-happy"></i> A fila está vazia.</li>';
        return;
    }
    
    // Show top 3 in the preview list
    const showCount = Math.min(queueData.length, 3);
    for (let i = 0; i < showCount; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${queueData[i].name}</span> <span style="color:var(--text-muted);font-size:0.75rem">Próximo...</span>`;
        if (i === 0) li.style.borderColor = 'var(--secondary)';
        queueList.appendChild(li);
    }
    if (queueData.length > 3) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.innerText = `... e mais ${queueData.length - 3} na fila.`;
        queueList.appendChild(li);
    }
}

// Loads the first prospect from the queue into the form
function loadActiveProspect() {
    if (queueData.length > 0) {
        const active = queueData[0];
        // Only set values if form is empty OR if they just completed a send to ensure we don't overwrite manual edits mid-way unnecessarily
        businessNameInput.value = active.name;
        businessNicheInput.value = active.niche;
        businessRatingInput.value = active.rating;
        whatsappInput.value = active.phone;
    } else {
        businessNameInput.value = '';
        whatsappInput.value = '';
    }
    updatePreview();
}

skipBtn.addEventListener('click', () => {
    if (queueData.length > 0) {
        queueData.shift(); // remove 1st
        saveQueue();
    }
});


// --- 3. Message Template Builder ---
function updatePreview() {
    const active = queueData[0];
    const name = businessNameInput.value || "[Nome]";
    let niche = businessNicheInput.value.trim().toLowerCase() || "negócio";
    const rating = businessRatingInput.value || "5,0";
    const phone = whatsappInput.value;
    const demoUrl = demoSelect.value;
    const scriptType = scriptSelect.value;

    const isFeminine = niche.endsWith('a') || niche === 'clínica' || niche === 'oficina' || niche === 'loja';
    const artigoA = isFeminine ? 'a sua' : 'o seu';
    const prepDoDa = isFeminine ? 'da' : 'do';

    // Saudação Dinâmica
    const hour = new Date().getHours();
    let saudacao = "Bom dia";
    if (hour >= 12 && hour < 18) saudacao = "Boa tarde";
    else if (hour >= 18) saudacao = "Boa noite";

    let text = "";

    if (scriptType === 'quebra_gelo') {
        const websiteContext = active && active.hasWebsite 
            ? "Vi que vocês já têm um site, mas ele pode estar limitando o potencial de conversão do Google — a velocidade e a estrutura de vendas fazem toda a diferença." 
            : "Senti falta de uma estrutura de conversão mais direta no Google. Isso acaba fazendo vocês perderem clientes prontos pra agendar para a concorrência.";

        text = `Oi, tudo bem? Estava analisando o perfil da *${name}* no Google e identifiquei alguns pontos que estão fazendo vocês perderem clientes. ${websiteContext}\n\nEu montei um modelo pronto (já validado) que mostra exatamente como corrigir isso e aumentar o volume de mensagens no WhatsApp.\n\nPosso te mostrar agora o seu site já validado para que sua conversão no google aumente consideravelmente? Te envio o link pra você ver como ficaria aplicado no seu caso.`;
    } else if (scriptType === 'auditoria') {
        text = `Olá, tudo bem? Vi o perfil da *${name}* no Google e notei um detalhe que pode estar fazendo vocês perderem alguns clientes para a concorrência. Posso te mandar uma sugestão rápida de como resolver isso?`;
    } else if (scriptType === 'msg2') {
        text = `Muita gente hoje escolhe onde ir pelo Google, e quem passa mais confiança no primeiro clique leva o cliente. Nós criamos um modelo de página super rápido e moderno que foca exatamente em fazer a pessoa clicar no seu WhatsApp. Quer ver como ficaria para vocês?`;
    } else if (scriptType === 'envio_demo') {
        text = `Olha só como ficou esse modelo que eu separei:\n${demoUrl}\n\nA ideia é que ele carregue instantaneamente e seja muito mais bonito que um site comum. Abre aí no seu celular e me diz o que achou da experiência!`;
    } else if (scriptType === 'followup') {
        text = `Oi! Passando só para saber se conseguiu ver o modelo que te mandei. Acha que faz sentido algo assim para a *${name}* hoje?`;
    }

    currentMessageText = text;
    
    if (!whatsappInput.value) {
        messagePreview.innerText = "Adicione clientes na fila para gerar o texto...";
        sendBtn.classList.add('disabled');
    } else {
        messagePreview.innerText = text;
        if (phone && phone.length >= 10) sendBtn.classList.remove('disabled');
        else sendBtn.classList.add('disabled');
    }
}

// User typing logic
[businessNameInput, businessNicheInput, businessRatingInput, whatsappInput, demoSelect, scriptSelect].forEach(input => {
    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
});

// --- 4. Objections (Anti-Não) ---
objectionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.target.getAttribute('data-type');
        const phone = whatsappInput.value;
        if (!phone || phone.length < 10) {
            alert('Para enviar a objeção, o Prospect atual deve ter um WhatsApp na tela (Fila não vazia).');
            return;
        }

        let reply = "";
        if (type === 'site') {
             reply = `Entendo perfeitamente! Foi exatamente por isso que chamei. Empresas que já têm site costumam focar nele como um "panfleto" estático.\nO modelo que montei não é um panfleto, é uma máquina focada em cliques no seu WhatsApp. Com uma estrutura de alto valor, a diferença salta aos olhos!`;
        } else if (type === 'agencia') {
             reply = `Maravilha ter uma agência trabalhando com vocês! A questão é que muitas agências são excelentes de tráfego, mas usam templates fracos na Engenharia de Conversão (Landing Pages).\nMostre o nosso modelo para a sua agência e compare a velocidade e a estrutura magnética.`;
        } else if (type === 'socio') {
             reply = `Claro, super entendo. Sociedade é assim mesmo.\nFaz o seguinte: manda o link do nosso modelo no grupo de vocês e compara o design com a estrutura de vocês hoje. A percepção de luxo e velocidade de carregamento se vendem sozinhas. Fico no aguardo!`;
        } else if (type === 'caro') {
             reply = `Compreendo o limite! Mas a questão aqui não é custo, é Retorno Imediato. A diferença entre a sua página atual do Google e essa estrutura premium é gigantesca.\nA ideia é que esse ambiente se pague logo nos primeiros 2 clientes extras que fecharem. Topa dar só uma espiada no link sem compromisso antes de falarmos de valores?`;
        }

        const encodedText = encodeURIComponent(reply);
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    });
});


// --- 5. CRM & Gamification ---
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
    
    // Remove from Queue
    if (queueData.length > 0) {
        queueData.shift();
        saveQueue();
    } else {
        // Just clear manual form
        businessNameInput.value = '';
        whatsappInput.value = '';
        updatePreview();
    }
    
    // Open WhatsApp natively
    window.open(link, '_blank');
});

function calculateMetrics() {
    const limitDaily = 25;
    const todayStr = new Date().toDateString();
    
    let sentToday = 0;
    let negoCount = 0;
    let closedCount = 0;

    crmData.forEach(entry => {
        // Daily sends calculation
        if (new Date(entry.date).toDateString() === todayStr) {
            sentToday++;
        }
        
        // Status counts (total)
        if (entry.status === 'interested') negoCount++;
        if (entry.status === 'closed') closedCount++;
    });

    // Update UI Stats Cards
    dailySendsLabel.innerText = sentToday;
    statsNegotiating.innerText = negoCount;
    statsClosed.innerText = closedCount;

    // Progress Bar Fill
    const perc = Math.min((sentToday / limitDaily) * 100, 100);
    goalProgress.style.width = `${perc}%`;
}

function renderCRM() {
    crmBody.innerHTML = '';
    
    if (crmData.length === 0) {
        emptyCRM.classList.remove('hidden');
    } else {
        emptyCRM.classList.add('hidden');
    }

    crmData.forEach(entry => {
        const d = new Date(entry.date);
        const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        
        const hoursPassed = (new Date() - d) / (1000 * 60 * 60);
        const needsFollowup = hoursPassed > 48 && entry.status === 'contacted';
        
        const tr = document.createElement('tr');
        if (needsFollowup) tr.classList.add('row-overdue');
        
        // Dynamic row color
        let selectClass = "bg-contacted";
        if (entry.status === 'interested') selectClass = 'bg-interested';
        if (entry.status === 'closed') selectClass = 'bg-closed';

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td><strong>${entry.name}</strong></td>
            <td>+${entry.phone}</td>
            <td>
                <select class="status-select ${selectClass}" data-id="${entry.id}">
                    <option value="contacted" ${entry.status === 'contacted' ? 'selected' : ''}>Contatado</option>
                    <option value="interested" ${entry.status === 'interested' ? 'selected' : ''}>Em Negociação</option>
                    <option value="closed" ${entry.status === 'closed' ? 'selected' : ''}>Fechado</option>
                </select>
            </td>
            <td>
                <button onclick="resumeContact('${entry.id}')" class="btn btn-outline btn-sm">Retomar</button>
            </td>
        `;
        crmBody.appendChild(tr);
    });

    // Handle CRM Status Changes
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

    calculateMetrics();
}

function saveCRM() {
    localStorage.setItem('prospect_crm_v3', JSON.stringify(crmData));
    renderCRM();
}

// Resumes a contact from CRM back into the active sender
function resumeContact(id) {
    const entry = crmData.find(x => x.id === id);
    if (!entry) return;

    // Load data into form
    businessNameInput.value = entry.name;
    whatsappInput.value = entry.phone;
    
    // Guess niche from name if possible (or default)
    let niche = "clínica";
    const nameLower = entry.name.toLowerCase();
    if (nameLower.includes("salão") || nameLower.includes("studio")) niche = "salão";
    else if (nameLower.includes("escritório") || nameLower.includes("advocacia")) niche = "escritório";
    else if (nameLower.includes("odontologia") || nameLower.includes("odonto")) niche = "clínica odontológica";
    businessNicheInput.value = niche;

    // Scroll to panel
    document.getElementById('activeProspectCard').scrollIntoView({ behavior: 'smooth' });
    
    // Pulse animation to show it's loaded
    const card = document.getElementById('activeProspectCard');
    card.classList.add('pulse-active');
    setTimeout(() => {
        card.classList.remove('pulse-active');
    }, 2000);

    updatePreview();
}

clearHistoryBtn.addEventListener('click', () => {
    if(confirm('Tem certeza que deseja apagar todo o histórico de prospecção do seu navegador?')) {
        crmData = [];
        saveCRM();
    }
});

// Initialization
renderQueue();
loadActiveProspect();
renderCRM();
