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


// --- 1. Smart Extraction Logic ---
function extractData(rawText) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let name = 'Negócio sem Nome';
    let rating = '5,0';
    let phone = '';

    if (lines.length > 0) name = lines[0];
    
    const ratingMatch = rawText.match(/(\d[.,]\d)\s*\(\d+\)/);
    if (ratingMatch) rating = ratingMatch[1];

    const phoneMatch = rawText.match(/(?:\+?55\s?)?(?:\(?0?[1-9]{2}\)?)\s?(?:9\d{4}|\d{4})[- ]?\d{4}/);
    if (phoneMatch) {
        let rawPhone = phoneMatch[0].replace(/\D/g, '');
        if (rawPhone.startsWith('00')) rawPhone = rawPhone.substring(2);
        if (rawPhone.startsWith('0') && rawPhone.length > 9) rawPhone = rawPhone.substring(1);
        if (!rawPhone.startsWith('55') && (rawPhone.length === 10 || rawPhone.length === 11)) {
            rawPhone = '55' + rawPhone;
        }
        phone = rawPhone;
    }

    // Attempt to guess niche based on name
    let niche = "clínica"; // default
    const nameLower = name.toLowerCase();
    if (nameLower.includes("salão") || nameLower.includes("studio")) niche = "salão";
    else if (nameLower.includes("escritório") || nameLower.includes("advocacia")) niche = "escritório";
    else if (nameLower.includes("odontologia") || nameLower.includes("odonto")) niche = "clínica odontológica";

    return { id: Date.now().toString(), name, rating, phone, niche };
}

// --- 2. Queue Management ---
queueBtn.addEventListener('click', () => {
    const raw = smartInput.value;
    if (!raw) return;
    
    // Split by deep spaces (if user pasted multiple blocks), though usually it's one by one
    // We will just process the whole block as one Prospect
    const extracted = extractData(raw);
    
    queueData.push(extracted);
    saveQueue();
    smartInput.value = ''; // clear for next paste
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
    const name = businessNameInput.value || "[Nome]";
    let niche = businessNicheInput.value.trim().toLowerCase() || "negócio";
    const rating = businessRatingInput.value || "5,0";
    const phone = whatsappInput.value;
    const demoUrl = demoSelect.value;
    const scriptType = scriptSelect.value;

    const isFeminine = niche.endsWith('a') || niche === 'clínica' || niche === 'oficina' || niche === 'loja';
    const artigoA = isFeminine ? 'a sua' : 'o seu';

    let text = "";

    if (scriptType === 'msg1') {
        text = `Oi, tudo bem?\n\nVi ${artigoA} ${niche} no Google e achei o trabalho muito bom.\n\nHoje a maioria dos negócios foca só no Instagram, mas grande parte dos clientes novos vem do Google quando já estão decididos.\n\nE aí entra um ponto chave: quem aparece com mais autoridade ali acaba sendo escolhido primeiro.\n\nMontei um modelo de site pra ${artigoA} ${niche} pensado exatamente pra isso — transformar buscas em mensagens direto no seu WhatsApp.\n\nFiz essa versão sem custo nenhum, só pra te mostrar o potencial na prática.\n\nQuer ver como ficou?\n${demoUrl}`;
    } else if (scriptType === 'msg2') {
        text = `Oi, tudo bem?\n\nVi ${artigoA} ${niche} ${name} no Google e notei que vocês já têm uma presença online legal — isso já é um ótimo passo à frente.\n\nMas hoje não basta só "ter", e sim *como* se aparece... porque é isso que faz o cliente escolher vocês e não a concorrência.\n\nMuitos perdem clientes com sites que não convertem a pesquisa em vendas. Montei uma versão estratégica para ${artigoA} ${niche}, focada exatamente nisso: atrair o olhar e gerar contato automático no WhatsApp.\n\nTotalmente sem custo. Quer ver como poderia ficar?\n${demoUrl}`;
    } else if (scriptType === 'followup') {
        text = `Oi, tudo bem? \n\nConseguiu dar uma olhadinha no modelo que te mandei mais cedo?\n\nQualquer dúvida sobre como isso pode aumentar os contatos de vocês, estou à disposição!`;
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
             reply = `Eu entendo perfeitamente! Foi exatamente por isso que te escolhi. Muitas clínicas que já têm site costumam focar nele como um "panfleto digital" e não tem botão visível.\nO modelo que montei não é um panfleto, é uma máquina focada em cliques no seu WhatsApp. Só olha rapidamente o design e os botões... a diferença salta aos olhos!`;
        } else if (type === 'caro') {
             reply = `Compreendo perfeitamente o momento! Justamente por entender a situação, desenvolvi esse sistema focado 100% num retorno rápido.\nA diferença entre a sua página atual do Google e essa é imensa. A ideia é que ele se pague logo nos primeiros 2 clientes que fecharem por buscarem no Google. Topa dar só uma espiada sem compromisso?`;
        } else if (type === 'interesse') {
             reply = `Sem problemas! Eu sei que a rotina por aí deve estar puxada.\nVou deixar o link aqui caso no futuro vocês queiram escalar o volume de agendamentos que vem do Google, tá bom? Sucesso para a equipe!`;
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
        
        const tr = document.createElement('tr');
        
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
                <a href="https://wa.me/${entry.phone}" target="_blank" class="btn btn-outline btn-sm">Retomar</a>
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
