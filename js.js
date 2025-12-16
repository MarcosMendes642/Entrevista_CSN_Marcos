const fotos = [
    'fotos/foto1.jpeg',
    'fotos/Foto2.jpeg',
    'fotos/foto3.jpeg',
    'fotos/foto4.jpeg'
];

let currentIndex = 0; // Renomeei para currentIndex para evitar confusão
let intervalId;
const fotoContainers = document.querySelectorAll('.foto-container');
const indicators = document.querySelectorAll('.indicator');

// Pré-carregar imagens
function preloadImages() {
    fotos.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log(`Imagem carregada: ${src}`);
        img.onerror = () => console.error(`Erro ao carregar: ${src}`);
    });
}

// Atualizar indicadores
function updateIndicators() {
    indicators.forEach((indicator, i) => {
        if (i === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Trocar foto - CORRIGIDO O ERRO
function trocarFoto() {
    console.log(`Trocando para foto ${currentIndex}`);
    
    // Esconder todas as fotos
    fotoContainers.forEach(container => {
        container.classList.remove('active');
    });
    
    // Mostrar apenas a foto atual
    fotoContainers[currentIndex].classList.add('active');
    
    // Atualizar indicadores
    updateIndicators();
    
    // Mover para próxima foto (mas só atualiza na próxima chamada)
    // O erro estava aqui: estava mudando o índice antes de mostrar a foto
}

// Função para ir para próxima foto (chamada pelo intervalo)
function nextFotoAuto() {
    // Primeiro mostra a foto atual
    trocarFoto();
    // Depois atualiza o índice para a próxima
    currentIndex = (currentIndex + 1) % fotos.length;
}

// Navegação manual
function nextFoto() {
    clearInterval(intervalId);
    trocarFoto(); // Mostra a atual
    currentIndex = (currentIndex + 1) % fotos.length; // Atualiza para próxima
    restartInterval();
}

function prevFoto() {
    clearInterval(intervalId);
    trocarFoto(); // Mostra a atual
    currentIndex = (currentIndex - 1 + fotos.length) % fotos.length; // Atualiza para anterior
    restartInterval();
}

// Reiniciar intervalo automático
function restartInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextFotoAuto, 4000);
}

// Navegação por indicadores
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        clearInterval(intervalId);
        currentIndex = parseInt(indicator.getAttribute('data-index'));
        trocarFoto();
        restartInterval();
    });
});

// Scroll suave
function irParaBaixo() {
    document.getElementById('conteudo').scrollIntoView({
        behavior: 'smooth'
    });
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextFoto();
    if (e.key === 'ArrowLeft') prevFoto();
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        irParaBaixo();
    }
});

// Inicialização
function init() {
    console.log('Inicializando slider...');
    preloadImages();
    
    // Inicializar todas as imagens nos containers
    fotoContainers.forEach((container, i) => {
        const img = container.querySelector('img');
        img.src = fotos[i];
    });
    
    // Mostrar primeira foto
    trocarFoto();
    
    // Iniciar intervalo
    intervalId = setInterval(nextFotoAuto, 4000);
    
    console.log(`Total de fotos: ${fotos.length}`);
    console.log(`Container de fotos encontrados: ${fotoContainers.length}`);
}

// Iniciar quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}