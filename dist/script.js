"use strict";
var mario = document.querySelector('.mario');
var pipe = document.querySelector('.pipe');
var scoreElement = document.getElementById('score');
var loserImage = document.querySelector('.loser');
var overlay = document.querySelector('.overlay');
var hiScoreElement = document.getElementById('hi-score');
var gameBoard = document.querySelector('.game-board');
var isJumping = false;
var score = 0;
var hiScore = Number(localStorage.getItem('hiScore')) || 0;
var gameOver = false;
hiScoreElement.textContent = hiScore.toString();
var jump = function () {
    if (isJumping || gameOver)
        return;
    isJumping = true;
    mario.classList.add('jump');
    setTimeout(function () {
        mario.classList.remove('jump');
        isJumping = false;
    }, 500);
};
var updateHiScore = function () {
    if (score > hiScore) {
        hiScore = score;
        localStorage.setItem('hiScore', hiScore.toString());
        hiScoreElement.textContent = hiScore.toString();
    }
};
var handleGameOver = function (pipePosition, marioPosition, collidedPipe) {
    gameOver = true;
    var allPipes = document.querySelectorAll('.pipe');
    allPipes.forEach(function (p) {
        p.style.animation = 'none';
        // Se for o cano que bateu, fixa a posição exatamente dele
        if (p === collidedPipe) {
            p.style.left = "".concat(pipePosition, "px");
            p.style.zIndex = '10'; // opcional: deixa o cano em cima pra ficar visível
        }
        else {
            // Pode fixar outros canos onde estiverem
            p.style.left = "".concat(p.offsetLeft, "px");
        }
    });
    mario.style.animation = 'none';
    mario.style.bottom = "".concat(marioPosition, "px");
    mario.src = './images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';
    loserImage.classList.add('show');
    overlay.classList.add('dark');
};
var loop = setInterval(function () {
    var marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    if (!gameOver) {
        score++;
        scoreElement.textContent = score.toString();
        updateHiScore();
    }
    var allPipes = document.querySelectorAll('.pipe');
    allPipes.forEach(function (p) {
        var pipePosition = p.offsetLeft;
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            handleGameOver(pipePosition, marioPosition, p); // passa o cano que bateu
            clearInterval(loop);
        }
    });
}, 10);
// Eventos para pular
document.addEventListener('keydown', function () {
    if (gameOver) {
        location.reload();
    }
    else {
        jump();
    }
});
document.addEventListener('touchstart', function () {
    if (gameOver) {
        location.reload();
    }
    else {
        jump();
    }
});
// 🚀 GERAÇÃO ALEATÓRIA DE CANOS
var createRandomPipe = function () {
    if (gameOver)
        return;
    var newPipe = pipe.cloneNode(true);
    // Altura aleatória entre 60 e 120 px
    var randomHeight = Math.floor(Math.random() * 60) + 60;
    newPipe.style.height = "".concat(randomHeight, "px");
    // Velocidade aleatória entre 1.2s e 2.0s
    var randomSpeed = (Math.random() * 0.8 + 1.2).toFixed(2);
    newPipe.style.animation = "pipe-animation ".concat(randomSpeed, "s linear forwards");
    newPipe.style.left = '100%';
    gameBoard.appendChild(newPipe);
    // Remove o cano depois que sair da tela
    var removeTime = parseFloat(randomSpeed) * 1000 + 500;
    setTimeout(function () {
        newPipe.remove();
    }, removeTime);
};
var startPipeGenerator = function () {
    var minDelay = 800;
    var maxDelay = 1800;
    var generate = function () {
        if (gameOver)
            return;
        createRandomPipe();
        // Delay aleatório antes do próximo cano aparecer
        var delay = Math.random() * (maxDelay - minDelay) + minDelay;
        setTimeout(generate, delay);
    };
    generate();
};
startPipeGenerator();
