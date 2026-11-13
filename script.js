const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const targetScoreDisplay = document.getElementById('target-score');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySubtitle = document.getElementById('overlay-subtitle');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.querySelector('.game-container');

// Configurações do Jogo
const TARGET_SCORE = 2000;
let score = 0;
let highScore = localStorage.getItem('dinoCloudHighScore') || 0;
let isPlaying = false;
let cactusPosition = 800;
let gameSpeed = 6;
let gameLoopId;
let scoreIntervalId;

targetScoreDisplay.textContent = TARGET_SCORE;
highScoreDisplay.textContent = highScore;

// Função de Pulo
function jump() {
    if (!isPlaying) return;
    if (!dino.classList.contains('jump')) {
        dino.classList.add('jump');
        setTimeout(() => {
            dino.classList.remove('jump');
        }, 550);
    }
}

// Controles de Teclado e Mouse/Toque
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isPlaying && !overlay.classList.contains('hidden')) {
            startGame();
        } else {
            jump();
        }
    }
});

gameContainer.addEventListener('mousedown', () => {
    if (isPlaying) jump();
});

startBtn.addEventListener('click', startGame);

// Iniciar ou Reiniciar o Jogo
function startGame() {
    isPlaying = true;
    score = 0;
    gameSpeed = 6;
    cactusPosition = 800;
    
    scoreDisplay.textContent = score;
    overlay.classList.add('hidden');
    cactus.style.left = cactusPosition + 'px';

    // Contador de Pontuação
    clearInterval(scoreIntervalId);
    scoreIntervalId = setInterval(() => {
        if (!isPlaying) return;
        score += 5;
        scoreDisplay.textContent = score;

        // Aumenta a dificuldade a cada 200 pontos
        if (score % 200 === 0) {
            gameSpeed += 1;
        }

        // Verifica se atingiu a meta
        if (score >= TARGET_SCORE) {
            winGame();
        }
    }, 100);

    // Loop principal de movimento e colisão
    cancelAnimationFrame(gameLoopId);
    updateGame();
}

function updateGame() {
    if (!isPlaying) return;

    // Move o cacto para a esquerda
    cactusPosition -= gameSpeed;

    // Reposiciona o cacto com variação aleatória de distância
    if (cactusPosition < -30) {
        cactusPosition = 800 + Math.floor(Math.random() * 250);
    }

    cactus.style.left = cactusPosition + 'px';

    // Detecção de Colisão
    const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
    
    // Hitbox ajustada para ser justa ao jogador
    if (cactusPosition > 55 && cactusPosition < 98 && dinoBottom < 72) {
        gameOver();
        return;
    }

    gameLoopId = requestAnimationFrame(updateGame);
}

// Fim de Jogo (Colisão)
function gameOver() {
    isPlaying = false;
    clearInterval(scoreIntervalId);
    cancelAnimationFrame(gameLoopId);
    updateHighScore();

    overlayTitle.textContent = 'FIM DE JOGO!';
    overlayTitle.style.color = '#ff6b6b';
    overlaySubtitle.textContent = `Você fez ${score} pontos. Faltaram ${TARGET_SCORE - score} para a meta.`;
    startBtn.textContent = 'Tentar Novamente';
    overlay.classList.remove('hidden');
}

// Vitória (Meta Atingida)
function winGame() {
    isPlaying = false;
    clearInterval(scoreIntervalId);
    cancelAnimationFrame(gameLoopId);
    updateHighScore();

    overlayTitle.textContent = 'VOCÊ VENCEU!';
    overlayTitle.style.color = '#51cf66';
    overlaySubtitle.textContent = `Parabéns! Você alcançou a meta de ${TARGET_SCORE} pontos no céu nublado!`;
    startBtn.textContent = 'Jogar Novamente';
    overlay.classList.remove('hidden');
}

// Atualiza o Recorde no navegador
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoCloudHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
}
