function processFiles() {
    const files = document.getElementById('fileInput').files;
    const output = document.getElementById('output');
    const feedback = document.getElementById('feedback');
    const listaChaves = document.getElementById('listaChaves');
    
    feedback.innerHTML = ''; // Limpa o feedback anterior
    listaChaves.innerHTML = ''; // Limpa a lista de chaves anterior

    if (files.length === 0) {
        feedback.innerHTML = '<div class="alert alert-warning">Por favor, selecione pelo menos um arquivo XML.</div>';
        return;
    }

    let totals = {
        pesoB: 0,
        vPag: 0
    };

    let filesProcessed = 0; // Contador para rastrear arquivos processados

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(event.target.result, 'application/xml');
            updateTotals(xmlDoc, totals);
            extractNotaInfo(xmlDoc, listaChaves);
            filesProcessed++;
            
            if (filesProcessed === files.length) {
                displayTotals(totals);
            }
        };
        
        reader.readAsText(file); // Lê o arquivo como texto
    });
}

// Função para atualizar os totais com base no conteúdo XML
function updateTotals(xmlDoc, totals) {
    ['pesoB', 'vPag'].forEach(field => {
        const elements = xmlDoc.getElementsByTagName(field);
        for (let i = 0; i < elements.length; i++) {
            const value = parseFloat(elements[i].textContent);
            if (!isNaN(value)) {
                totals[field] += value;
            }
        }
    });
}

// Função para extrair informações das notas fiscais
function extractNotaInfo(xmlDoc, listaChaves) {
    const infNFe = xmlDoc.getElementsByTagName('infNFe');
    for (let i = 0; i < infNFe.length; i++) {
        const chave = infNFe[i].getAttribute('Id').replace(/[^0-9]/g, ''); // Extrai apenas números
        const nNF = xmlDoc.getElementsByTagName('nNF')[i].textContent; // Número da nota fiscal
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `Chave: ${chave}, Número da Nota: ${nNF}`;
        listaChaves.appendChild(listItem);
    }
}

// Função para exibir os totais na tela
function displayTotals(totals) {
    const pesoTotalNotasDiv = document.getElementById('pesoTotalNotas');
    const pesoTotalNotasValor = document.getElementById('pesoTotalNotasValor');
    const valorTotalNotasDiv = document.getElementById('valorTotalNotas');
    const valorTotalNotasValor = document.getElementById('valorTotalNotasValor');

    // Atualiza os valores exibidos
    pesoTotalNotasValor.textContent = formatNumber(totals['pesoB']);
    valorTotalNotasValor.textContent = formatNumber(totals['vPag']);

    // Exibe as divs que estavam escondidas
    pesoTotalNotasDiv.classList.remove('d-none');
    valorTotalNotasDiv.classList.remove('d-none');
}

// Função para formatar números com duas casas decimais no formato brasileiro
function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(number);
}