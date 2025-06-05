const mario = document.querySelector('.mario') as HTMLImageElement;
const pipe = document.querySelector('.pipe') as HTMLImageElement;
const scoreElement = document.getElementById('score') as HTMLElement;
const loserImage = document.querySelector('.loser') as HTMLImageElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const hiScoreElement = document.getElementById('hi-score') as HTMLElement;
const gameBoard = document.querySelector('.game-board') as HTMLElement;

let isJumping = false;
let score = 0;
let hiScore = Number(localStorage.getItem('hiScore')) || 0;
let gameOver = false;

hiScoreElement.textContent = hiScore.toString();

const jump = (): void => {
    if (isJumping || gameOver) return;

    isJumping = true;
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
        isJumping = false;
    }, 500);
};

const updateHiScore = (): void => {
    if (score > hiScore) {
        hiScore = score;
        localStorage.setItem('hiScore', hiScore.toString());
        hiScoreElement.textContent = hiScore.toString();
    }
};

const handleGameOver = (pipePosition: number, marioPosition: number, collidedPipe: HTMLElement): void => {
    gameOver = true;

    const allPipes = document.querySelectorAll<HTMLElement>('.pipe');
    allPipes.forEach(p => {
        p.style.animation = 'none';
        // Se for o cano que bateu, fixa a posição exatamente dele
        if (p === collidedPipe) {
            p.style.left = `${pipePosition}px`;
            p.style.zIndex = '10'; // opcional: deixa o cano em cima pra ficar visível
        } else {
            // Pode fixar outros canos onde estiverem
            p.style.left = `${p.offsetLeft}px`;
        }
    });

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = './images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    loserImage.classList.add('show');
    overlay.classList.add('dark');
};


const loop = setInterval(() => {
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (!gameOver) {
        score++;
        scoreElement.textContent = score.toString();
        updateHiScore();
    }

    const allPipes = document.querySelectorAll<HTMLElement>('.pipe');
    allPipes.forEach(p => {
        const pipePosition = p.offsetLeft;

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            handleGameOver(pipePosition, marioPosition, p); // passa o cano que bateu
            clearInterval(loop);
        }
    });
}, 10);

// Eventos para pular
document.addEventListener('keydown', () => {
    if (gameOver) {
        location.reload();
    } else {
        jump();
    }
});
document.addEventListener('touchstart', () => {
    if (gameOver) {
        location.reload();
    } else {
        jump();
    }
});

// 🚀 GERAÇÃO ALEATÓRIA DE CANOS

const createRandomPipe = (): void => {
    if (gameOver) return;

    const newPipe = pipe.cloneNode(true) as HTMLImageElement;

    // Altura aleatória entre 60 e 120 px
    const randomHeight = Math.floor(Math.random() * 60) + 60;
    newPipe.style.height = `${randomHeight}px`;

    // Velocidade aleatória entre 1.2s e 2.0s
    const randomSpeed = (Math.random() * 0.8 + 1.2).toFixed(2);
    newPipe.style.animation = `pipe-animation ${randomSpeed}s linear forwards`;

    newPipe.style.left = '100%';
    gameBoard.appendChild(newPipe);

    // Remove o cano depois que sair da tela
    const removeTime = parseFloat(randomSpeed) * 1000 + 500;
    setTimeout(() => {
        newPipe.remove();
    }, removeTime);
};

const startPipeGenerator = (): void => {
    const minDelay = 800;
    const maxDelay = 1800;

    const generate = (): void => {
        if (gameOver) return;

        createRandomPipe();

        // Delay aleatório antes do próximo cano aparecer
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;
        setTimeout(generate, delay);
    };

    generate();
};

startPipeGenerator();
